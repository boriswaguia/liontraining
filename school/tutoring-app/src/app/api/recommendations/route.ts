import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/recommendations — get student's recent recommendations
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const recommendations = await prisma.dailyRecommendation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ recommendations });
}

// PATCH /api/recommendations — mark as viewed or completed
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id, viewed, completed } = await req.json();

  const rec = await prisma.dailyRecommendation.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!rec) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  if (viewed === true) {
    data.viewed = true;
    data.viewedAt = new Date();
  }
  if (completed === true) {
    data.completed = true;
    data.completedAt = new Date();
  }

  const updated = await prisma.dailyRecommendation.update({
    where: { id },
    data,
  });

  return NextResponse.json({ recommendation: updated });
}
