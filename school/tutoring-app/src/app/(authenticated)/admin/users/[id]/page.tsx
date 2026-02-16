"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Shield,
  Calendar,
  BookOpen,
  MessageCircle,
  Lightbulb,
  FileText,
  GraduationCap,
  Trophy,
  Target,
  Zap,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Eye,
  Coins,
} from "lucide-react";
import MathMarkdown from "@/components/MathMarkdown";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  isActive: boolean;
  creditBalance: number;
  plan: string;
  subscriptionPlan: string | null;
  subscriptionExpiresAt: string | null;
  schoolId: string | null;
  departmentId: string | null;
  classId: string | null;
  createdAt: string;
  updatedAt: string;
  school: { id: string; shortName: string; name: string; city: string } | null;
  department: { id: string; name: string; code: string } | null;
  academicClass: { id: string; name: string; code: string; academicYear: string } | null;
  enrollments: {
    id: string;
    enrolledAt: string;
    course: { id: string; code: string; title: string; category: string };
  }[];
  chatSessions: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    course: { id: string; code: string; title: string };
    _count: { messages: number };
  }[];
  exercises: {
    id: string;
    topic: string;
    difficulty: string;
    score: number | null;
    questions: string;
    solutions: string;
    createdAt: string;
    course: { id: string; code: string; title: string };
  }[];
  studyGuides: {
    id: string;
    title: string;
    chapter: string | null;
    completed: boolean;
    content: string;
    createdAt: string;
    course: { id: string; code: string; title: string };
  }[];
  flashcardDecks: {
    id: string;
    title: string;
    reviewed: boolean;
    confidence: number | null;
    cards: string;
    createdAt: string;
    course: { id: string; code: string; title: string };
  }[];
  studyPlans: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    course: { id: string; code: string; title: string };
    _count: { tasks: number };
  }[];
  progress: {
    id: string;
    masteryLevel: number;
    currentDifficulty: string;
    totalXp: number;
    streak: number;
    totalExercises: number;
    totalCorrect: number;
    totalFlashcards: number;
    totalStudyGuides: number;
    totalChatMessages: number;
    lastActivityAt: string;
    course: { id: string; code: string; title: string };
  }[];
  achievements: {
    id: string;
    badge: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }[];
  _count: {
    enrollments: number;
    chatSessions: number;
    exercises: number;
    studyGuides: number;
    flashcardDecks: number;
    studyPlans: number;
    progress: number;
    topicMastery: number;
    achievements: number;
  };
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  school_admin: "bg-amber-100 text-amber-700",
  student: "bg-blue-100 text-blue-700",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrateur",
  school_admin: "Admin École",
  student: "Étudiant",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [expandedDeck, setExpandedDeck] = useState<string | null>(null);
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDesc, setCreditDesc] = useState("");
  const [grantingCredits, setGrantingCredits] = useState(false);
  const [activatingSub, setActivatingSub] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Erreur");
        }
        const data = await res.json();
        setUser(data.user);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
      setLoading(false);
    }
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux utilisateurs
        </button>
        <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center">
          <XCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">{error || "Utilisateur introuvable"}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "Vue d'ensemble", icon: Users },
    { key: "courses", label: `Cours (${user._count.enrollments})`, icon: BookOpen },
    { key: "progress", label: `Progression (${user.progress.length})`, icon: Target },
    { key: "exercises", label: `Exercices (${user._count.exercises})`, icon: Lightbulb },
    { key: "guides", label: `Guides (${user._count.studyGuides})`, icon: FileText },
    { key: "flashcards", label: `Flashcards (${user._count.flashcardDecks})`, icon: GraduationCap },
    { key: "chats", label: `Chats (${user._count.chatSessions})`, icon: MessageCircle },
    { key: "achievements", label: `Succès (${user._count.achievements})`, icon: Trophy },
    { key: "credits", label: `Crédits (${user.creditBalance})`, icon: Coins },
  ];

  // Compute aggregate stats
  const totalXp = user.progress.reduce((s, p) => s + p.totalXp, 0);
  const avgMastery =
    user.progress.length > 0
      ? Math.round(user.progress.reduce((s, p) => s + p.masteryLevel, 0) / user.progress.length)
      : 0;
  const totalExercises = user.progress.reduce((s, p) => s + p.totalExercises, 0);
  const totalCorrect = user.progress.reduce((s, p) => s + p.totalCorrect, 0);
  const maxStreak = user.progress.reduce((s, p) => Math.max(s, p.streak), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push("/admin/users")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux utilisateurs
      </button>

      {/* User Header */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"
                }`}
              >
                <Shield className="w-3 h-3" />
                {ROLE_LABELS[user.role] || user.role}
              </span>
              {user.isActive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle2 className="w-3 h-3" /> Actif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  <XCircle className="w-3 h-3" /> Inactif
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Inscrit le {formatDate(user.createdAt)}
              </span>
              <span>Langue: {user.language === "fr" ? "Français" : "English"}</span>
            </div>
            {/* Organization */}
            {(user.school || user.department || user.academicClass) && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                {[
                  user.school?.shortName,
                  user.department ? `${user.department.code} — ${user.department.name}` : null,
                  user.academicClass
                    ? `${user.academicClass.code} (${user.academicClass.academicYear})`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" > ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-6 bg-white rounded-xl border shadow-sm p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-lg whitespace-nowrap transition font-medium ${
              activeTab === tab.key
                ? "bg-blue-50 text-blue-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium">XP Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalXp.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-medium">Maîtrise moy.</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{avgMastery}%</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-xs font-medium">Exercices</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCorrect}/{totalExercises}
                </p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-medium">Série max</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{maxStreak}j</p>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-2 text-yellow-600 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs font-medium">Succès</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{user._count.achievements}</p>
              </div>
            </div>

            {/* Activity summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Cours inscrits", value: user._count.enrollments, icon: BookOpen, color: "text-blue-600" },
                { label: "Discussions", value: user._count.chatSessions, icon: MessageCircle, color: "text-indigo-600" },
                { label: "Exercices", value: user._count.exercises, icon: Lightbulb, color: "text-green-600" },
                { label: "Guides d'étude", value: user._count.studyGuides, icon: FileText, color: "text-purple-600" },
                { label: "Jeux de flashcards", value: user._count.flashcardDecks, icon: GraduationCap, color: "text-amber-600" },
                { label: "Plans d'étude", value: user._count.studyPlans, icon: ClipboardList, color: "text-teal-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border p-4 flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            {user.achievements.length > 0 && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Succès récents
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user.achievements.slice(0, 10).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2"
                      title={a.description}
                    >
                      <span className="text-lg">{a.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-gray-800">{a.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(a.earnedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {user.enrollments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun cours inscrit</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Code</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Catégorie</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Inscrit le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {user.enrollments.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.course.code}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{e.course.title}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                          {e.course.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(e.enrolledAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="space-y-4">
            {user.progress.length === 0 ? (
              <div className="bg-white rounded-xl border text-center py-12 text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucune progression enregistrée</p>
              </div>
            ) : (
              user.progress.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {p.course.code} — {p.course.title}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        Dernière activité: {formatDateTime(p.lastActivityAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        DIFFICULTY_COLORS[p.currentDifficulty] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.currentDifficulty}
                    </span>
                  </div>
                  {/* Mastery bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Maîtrise</span>
                      <span>{p.masteryLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${p.masteryLevel}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Zap className="w-3 h-3 text-purple-500" />
                      {p.totalXp.toLocaleString()} XP
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {p.streak}j série
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Lightbulb className="w-3 h-3 text-green-500" />
                      {p.totalCorrect}/{p.totalExercises} exercices
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <GraduationCap className="w-3 h-3 text-amber-500" />
                      {p.totalFlashcards} flashcards
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageCircle className="w-3 h-3 text-indigo-500" />
                      {p.totalChatMessages} messages
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === "exercises" && (
          <div className="space-y-3">
            {user.exercises.length === 0 ? (
              <div className="bg-white rounded-xl border text-center py-12 text-gray-500">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun exercice</p>
              </div>
            ) : (
              user.exercises.map((ex) => {
                const isOpen = expandedExercise === ex.id;
                let questions: string[] = [];
                let solutions: string[] = [];
                if (isOpen) {
                  try { questions = JSON.parse(ex.questions); } catch { questions = [ex.questions]; }
                  try { solutions = JSON.parse(ex.solutions); } catch { solutions = [ex.solutions]; }
                }
                return (
                  <div key={ex.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedExercise(isOpen ? null : ex.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                        <div className="text-left min-w-0">
                          <p className="font-medium text-gray-900 truncate">{ex.topic}</p>
                          <p className="text-xs text-gray-500">{ex.course.code} — {ex.course.title} · {formatDate(ex.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[ex.difficulty] || "bg-gray-100 text-gray-700"}`}>
                          {ex.difficulty}
                        </span>
                        {ex.score !== null && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            ex.score >= 75 ? "bg-green-100 text-green-700" : ex.score >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                          }`}>
                            {ex.score}%
                          </span>
                        )}
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="space-y-4 mt-4">
                          {questions.map((q: string, i: number) => (
                            <div key={i} className="border border-gray-100 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="prose prose-sm max-w-none">
                                    <MathMarkdown>{q}</MathMarkdown>
                                  </div>
                                  {solutions[i] && (
                                    <>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setShowSolutions(prev => ({ ...prev, [`${ex.id}-${i}`]: !prev[`${ex.id}-${i}`] })); }}
                                        className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                      >
                                        <Eye className="w-3 h-3" />
                                        {showSolutions[`${ex.id}-${i}`] ? "Masquer la solution" : "Voir la solution"}
                                      </button>
                                      {showSolutions[`${ex.id}-${i}`] && (
                                        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="flex items-center gap-1 text-green-700 text-xs font-medium mb-1">
                                            <CheckCircle2 className="w-3 h-3" /> Solution
                                          </div>
                                          <div className="prose prose-sm max-w-none">
                                            <MathMarkdown>{solutions[i]}</MathMarkdown>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Study Guides Tab */}
        {activeTab === "guides" && (
          <div className="space-y-3">
            {user.studyGuides.length === 0 ? (
              <div className="bg-white rounded-xl border text-center py-12 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun guide d&apos;étude</p>
              </div>
            ) : (
              user.studyGuides.map((sg) => {
                const isOpen = expandedGuide === sg.id;
                return (
                  <div key={sg.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedGuide(isOpen ? null : sg.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-purple-500 shrink-0" />
                        <div className="text-left min-w-0">
                          <p className="font-medium text-gray-900 truncate">{sg.title}</p>
                          <p className="text-xs text-gray-500">
                            {sg.course.code} — {sg.course.title}
                            {sg.chapter && ` · ${sg.chapter}`}
                            {" · "}{formatDate(sg.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {sg.completed ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Terminé
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 text-xs">
                            <Clock className="w-3.5 h-3.5" /> En cours
                          </span>
                        )}
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="prose prose-sm max-w-none mt-4">
                          <MathMarkdown>{sg.content}</MathMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === "flashcards" && (
          <div className="space-y-3">
            {user.flashcardDecks.length === 0 ? (
              <div className="bg-white rounded-xl border text-center py-12 text-gray-500">
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun jeu de flashcards</p>
              </div>
            ) : (
              user.flashcardDecks.map((fd) => {
                const isOpen = expandedDeck === fd.id;
                let cards: { front: string; back: string }[] = [];
                if (isOpen) {
                  try { cards = JSON.parse(fd.cards); } catch { cards = []; }
                }
                return (
                  <div key={fd.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedDeck(isOpen ? null : fd.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="text-left min-w-0">
                          <p className="font-medium text-gray-900 truncate">{fd.title}</p>
                          <p className="text-xs text-gray-500">{fd.course.code} — {fd.course.title} · {formatDate(fd.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {fd.reviewed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300" />
                        )}
                        {fd.confidence !== null && (
                          <span className="text-xs font-medium text-gray-700">{fd.confidence}%</span>
                        )}
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>
                    {isOpen && cards.length > 0 && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {cards.map((card, i) => (
                            <div key={i} className="border border-gray-100 rounded-lg p-3">
                              <div className="text-xs font-semibold text-blue-600 mb-1">Q{i + 1}</div>
                              <div className="prose prose-sm max-w-none text-sm">
                                <MathMarkdown>{card.front}</MathMarkdown>
                              </div>
                              <div className="border-t border-gray-100 mt-2 pt-2">
                                <div className="text-xs font-semibold text-green-600 mb-1">Réponse</div>
                                <div className="prose prose-sm max-w-none text-sm">
                                  <MathMarkdown>{card.back}</MathMarkdown>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Chats Tab */}
        {activeTab === "chats" && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {user.chatSessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucune discussion</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Cours</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Messages</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Dernière activité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {user.chatSessions.map((cs) => (
                    <tr key={cs.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{cs.title}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{cs.course.code}</td>
                      <td className="px-4 py-3 text-gray-600">{cs._count.messages}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDateTime(cs.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div>
            {user.achievements.length === 0 ? (
              <div className="bg-white rounded-xl border text-center py-12 text-gray-500">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun succès obtenu</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.achievements.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-xl border p-4 flex items-start gap-3"
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(a.earnedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === "credits" && (
          <div className="space-y-6">
            {/* Subscription card */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  Abonnement
                </h3>
                {user.subscriptionPlan && user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date() ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Actif</span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">Aucun</span>
                )}
              </div>
              {user.subscriptionPlan && user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date() ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-medium">{user.subscriptionPlan === "monthly" ? "Mensuel (5 000 FCFA/mois)" : "Annuel (40 000 FCFA/an)"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Expire le</span>
                    <span className="font-medium">{new Date(user.subscriptionExpiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Jours restants</span>
                    <span className="font-medium">{Math.max(0, Math.ceil((new Date(user.subscriptionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}</span>
                  </div>
                  <button
                    disabled={activatingSub}
                    onClick={async () => {
                      setActivatingSub(true);
                      try {
                        const res = await fetch(`/api/admin/subscriptions?userId=${user.id}`, { method: "DELETE" });
                        if (res.ok) {
                          setUser({ ...user, subscriptionPlan: null, subscriptionExpiresAt: null });
                        }
                      } finally {
                        setActivatingSub(false);
                      }
                    }}
                    className="w-full mt-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                  >
                    Annuler l'abonnement
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-3">Activer un abonnement illimité pour cet étudiant :</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={activatingSub}
                      onClick={async () => {
                        setActivatingSub(true);
                        try {
                          const res = await fetch("/api/admin/subscriptions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: user.id, plan: "monthly" }),
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setUser({ ...user, subscriptionPlan: data.subscriptionPlan, subscriptionExpiresAt: data.subscriptionExpiresAt });
                          }
                        } finally {
                          setActivatingSub(false);
                        }
                      }}
                      className="p-4 border-2 border-indigo-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition"
                    >
                      <p className="font-bold text-gray-900">Mensuel</p>
                      <p className="text-xl font-bold text-indigo-600 mt-1">5 000 <span className="text-sm font-normal">FCFA</span></p>
                      <p className="text-xs text-gray-400 mt-1">30 jours illimité</p>
                    </button>
                    <button
                      disabled={activatingSub}
                      onClick={async () => {
                        setActivatingSub(true);
                        try {
                          const res = await fetch("/api/admin/subscriptions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: user.id, plan: "annual" }),
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setUser({ ...user, subscriptionPlan: data.subscriptionPlan, subscriptionExpiresAt: data.subscriptionExpiresAt });
                          }
                        } finally {
                          setActivatingSub(false);
                        }
                      }}
                      className="p-4 border-2 border-amber-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition"
                    >
                      <p className="font-bold text-gray-900">Annuel</p>
                      <p className="text-xl font-bold text-amber-600 mt-1">40 000 <span className="text-sm font-normal">FCFA</span></p>
                      <p className="text-xs text-gray-400 mt-1">365 jours illimité</p>
                      <p className="text-xs text-green-600 font-medium">Économie de 33%</p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Balance card */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  Solde de crédits
                </h3>
                <div className="text-right">
                  <p className="text-3xl font-bold text-amber-600">{user.creditBalance}</p>
                  <p className="text-xs text-gray-500">crédits disponibles</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Plan: <span className="font-medium text-gray-700">{user.plan === "free" ? "Gratuit" : user.plan}</span>
              </p>
            </div>

            {/* Grant credits form */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Attribuer des crédits</h3>
              <div className="flex gap-3 items-end flex-wrap">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="px-3 py-2 border rounded-lg w-32"
                    placeholder="50"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
                  <input
                    type="text"
                    value={creditDesc}
                    onChange={(e) => setCreditDesc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Bonus de bienvenue"
                  />
                </div>
                <button
                  disabled={grantingCredits || !creditAmount || Number(creditAmount) === 0}
                  onClick={async () => {
                    setGrantingCredits(true);
                    try {
                      const res = await fetch("/api/admin/credits", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          userId: user.id,
                          amount: Number(creditAmount),
                          description: creditDesc || `Admin grant: ${creditAmount} crédits`,
                        }),
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setUser({ ...user, creditBalance: data.creditBalance });
                        setCreditAmount("");
                        setCreditDesc("");
                      }
                    } finally {
                      setGrantingCredits(false);
                    }
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {grantingCredits ? "..." : "Attribuer"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Utilisez un montant négatif pour retirer des crédits.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
