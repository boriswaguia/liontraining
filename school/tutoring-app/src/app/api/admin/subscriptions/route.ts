import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { activateSubscription, cancelSubscription, SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/lib/credits";
import { logActivity } from "@/lib/activity";

/**
 * POST /api/admin/subscriptions — Activate a subscription for a user
 */
export async function POST(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "userId et plan sont obligatoires" },
        { status: 400 }
      );
    }

    if (!SUBSCRIPTION_PLANS[plan as SubscriptionPlan]) {
      return NextResponse.json(
        { error: "Plan invalide. Utilisez 'monthly' ou 'annual'." },
        { status: 400 }
      );
    }

    const updatedUser = await activateSubscription(userId, plan as SubscriptionPlan);

    logActivity({
      userId: session!.user!.id!,
      action: "admin.subscription.activate",
      category: "admin",
      resource: "user",
      resourceId: userId,
      detail: { plan, expiresAt: updatedUser.subscriptionExpiresAt },
    });

    return NextResponse.json({
      subscriptionPlan: updatedUser.subscriptionPlan,
      subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
    });
  } catch (err) {
    console.error("Subscription activation error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'activation de l'abonnement" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/subscriptions?userId=xxx — Cancel a subscription
 */
export async function DELETE(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  await cancelSubscription(userId);

  logActivity({
    userId: session!.user!.id!,
    action: "admin.subscription.cancel",
    category: "admin",
    resource: "user",
    resourceId: userId,
  });

  return NextResponse.json({ success: true });
}
