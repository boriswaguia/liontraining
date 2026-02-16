"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Loader2, Plus, BookOpen, CheckCircle2, Circle, MessageCircle, Bot } from "lucide-react";
import Link from "next/link";
import MathMarkdown from "@/components/MathMarkdown";
import QuotaExceededModal from "@/components/QuotaExceededModal";
import { useLanguage } from "@/hooks/useLanguage";

interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
}

interface StudyGuide {
  id: string;
  title: string;
  content: string;
  chapter: string | null;
  completed: boolean;
  source?: string;
  createdAt: string;
  course: Course;
}

export default function StudyGuidesPage() {
  const { language: lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("courseId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [guides, setGuides] = useState<StudyGuide[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(
    preselectedCourseId || ""
  );
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeGuide, setActiveGuide] = useState<StudyGuide | null>(null);
  const [quotaModal, setQuotaModal] = useState<{ show: boolean; reason?: string; creditBalance?: number; creditCost?: number }>({ show: false });

  const toggleGuideComplete = async (guideId: string, completed: boolean) => {
    try {
      await fetch("/api/study-guides", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideId, completed }),
      });
      setGuides((prev) =>
        prev.map((g) => (g.id === guideId ? { ...g, completed } : g))
      );
      if (activeGuide?.id === guideId) {
        setActiveGuide((prev) => (prev ? { ...prev, completed } : prev));
      }
    } catch (error) {
      console.error("Error toggling guide:", error);
    }
  };

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []));

    const guideUrl = preselectedCourseId
      ? `/api/study-guides?courseId=${preselectedCourseId}`
      : "/api/study-guides";
    fetch(guideUrl)
      .then((r) => r.json())
      .then((d) => setGuides(d.guides || []));
  }, [preselectedCourseId]);

  const generateGuide = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          chapter: chapter || undefined,
        }),
      });
      if (res.status === 402) {
        const err = await res.json();
        setQuotaModal({ show: true, reason: err.reason, creditBalance: err.creditBalance, creditCost: err.creditCost });
        return;
      }
      const data = await res.json();
      if (data.guide) {
        setGuides((prev) => [{ ...data.guide, course: courses.find((c) => c.id === selectedCourse)! }, ...prev]);
        setActiveGuide({ ...data.guide, course: courses.find((c) => c.id === selectedCourse)! });
      }
    } catch (error) {
      console.error("Error generating guide:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-500" />
          {t("guides.title")}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("guides.subtitle")}
        </p>
      </div>

      {/* Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {t("guides.newGuide")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("guides.course")}
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">{t("guides.selectCourse")}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("guides.chapter")}
            </label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder={t("guides.chapter.placeholder")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateGuide}
              disabled={loading || !selectedCourse}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("guides.generating")}
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  {t("guides.generate")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guide List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {t("guides.myGuides")} ({guides.length})
            </h3>
            {guides.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("guides.noPrevious")}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {guides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => setActiveGuide(guide)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeGuide?.id === guide.id
                        ? "bg-green-50 border border-green-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {guide.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={`font-medium text-sm truncate flex items-center gap-1 ${guide.completed ? "text-green-700" : "text-gray-800"}`}>
                          {guide.source === "system" && <Bot className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                          <span className="truncate">{guide.title}</span>
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {guide.source === "system" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                              📌 {lang === "en" ? "Daily" : "Quotidien"}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {guide.course?.code} •{" "}
                            {new Date(guide.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Guide Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
            {activeGuide ? (
              <>
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {activeGuide.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {activeGuide.course?.code} - {activeGuide.course?.title}
                  </p>
                </div>
                <div className="prose max-w-none">
                  <MathMarkdown>{activeGuide.content}</MathMarkdown>
                </div>

                {/* Discuss with AI */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/chat?courseId=${activeGuide.course?.id}&contextType=study_guide&contextId=${activeGuide.id}&contextTitle=${encodeURIComponent(activeGuide.title)}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t("discuss.withAI")}
                  </Link>
                </div>

                {/* Completion toggle */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  {activeGuide.completed ? (
                    <button
                      onClick={() => toggleGuideComplete(activeGuide.id, false)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium text-sm">{t("guides.markRead")}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleGuideComplete(activeGuide.id, true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                    >
                      <Circle className="w-5 h-5" />
                      <span className="font-medium text-sm">{t("guides.markUnread")}</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>{t("guides.selectOrGenerate")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <QuotaExceededModal
        show={quotaModal.show}
        onClose={() => setQuotaModal({ show: false })}
        reason={quotaModal.reason}
        creditBalance={quotaModal.creditBalance}
        creditCost={quotaModal.creditCost}
        lang={lang}
      />
    </div>
  );
}
