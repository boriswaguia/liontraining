import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/courses?classId=xxx — list courses
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");

  const where = classId ? { classId } : {};

  const courses = await prisma.course.findMany({
    where,
    orderBy: { code: "asc" },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      hours: true,
      semester: true,
      level: true,
      category: true,
      isActive: true,
      classId: true,
      createdAt: true,
      academicClass: {
        select: {
          name: true,
          code: true,
          department: {
            select: { code: true, school: { select: { shortName: true } } },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  return NextResponse.json({ courses });
}

// POST /api/admin/courses — create (without markdown content for now)
export async function POST(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { classId, code, title, description, hours, semester, level, category, content } = body;

  if (!code || !title || !description || !category) {
    return NextResponse.json(
      { error: "Code, titre, description et catégorie sont requis" },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.course.create({
      data: {
        classId: classId || null,
        code,
        title,
        description,
        hours: hours || 36,
        semester: semester || 1,
        level: level || 1,
        category,
        content: content || `# ${title}\n\n${description}`,
      },
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Ce code de cours existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/courses — update or toggle active
export async function PATCH(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  // Don't allow overwriting content via simple PATCH unless explicitly provided
  const course = await prisma.course.update({
    where: { id },
    data,
  });

  return NextResponse.json({ course });
}

// DELETE /api/admin/courses
export async function DELETE(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
