import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/schools — public, no auth required (used in sign-up)
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        shortName: true,
        city: true,
        country: true,
        logo: true,
      },
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error("Schools fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des écoles" },
      { status: 500 }
    );
  }
}
