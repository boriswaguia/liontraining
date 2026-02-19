import cron from "node-cron";
import { prisma } from "@/lib/db";

let schedulerStarted = false;

/**
 * Start the daily content scheduler.
 * Runs at the top of every UTC hour, checks if the configured
 * hour matches, and POSTs to /api/cron/daily-content if so.
 *
 * This is called once from src/instrumentation.ts on server startup.
 */
export function startDailyContentScheduler() {
  if (schedulerStarted) {
    console.log("[Scheduler] Already running, skipping duplicate start.");
    return;
  }

  schedulerStarted = true;

  // Run at minute 0 of every hour (e.g., 05:00 UTC, 07:00 UTC, etc.)
  cron.schedule(
    "0 * * * *",
    async () => {
      const currentHourUTC = new Date().getUTCHours();
      console.log(`[Scheduler] Tick at ${currentHourUTC}:00 UTC`);

      try {
        // Read settings from DB
        const [enabledSetting, hourSetting] = await Promise.all([
          prisma.systemSetting.findUnique({ where: { key: "daily_recommendations_enabled" } }),
          prisma.systemSetting.findUnique({ where: { key: "daily_recommendations_hour" } }),
        ]);

        const enabled = enabledSetting?.value === "true";
        const configuredHour = parseInt(hourSetting?.value || "7", 10);

        if (!enabled) {
          console.log("[Scheduler] Daily recommendations are disabled. Skipping.");
          return;
        }

        if (currentHourUTC !== configuredHour) {
          console.log(
            `[Scheduler] Current hour ${currentHourUTC} ≠ configured hour ${configuredHour}. Skipping.`
          );
          return;
        }

        console.log(`[Scheduler] ✅ Triggering daily content generation at ${currentHourUTC}:00 UTC…`);

        // Call the cron endpoint internally
        const baseUrl = process.env.AUTH_URL?.includes("localhost")
          ? "http://localhost:3000"
          : "http://localhost:3000"; // always use internal port

        const cronSecret = process.env.CRON_SECRET;
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (cronSecret) {
          headers["x-cron-secret"] = cronSecret;
        }

        const res = await fetch(`${baseUrl}/api/cron/daily-content`, {
          method: "POST",
          headers,
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("[Scheduler] ❌ Cron endpoint returned error:", data);
          return;
        }

        if (data.skipped) {
          console.log("[Scheduler] Skipped:", data.reason);
        } else if (data.summary) {
          const { generated, skipped, errors, total } = data.summary;
          console.log(
            `[Scheduler] ✅ Daily content done — ${generated} generated, ${skipped} skipped, ${errors} errors (${total} students total)`
          );
        }
      } catch (err) {
        console.error("[Scheduler] ❌ Unexpected error:", (err as Error).message);
      }
    },
    {
      timezone: "UTC",
    }
  );

  console.log("[Scheduler] Daily content scheduler started. Checks every hour at :00 UTC.");
}
