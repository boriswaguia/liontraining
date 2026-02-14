import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateFlashcards } from "@/lib/gemini";

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

    const cards = await generateFlashcards(
      course.title,
      course.content,
      topic,
      count
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
