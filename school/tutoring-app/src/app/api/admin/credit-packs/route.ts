import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { logActivity, Actions } from "@/lib/activity";

export async function GET() {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const packs = await prisma.creditPack.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ packs });
}

export async function POST(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { name, credits, priceCFA, description, sortOrder } = await req.json();

    if (!name || !credits || !priceCFA) {
      return NextResponse.json(
        { error: "Nom, crédits et prix sont obligatoires" },
        { status: 400 }
      );
    }

    const pack = await prisma.creditPack.create({
      data: {
        name,
        credits: Number(credits),
        priceCFA: Number(priceCFA),
        description: description || null,
        sortOrder: Number(sortOrder || 0),
      },
    });

    logActivity({
      userId: session!.user!.id!,
      action: "admin.credit_pack.create",
      category: "admin",
      resource: "credit_pack",
      resourceId: pack.id,
      detail: { name, credits, priceCFA },
    });

    return NextResponse.json({ pack }, { status: 201 });
  } catch (err) {
    console.error("Credit pack create error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du pack" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { id, name, credits, priceCFA, description, sortOrder, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const pack = await prisma.creditPack.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(credits !== undefined && { credits: Number(credits) }),
        ...(priceCFA !== undefined && { priceCFA: Number(priceCFA) }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    logActivity({
      userId: session!.user!.id!,
      action: "admin.credit_pack.update",
      category: "admin",
      resource: "credit_pack",
      resourceId: pack.id,
      detail: { name: pack.name, credits: pack.credits, priceCFA: pack.priceCFA, isActive: pack.isActive },
    });

    return NextResponse.json({ pack });
  } catch (err) {
    console.error("Credit pack update error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du pack" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { error, status, session } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  await prisma.creditPack.delete({ where: { id } });

  logActivity({
    userId: session!.user!.id!,
    action: "admin.credit_pack.delete",
    category: "admin",
    resource: "credit_pack",
    resourceId: id,
  });

  return NextResponse.json({ success: true });
}
