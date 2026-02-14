import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/departments/[departmentId]/classes — public, used in sign-up
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  try {
    const { departmentId } = await params;

    const classes = await prisma.academicClass.findMany({
      where: { departmentId },
      orderBy: [{ academicYear: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        code: true,
        academicYear: true,
        description: true,
      },
    });

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Classes fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des classes" },
      { status: 500 }
    );
  }
}
