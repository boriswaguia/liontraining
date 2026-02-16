import { prisma } from "@/lib/db";

// ============= CREDIT COSTS =============
export const CREDIT_COSTS: Record<string, number> = {
  exercise: 3,
  study_guide: 3,
  flashcards: 2,
  chat: 1,
  study_plan: 5,
};

// ============= FREE TIER LIMITS (per day) =============
export const FREE_LIMITS = {
  generations: 5, // exercises + guides + flashcards + study plans combined
  chatMessages: 15,
};

// Which actions count as "generations" vs "chat"
const GENERATION_ACTIONS = ["exercise", "study_guide", "flashcards", "study_plan"];
const CHAT_ACTIONS = ["chat"];

export type QuotaAction = "exercise" | "study_guide" | "flashcards" | "chat" | "study_plan";

export interface QuotaResult {
  allowed: boolean;
  reason?: "quota_exceeded" | "insufficient_credits";
  freeRemaining?: number;
  creditBalance?: number;
  creditCost?: number;
  usedCredits?: boolean; // true if credits were deducted (not free tier)
}

/**
 * Get today's date as a Date object (no time component) in UTC.
 */
function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Check whether a user can perform an action, and if allowed, record the usage.
 *
 * Logic:
 * 1. Admins are always allowed (no quota).
 * 2. Check if today's free tier allows it.
 * 3. If free tier exceeded, try to deduct credits.
 * 4. If insufficient credits, deny with 402.
 */
export async function checkAndConsumeQuota(
  userId: string,
  action: QuotaAction
): Promise<QuotaResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, creditBalance: true, plan: true },
  });

  if (!user) {
    return { allowed: false, reason: "quota_exceeded" };
  }

  // Admins bypass all quotas
  if (user.role === "admin") {
    return { allowed: true };
  }

  const today = todayUTC();
  const cost = CREDIT_COSTS[action] || 1;
  const isGeneration = GENERATION_ACTIONS.includes(action);
  const isChat = CHAT_ACTIONS.includes(action);

  // Get or create today's quota record
  let quota = await prisma.usageQuota.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (!quota) {
    quota = await prisma.usageQuota.create({
      data: { userId, date: today, generations: 0, chatMessages: 0 },
    });
  }

  // Check free tier
  let withinFreeTier = false;
  if (isGeneration && quota.generations < FREE_LIMITS.generations) {
    withinFreeTier = true;
  }
  if (isChat && quota.chatMessages < FREE_LIMITS.chatMessages) {
    withinFreeTier = true;
  }

  if (withinFreeTier) {
    // Increment usage counter
    await prisma.usageQuota.update({
      where: { id: quota.id },
      data: isGeneration
        ? { generations: { increment: 1 } }
        : { chatMessages: { increment: 1 } },
    });

    const remaining = isGeneration
      ? FREE_LIMITS.generations - quota.generations - 1
      : FREE_LIMITS.chatMessages - quota.chatMessages - 1;

    return { allowed: true, freeRemaining: remaining, usedCredits: false };
  }

  // Free tier exhausted — try credits
  if (user.creditBalance < cost) {
    return {
      allowed: false,
      reason: "insufficient_credits",
      creditBalance: user.creditBalance,
      creditCost: cost,
    };
  }

  // Deduct credits in a transaction
  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { creditBalance: { decrement: cost } },
    }),
    prisma.usageQuota.update({
      where: { id: quota.id },
      data: isGeneration
        ? { generations: { increment: 1 } }
        : { chatMessages: { increment: 1 } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount: -cost,
        type: "usage",
        action,
        description: `${action} generation`,
        balanceBefore: user.creditBalance,
        balanceAfter: user.creditBalance - cost,
      },
    }),
  ]);

  return {
    allowed: true,
    creditBalance: updatedUser.creditBalance,
    creditCost: cost,
    usedCredits: true,
  };
}

/**
 * Get a user's current quota status for the UI.
 */
export async function getQuotaStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditBalance: true, plan: true, role: true },
  });

  if (!user) return null;

  const today = todayUTC();
  const quota = await prisma.usageQuota.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  return {
    creditBalance: user.creditBalance,
    plan: user.plan,
    role: user.role,
    today: {
      generations: quota?.generations || 0,
      chatMessages: quota?.chatMessages || 0,
      generationsLimit: FREE_LIMITS.generations,
      chatMessagesLimit: FREE_LIMITS.chatMessages,
    },
  };
}

/**
 * Add credits to a user's balance (admin grant or purchase).
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: "purchase" | "admin_grant" | "refund",
  description: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditBalance: true },
  });

  if (!user) throw new Error("User not found");

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { creditBalance: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        balanceBefore: user.creditBalance,
        balanceAfter: user.creditBalance + amount,
      },
    }),
  ]);

  return updatedUser;
}
