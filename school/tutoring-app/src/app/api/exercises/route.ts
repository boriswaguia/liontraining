import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateExercises } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { courseId, topic, difficulty = "medium", count = 5 } = await req.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    const result = await generateExercises(
      course.title,
      course.content,
      topic,
      difficulty,
      count
    );

    const exercise = await prisma.exercise.create({
      data: {
        userId: session.user.id,
        courseId,
        topic,
        questions: JSON.stringify(result.questions),
        solutions: JSON.stringify(result.solutions),
        difficulty,
      },
    });

    return NextResponse.json({ exercise, ...result }, { status: 201 });
  } catch (error) {
    console.error("Exercise generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des exercices" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const courseId = req.nextUrl.searchParams.get("courseId");

  const exercises = await prisma.exercise.findMany({
    where: {
      userId: session.user.id,
      ...(courseId ? { courseId } : {}),
    },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ exercises });
}
