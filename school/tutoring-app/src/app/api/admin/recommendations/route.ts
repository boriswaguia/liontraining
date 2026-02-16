import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/recommendations — list daily recommendations with filters
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const userId = searchParams.get("userId");
  const type = searchParams.get("type"); // exercise | study_guide | flashcard
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const emailStatus = searchParams.get("emailStatus"); // sent | unsent
  const viewedStatus = searchParams.get("viewedStatus"); // viewed | unviewed
  const completedStatus = searchParams.get("completedStatus"); // completed | uncompleted

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (userId) where.userId = userId;
  if (type) where.type = type;
  if (emailStatus === "sent") where.emailSent = true;
  if (emailStatus === "unsent") where.emailSent = false;
  if (viewedStatus === "viewed") where.viewed = true;
  if (viewedStatus === "unviewed") where.viewed = false;
  if (completedStatus === "completed") where.completed = true;
  if (completedStatus === "uncompleted") where.completed = false;

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      where.createdAt.lte = to;
    }
  }

  const [total, recommendations] = await Promise.all([
    prisma.dailyRecommendation.count({ where }),
    prisma.dailyRecommendation.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, language: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  // Aggregate stats
  const stats = await prisma.dailyRecommendation.groupBy({
    by: ["type"],
    _count: true,
    where: {
      createdAt: { gte: new Date(Date.now() - 30 * 86400000) },
    },
  });

  const last30 = await prisma.dailyRecommendation.count({
    where: { createdAt: { gte: new Date(Date.now() - 30 * 86400000) } },
  });

  const emailsSent = await prisma.dailyRecommendation.count({
    where: { emailSent: true, createdAt: { gte: new Date(Date.now() - 30 * 86400000) } },
  });

  const viewed = await prisma.dailyRecommendation.count({
    where: { viewed: true, createdAt: { gte: new Date(Date.now() - 30 * 86400000) } },
  });

  const completed = await prisma.dailyRecommendation.count({
    where: { completed: true, createdAt: { gte: new Date(Date.now() - 30 * 86400000) } },
  });

  return NextResponse.json({
    recommendations,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      last30Days: {
        total: last30,
        emailsSent,
        viewed,
        completed,
        viewRate: last30 > 0 ? Math.round((viewed / last30) * 100) : 0,
        completionRate: last30 > 0 ? Math.round((completed / last30) * 100) : 0,
        byType: stats.map((s: { type: string; _count: number }) => ({ type: s.type, count: s._count })),
      },
    },
  });
}
