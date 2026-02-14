"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Loader2,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trophy,
} from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
}

interface StudyTask {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  completed: boolean;
}

interface StudyPlanItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  course: Course;
  tasks: StudyTask[];
}

export default function PlannerPage() {
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("courseId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [plans, setPlans] = useState<StudyPlanItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(
    preselectedCourseId || ""
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<StudyPlanItem | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []));

    const url = preselectedCourseId
      ? `/api/study-plans?courseId=${preselectedCourseId}`
      : "/api/study-plans";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []));

    // Default end date: 30 days from now
    const end = new Date();
    end.setDate(end.getDate() + 30);
    setEndDate(end.toISOString().split("T")[0]);
  }, [preselectedCourseId]);

  const generatePlan = async () => {
    if (!selectedCourse || !startDate || !endDate) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          startDate,
          endDate,
          hoursPerDay,
        }),
      });
      const data = await res.json();
      if (data.plan) {
        const newPlan = {
          ...data.plan,
          course: courses.find((c) => c.id === selectedCourse)!,
        };
        setPlans((prev) => [newPlan, ...prev]);
        setActivePlan(newPlan);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await fetch("/api/study-plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed }),
      });

      if (activePlan) {
        const updated = {
          ...activePlan,
          tasks: activePlan.tasks.map((t) =>
            t.id === taskId ? { ...t, completed } : t
          ),
        };
        setActivePlan(updated);
        setPlans((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const completedTasks = activePlan?.tasks.filter((t) => t.completed).length || 0;
  const totalTasks = activePlan?.tasks.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-indigo-500" />
          Plan d&apos;Étude
        </h1>
        <p className="text-gray-500 mt-1">
          Programme de révision personnalisé par IA
        </p>
      </div>

      {/* Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Créer un Plan de Révision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cours
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="">Choisir...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date fin (examen)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heures/jour
            </label>
            <select
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}h
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={generatePlan}
              disabled={loading || !selectedCourse}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer le Plan"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Mes Plans ({plans.length})
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {plans.map((plan) => {
                const done = plan.tasks.filter((t) => t.completed).length;
                const pct =
                  plan.tasks.length > 0
                    ? Math.round((done / plan.tasks.length) * 100)
                    : 0;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setActivePlan(plan)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activePlan?.id === plan.id
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {plan.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {plan.course?.code} • {pct}% complété
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div
                        className="bg-indigo-500 h-1 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Plan Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
            {activePlan ? (
              <>
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {activePlan.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {activePlan.course?.code} -{" "}
                    {new Date(activePlan.startDate).toLocaleDateString(
                      "fr-FR"
                    )}{" "}
                    au{" "}
                    {new Date(activePlan.endDate).toLocaleDateString("fr-FR")}
                  </p>

                  {/* Progress */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {completedTasks}/{totalTasks} ({Math.round(progress)}%)
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {activePlan.tasks.map((task) => {
                    const dueDate = new Date(task.dueDate);
                    const isPast = dueDate < new Date() && !task.completed;
                    return (
                      <div
                        key={task.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          task.completed
                            ? "border-green-100 bg-green-50"
                            : isPast
                              ? "border-red-100 bg-red-50"
                              : "border-gray-100"
                        }`}
                      >
                        <button
                          onClick={() =>
                            toggleTask(task.id, !task.completed)
                          }
                          className="mt-0.5 flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 hover:text-blue-400" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm ${
                              task.completed
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          {dueDate.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Celebration when plan is 100% complete */}
                {totalTasks > 0 && completedTasks === totalTasks && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      <div>
                        <p className="font-bold text-gray-800">Plan terminé !</p>
                        <p className="text-sm text-gray-600">
                          Félicitations ! Vous avez complété toutes les tâches de ce plan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <CalendarDays className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>Sélectionnez un plan ou créez-en un nouveau</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
