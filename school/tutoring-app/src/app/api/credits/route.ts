import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getQuotaStatus, CREDIT_COSTS, FREE_LIMITS } from "@/lib/credits";

/**
 * GET /api/credits — Get current user's credit balance, quota status, packs, and history
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const tab = req.nextUrl.searchParams.get("tab");

  // Basic quota status (always returned)
  const quotaStatus = await getQuotaStatus(session.user.id);

  if (tab === "history") {
    const transactions = await prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ quotaStatus, transactions, creditCosts: CREDIT_COSTS, freeLimits: FREE_LIMITS });
  }

  if (tab === "packs") {
    const packs = await prisma.creditPack.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ quotaStatus, packs, creditCosts: CREDIT_COSTS, freeLimits: FREE_LIMITS });
  }

  // Default: just quota status + costs
  return NextResponse.json({ quotaStatus, creditCosts: CREDIT_COSTS, freeLimits: FREE_LIMITS });
}
