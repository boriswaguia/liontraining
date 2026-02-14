"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Lightbulb,
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/hooks/useLanguage";

interface Course {
  id: string;
  code: string;
  title: string;
}

interface Exercise {
  id: string;
  topic: string;
  questions: string;
  solutions: string;
  difficulty: string;
  score: number | null;
  createdAt: string;
  course: Course;
}

const DIFFICULTY_LABELS: Record<string, { labelKey: string; color: string }> = {
  easy: { labelKey: "exercises.easy", color: "bg-green-100 text-green-700" },
  medium: { labelKey: "exercises.medium", color: "bg-yellow-100 text-yellow-700" },
  hard: { labelKey: "exercises.hard", color: "bg-red-100 text-red-700" },
};

export default function ExercisesPage() {
  const { language: lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("courseId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(
    preselectedCourseId || ""
  );
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>(
    {}
  );
  const [scoring, setScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    xpEarned: number;
    newDifficulty: string;
    overallMastery: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []));

    const url = preselectedCourseId
      ? `/api/exercises?courseId=${preselectedCourseId}`
      : "/api/exercises";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setExercises(d.exercises || []));
  }, [preselectedCourseId]);

  const generateExercises = async () => {
    if (!selectedCourse || !topic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          topic,
          difficulty,
          count,
        }),
      });
      const data = await res.json();
      if (data.exercise) {
        const newExercise = {
          ...data.exercise,
          course: courses.find((c) => c.id === selectedCourse)!,
        };
        setExercises((prev) => [newExercise, ...prev]);
        setActiveExercise(newExercise);
        setShowSolutions({});
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSolution = (index: number) => {
    setShowSolutions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const submitScore = async (score: number) => {
    if (!activeExercise || scoring) return;
    setScoring(true);
    setScoreResult(null);
    try {
      const res = await fetch("/api/exercises/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: activeExercise.id,
          score,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScoreResult(data);
        // Update the exercise in the list to reflect the score
        setExercises((prev) =>
          prev.map((ex) =>
            ex.id === activeExercise.id ? { ...ex, score } : ex
          )
        );
        setActiveExercise((prev) => (prev ? { ...prev, score } : prev));
      }
    } catch (error) {
      console.error("Score error:", error);
    } finally {
      setScoring(false);
    }
  };

  const questions = activeExercise
    ? JSON.parse(activeExercise.questions)
    : [];
  const solutions = activeExercise
    ? JSON.parse(activeExercise.solutions)
    : [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          {t("exercises.title")}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("exercises.subtitle")}
        </p>
      </div>

      {/* Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {t("exercises.newExercises")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("exercises.course")}
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="">{t("exercises.selectCourse")}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("exercises.topic")}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("exercises.topic.placeholder")}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("exercises.difficulty")}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="easy">{t("exercises.easy")}</option>
              <option value="medium">{t("exercises.medium")}</option>
              <option value="hard">{t("exercises.hard")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("exercises.count")}
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              {[3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>
                  {n} {t("exercises.countUnit")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateExercises}
              disabled={loading || !selectedCourse || !topic}
              className="w-full bg-yellow-500 text-white py-2.5 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("exercises.generating")}
                </>
              ) : (
                t("exercises.generate")
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {t("exercises.myExercises")} ({exercises.length})
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setActiveExercise(ex);
                    setShowSolutions({});
                    setScoreResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeExercise?.id === ex.id
                      ? "bg-yellow-50 border border-yellow-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800">
                        {ex.topic}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            DIFFICULTY_LABELS[ex.difficulty]?.color ||
                            "bg-gray-100"
                          }`}
                        >
                          {t(DIFFICULTY_LABELS[ex.difficulty]?.labelKey as any) || ex.difficulty}
                        </span>
                        <span className="text-xs text-gray-400">
                          {ex.course?.code}
                        </span>
                      </div>
                    </div>
                    {ex.score !== null && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                        ex.score >= 75
                          ? "bg-green-100 text-green-700"
                          : ex.score >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}>
                        {ex.score}%
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exercise Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
            {activeExercise ? (
              <>
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {activeExercise.topic}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        DIFFICULTY_LABELS[activeExercise.difficulty]?.color
                      }`}
                    >
                      {t(DIFFICULTY_LABELS[activeExercise.difficulty]?.labelKey as any)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {activeExercise.course?.code} -{" "}
                    {activeExercise.course?.title}
                  </p>
                </div>

                <div className="space-y-6">
                  {questions.map((q: string, i: number) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{q}</ReactMarkdown>
                          </div>

                          <button
                            onClick={() => toggleSolution(i)}
                            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {showSolutions[i] ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                {t("exercises.hideSolution")}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                {t("exercises.showSolution")}
                              </>
                            )}
                          </button>

                          {showSolutions[i] && solutions[i] && (
                            <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-1 text-green-700 text-sm font-medium mb-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {t("exercises.solution")}
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <ReactMarkdown>{solutions[i]}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Self-Scoring Section */}
                {activeExercise && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    {activeExercise.score !== null ? (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              {t("exercises.scoreRecorded")}
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {activeExercise.score}%
                            </p>
                          </div>
                          {scoreResult && (
                            <div className="text-right">
                              <p className="text-sm text-blue-600 font-medium">
                                +{scoreResult.xpEarned} {t("exercises.xpEarned")}
                              </p>
                              <p className="text-xs text-blue-500">
                                {t("exercises.overallMastery")} {scoreResult.overallMastery}%
                              </p>
                              <p className="text-xs text-blue-500">
                                {t("exercises.adaptedDifficulty")} {scoreResult.newDifficulty}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          {t("exercises.selfEval")}
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { score: 0, label: "0%", desc: t("exercises.notUnderstood"), color: "bg-red-100 hover:bg-red-200 text-red-700" },
                            { score: 25, label: "25%", desc: t("exercises.difficult"), color: "bg-orange-100 hover:bg-orange-200 text-orange-700" },
                            { score: 50, label: "50%", desc: t("exercises.average"), color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700" },
                            { score: 75, label: "75%", desc: t("exercises.good"), color: "bg-blue-100 hover:bg-blue-200 text-blue-700" },
                            { score: 100, label: "100%", desc: t("exercises.perfect"), color: "bg-green-100 hover:bg-green-200 text-green-700" },
                          ].map((opt) => (
                            <button
                              key={opt.score}
                              onClick={() => submitScore(opt.score)}
                              disabled={scoring}
                              className={`${opt.color} rounded-lg p-3 text-center transition-colors disabled:opacity-50`}
                            >
                              <p className="text-lg font-bold">{opt.label}</p>
                              <p className="text-xs">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                        {scoring && (
                          <p className="text-xs text-gray-400 mt-2 text-center">
                            {t("exercises.saving")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Lightbulb className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>{t("exercises.selectOrGenerate")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
