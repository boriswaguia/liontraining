import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStudentProgressData } from "@/lib/progress";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const data = await getStudentProgressData(session.user.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des progrès" },
      { status: 500 }
    );
  }
}
