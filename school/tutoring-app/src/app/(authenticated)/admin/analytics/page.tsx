"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  Users,
  BookOpen,
  MessageCircle,
  FileText,
  Lightbulb,
  GraduationCap,
  CalendarDays,
  TrendingUp,
  Award,
  AlertTriangle,
  Zap,
  School,
  RefreshCw,
  Clock,
  Target,
  Brain,
} from "lucide-react";
import { Language, t } from "@/lib/i18n";

// ── Types ──
interface AnalyticsData {
  period: { days: number; since: string };
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalStudents: number;
    totalAdmins: number;
    totalCourses: number;
    activeCourses: number;
    totalEnrollments: number;
    totalSchools: number;
    totalDepartments: number;
    totalClasses: number;
  };
  content: {
    totalExercises: number;
    totalStudyGuides: number;
    totalFlashcards: number;
    totalChatSessions: number;
    totalChatMessages: number;
    totalStudyPlans: number;
    totalAchievements: number;
  };
  recent: Record<string, number>;
  charts: {
    dailyActivity: { date: string; count: number }[];
    dailyRegistrations: { date: string; count: number }[];
    activityByCategory: { category: string; count: number }[];
    topActions: { action: string; count: number }[];
    scoreDistribution: { bucket: string; count: number }[];
    hourlyActivity: { hour: number; dow: number; count: number }[];
  };
  rankings: {
    topStudents: { userId: string; name: string; email: string; count: number }[];
    coursePopularity: { courseId: string; code: string; title: string; enrollments: number }[];
    masteryByCourse: { courseId: string; code: string; title: string; avgMastery: number; studentCount: number }[];
    featureAdoption: { feature: string; users: number }[];
    engagementBySchool: { schoolId: string; shortName: string; students: number; activities: number }[];
    atRiskStudents: { id: string; name: string; email: string; lastActivity: string | null }[];
    xpLeaderboard: { userId: string; name: string; totalXp: number; courses: number }[];
  };
}

// ── Helpers ──
const categoryLabels: Record<string, Record<string, string>> = {
  auth: { fr: "Authentification", en: "Authentication" },
  learning: { fr: "Apprentissage", en: "Learning" },
  ai: { fr: "IA", en: "AI" },
  admin: { fr: "Admin", en: "Admin" },
};

const categoryColors: Record<string, string> = {
  auth: "#3b82f6",
  learning: "#22c55e",
  ai: "#a855f7",
  admin: "#f59e0b",
};

const actionLabels: Record<string, Record<string, string>> = {
  login: { fr: "Connexions", en: "Logins" },
  register: { fr: "Inscriptions", en: "Registrations" },
  "course.enroll": { fr: "Inscriptions cours", en: "Course enrollments" },
  "chat.message": { fr: "Messages IA", en: "AI messages" },
  "exercise.generate": { fr: "Exercices générés", en: "Exercises generated" },
  "exercise.score": { fr: "Scores soumis", en: "Scores submitted" },
  "study_guide.generate": { fr: "Guides générés", en: "Guides generated" },
  "study_guide.complete": { fr: "Guides complétés", en: "Guides completed" },
  "flashcard.generate": { fr: "Flashcards générées", en: "Flashcards generated" },
  "flashcard.review": { fr: "Flashcards révisées", en: "Flashcards reviewed" },
  "study_plan.generate": { fr: "Plans générés", en: "Plans generated" },
  "study_plan.task_toggle": { fr: "Tâches cochées", en: "Tasks toggled" },
};

const featureLabels: Record<string, Record<string, string>> = {
  "chat.message": { fr: "Tuteur IA", en: "AI Tutor" },
  "exercise.generate": { fr: "Exercices", en: "Exercises" },
  "exercise.score": { fr: "Scores", en: "Scores" },
  "study_guide.generate": { fr: "Guides", en: "Guides" },
  "study_guide.complete": { fr: "Guides terminés", en: "Guides done" },
  "flashcard.generate": { fr: "Flashcards", en: "Flashcards" },
  "flashcard.review": { fr: "Révisions", en: "Reviews" },
  "study_plan.generate": { fr: "Plans", en: "Plans" },
};

