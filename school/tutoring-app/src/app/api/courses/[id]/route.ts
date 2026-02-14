import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
