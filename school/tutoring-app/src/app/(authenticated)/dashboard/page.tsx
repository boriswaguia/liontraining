import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Lightbulb,
  GraduationCap,
  MessageCircle,
  CalendarDays,
  TrendingUp,
  Zap,
  Flame,
  Target,
} from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/courses";
import { Language, t } from "@/lib/i18n";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;
  const userExt = session?.user as Record<string, unknown> | undefined;
  const lang = ((userExt?.language as string) || "fr") as Language;

  const [enrollments, studyGuides, exercises, flashcardDecks, chatSessions, studyPlans, userProgress, achievements] =
    await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: { course: true },
      }),
      prisma.studyGuide.count({ where: { userId } }),
      prisma.exercise.count({ where: { userId } }),
      prisma.flashcardDeck.count({ where: { userId } }),
      prisma.chatSession.count({ where: { userId } }),
      prisma.studyPlan.count({ where: { userId } }),
      prisma.userProgress.findMany({
        where: { userId },
        include: { course: true },
      }),
      prisma.achievement.count({ where: { userId } }),
    ]);

  // Aggregate progress stats
  const totalXp = userProgress.reduce((sum: number, p: any) => sum + p.totalXp, 0);
  const maxStreak = userProgress.length > 0
    ? Math.max(...userProgress.map((p: any) => p.streak))
    : 0;
  const totalExercisesScored = userProgress.reduce(
    (sum: number, p: any) => sum + p.totalExercises,
    0
  );
  const totalCorrect = userProgress.reduce(
    (sum: number, p: any) => sum + p.totalCorrect,
    0
  );
  const successRate = totalExercisesScored > 0
    ? Math.round((totalCorrect / totalExercisesScored) * 100)
    : 0;

  const stats = [
    {
      label: t("dash.enrolledCourses", lang),
      value: enrollments.length,
      icon: BookOpen,
      color: "bg-blue-500",
      href: "/courses",
    },
    {
      label: t("dash.studyGuides", lang),
      value: studyGuides,
      icon: FileText,
      color: "bg-green-500",
      href: "/study-guides",
    },
    {
      label: t("dash.exercises", lang),
      value: exercises,
      icon: Lightbulb,
      color: "bg-yellow-500",
      href: "/exercises",
    },
    {
      label: t("dash.flashcards", lang),
      value: flashcardDecks,
      icon: GraduationCap,
      color: "bg-purple-500",
      href: "/flashcards",
    },
    {
      label: t("dash.chatSessions", lang),
      value: chatSessions,
      icon: MessageCircle,
      color: "bg-pink-500",
      href: "/chat",
    },
    {
      label: t("dash.studyPlans", lang),
      value: studyPlans,
      icon: CalendarDays,
      color: "bg-indigo-500",
      href: "/planner",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("dash.welcome", lang)} {session?.user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {t("dash.subtitle", lang)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div
              className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          {t("dash.quickActions", lang)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/chat"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-800">
                {t("dash.askQuestion", lang)}
              </p>
              <p className="text-sm text-gray-500">
                {t("dash.askQuestion.desc", lang)}
              </p>
            </div>
          </Link>
          <Link
            href="/exercises"
            className="flex items-center gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
          >
            <Lightbulb className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-medium text-gray-800">
                {t("dash.practice", lang)}
              </p>
              <p className="text-sm text-gray-500">
                {t("dash.practice.desc", lang)}
              </p>
            </div>
          </Link>
          <Link
            href="/flashcards"
            className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <GraduationCap className="w-8 h-8 text-purple-500" />
            <div>
              <p className="font-medium text-gray-800">{t("dash.review", lang)}</p>
              <p className="text-sm text-gray-500">
                {t("dash.review.desc", lang)}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Progress Overview */}
      {(totalXp > 0 || totalExercisesScored > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              {t("dash.myProgress", lang)}
            </h2>
            <Link
              href="/progress"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t("seeDetails", lang)}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <Zap className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-blue-600">{totalXp}</p>
              <p className="text-xs text-blue-500">{t("dash.totalXp", lang)}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-orange-600">{maxStreak}</p>
              <p className="text-xs text-orange-500">{t("dash.bestStreak", lang)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-600">{successRate}%</p>
              <p className="text-xs text-green-500">{t("dash.successRate", lang)}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <GraduationCap className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-yellow-600">{achievements}</p>
              <p className="text-xs text-yellow-600">{t("dash.badges", lang)}</p>
            </div>
          </div>
          {userProgress.length > 0 && (
            <div className="mt-4 space-y-2">
              {userProgress.slice(0, 3).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-20 truncate">
                    {p.course.code}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 transition-all ${
                        p.masteryLevel >= 70
                          ? "bg-green-500"
                          : p.masteryLevel >= 40
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                      }`}
                      style={{ width: `${p.masteryLevel}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600 w-10 text-right">
                    {p.masteryLevel}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Courses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{t("dash.myCourses", lang)}</h2>
          <Link
            href="/courses"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("seeAll", lang)}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((enrollment: any) => (
            <Link
              key={enrollment.id}
              href={`/courses/${enrollment.course.id}`}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {CATEGORY_ICONS[enrollment.course.category] || "📚"}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm">
                    {enrollment.course.code}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {enrollment.course.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {enrollment.course.hours}{t("courses.hours", lang)} • {t("dash.semester", lang)}{" "}
                    {enrollment.course.semester}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
