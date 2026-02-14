import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chatWithTutor } from "@/lib/gemini";
import { buildStudentProfileForLLM, recordActivity } from "@/lib/progress";

async function fetchContextContent(contextType: string, contextId: string): Promise<string> {
  switch (contextType) {
    case "exercise": {
      const exercise = await prisma.exercise.findUnique({ where: { id: contextId } });
      if (!exercise) return "";
      const questions = JSON.parse(exercise.questions);
      const solutions = JSON.parse(exercise.solutions);
      return `[EXERCISE CONTEXT]
Topic: ${exercise.topic}
Difficulty: ${exercise.difficulty}
Score: ${exercise.score ?? "Not attempted"}

Questions:
${questions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")}

Solutions:
${solutions.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}
[/EXERCISE CONTEXT]`;
    }
    case "flashcard": {
      const deck = await prisma.flashcardDeck.findUnique({ where: { id: contextId } });
      if (!deck) return "";
      const cards = JSON.parse(deck.cards);
      return `[FLASHCARD CONTEXT]
Deck: ${deck.title}
Confidence: ${deck.confidence ?? "Not reviewed"}

Cards:
${cards.map((c: { front: string; back: string }, i: number) => `${i + 1}. Front: ${c.front}\n   Back: ${c.back}`).join("\n")}
[/FLASHCARD CONTEXT]`;
    }
    case "study_guide": {
      const guide = await prisma.studyGuide.findUnique({ where: { id: contextId } });
      if (!guide) return "";
      return `[STUDY GUIDE CONTEXT]
Title: ${guide.title}
Chapter: ${guide.chapter || "General"}

Content:
${guide.content.substring(0, 15000)}
[/STUDY GUIDE CONTEXT]`;
    }
    case "study_plan": {
      const plan = await prisma.studyPlan.findUnique({
        where: { id: contextId },
        include: { tasks: { orderBy: { dueDate: "asc" } } },
      });
      if (!plan) return "";
      const completedTasks = plan.tasks.filter(t => t.completed).length;
      return `[STUDY PLAN CONTEXT]
Title: ${plan.title}
Period: ${plan.startDate.toISOString().split("T")[0]} to ${plan.endDate.toISOString().split("T")[0]}
Progress: ${completedTasks}/${plan.tasks.length} tasks completed

Tasks:
${plan.tasks.map((t, i) => `${i + 1}. [${t.completed ? "✓" : " "}] ${t.title} (due: ${t.dueDate.toISOString().split("T")[0]})${t.description ? `\n   ${t.description}` : ""}`).join("\n")}
[/STUDY PLAN CONTEXT]`;
    }
    default:
      return "";
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { courseId, sessionId, message, contextType, contextId } = await req.json();

    let chatSession;

    if (sessionId) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: "asc" } }, course: true },
      });
    }

    if (!chatSession) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Cours non trouvé" },
          { status: 404 }
        );
      }

      chatSession = await prisma.chatSession.create({
        data: {
          userId: session.user.id,
          courseId,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
          contextType: contextType || null,
          contextId: contextId || null,
        },
        include: { messages: true, course: true },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "user",
        content: message,
      },
    });

    // Get AI response
    const messageHistory = chatSession.messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

    const course = chatSession.course;
    const studentProfile = await buildStudentProfileForLLM(session.user.id, course.id);
    const userLanguage = (session.user as { language?: string }).language || "fr";

    // Fetch context content if this chat is about a specific resource
    let contextContent = "";
    if (chatSession.contextType && chatSession.contextId) {
      contextContent = await fetchContextContent(chatSession.contextType, chatSession.contextId);
    }

    const aiResponse = await chatWithTutor(
      course.title,
      course.content,
      messageHistory,
      message,
      studentProfile,
      userLanguage,
      contextContent
    );

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "assistant",
        content: aiResponse,
      },
    });

    // Record activity for progress tracking
    await recordActivity(session.user.id, course.id, "chat");

    return NextResponse.json({
      sessionId: chatSession.id,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la conversation" },
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
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (sessionId) {
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        course: true,
      },
    });
    return NextResponse.json({ session: chatSession });
  }

  const sessions = await prisma.chatSession.findMany({
    where: {
      userId: session.user.id,
      ...(courseId ? { courseId } : {}),
    },
    include: { course: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ sessions });
}
