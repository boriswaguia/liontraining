import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  generateExercises,
  generateStudyGuide,
  generateFlashcards,
} from "@/lib/gemini";
import { buildStudentProfileForLLM } from "@/lib/progress";
import { sendEmail, buildRecommendationEmail } from "@/lib/email";
import { logActivity, Actions } from "@/lib/activity";
import { auth } from "@/lib/auth";

/**
 * POST /api/cron/daily-content
 *
 * Generates personalized daily content for each active student
 * based on their progress, then sends an email notification.
 *
 * Protected by CRON_SECRET header OR admin session auth.
 */
export async function POST(req: NextRequest) {
  // ── Auth: check cron secret OR admin session ──
  // Read at request time so auto-generated secrets (set in instrumentation.ts) are picked up
  const cronSecret = process.env.CRON_SECRET || "";
  const secret = req.headers.get("x-cron-secret") || "";
  const hasCronSecret = cronSecret !== "" && secret === cronSecret;

  let isAdmin = false;
  if (!hasCronSecret) {
    const session = await auth();
    isAdmin = (session?.user as Record<string, unknown>)?.role === "admin";
  }

  if (!hasCronSecret && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Check if feature is enabled ──
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "daily_recommendations_enabled" },
  });
  if (!setting || setting.value !== "true") {
    return NextResponse.json({
      skipped: true,
      reason: "Daily recommendations are disabled",
    });
  }

  const appUrl = process.env.AUTH_URL || "https://lionlearning.briskprototyping.com";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ── Get all active students with enrollments ──
  const students = await prisma.user.findMany({
    where: { role: "student", isActive: true },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  });

  const results: {
    userId: string;
    name: string;
    status: string;
    type?: string;
    courseCode?: string;
    error?: string;
  }[] = [];

  for (const student of students) {
    try {
      // Skip students with no enrollments
      if (!student.enrollments.length) {
        results.push({ userId: student.id, name: student.name, status: "skipped", error: "No enrollments" });
        continue;
      }

      // Check if already generated today
      const existing = await prisma.dailyRecommendation.findFirst({
        where: {
          userId: student.id,
          createdAt: { gte: today },
        },
      });
      if (existing) {
        results.push({ userId: student.id, name: student.name, status: "skipped", error: "Already generated today" });
        continue;
      }

      // ── Pick the best course + topic ──
      const { course, topic, reason, contentType } = await selectContentForStudent(student);

      const lang = student.language || "fr";
      const profile = await buildStudentProfileForLLM(student.id, course.id);

      let contentId: string;
      let topicLabel = topic;

      // ── Generate content based on rotating type ──
      if (contentType === "exercise") {
        const difficulty = await getAdaptiveDifficulty(student.id, course.id);
        const result = await generateExercises(
          course.title,
          course.content,
          topic,
          difficulty,
          5,
          profile,
          lang
        );
        const exercise = await prisma.exercise.create({
          data: {
            userId: student.id,
            courseId: course.id,
            topic,
            questions: JSON.stringify(result.questions),
            solutions: JSON.stringify(result.solutions),
            difficulty,
            source: "system",
          },
        });
        contentId = exercise.id;
      } else if (contentType === "study_guide") {
        const content = await generateStudyGuide(
          course.title,
          course.content,
          topic,
          profile,
          lang
        );
        const guide = await prisma.studyGuide.create({
          data: {
            userId: student.id,
            courseId: course.id,
            title: lang === "fr"
              ? `📌 Recommandation: ${topic}`
              : `📌 Recommendation: ${topic}`,
            content,
            chapter: topic,
            source: "system",
          },
        });
        contentId = guide.id;
        topicLabel = guide.title;
      } else {
        // flashcard
        const cards = await generateFlashcards(
          course.title,
          course.content,
          topic,
          15,
          profile,
          lang
        );
        const deck = await prisma.flashcardDeck.create({
          data: {
            userId: student.id,
            courseId: course.id,
            title: lang === "fr"
              ? `📌 Recommandation: ${topic}`
              : `📌 Recommendation: ${topic}`,
            cards: JSON.stringify(cards),
            source: "system",
          },
        });
        contentId = deck.id;
        topicLabel = deck.title;
      }

      // ── Create recommendation record ──
      const rec = await prisma.dailyRecommendation.create({
        data: {
          userId: student.id,
          courseId: course.id,
          type: contentType,
          contentId,
          reason,
        },
      });

      // ── Send email ──
      const contentUrl = contentType === "exercise"
        ? `${appUrl}/exercises?courseId=${course.id}`
        : contentType === "study_guide"
          ? `${appUrl}/study-guides?courseId=${course.id}`
          : `${appUrl}/flashcards?courseId=${course.id}`;

      const { subject, html } = buildRecommendationEmail({
        studentName: student.name.split(" ")[0],
        type: contentType,
        courseTitle: course.title,
        courseCode: course.code,
        topic: topicLabel,
        reason,
        contentUrl,
        language: lang,
      });

      const emailSent = await sendEmail({ to: student.email, subject, html });

      if (emailSent) {
        await prisma.dailyRecommendation.update({
          where: { id: rec.id },
          data: { emailSent: true, emailSentAt: new Date() },
        });
      }

      // Log activity
      logActivity({
        userId: student.id,
        action: Actions.DAILY_RECOMMENDATION,
        category: "ai",
        resource: contentType === "exercise" ? "exercise" : contentType === "study_guide" ? "study_guide" : "flashcard_deck",
        resourceId: contentId,
        detail: { type: contentType, courseId: course.id, topic, reason, emailSent },
      });

      results.push({
        userId: student.id,
        name: student.name,
        status: "generated",
        type: contentType,
        courseCode: course.code,
      });
    } catch (err) {
      console.error(`[DailyCron] Error for ${student.name}:`, (err as Error).message);
      results.push({
        userId: student.id,
        name: student.name,
        status: "error",
        error: (err as Error).message,
      });
    }
  }

  const generated = results.filter((r) => r.status === "generated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;

  console.log(`[DailyCron] Done: ${generated} generated, ${skipped} skipped, ${errors} errors`);

  return NextResponse.json({
    success: true,
    summary: { total: students.length, generated, skipped, errors },
    details: results,
  });
}

