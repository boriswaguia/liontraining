import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import bcrypt from "bcryptjs";

// Allowed fields for PATCH update — prevents arbitrary field injection
const ALLOWED_UPDATE_FIELDS = new Set([
  "name",
  "email",
  "password",
  "role",
  "language",
  "isActive",
  "schoolId",
  "departmentId",
  "classId",
]);

// GET /api/admin/users — list users with pagination, sorting, and filters
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId");
  const departmentId = searchParams.get("departmentId");
  const classId = searchParams.get("classId");
  const role = searchParams.get("role");
  const search = searchParams.get("search");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const isActive = searchParams.get("isActive"); // "true" | "false" | null (all)

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
  const skip = (page - 1) * pageSize;

  // Sorting
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const allowedSortFields = ["name", "email", "role", "createdAt", "updatedAt"];
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const where: Record<string, unknown> = {};

  if (schoolId) where.schoolId = schoolId;
  if (departmentId) where.departmentId = departmentId;
  if (classId) where.classId = classId;
  if (role) where.role = role;

  // isActive filter
  if (isActive === "true") where.isActive = true;
  else if (isActive === "false") where.isActive = false;

  // Search by name or email
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // Date range filter on createdAt
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      (where.createdAt as Record<string, unknown>).lte = end;
    }
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { [finalSortBy]: sortOrder },
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        isActive: true,
        schoolId: true,
        departmentId: true,
        classId: true,
        createdAt: true,
        updatedAt: true,
        school: { select: { id: true, shortName: true } },
        department: { select: { id: true, name: true, code: true } },
        academicClass: { select: { id: true, name: true, code: true, academicYear: true } },
        _count: {
          select: {
            enrollments: true,
            chatSessions: true,
            exercises: true,
            studyGuides: true,
            flashcardDecks: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  });
}

// POST /api/admin/users — create a user
export async function POST(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { name, email, password, role, language, isActive, schoolId, departmentId, classId } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nom, email et mot de passe sont requis" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "student",
        language: language || "fr",
        isActive: isActive !== undefined ? isActive : true,
        schoolId: schoolId || null,
        departmentId: departmentId || null,
        classId: classId || null,
      },
    });
    return NextResponse.json({ user: { ...user, password: undefined } }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Cet email existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/users — update a user (whitelist fields)
export async function PATCH(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { id, password, ...rawData } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  // Whitelist only allowed fields
  const data: Record<string, unknown> = {};
  for (const key of Object.keys(rawData)) {
    if (ALLOWED_UPDATE_FIELDS.has(key)) {
      data[key] = rawData[key];
    }
  }

  // If password is being updated, hash it
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return NextResponse.json({ user: { ...user, password: undefined } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Cet email existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/users — delete a user with cascade protection + self-deletion prevention
export async function DELETE(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  // Prevent self-deletion
  if (session?.user?.id === id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte" },
      { status: 400 }
    );
  }

  // Prevent deleting the last admin
  const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!targetUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (targetUser.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Impossible de supprimer le dernier administrateur" },
        { status: 400 }
      );
    }
  }

  // Delete related data explicitly in a transaction, then the user
  await prisma.$transaction(async (tx) => {
    await tx.achievement.deleteMany({ where: { userId: id } });
    await tx.topicMastery.deleteMany({ where: { userId: id } });
    await tx.userProgress.deleteMany({ where: { userId: id } });
    await tx.studyPlan.deleteMany({ where: { userId: id } });
    await tx.chatSession.deleteMany({ where: { userId: id } });
    await tx.flashcardDeck.deleteMany({ where: { userId: id } });
    await tx.exercise.deleteMany({ where: { userId: id } });
    await tx.studyGuide.deleteMany({ where: { userId: id } });
    await tx.enrollment.deleteMany({ where: { userId: id } });
    await tx.user.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}
