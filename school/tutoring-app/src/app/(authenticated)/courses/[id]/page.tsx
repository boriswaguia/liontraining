import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Lightbulb,
  GraduationCap,
  MessageCircle,
  CalendarDays,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/courses";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id!;
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) notFound();

  // Get stats for this course
  const [guides, exercises, decks, chats, plans] = await Promise.all([
    prisma.studyGuide.count({ where: { userId, courseId: id } }),
    prisma.exercise.count({ where: { userId, courseId: id } }),
    prisma.flashcardDeck.count({ where: { userId, courseId: id } }),
    prisma.chatSession.count({ where: { userId, courseId: id } }),
    prisma.studyPlan.count({ where: { userId, courseId: id } }),
  ]);

  const features = [
    {
      label: "Guide d'Étude",
      description: "Résumé simplifié du cours généré par IA",
      icon: FileText,
      color: "bg-green-500",
      href: `/study-guides?courseId=${id}`,
      count: guides,
    },
    {
      label: "Exercices",
      description: "Exercices avec solutions détaillées",
      icon: Lightbulb,
      color: "bg-yellow-500",
      href: `/exercises?courseId=${id}`,
      count: exercises,
    },
    {
      label: "Flashcards",
      description: "Cartes de révision pour mémoriser",
      icon: GraduationCap,
      color: "bg-purple-500",
      href: `/flashcards?courseId=${id}`,
      count: decks,
    },
    {
      label: "Tuteur IA",
      description: "Posez vos questions au tuteur intelligent",
      icon: MessageCircle,
      color: "bg-blue-500",
      href: `/chat?courseId=${id}`,
      count: chats,
    },
    {
      label: "Plan d'Étude",
      description: "Programme de révision personnalisé",
      icon: CalendarDays,
      color: "bg-indigo-500",
      href: `/planner?courseId=${id}`,
      count: plans,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux cours
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl">
            {CATEGORY_ICONS[course.category] || "📚"}
          </span>
          <div className="flex-1">
            <span className="text-sm text-blue-600 font-medium">
              {course.code}
            </span>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">
              {course.title}
            </h1>
            <p className="text-gray-500 mt-2">{course.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.hours} heures
              </span>
              <span>Niveau {course.level}</span>
              <span>Semestre {course.semester}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {CATEGORY_LABELS[course.category]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Outils d&apos;Apprentissage
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Link
            key={feature.label}
            href={feature.href}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`${feature.color} w-10 h-10 rounded-lg flex items-center justify-center`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              {feature.count > 0 && (
                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {feature.count} créé(s)
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {feature.label}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
