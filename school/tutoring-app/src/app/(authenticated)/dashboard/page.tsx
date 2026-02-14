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
} from "lucide-react";
import { CATEGORY_ICONS } from "@/lib/courses";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const [enrollments, studyGuides, exercises, flashcardDecks, chatSessions, studyPlans] =
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
    ]);

  const stats = [
    {
      label: "Cours Inscrits",
      value: enrollments.length,
      icon: BookOpen,
      color: "bg-blue-500",
      href: "/courses",
    },
    {
      label: "Guides d'Étude",
      value: studyGuides,
      icon: FileText,
      color: "bg-green-500",
      href: "/study-guides",
    },
    {
      label: "Exercices",
      value: exercises,
      icon: Lightbulb,
      color: "bg-yellow-500",
      href: "/exercises",
    },
    {
      label: "Flashcards",
      value: flashcardDecks,
      icon: GraduationCap,
      color: "bg-purple-500",
      href: "/flashcards",
    },
    {
      label: "Conversations IA",
      value: chatSessions,
      icon: MessageCircle,
      color: "bg-pink-500",
      href: "/chat",
    },
    {
      label: "Plans d'Étude",
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
          Bienvenue, {session?.user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Votre espace de tutorat personnalisé - IUT de Douala, Génie
          Informatique
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
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/chat"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-800">
                Poser une Question
              </p>
              <p className="text-sm text-gray-500">
                Discutez avec le tuteur IA
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
                S&apos;entraîner
              </p>
              <p className="text-sm text-gray-500">
                Générer des exercices
              </p>
            </div>
          </Link>
          <Link
            href="/flashcards"
            className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <GraduationCap className="w-8 h-8 text-purple-500" />
            <div>
              <p className="font-medium text-gray-800">Réviser</p>
              <p className="text-sm text-gray-500">
                Flashcards de révision
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Mes Cours</h2>
          <Link
            href="/courses"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Voir tout →
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
                    {enrollment.course.hours}h • Semestre{" "}
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
