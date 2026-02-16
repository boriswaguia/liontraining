import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/settings — list all system settings
export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const settings = await prisma.systemSetting.findMany({
    orderBy: { key: "asc" },
  });

  // Return as key-value map for easy consumption
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }

  return NextResponse.json({ settings: map });
}

// PATCH /api/admin/settings — update a single setting
export async function PATCH(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { key, value } = await req.json();

  if (!key || value === undefined) {
    return NextResponse.json({ error: "key and value required" }, { status: 400 });
  }

  // Only allow known settings
  const allowedKeys = [
    "daily_recommendations_enabled",
    "daily_recommendations_hour", // e.g., "07" (24h format hour)
  ];
  if (!allowedKeys.includes(key)) {
    return NextResponse.json({ error: "Unknown setting key" }, { status: 400 });
  }

  const setting = await prisma.systemSetting.upsert({
    where: { key },
    create: { key, value: String(value) },
    update: { value: String(value) },
  });

  return NextResponse.json({ setting });
}
