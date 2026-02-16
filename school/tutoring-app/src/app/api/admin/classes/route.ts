import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { logActivity, Actions } from "@/lib/activity";

// GET /api/admin/classes?departmentId=xxx — list academic classes
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId");

  const where = departmentId ? { departmentId } : {};

  const classes = await prisma.academicClass.findMany({
    where,
    orderBy: [{ academicYear: "desc" }, { name: "asc" }],
    include: {
      department: {
        select: { id: true, code: true, school: { select: { shortName: true } } },
      },
      _count: { select: { courses: true, users: true } },
    },
  });

  return NextResponse.json({ classes });
}

// POST /api/admin/classes — create
export async function POST(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { departmentId, name, code, academicYear, description } = body;

  if (!departmentId || !name || !code || !academicYear) {
    return NextResponse.json(
      { error: "Département, nom, code et année académique sont requis" },
      { status: 400 }
    );
  }

  try {
    const cls = await prisma.academicClass.create({
      data: { departmentId, name, code, academicYear, description },
    });

    logActivity({
      userId: session!.user!.id!,
      action: Actions.ADMIN_CLASS_CREATE,
      category: "admin",
      resource: "class",
      resourceId: cls.id,
      detail: { name, code, academicYear, departmentId },
      req,
    });

    return NextResponse.json({ class: cls }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Cette classe existe déjà pour ce département et cette année" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/classes — update or toggle active
export async function PATCH(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const cls = await prisma.academicClass.update({
    where: { id },
    data,
  });

  logActivity({
    userId: session!.user!.id!,
    action: Actions.ADMIN_CLASS_UPDATE,
    category: "admin",
    resource: "class",
    resourceId: id,
    detail: { updatedFields: Object.keys(data) },
    req,
  });

  return NextResponse.json({ class: cls });
}

// DELETE /api/admin/classes
export async function DELETE(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await prisma.academicClass.delete({ where: { id } });

  logActivity({
    userId: session!.user!.id!,
    action: Actions.ADMIN_CLASS_DELETE,
    category: "admin",
    resource: "class",
    resourceId: id,
    req,
  });

  return NextResponse.json({ success: true });
}
