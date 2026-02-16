import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/activity — list activity logs with filters and pagination
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);

  // Filters
  const userId = searchParams.get("userId");
  const action = searchParams.get("action");
  const category = searchParams.get("category");
  const resource = searchParams.get("resource");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const search = searchParams.get("search");

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "30", 10)));
  const skip = (page - 1) * pageSize;

  // Sorting
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" as const : "desc" as const;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (category) where.category = category;
  if (resource) where.resource = resource;

  // Date range filter
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      (where.createdAt as Record<string, unknown>).lte = end;
    }
  }

  // Search in action or detail fields
  if (search) {
    where.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { resource: { contains: search, mode: "insensitive" } },
      { detail: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [logs, totalCount] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: sortOrder },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.activityLog.count({ where }),
  ]);

  // Also return filter options for the UI
  const [categories, actions, resources] = await Promise.all([
    prisma.activityLog.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
    prisma.activityLog.findMany({
      select: { action: true },
      distinct: ["action"],
      orderBy: { action: "asc" },
    }),
    prisma.activityLog.findMany({
      select: { resource: true },
      distinct: ["resource"],
      where: { resource: { not: null } },
      orderBy: { resource: "asc" },
    }),
  ]);

  return NextResponse.json({
    logs,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    filters: {
      categories: categories.map((c) => c.category),
      actions: actions.map((a) => a.action),
      resources: resources.map((r) => r.resource).filter(Boolean),
    },
  });
}
