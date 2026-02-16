import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { addCredits } from "@/lib/credits";
import { logActivity } from "@/lib/activity";

/**
 * POST /api/admin/credits — Grant credits to a user
 */
export async function POST(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { userId, amount, description } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "userId et amount sont obligatoires" },
        { status: 400 }
      );
    }

    const updatedUser = await addCredits(
      userId,
      Number(amount),
      "admin_grant",
      description || `Admin grant: ${amount} credits`
    );

    logActivity({
      userId: session!.user!.id!,
      action: "admin.credits.grant",
      category: "admin",
      resource: "user",
      resourceId: userId,
      detail: { amount: Number(amount), description, newBalance: updatedUser.creditBalance },
    });

    return NextResponse.json({ creditBalance: updatedUser.creditBalance });
  } catch (err) {
    console.error("Credit grant error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'attribution des crédits" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/credits?userId=xxx — Get a user's credit history
 */
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  const [user, transactions, todayQuota] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, creditBalance: true, plan: true },
    }),
    prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.usageQuota.findFirst({
      where: {
        userId,
        date: (() => {
          const now = new Date();
          return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        })(),
      },
    }),
  ]);

  return NextResponse.json({ user, transactions, todayQuota });
}
