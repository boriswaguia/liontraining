"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Loader2, Plus, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  createdAt: string;
  course: Course;
}

export default function StudyGuidesPage() {
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
          Guides d&apos;Étude
        </h1>
        <p className="text-gray-500 mt-1">
          Résumés simplifiés de vos cours, générés par IA
        </p>
      </div>

      {/* Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Générer un Nouveau Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cours
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Choisir un cours...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapitre (optionnel)
            </label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Ex: Nombres complexes"
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
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Générer
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
              Mes Guides ({guides.length})
            </h3>
            {guides.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucun guide créé</p>
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
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {guide.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {guide.course?.code} •{" "}
                      {new Date(guide.createdAt).toLocaleDateString("fr-FR")}
                    </p>
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
                  <ReactMarkdown>{activeGuide.content}</ReactMarkdown>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>Sélectionnez un guide ou générez-en un nouveau</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
