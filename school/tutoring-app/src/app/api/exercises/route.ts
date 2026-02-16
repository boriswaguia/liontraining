import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateExercises } from "@/lib/gemini";
import { buildStudentProfileForLLM, getOrCreateProgress } from "@/lib/progress";
import { logActivity, Actions } from "@/lib/activity";
import { checkAndConsumeQuota } from "@/lib/credits";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // Check quota / credits
    const quota = await checkAndConsumeQuota(session.user.id, "exercise");
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "quota_exceeded", reason: quota.reason, creditBalance: quota.creditBalance, creditCost: quota.creditCost },
        { status: 402 }
      );
    }

    const { courseId, topic, difficulty: reqDifficulty, count = 5 } = await req.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    // Use adaptive difficulty if not explicitly set
    let difficulty = reqDifficulty;
    if (!difficulty) {
      const progress = await getOrCreateProgress(session.user.id, courseId);
      difficulty = progress.currentDifficulty;
    }

    const studentProfile = await buildStudentProfileForLLM(session.user.id, courseId);

    const userLanguage = (session.user as { language?: string }).language || "fr";

    const result = await generateExercises(
      course.title,
      course.content,
      topic,
      difficulty,
      count,
      studentProfile,
      userLanguage
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

    logActivity({
      userId: session.user.id,
      action: Actions.EXERCISE_GENERATE,
      category: "ai",
      resource: "exercise",
      resourceId: exercise.id,
      detail: { courseId, topic, difficulty, count },
      req,
    });

    return NextResponse.json({ exercise, ...result, quota: { freeRemaining: quota.freeRemaining, usedCredits: quota.usedCredits, creditBalance: quota.creditBalance } }, { status: 201 });
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
