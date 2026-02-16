import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getQuotaStatus, CREDIT_COSTS, FREE_LIMITS, SUBSCRIPTION_PLANS } from "@/lib/credits";

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
  const base = { quotaStatus, creditCosts: CREDIT_COSTS, freeLimits: FREE_LIMITS, subscriptionPlans: SUBSCRIPTION_PLANS };

  if (tab === "history") {
    const transactions = await prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ ...base, transactions });
  }

  if (tab === "packs") {
    const packs = await prisma.creditPack.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ ...base, packs });
  }

  // Default: just quota status + costs + plans
  return NextResponse.json(base);
}
