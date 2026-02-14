import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateStudyPlan } from "@/lib/gemini";
import { buildStudentProfileForLLM, recordActivity } from "@/lib/progress";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { courseId, startDate, endDate, hoursPerDay = 2 } = await req.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    const studentProfile = await buildStudentProfileForLLM(session.user.id, courseId);

    const userLanguage = (session.user as { language?: string }).language || "fr";

    const result = await generateStudyPlan(
      course.title,
      course.content,
      startDate,
      endDate,
      hoursPerDay,
      studentProfile,
      userLanguage
    );

    const plan = await prisma.studyPlan.create({
      data: {
        userId: session.user.id,
        courseId,
        title: result.title,
        plan: JSON.stringify(result),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        tasks: {
          create: result.tasks.map((task) => ({
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate),
          })),
        },
      },
      include: { tasks: true },
    });

    // Record activity for progress tracking
    await recordActivity(session.user.id, courseId, "study_plan");

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Study plan error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du plan" },
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

  const plans = await prisma.studyPlan.findMany({
    where: {
      userId: session.user.id,
      ...(courseId ? { courseId } : {}),
    },
    include: { course: true, tasks: { orderBy: { dueDate: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ plans });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { taskId, completed } = await req.json();

  const task = await prisma.studyTask.update({
    where: { id: taskId },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ task });
}
