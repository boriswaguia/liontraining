import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { exec } from "child_process";
import { promisify } from "util";
import { spawn } from "child_process";

const execAsync = promisify(exec);

/**
 * GET /api/admin/backup
 * Returns backup configuration status.
 */
export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  // Check pg_dump is available
  let pgDumpVersion = "";
  try {
    const { stdout } = await execAsync("pg_dump --version");
    pgDumpVersion = stdout.trim();
  } catch {
    pgDumpVersion = "not available";
  }

  return NextResponse.json({
    automated: {
      schedule: "Daily at 00:00 UTC",
      keepDays: 7,
      keepWeeks: 4,
      keepMonths: 3,
      storage: "Docker volume: pgbackups",
    },
    manual: {
      available: pgDumpVersion !== "not available",
      pgDumpVersion,
    },
  });
}

/**
 * POST /api/admin/backup
 * Triggers a manual pg_dump and streams it as a .sql.gz download.
 */
export async function POST() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const pgHost = process.env.PGHOST || "db";
  const pgPort = process.env.PGPORT || "5432";
  const pgUser = process.env.PGUSER || "lionlearn";
  const pgDatabase = process.env.PGDATABASE || "lionlearn";
  const pgPassword = process.env.PGPASSWORD || "";

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `${pgDatabase}-manual-${timestamp}.sql.gz`;

  const cmd = `PGPASSWORD="${pgPassword}" pg_dump -h ${pgHost} -p ${pgPort} -U ${pgUser} -d ${pgDatabase} --no-password | gzip`;

  return new Promise<Response>((resolve) => {
    const pgDump = spawn("sh", ["-c", cmd], {
      env: { ...process.env, PGPASSWORD: pgPassword },
    });

    const chunks: Buffer[] = [];
    let stderr = "";

    pgDump.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    pgDump.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    pgDump.on("close", (code: number) => {
      if (code !== 0) {
        resolve(
          NextResponse.json(
            { error: `pg_dump failed (exit ${code}): ${stderr}` },
            { status: 500 }
          )
        );
        return;
      }

      const body = Buffer.concat(chunks);
      resolve(
        new Response(body, {
          headers: {
            "Content-Type": "application/gzip",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": String(body.length),
          },
        })
      );
    });

    pgDump.on("error", (err: Error) => {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}
