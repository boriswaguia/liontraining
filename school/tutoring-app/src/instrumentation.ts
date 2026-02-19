/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts. Sets up the daily-content cron scheduler.
 */
export async function register() {
  // Only run in Node.js runtime (not Edge), and not during build
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // Ensure a CRON_SECRET exists for internal scheduler → API auth.
  // If not configured in .env, generate a random one for this session.
  if (!process.env.CRON_SECRET) {
    const { randomBytes } = await import("crypto");
    process.env.CRON_SECRET = randomBytes(32).toString("hex");
    console.log("[Scheduler] No CRON_SECRET in env — generated internal secret.");
  }

  const { startDailyContentScheduler } = await import("@/lib/scheduler");
  startDailyContentScheduler();
}
