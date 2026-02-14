import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateStudyGuide } from "@/lib/gemini";

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

    const content = await generateStudyGuide(
      course.title,
      course.content,
      chapter
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
