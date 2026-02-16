import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { logActivity, Actions } from "@/lib/activity";

// GET /api/admin/schools — list all schools (with counts)
export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const schools = await prisma.school.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { departments: true, users: true } },
    },
  });

  return NextResponse.json({ schools });
}

// POST /api/admin/schools — create a school
export async function POST(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { name, shortName, city, country, logo, description } = body;

  if (!name || !shortName || !city) {
    return NextResponse.json(
      { error: "Nom, nom court et ville sont requis" },
      { status: 400 }
    );
  }

  try {
    const school = await prisma.school.create({
      data: { name, shortName, city, country: country || "Cameroun", logo, description },
    });

    logActivity({
      userId: session!.user!.id!,
      action: Actions.ADMIN_SCHOOL_CREATE,
      category: "admin",
      resource: "school",
      resourceId: school.id,
      detail: { name, shortName, city },
      req,
    });

    return NextResponse.json({ school }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Ce nom court existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/schools — update or toggle active
export async function PATCH(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const school = await prisma.school.update({
    where: { id },
    data,
  });

  logActivity({
    userId: session!.user!.id!,
    action: Actions.ADMIN_SCHOOL_UPDATE,
    category: "admin",
    resource: "school",
    resourceId: id,
    detail: { updatedFields: Object.keys(data) },
    req,
  });

  return NextResponse.json({ school });
}

// DELETE /api/admin/schools — delete a school
export async function DELETE(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await prisma.school.delete({ where: { id } });

  logActivity({
    userId: session!.user!.id!,
    action: Actions.ADMIN_SCHOOL_DELETE,
    category: "admin",
    resource: "school",
    resourceId: id,
    req,
  });

  return NextResponse.json({ success: true });
}
