import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateFlashcards } from "@/lib/gemini";
import { buildStudentProfileForLLM, recordActivity } from "@/lib/progress";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { courseId, topic, count = 15 } = await req.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    const studentProfile = await buildStudentProfileForLLM(session.user.id, courseId);

    const cards = await generateFlashcards(
      course.title,
      course.content,
      topic,
      count,
      studentProfile
    );

    const deck = await prisma.flashcardDeck.create({
      data: {
        userId: session.user.id,
        courseId,
        title: topic
          ? `Flashcards: ${topic}`
          : `Flashcards - ${course.title}`,
        cards: JSON.stringify(cards),
      },
    });

    // Record activity for progress tracking
    await recordActivity(session.user.id, courseId, "flashcard");

    return NextResponse.json({ deck, cards }, { status: 201 });
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des flashcards" },
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

  const decks = await prisma.flashcardDeck.findMany({
    where: {
      userId: session.user.id,
      ...(courseId ? { courseId } : {}),
    },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ decks });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { deckId, reviewed, confidence } = await req.json();

    const deck = await prisma.flashcardDeck.findFirst({
      where: { id: deckId, userId: session.user.id },
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck non trouvé" }, { status: 404 });
    }

    await prisma.flashcardDeck.update({
      where: { id: deckId },
      data: {
        reviewed: reviewed ?? true,
        confidence: confidence ?? undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Flashcard PATCH error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
