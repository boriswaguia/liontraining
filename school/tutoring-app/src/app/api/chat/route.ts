import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chatWithTutor } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { courseId, sessionId, message } = await req.json();

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
    const aiResponse = await chatWithTutor(
      course.title,
      course.content,
      messageHistory,
      message
    );

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "assistant",
        content: aiResponse,
      },
    });

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
