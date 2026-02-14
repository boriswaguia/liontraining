import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/departments?schoolId=xxx — list departments
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId");

  const where = schoolId ? { schoolId } : {};

  const departments = await prisma.department.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      school: { select: { id: true, shortName: true } },
      _count: { select: { classes: true, users: true } },
    },
  });

  return NextResponse.json({ departments });
}

// POST /api/admin/departments — create
export async function POST(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { schoolId, name, code, description } = body;

  if (!schoolId || !name || !code) {
    return NextResponse.json(
      { error: "École, nom et code sont requis" },
      { status: 400 }
    );
  }

  try {
    const department = await prisma.department.create({
      data: { schoolId, name, code, description },
    });
    return NextResponse.json({ department }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Ce code existe déjà pour cette école" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/admin/departments — update or toggle active
export async function PATCH(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const department = await prisma.department.update({
    where: { id },
    data,
  });

  return NextResponse.json({ department });
}

// DELETE /api/admin/departments
export async function DELETE(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await prisma.department.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
