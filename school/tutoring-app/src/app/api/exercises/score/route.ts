import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateAfterExerciseScore } from "@/lib/progress";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { exerciseId, score } = await req.json();

    // Validate score
    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score invalide (0-100)" },
        { status: 400 }
      );
    }

    // Find the exercise
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise || exercise.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Exercice non trouvé" },
        { status: 404 }
      );
    }

    // Update exercise score
    await prisma.exercise.update({
      where: { id: exerciseId },
      data: { score },
    });

    // Update progress tracking
    const result = await updateAfterExerciseScore(
      session.user.id,
      exercise.courseId,
      exercise.topic,
      score,
      exercise.difficulty
    );

    return NextResponse.json({
      success: true,
      xpEarned: result.xpEarned,
      newDifficulty: result.newDifficulty,
      overallMastery: result.overallMastery,
    });
  } catch (error) {
    console.error("Score submission error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la soumission du score" },
      { status: 500 }
    );
  }
}
