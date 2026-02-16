import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/users/[id] — get a single user with full details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      language: true,
      isActive: true,
      creditBalance: true,
      plan: true,
      schoolId: true,
      departmentId: true,
      classId: true,
      createdAt: true,
      updatedAt: true,
      school: { select: { id: true, shortName: true, name: true, city: true } },
      department: { select: { id: true, name: true, code: true } },
      academicClass: { select: { id: true, name: true, code: true, academicYear: true } },
      enrollments: {
        select: {
          id: true,
          enrolledAt: true,
          course: {
            select: { id: true, code: true, title: true, category: true },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
      chatSessions: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          course: { select: { id: true, code: true, title: true } },
          _count: { select: { messages: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
      exercises: {
        select: {
          id: true,
          topic: true,
          difficulty: true,
          score: true,
          questions: true,
          solutions: true,
          createdAt: true,
          course: { select: { id: true, code: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      studyGuides: {
        select: {
          id: true,
          title: true,
          chapter: true,
          completed: true,
          content: true,
          createdAt: true,
          course: { select: { id: true, code: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      flashcardDecks: {
        select: {
          id: true,
          title: true,
          reviewed: true,
          confidence: true,
          cards: true,
          createdAt: true,
          course: { select: { id: true, code: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      studyPlans: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          course: { select: { id: true, code: true, title: true } },
          _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      progress: {
        select: {
          id: true,
          masteryLevel: true,
          currentDifficulty: true,
          totalXp: true,
          streak: true,
          totalExercises: true,
          totalCorrect: true,
          totalFlashcards: true,
          totalStudyGuides: true,
          totalChatMessages: true,
          lastActivityAt: true,
          course: { select: { id: true, code: true, title: true } },
        },
        orderBy: { lastActivityAt: "desc" },
      },
      achievements: {
        select: {
          id: true,
          badge: true,
          title: true,
          description: true,
          icon: true,
          earnedAt: true,
        },
        orderBy: { earnedAt: "desc" },
      },
      _count: {
        select: {
          enrollments: true,
          chatSessions: true,
          exercises: true,
          studyGuides: true,
          flashcardDecks: true,
          studyPlans: true,
          progress: true,
          topicMastery: true,
          achievements: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
