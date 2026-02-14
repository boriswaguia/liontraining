import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/courses";
import { Clock, Users } from "lucide-react";

export default async function CoursesPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
  });

  // Group by category
  const coursesByCategory: Record<string, typeof enrollments> = {};
  for (const enrollment of enrollments) {
    const cat = enrollment.course.category;
    if (!coursesByCategory[cat]) coursesByCategory[cat] = [];
    coursesByCategory[cat].push(enrollment);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mes Cours</h1>
        <p className="text-gray-500 mt-1">
          Niveau 1 - Semestre 1 - Génie Informatique (2025/2026)
        </p>
      </div>

      {Object.entries(coursesByCategory).map(([category, categoryEnrollments]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-xl">{CATEGORY_ICONS[category] || "📚"}</span>
            {CATEGORY_LABELS[category] || category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryEnrollments.map((enrollment: any) => (
              <Link
                key={enrollment.id}
                href={`/courses/${enrollment.course.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {enrollment.course.code}
                  </span>
                  <span className="text-2xl">
                    {CATEGORY_ICONS[category] || "📚"}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {enrollment.course.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {enrollment.course.hours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Niveau {enrollment.course.level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
