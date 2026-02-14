import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/schools/[schoolId]/departments — public, used in sign-up
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const { schoolId } = await params;

    const departments = await prisma.department.findMany({
      where: { schoolId, isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
      },
    });

    return NextResponse.json({ departments });
  } catch (error) {
    console.error("Departments fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des départements" },
      { status: 500 }
    );
  }
}