const dayNames: Record<string, string[]> = {
  fr: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toLocaleString();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function timeAgo(iso: string | null, lang: string): string {
  if (!iso) return lang === "fr" ? "Jamais" : "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return lang === "fr" ? "Aujourd'hui" : "Today";
  if (days === 1) return lang === "fr" ? "Hier" : "Yesterday";
  return lang === "fr" ? `Il y a ${days}j` : `${days}d ago`;
}

// ── Mini bar chart (pure SVG) ──
function MiniBarChart({ data, height = 120, barColor = "#3b82f6" }: { data: { label: string; value: number }[]; height?: number; barColor?: string }) {
  if (!data.length) return <div className="text-gray-400 text-sm text-center py-8">—</div>;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.max(6, Math.min(24, Math.floor(300 / data.length) - 2));
  const svgWidth = data.length * (barWidth + 2) + 10;

  return (
    <div className="overflow-x-auto">
      <svg width={svgWidth} height={height + 20} className="mx-auto">
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * height;
          return (
            <g key={i}>
              <rect
                x={i * (barWidth + 2) + 5}
                y={height - barH}
                width={barWidth}
                height={barH}
                fill={barColor}
                rx={2}
                opacity={0.85}
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </rect>
              {data.length <= 15 && (
                <text
                  x={i * (barWidth + 2) + 5 + barWidth / 2}
                  y={height + 14}
                  textAnchor="middle"
                  className="text-[8px] fill-gray-400"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Horizontal bar chart ──
function HorizontalBars({ data, lang }: { data: { label: string; value: number; sub?: string }[]; lang: string }) {
  if (!data.length) return <EmptyState lang={lang} />;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-gray-700 truncate max-w-[70%]" title={d.label}>
              {d.label}
              {d.sub && <span className="text-gray-400 ml-1">{d.sub}</span>}
            </span>
            <span className="text-gray-500 font-medium">{formatNum(d.value)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${(d.value / maxVal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Donut chart ──
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;
  const r = 40;
  const cx = 50;
  const cy = 50;
  let cumulative = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={100} height={100} viewBox="0 0 100 100">
        {data.map((d, i) => {
          const pct = d.value / total;
          const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
          cumulative += pct;
          const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
          const largeArc = pct > 0.5 ? 1 : 0;
          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);
          const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          return (
            <path key={i} d={path} fill={d.color} opacity={0.85}>
              <title>{`${d.label}: ${d.value} (${(pct * 100).toFixed(0)}%)`}</title>
            </path>
          );
        })}
        <circle cx={cx} cy={cy} r={22} fill="white" />
        <text x={cx} y={cy + 4} textAnchor="middle" className="text-xs font-bold fill-gray-700">
          {formatNum(total)}
        </text>
      </svg>
      <div className="space-y-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-gray-600">{d.label}</span>
            <span className="text-gray-400">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Heatmap ──
function ActivityHeatmap({ data, lang }: { data: { hour: number; dow: number; count: number }[]; lang: string }) {
  if (!data.length) return <EmptyState lang={lang} />;
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  data.forEach((d) => { grid[d.dow][d.hour] = d.count; });

  const dn = dayNames[lang] || dayNames.fr;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[480px]">
        <div className="flex gap-0.5 mb-1 pl-10">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="w-4 text-center text-[7px] text-gray-400">
              {h % 3 === 0 ? `${h}h` : ""}
            </div>
          ))}
        </div>
        {grid.map((row, dow) => (
          <div key={dow} className="flex items-center gap-0.5">
            <span className="w-9 text-right text-[9px] text-gray-400 pr-1">{dn[dow]}</span>
            {row.map((count, h) => {
              const intensity = count / maxCount;
              const bg = intensity === 0
                ? "#f3f4f6"
                : `rgba(37, 99, 235, ${0.15 + intensity * 0.85})`;
              return (
                <div
                  key={h}
                  className="w-4 h-4 rounded-[2px]"
                  style={{ backgroundColor: bg }}
                  title={`${dn[dow]} ${h}h: ${count} ${lang === "fr" ? "actions" : "actions"}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ lang }: { lang: string }) {
  return (
    <div className="text-center text-gray-400 py-6 text-sm">
      {lang === "fr" ? "Aucune donnée" : "No data"}
    </div>
  );
}

// ── Stat Card ──
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Users;
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{formatNum(value)}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

// ── Card wrapper ──
function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ══════════════════ MAIN PAGE ══════════════════
export default function AnalyticsPage() {
  const { data: session } = useSession();
  const lang = ((session?.user as Record<string, unknown>)?.language as string || "fr") as Language;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-gray-300 animate-spin" />
      </div>
    );
  }

  const o = data.overview;
  const c = data.content;
  const r = data.recent;
  const ch = data.charts;
  const rk = data.rankings;

  // Prepare chart data
  const dailyActivityData = ch.dailyActivity.map((d) => ({
    label: formatDate(d.date),
    value: d.count,
  }));

  const dailyRegData = ch.dailyRegistrations.map((d) => ({
    label: formatDate(d.date),
    value: d.count,
  }));

  const categoryDonut = ch.activityByCategory.map((d) => ({
    label: categoryLabels[d.category]?.[lang] || d.category,
    value: d.count,
    color: categoryColors[d.category] || "#94a3b8",
  }));

  const scoreOrder = ["90-100", "70-89", "50-69", "30-49", "0-29"];
  const scoreColors: Record<string, string> = { "90-100": "#22c55e", "70-89": "#84cc16", "50-69": "#eab308", "30-49": "#f97316", "0-29": "#ef4444" };
  const scoreBars = scoreOrder.map((b) => {
    const found = ch.scoreDistribution.find((s) => s.bucket === b);
    return { label: b, value: found?.count || 0, color: scoreColors[b] };
  });

  const periodLabel = days === 7
    ? (lang === "fr" ? "7 derniers jours" : "Last 7 days")
    : days === 30
    ? (lang === "fr" ? "30 derniers jours" : "Last 30 days")
    : days === 90
    ? (lang === "fr" ? "90 derniers jours" : "Last 90 days")
    : `${days} ${lang === "fr" ? "jours" : "days"}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-amber-600" />
            {t("admin.analytics.title", lang)}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t("admin.analytics.subtitle", lang)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>{lang === "fr" ? "7 jours" : "7 days"}</option>
            <option value={30}>{lang === "fr" ? "30 jours" : "30 days"}</option>
            <option value={90}>{lang === "fr" ? "90 jours" : "90 days"}</option>
            <option value={180}>{lang === "fr" ? "180 jours" : "180 days"}</option>
            <option value={365}>{lang === "fr" ? "1 an" : "1 year"}</option>
          </select>
          <button onClick={fetchData} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Row 1: Key metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={Users} label={lang === "fr" ? "Utilisateurs" : "Users"} value={o.totalUsers} sub={`${o.activeUsers} ${lang === "fr" ? "actifs" : "active"}`} color="bg-blue-100 text-blue-600" />
        <StatCard icon={BookOpen} label={lang === "fr" ? "Cours" : "Courses"} value={o.totalCourses} sub={`${o.activeCourses} ${lang === "fr" ? "actifs" : "active"}`} color="bg-green-100 text-green-600" />
        <StatCard icon={GraduationCap} label={lang === "fr" ? "Inscriptions" : "Enrollments"} value={o.totalEnrollments} sub={`+${r.enrollments} ${periodLabel}`} color="bg-purple-100 text-purple-600" />
        <StatCard icon={MessageCircle} label={lang === "fr" ? "Messages IA" : "AI Messages"} value={c.totalChatMessages} sub={`${c.totalChatSessions} sessions`} color="bg-cyan-100 text-cyan-600" />
        <StatCard icon={Target} label="Exercices" value={c.totalExercises} sub={`+${r.exercises} ${periodLabel}`} color="bg-orange-100 text-orange-600" />
        <StatCard icon={Award} label={lang === "fr" ? "Succès" : "Achievements"} value={c.totalAchievements} color="bg-amber-100 text-amber-600" />
      </div>

      {/* ── Row 2: AI content stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={FileText} label={lang === "fr" ? "Guides d'étude" : "Study Guides"} value={c.totalStudyGuides} sub={`+${r.studyGuides}`} color="bg-indigo-100 text-indigo-600" />
        <StatCard icon={Lightbulb} label="Flashcards" value={c.totalFlashcards} sub={`+${r.flashcards}`} color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={CalendarDays} label={lang === "fr" ? "Plans d'étude" : "Study Plans"} value={c.totalStudyPlans} sub={`+${r.studyPlans}`} color="bg-rose-100 text-rose-600" />
        <StatCard icon={School} label={lang === "fr" ? "Écoles" : "Schools"} value={o.totalSchools} sub={`${o.totalDepartments} dép. · ${o.totalClasses} classes`} color="bg-teal-100 text-teal-600" />
      </div>

      {/* ── Row 3: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily active users */}
        <Card title={lang === "fr" ? `Utilisateurs actifs par jour (${periodLabel})` : `Daily Active Users (${periodLabel})`}>
          <MiniBarChart data={dailyActivityData} barColor="#3b82f6" height={100} />
        </Card>

        {/* Activity by category */}
        <Card title={lang === "fr" ? `Activités par catégorie (${periodLabel})` : `Activity by Category (${periodLabel})`}>
          <DonutChart data={categoryDonut} />
        </Card>

        {/* Daily registrations */}
        <Card title={lang === "fr" ? `Nouvelles inscriptions par jour` : `Daily Registrations`}>
          <MiniBarChart data={dailyRegData} barColor="#22c55e" height={100} />
        </Card>

        {/* Score distribution */}
        <Card title={lang === "fr" ? "Distribution des scores d'exercices" : "Exercise Score Distribution"}>
          <div className="space-y-2">
            {scoreBars.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-12 text-right">{b.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 relative">
                  <div
                    className="h-5 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max(8, (b.value / Math.max(...scoreBars.map((s) => s.value), 1)) * 100)}%`,
                      backgroundColor: b.color,
                    }}
                  >
                    <span className="text-[10px] font-medium text-white">{b.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 4: Heatmap ── */}
      <Card title={lang === "fr" ? `Heures d'activité (${periodLabel})` : `Activity Hours (${periodLabel})`}>
        <ActivityHeatmap data={ch.hourlyActivity} lang={lang} />
      </Card>

      {/* ── Row 5: Rankings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Top actions */}
        <Card title={lang === "fr" ? "Actions les plus fréquentes" : "Top Actions"}>
          <HorizontalBars
            lang={lang}
            data={ch.topActions.map((a) => ({
              label: actionLabels[a.action]?.[lang] || a.action,
              value: a.count,
            }))}
          />
        </Card>

        {/* Feature adoption */}
        <Card title={lang === "fr" ? "Adoption des fonctionnalités" : "Feature Adoption"}>
          <HorizontalBars
            lang={lang}
            data={rk.featureAdoption.map((f) => ({
              label: featureLabels[f.feature]?.[lang] || f.feature,
              value: f.users,
              sub: lang === "fr" ? "utilisateurs" : "users",
            }))}
          />
        </Card>

        {/* Course popularity */}
        <Card title={lang === "fr" ? "Cours les plus populaires" : "Most Popular Courses"}>
          <HorizontalBars
            lang={lang}
            data={rk.coursePopularity.map((c) => ({
              label: c.code,
              value: c.enrollments,
              sub: c.title.length > 25 ? c.title.substring(0, 25) + "…" : c.title,
            }))}
          />
        </Card>

        {/* Mastery by course */}
        <Card title={lang === "fr" ? "Maîtrise moyenne par cours" : "Average Mastery by Course"}>
          {rk.masteryByCourse.length ? (
            <div className="space-y-2">
              {rk.masteryByCourse.map((c) => (
                <div key={c.courseId}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-700 truncate max-w-[60%]">{c.code}</span>
                    <span className="text-gray-500">
                      {c.avgMastery}% <span className="text-gray-400">({c.studentCount} {lang === "fr" ? "étudiants" : "students"})</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${c.avgMastery}%`,
                        backgroundColor: c.avgMastery >= 70 ? "#22c55e" : c.avgMastery >= 40 ? "#eab308" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState lang={lang} />}
        </Card>

        {/* XP Leaderboard */}
        <Card title={lang === "fr" ? "Classement XP" : "XP Leaderboard"}>
          {rk.xpLeaderboard.length ? (
            <div className="space-y-2">
              {rk.xpLeaderboard.map((s, i) => (
                <div key={s.userId} className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? "bg-amber-100 text-amber-700" :
                    i === 1 ? "bg-gray-100 text-gray-600" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-gray-50 text-gray-400"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-blue-600">{formatNum(s.totalXp)} XP</span>
                    <p className="text-[10px] text-gray-400">{s.courses} {lang === "fr" ? "cours" : "courses"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState lang={lang} />}
        </Card>

        {/* Most active students */}
        <Card title={lang === "fr" ? `Étudiants les plus actifs (${periodLabel})` : `Most Active Students (${periodLabel})`}>
          {rk.topStudents.length ? (
            <div className="space-y-2">
              {rk.topStudents.map((s, i) => (
                <div key={s.userId} className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? "bg-green-100 text-green-700" : "bg-gray-50 text-gray-400"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-600">{formatNum(s.count)}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState lang={lang} />}
        </Card>
      </div>

      {/* ── Row 6: School engagement + At-risk ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Engagement by school */}
        <Card title={lang === "fr" ? "Engagement par école" : "Engagement by School"}>
          {rk.engagementBySchool.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500">
                  <tr>
                    <th className="pb-2">{lang === "fr" ? "École" : "School"}</th>
                    <th className="pb-2 text-right">{lang === "fr" ? "Étudiants" : "Students"}</th>
                    <th className="pb-2 text-right">{lang === "fr" ? "Activités" : "Activities"}</th>
                    <th className="pb-2 text-right">{lang === "fr" ? "Moy/étudiant" : "Avg/student"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rk.engagementBySchool.map((s) => (
                    <tr key={s.schoolId} className="text-gray-700">
                      <td className="py-1.5 font-medium">{s.shortName}</td>
                      <td className="py-1.5 text-right">{s.students}</td>
                      <td className="py-1.5 text-right">{formatNum(s.activities)}</td>
                      <td className="py-1.5 text-right text-blue-600 font-medium">
                        {s.students > 0 ? (s.activities / s.students).toFixed(1) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState lang={lang} />}
        </Card>

        {/* At-risk students */}
        <Card title={lang === "fr" ? "Étudiants à risque (inactifs)" : "At-Risk Students (Inactive)"}>
          {rk.atRiskStudents.length ? (
            <div className="space-y-2">
              {rk.atRiskStudents.map((s) => (
                <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{s.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(s.lastActivity, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Zap className="w-8 h-8 mx-auto text-green-400 mb-2" />
              <p className="text-sm text-green-600 font-medium">
                {lang === "fr" ? "Tous les étudiants sont actifs !" : "All students are active!"}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
