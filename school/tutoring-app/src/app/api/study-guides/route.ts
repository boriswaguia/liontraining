import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateStudyGuide } from "@/lib/gemini";
import { buildStudentProfileForLLM, recordActivity } from "@/lib/progress";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { courseId, chapter } = await req.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    const studentProfile = await buildStudentProfileForLLM(session.user.id, courseId);

    const userLanguage = (session.user as { language?: string }).language || "fr";

    const content = await generateStudyGuide(
      course.title,
      course.content,
      chapter,
      studentProfile,
      userLanguage
    );

    const guide = await prisma.studyGuide.create({
      data: {
        userId: session.user.id,
        courseId,
        title: chapter
          ? `Guide: ${chapter}`
          : `Guide d'étude - ${course.title}`,
        content,
        chapter,
      },
    });

    // Record activity for progress tracking
    await recordActivity(session.user.id, courseId, "study_guide");

    return NextResponse.json({ guide }, { status: 201 });
  } catch (error) {
    console.error("Study guide error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du guide" },
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

  const guides = await prisma.studyGuide.findMany({
    where: {
      userId: session.user.id,
      ...(courseId ? { courseId } : {}),
    },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ guides });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { guideId, completed } = await req.json();

    const guide = await prisma.studyGuide.findFirst({
      where: { id: guideId, userId: session.user.id },
    });

    if (!guide) {
      return NextResponse.json({ error: "Guide non trouvé" }, { status: 404 });
    }

    await prisma.studyGuide.update({
      where: { id: guideId },
      data: { completed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Study guide PATCH error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
