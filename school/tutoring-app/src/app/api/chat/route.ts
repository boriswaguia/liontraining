import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chatWithTutor } from "@/lib/gemini";
import { buildStudentProfileForLLM, recordActivity } from "@/lib/progress";
import { logActivity, Actions } from "@/lib/activity";
import { checkAndConsumeQuota } from "@/lib/credits";

// ── Input safety guard ──────────────────────────────────────────────
const MAX_MESSAGE_LENGTH = 4000;

// Patterns that signal prompt-injection or jailbreak attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)/i,
  /you\s+are\s+now\s+(a|an|the)\b/i,
  /pretend\s+(you\s+are|to\s+be|you'?re)/i,
  /act\s+as\s+(a|an|if)/i,
  /system\s*prompt/i,
  /\bDAN\b/,
  /do\s+anything\s+now/i,
  /jailbreak/i,
  /bypass\s+(the\s+)?(filter|safety|rules?|restrictions?)/i,
  /override\s+(your|the|these)\s+(instructions?|rules?|safety)/i,
  /reveal\s+(your|the)\s+(instructions?|prompt|system|rules)/i,
  /from\s+now\s+on\s+(you|ignore|respond)/i,
  /\[\s*system\s*\]/i,
  /\{\s*"role"\s*:\s*"system"/i,
];

function sanitizeMessage(message: string): { safe: boolean; reason?: string } {
  if (!message || typeof message !== "string") {
    return { safe: false, reason: "empty" };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { safe: false, reason: "too_long" };
  }
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return { safe: false, reason: "injection" };
    }
  }
  return { safe: true };
}

const REFUSAL_MESSAGES: Record<string, Record<string, string>> = {
  empty: {
    fr: "Veuillez saisir un message.",
    en: "Please enter a message.",
  },
  too_long: {
    fr: "Votre message est trop long. Veuillez le raccourcir et réessayer.",
    en: "Your message is too long. Please shorten it and try again.",
  },
  injection: {
    fr: "Je suis votre tuteur académique et je ne peux répondre qu'aux questions liées à votre cours. Comment puis-je vous aider avec la matière ?",
    en: "I'm your academic tutor and can only answer questions related to your course. How can I help you with the material?",
  },
};

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

    // ── Input safety check ──
    const userLanguage = (session.user as { language?: string }).language || "fr";
    const check = sanitizeMessage(message);
    if (!check.safe) {
      const refusal = REFUSAL_MESSAGES[check.reason!]?.[userLanguage]
        ?? REFUSAL_MESSAGES[check.reason!]?.fr
        ?? "Message invalide.";

      // For injection attempts, still save the exchange so admins can audit
      if (check.reason === "injection" && (sessionId || courseId)) {
        console.warn(`[SAFETY] Blocked injection attempt from user ${session.user.id}: ${message.substring(0, 120)}`);
      }

      return NextResponse.json({ response: refusal, blocked: true });
    }

    // Check quota / credits
    const quotaResult = await checkAndConsumeQuota(session.user.id, "chat");
    if (!quotaResult.allowed) {
      return NextResponse.json(
        { error: "quota_exceeded", reason: quotaResult.reason, creditBalance: quotaResult.creditBalance, creditCost: quotaResult.creditCost },
        { status: 402 }
      );
    }

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

    logActivity({
      userId: session.user.id,
      action: Actions.CHAT_MESSAGE,
      category: "ai",
      resource: "chat_session",
      resourceId: chatSession.id,
      detail: { courseId: course.id, courseTitle: course.title },
      req,
    });

    return NextResponse.json({
      sessionId: chatSession.id,
      response: aiResponse,
      quota: { freeRemaining: quotaResult.freeRemaining, usedCredits: quotaResult.usedCredits, creditBalance: quotaResult.creditBalance },
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