// ════════════════════════════════════════════════════
// SMART CONTENT SELECTION
// ════════════════════════════════════════════════════

interface StudentWithEnrollments {
  id: string;
  language: string;
  enrollments: {
    course: {
      id: string;
      code: string;
      title: string;
      content: string;
      category: string;
    };
  }[];
}

async function selectContentForStudent(student: StudentWithEnrollments): Promise<{
  course: StudentWithEnrollments["enrollments"][0]["course"];
  topic: string;
  reason: string;
  contentType: "exercise" | "study_guide" | "flashcard";
}> {
  const fr = student.language === "fr";

  // 1. Get all progress records for enrolled courses
  const courseIds = student.enrollments.map((e) => e.course.id);
  const [progresses, topicMasteries, recentRecs] = await Promise.all([
    prisma.userProgress.findMany({
      where: { userId: student.id, courseId: { in: courseIds } },
    }),
    prisma.topicMastery.findMany({
      where: { userId: student.id, courseId: { in: courseIds } },
      orderBy: { masteryScore: "asc" },
    }),
    prisma.dailyRecommendation.findMany({
      where: {
        userId: student.id,
        createdAt: { gte: new Date(Date.now() - 7 * 86400000) }, // last 7 days
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // 2. Score each course — prefer low mastery, long inactivity
  const courseScores = student.enrollments.map((e) => {
    const prog = progresses.find((p: { courseId: string }) => p.courseId === e.course.id);
    const mastery = prog?.masteryLevel ?? 0;
    const daysSinceActivity = prog?.lastActivityAt
      ? Math.floor((Date.now() - prog.lastActivityAt.getTime()) / 86400000)
      : 30; // never studied = high priority
    const recentRecsForCourse = recentRecs.filter((r: { courseId: string }) => r.courseId === e.course.id).length;

    // Score: lower mastery + longer inactivity + fewer recent recs = higher priority
    const score = (100 - mastery) * 2 + daysSinceActivity * 3 - recentRecsForCourse * 20;
    return { course: e.course, score, mastery, daysSinceActivity };
  });

  courseScores.sort((a, b) => b.score - a.score);
  const selected = courseScores[0];

  // 3. Pick topic — prefer weakest topic in selected course
  const courseTopics = topicMasteries.filter((t: { courseId: string }) => t.courseId === selected.course.id);
  let topic: string;
  let reason: string;

  if (courseTopics.length) {
    // Pick the weakest topic that wasn't recommended recently
    const recentTopics = recentRecs
      .filter((r: { courseId: string }) => r.courseId === selected.course.id)
      .map((r: { reason: string | null }) => {
        try {
          const d = JSON.parse(r.reason || "{}");
          return d.topic;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const candidate = courseTopics.find((t: { topic: string }) => !recentTopics.includes(t.topic)) || courseTopics[0];
    topic = candidate.topic;

    if (candidate.masteryScore < 30) {
      reason = fr
        ? `Votre maîtrise de "${topic}" est de ${candidate.masteryScore}%. Pratiquons pour progresser !`
        : `Your mastery of "${topic}" is ${candidate.masteryScore}%. Let's practice to improve!`;
    } else if (candidate.masteryScore < 60) {
      reason = fr
        ? `"${topic}" a besoin d'attention (${candidate.masteryScore}%). Consolidons vos acquis !`
        : `"${topic}" needs attention (${candidate.masteryScore}%). Let's consolidate!`;
    } else {
      reason = fr
        ? `Maintenons votre niveau sur "${topic}" (${candidate.masteryScore}%).`
        : `Let's maintain your level on "${topic}" (${candidate.masteryScore}%).`;
    }
  } else {
    // No topic mastery data → student is new to this course
    topic = selected.course.title;
    reason = fr
      ? `Commençons à explorer ${selected.course.code} — ${selected.course.title} !`
      : `Let's start exploring ${selected.course.code} — ${selected.course.title}!`;
  }

  // 4. Pick content type — rotate, avoid repeating same type
  const lastTypes = recentRecs.slice(0, 3).map((r: { type: string }) => r.type);
  const typeOrder: ("exercise" | "study_guide" | "flashcard")[] = ["exercise", "study_guide", "flashcard"];
  let contentType = typeOrder.find((t) => !lastTypes.includes(t)) || typeOrder[0];

  // If mastery is very low (<30), prefer study_guide first
  if (selected.mastery < 30 && !lastTypes.includes("study_guide")) {
    contentType = "study_guide";
  }

  return { course: selected.course, topic, reason, contentType };
}

async function getAdaptiveDifficulty(userId: string, courseId: string): Promise<string> {
  const progress = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  return progress?.currentDifficulty || "easy";
}
