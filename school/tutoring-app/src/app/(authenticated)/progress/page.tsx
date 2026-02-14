"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  TrendingUp,
  Flame,
  Star,
  Target,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
} from "lucide-react";

interface CourseProgress {
  id: string;
  courseId: string;
  masteryLevel: number;
  currentDifficulty: string;
  totalXp: number;
  streak: number;
  totalExercises: number;
  totalCorrect: number;
  totalFlashcards: number;
  totalStudyGuides: number;
  totalChatMessages: number;
  topicsCovered: string;
  lastActivityAt: string;
  course: {
    id: string;
    code: string;
    title: string;
    category: string;
  };
}

interface TopicMastery {
  id: string;
  topic: string;
  masteryScore: number;
  timesPracticed: number;
  timesCorrect: number;
  difficultyReached: string;
  courseId: string;
  course: {
    code: string;
    title: string;
  };
}

interface Achievement {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface Stats {
  totalXp: number;
  maxStreak: number;
  totalExercises: number;
  totalCorrect: number;
  successRate: number;
  coursesStudied: number;
  topicsMastered: number;
  totalTopics: number;
}

interface ProgressData {
  courseProgress: CourseProgress[];
  topicMastery: TopicMastery[];
  achievements: Achievement[];
  stats: Stats;
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: "Facile", color: "text-green-600 bg-green-100" },
  medium: { label: "Moyen", color: "text-yellow-600 bg-yellow-100" },
  hard: { label: "Difficile", color: "text-red-600 bg-red-100" },
};

function getMasteryColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-yellow-500";
  if (score >= 20) return "bg-orange-500";
  return "bg-red-500";
}

function getMasteryLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "Moyen";
  if (score >= 20) return "Débutant";
  return "À découvrir";
}

