import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/analytics — aggregated platform analytics
export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  const { searchParams } = new URL(req.url);
  const days = Math.min(365, Math.max(1, parseInt(searchParams.get("days") || "30", 10)));
  const since = new Date();
  since.setDate(since.getDate() - days);

  // ── 1. Overview counts ──
  const [
    totalUsers,
    activeUsers,
    totalStudents,
    totalAdmins,
    totalCourses,
    activeCourses,
    totalEnrollments,
    totalSchools,
    totalDepartments,
    totalClasses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.course.count(),
    prisma.course.count({ where: { isActive: true } }),
    prisma.enrollment.count(),
    prisma.school.count(),
    prisma.department.count(),
    prisma.academicClass.count(),
  ]);

  // ── 2. Content generated counts ──
  const [
    totalExercises,
    totalStudyGuides,
    totalFlashcards,
    totalChatSessions,
    totalChatMessages,
    totalStudyPlans,
    totalAchievements,
  ] = await Promise.all([
    prisma.exercise.count(),
    prisma.studyGuide.count(),
    prisma.flashcardDeck.count(),
    prisma.chatSession.count(),
    prisma.chatMessage.count(),
    prisma.studyPlan.count(),
    prisma.achievement.count(),
  ]);

  // ── 3. Recent content (within period) ──
  const [
    recentExercises,
    recentStudyGuides,
    recentFlashcards,
    recentChatSessions,
    recentStudyPlans,
    recentUsers,
    recentEnrollments,
  ] = await Promise.all([
    prisma.exercise.count({ where: { createdAt: { gte: since } } }),
    prisma.studyGuide.count({ where: { createdAt: { gte: since } } }),
    prisma.flashcardDeck.count({ where: { createdAt: { gte: since } } }),
    prisma.chatSession.count({ where: { createdAt: { gte: since } } }),
    prisma.studyPlan.count({ where: { createdAt: { gte: since } } }),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.enrollment.count({ where: { enrolledAt: { gte: since } } }),
  ]);

  // ── 4. Daily active users (from activity logs) ──
  const dailyActivity: { date: string; count: number }[] = await prisma.$queryRawUnsafe(`
    SELECT DATE("createdAt") as date, COUNT(DISTINCT "userId")::int as count
    FROM "ActivityLog"
    WHERE "createdAt" >= $1
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `, since);

  // ── 5. Activity by category (period) ──
  const activityByCategory: { category: string; count: number }[] = await prisma.$queryRawUnsafe(`
    SELECT "category", COUNT(*)::int as count
    FROM "ActivityLog"
    WHERE "createdAt" >= $1
    GROUP BY "category"
    ORDER BY count DESC
  `, since);

  // ── 6. Top actions (period) ──
  const topActions: { action: string; count: number }[] = await prisma.$queryRawUnsafe(`
    SELECT "action", COUNT(*)::int as count
    FROM "ActivityLog"
    WHERE "createdAt" >= $1
    GROUP BY "action"
    ORDER BY count DESC
    LIMIT 15
  `, since);

  // ── 7. Most active students (period) ──
  const topStudents: { userId: string; name: string; email: string; count: number }[] = await prisma.$queryRawUnsafe(`
    SELECT a."userId", u."name", u."email", COUNT(*)::int as count
    FROM "ActivityLog" a
    JOIN "User" u ON u."id" = a."userId"
    WHERE a."createdAt" >= $1 AND u."role" = 'student'
    GROUP BY a."userId", u."name", u."email"
    ORDER BY count DESC
    LIMIT 10
  `, since);

  // ── 8. Course popularity (by enrollments) ──
  const coursePopularity: { courseId: string; code: string; title: string; enrollments: number }[] = await prisma.$queryRawUnsafe(`
    SELECT c."id" as "courseId", c."code", c."title", COUNT(e."id")::int as enrollments
    FROM "Course" c
    LEFT JOIN "Enrollment" e ON e."courseId" = c."id"
    WHERE c."isActive" = true
    GROUP BY c."id", c."code", c."title"
    ORDER BY enrollments DESC
    LIMIT 10
  `);

  // ── 9. Average mastery by course ──
  const masteryByCourse: { courseId: string; code: string; title: string; avgMastery: number; studentCount: number }[] = await prisma.$queryRawUnsafe(`
    SELECT c."id" as "courseId", c."code", c."title",
           ROUND(AVG(p."masteryLevel"))::int as "avgMastery",
           COUNT(p."id")::int as "studentCount"
    FROM "UserProgress" p
    JOIN "Course" c ON c."id" = p."courseId"
    GROUP BY c."id", c."code", c."title"
    HAVING COUNT(p."id") > 0
    ORDER BY "avgMastery" DESC
    LIMIT 10
  `);

  // ── 10. Exercise score distribution ──
  const scoreDistribution: { bucket: string; count: number }[] = await prisma.$queryRawUnsafe(`
    SELECT
      CASE
        WHEN score >= 90 THEN '90-100'
        WHEN score >= 70 THEN '70-89'
        WHEN score >= 50 THEN '50-69'
        WHEN score >= 30 THEN '30-49'
        ELSE '0-29'
      END as bucket,
      COUNT(*)::int as count
    FROM "Exercise"
    WHERE score IS NOT NULL
    GROUP BY bucket
    ORDER BY bucket DESC
  `);

  // ── 11. New users per day (period) ──
  const dailyRegistrations: { date: string; count: number }[] = await prisma.$queryRawUnsafe(`
    SELECT DATE("createdAt") as date, COUNT(*)::int as count
    FROM "User"
    WHERE "createdAt" >= $1
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `, since);

  // ── 12. Feature adoption (unique users per feature in period) ──
  const featureAdoption: { feature: string; users: number }[] = await prisma.$queryRawUnsafe(`
    SELECT "action" as feature, COUNT(DISTINCT "userId")::int as users
    FROM "ActivityLog"
    WHERE "createdAt" >= $1
      AND "action" IN ('chat.message', 'exercise.generate', 'study_guide.generate', 'flashcard.generate', 'study_plan.generate', 'exercise.score', 'flashcard.review', 'study_guide.complete')
    GROUP BY "action"
    ORDER BY users DESC
  `, since);

  // ── 13. Engagement by school ──
  const engagementBySchool: { schoolId: string; shortName: string; students: number; activities: number }[] = await prisma.$queryRawUnsafe(`
    SELECT s."id" as "schoolId", s."shortName",
           COUNT(DISTINCT u."id")::int as students,
           COUNT(a."id")::int as activities
    FROM "School" s
    LEFT JOIN "User" u ON u."schoolId" = s."id" AND u."role" = 'student'
    LEFT JOIN "ActivityLog" a ON a."userId" = u."id" AND a."createdAt" >= $1
    GROUP BY s."id", s."shortName"
    ORDER BY activities DESC
  `, since);

  // ── 14. At-risk students (registered but inactive in period) ──
  const atRiskStudents: { id: string; name: string; email: string; lastActivity: string | null }[] = await prisma.$queryRawUnsafe(`
    SELECT u."id", u."name", u."email",
           MAX(a."createdAt") as "lastActivity"
    FROM "User" u
    LEFT JOIN "ActivityLog" a ON a."userId" = u."id"
    WHERE u."role" = 'student' AND u."isActive" = true
    GROUP BY u."id", u."name", u."email"
    HAVING MAX(a."createdAt") IS NULL OR MAX(a."createdAt") < $1
    ORDER BY MAX(a."createdAt") ASC NULLS FIRST
    LIMIT 10
  `, since);

  // ── 15. XP leaderboard ──
  const xpLeaderboard: { userId: string; name: string; totalXp: number; courses: number }[] = await prisma.$queryRawUnsafe(`
    SELECT u."id" as "userId", u."name",
           SUM(p."totalXp")::int as "totalXp",
           COUNT(p."id")::int as courses
    FROM "UserProgress" p
    JOIN "User" u ON u."id" = p."userId"
    WHERE u."role" = 'student'
    GROUP BY u."id", u."name"
    ORDER BY "totalXp" DESC
    LIMIT 10
  `);

  // ── 16. Hourly activity heatmap (for the period) ──
  const hourlyActivity: { hour: number; dow: number; count: number }[] = await prisma.$queryRawUnsafe(`
    SELECT EXTRACT(HOUR FROM "createdAt")::int as hour,
           EXTRACT(DOW FROM "createdAt")::int as dow,
           COUNT(*)::int as count
    FROM "ActivityLog"
    WHERE "createdAt" >= $1
    GROUP BY hour, dow
    ORDER BY dow, hour
  `, since);

  return NextResponse.json({
    period: { days, since: since.toISOString() },
    overview: {
      totalUsers,
      activeUsers,
      totalStudents,
      totalAdmins,
      totalCourses,
      activeCourses,
      totalEnrollments,
      totalSchools,
      totalDepartments,
      totalClasses,
    },
    content: {
      totalExercises,
      totalStudyGuides,
      totalFlashcards,
      totalChatSessions,
      totalChatMessages,
      totalStudyPlans,
      totalAchievements,
    },
    recent: {
      exercises: recentExercises,
      studyGuides: recentStudyGuides,
      flashcards: recentFlashcards,
      chatSessions: recentChatSessions,
      studyPlans: recentStudyPlans,
      users: recentUsers,
      enrollments: recentEnrollments,
    },
    charts: {
      dailyActivity,
      dailyRegistrations,
      activityByCategory,
      topActions,
      scoreDistribution,
      hourlyActivity,
    },
    rankings: {
      topStudents,
      coursePopularity,
      masteryByCourse,
      featureAdoption,
      engagementBySchool,
      atRiskStudents,
      xpLeaderboard,
    },
  });
}