function getXPLevel(xp: number): { level: number; progress: number; next: number } {
  // Each level requires more XP: level N requires N*50 XP
  let level = 1;
  let remaining = xp;
  while (remaining >= level * 50) {
    remaining -= level * 50;
    level++;
  }
  return {
    level,
    progress: remaining,
    next: level * 50,
  };
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement de vos progrès...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-gray-500">Erreur lors du chargement des progrès.</p>
      </div>
    );
  }

  const { stats, courseProgress, topicMastery, achievements } = data;
  const xpInfo = getXPLevel(stats.totalXp);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          Mon Progrès
        </h1>
        <p className="text-gray-500 mt-1">
          Suivez votre progression et vos accomplissements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* XP & Level */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Niveau {xpInfo.level}</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalXp} XP</p>
          <div className="mt-2">
            <div className="w-full bg-blue-400/40 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{
                  width: `${(xpInfo.progress / xpInfo.next) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs mt-1 opacity-80">
              {xpInfo.progress}/{xpInfo.next} XP vers niveau {xpInfo.level + 1}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Série</span>
          </div>
          <p className="text-3xl font-bold">{stats.maxStreak}</p>
          <p className="text-xs opacity-80 mt-1">jours consécutifs</p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Réussite</span>
          </div>
          <p className="text-3xl font-bold">{stats.successRate}%</p>
          <p className="text-xs opacity-80 mt-1">
            {stats.totalCorrect}/{stats.totalExercises} exercices
          </p>
        </div>

        {/* Topics Mastered */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Maîtrisés</span>
          </div>
          <p className="text-3xl font-bold">{stats.topicsMastered}</p>
          <p className="text-xs opacity-80 mt-1">
            sur {stats.totalTopics} sujets étudiés
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress - Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Mastery */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Maîtrise par Cours
            </h2>

            {courseProgress.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Commencez à étudier pour voir vos progrès !</p>
                <p className="text-sm mt-1">
                  Générez des exercices, flashcards ou guides d&apos;étude
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {courseProgress.map((cp) => {
                  const isExpanded = expandedCourse === cp.courseId;
                  const courseTopics = topicMastery.filter(
                    (t) => t.courseId === cp.courseId
                  );

                  return (
                    <div
                      key={cp.id}
                      className="border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedCourse(isExpanded ? null : cp.courseId)
                        }
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-blue-600">
                              {cp.course.code}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {cp.course.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_LABELS[cp.currentDifficulty]?.color || "bg-gray-100"}`}
                            >
                              {DIFFICULTY_LABELS[cp.currentDifficulty]?.label || cp.currentDifficulty}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Mastery Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-3">
                            <div
                              className={`${getMasteryColor(cp.masteryLevel)} rounded-full h-3 transition-all duration-500`}
                              style={{ width: `${cp.masteryLevel}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-700 w-12 text-right">
                            {cp.masteryLevel}%
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{cp.totalExercises} exercices</span>
                          <span>{cp.totalFlashcards} flashcards</span>
                          <span>{cp.totalStudyGuides} guides</span>
                          <span>{cp.totalXp} XP</span>
                        </div>
                      </button>

                      {/* Expanded Topic Details */}
                      {isExpanded && courseTopics.length > 0 && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Détail par Sujet
                          </h4>
                          <div className="space-y-3">
                            {courseTopics.map((tm) => (
                              <div key={tm.id}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-700">
                                    {tm.topic}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                      {tm.timesPracticed}x pratiqué
                                    </span>
                                    <span
                                      className={`text-xs px-1.5 py-0.5 rounded ${getMasteryColor(tm.masteryScore)} text-white`}
                                    >
                                      {tm.masteryScore}%
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`${getMasteryColor(tm.masteryScore)} rounded-full h-2 transition-all duration-500`}
                                    style={{
                                      width: `${tm.masteryScore}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isExpanded && courseTopics.length === 0 && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50 text-center text-gray-400 text-sm">
                          Aucun sujet pratiqué pour ce cours
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Motivational Message */}
          {courseProgress.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">
                  {stats.successRate >= 80
                    ? "🌟"
                    : stats.successRate >= 60
                      ? "💪"
                      : stats.successRate >= 40
                        ? "📚"
                        : "🚀"}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {stats.successRate >= 80
                      ? "Excellent travail ! Vous êtes sur la bonne voie !"
                      : stats.successRate >= 60
                        ? "Bon progrès ! Continuez comme ça !"
                        : stats.successRate >= 40
                          ? "Vous progressez ! Concentrez-vous sur vos points faibles."
                          : "Chaque effort compte ! N'abandonnez pas."}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.topicsMastered > 0
                      ? `Vous avez maîtrisé ${stats.topicsMastered} sujet${stats.topicsMastered > 1 ? "s" : ""}. `
                      : ""}
                    {stats.maxStreak > 0
                      ? `Votre meilleure série est de ${stats.maxStreak} jour${stats.maxStreak > 1 ? "s" : ""}.`
                      : "Commencez votre série en étudiant chaque jour !"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Achievements */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Badges ({achievements.length})
            </h2>

            {achievements.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <Award className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">
                  Pas encore de badges. Continuez à étudier !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200 text-center"
                  >
                    <span className="text-2xl block mb-1">{a.icon}</span>
                    <p className="text-xs font-semibold text-gray-800">
                      {a.title}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {a.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Badges Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Badges à Débloquer
            </h2>
            <div className="space-y-2">
              {[
                { icon: "🎯", title: "Premier Pas", desc: "Compléter 1 exercice" },
                { icon: "💪", title: "En Forme", desc: "Compléter 5 exercices" },
                { icon: "⭐", title: "Score Parfait", desc: "100% à un exercice" },
                { icon: "📅", title: "Régulier", desc: "3 jours de série" },
                { icon: "🏆", title: "Déterminé", desc: "7 jours de série" },
                { icon: "🎓", title: "Expert", desc: "80% de maîtrise" },
              ]
                .filter(
                  (b) =>
                    !achievements.some(
                      (a) => a.title === b.title
                    )
                )
                .slice(0, 4)
                .map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 opacity-60"
                  >
                    <span className="text-lg grayscale">{b.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        {b.title}
                      </p>
                      <p className="text-[10px] text-gray-400">{b.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
