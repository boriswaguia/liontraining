"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Settings,
  Power,
  Clock,
  RefreshCw,
  Bot,
  Mail,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lightbulb,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Play,
  Loader2,
} from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface Recommendation {
  id: string;
  userId: string;
  courseId: string;
  type: string;
  contentId: string;
  reason: string;
  emailSent: boolean;
  emailSentAt: string | null;
  viewed: boolean;
  viewedAt: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    language: string;
  };
}

interface Stats {
  last30Days: {
    total: number;
    emailsSent: number;
    viewed: number;
    completed: number;
    viewRate: number;
    completionRate: number;
    byType: { type: string; count: number }[];
  };
}

const typeIcons: Record<string, typeof FileText> = {
  exercise: Lightbulb,
  study_guide: FileText,
  flashcard: GraduationCap,
};

const typeColors: Record<string, string> = {
  exercise: "bg-amber-100 text-amber-700",
  study_guide: "bg-green-100 text-green-700",
  flashcard: "bg-purple-100 text-purple-700",
};

const typeLabels: Record<string, Record<string, string>> = {
  exercise: { fr: "Exercice", en: "Exercise" },
  study_guide: { fr: "Guide d'étude", en: "Study Guide" },
  flashcard: { fr: "Flashcards", en: "Flashcards" },
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const lang = ((session?.user as Record<string, unknown>)?.language as string || "fr") as Language;

  // Settings state
  const [cronEnabled, setCronEnabled] = useState(false);
  const [cronHour, setCronHour] = useState("07");
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);

  // Recommendations state
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [recsLoading, setRecsLoading] = useState(true);

  // Fetch settings
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        setCronEnabled(s.daily_recommendations_enabled === "true");
        setCronHour(s.daily_recommendations_hour || "07");
      })
      .finally(() => setSettingsLoading(false));
  }, []);

  // Fetch recommendations
  const fetchRecs = useCallback(async () => {
    setRecsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/admin/recommendations?${params}`);
      const data = await res.json();
      setRecs(data.recommendations || []);
      setStats(data.stats || null);
      setTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setRecsLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => { fetchRecs(); }, [fetchRecs]);

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleCron = async () => {
    const newVal = !cronEnabled;
    setCronEnabled(newVal);
    await saveSetting("daily_recommendations_enabled", String(newVal));
  };

  const updateHour = async (hour: string) => {
    setCronHour(hour);
    await saveSetting("daily_recommendations_hour", hour);
  };

  const triggerManually = async () => {
    setTriggering(true);
    setTriggerResult(null);
    try {
      const res = await fetch("/api/cron/daily-content", {
        method: "POST",
      });
      const data = await res.json();
      if (data.skipped) {
        setTriggerResult(lang === "fr" ? "Désactivé — activez d'abord le cron" : "Disabled — enable cron first");
      } else if (data.summary) {
        const s = data.summary;
        setTriggerResult(
          lang === "fr"
            ? `✅ ${s.generated} générés, ${s.skipped} ignorés, ${s.errors} erreurs`
            : `✅ ${s.generated} generated, ${s.skipped} skipped, ${s.errors} errors`
        );
        fetchRecs();
      } else if (data.error) {
        setTriggerResult(`❌ ${data.error}`);
      }
    } catch (err) {
      setTriggerResult(`❌ ${(err as Error).message}`);
    } finally {
      setTriggering(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bot className="w-7 h-7 text-blue-600" />
          {t("admin.settings.title", lang)}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {t("admin.settings.subtitle", lang)}
        </p>
      </div>

      {/* ─── Settings Card ─── */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-700">
            {lang === "fr" ? "Recommandations quotidiennes" : "Daily Recommendations"}
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Power className={`w-5 h-5 ${cronEnabled ? "text-green-500" : "text-gray-400"}`} />
              <div>
                <p className="font-medium text-gray-800">
                  {lang === "fr" ? "Génération automatique" : "Automatic generation"}
                </p>
                <p className="text-xs text-gray-500">
                  {lang === "fr"
                    ? "Génère quotidiennement du contenu personnalisé pour chaque étudiant"
                    : "Daily personalized content generation for each student"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleCron}
              disabled={saving}
              className={`relative w-14 h-7 rounded-full transition-colors ${cronEnabled ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${cronEnabled ? "translate-x-7" : ""}`}
              />
            </button>
          </div>

          {/* Hour picker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">
                  {lang === "fr" ? "Heure d'exécution" : "Execution time"}
                </p>
                <p className="text-xs text-gray-500">
                  {lang === "fr" ? "L'heure à laquelle le cron s'exécute (UTC)" : "The hour the cron runs (UTC)"}
                </p>
              </div>
            </div>
            <select
              value={cronHour}
              onChange={(e) => updateHour(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                <option key={h} value={h}>{h}:00 UTC</option>
              ))}
            </select>
          </div>

          {/* Manual trigger */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">
                  {lang === "fr" ? "Déclenchement manuel" : "Manual trigger"}
                </p>
                <p className="text-xs text-gray-500">
                  {lang === "fr" ? "Exécuter maintenant pour tous les étudiants" : "Run now for all students"}
                </p>
              </div>
            </div>
            <button
              onClick={triggerManually}
              disabled={triggering}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {triggering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === "fr" ? "En cours..." : "Running..."}
                </>
              ) : (
                lang === "fr" ? "Exécuter" : "Run now"
              )}
            </button>
          </div>
          {triggerResult && (
            <div className={`text-sm px-4 py-3 rounded-lg ${triggerResult.startsWith("✅") ? "bg-green-50 text-green-700" : triggerResult.startsWith("❌") ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
              {triggerResult}
            </div>
          )}
        </div>
      </div>

      {/* ─── Stats ─── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <StatCard
            icon={Bot}
            label={lang === "fr" ? "Générés (30j)" : "Generated (30d)"}
            value={stats.last30Days.total}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={Mail}
            label={lang === "fr" ? "Emails envoyés" : "Emails sent"}
            value={stats.last30Days.emailsSent}
            color="bg-cyan-100 text-cyan-600"
          />
          <StatCard
            icon={Eye}
            label={lang === "fr" ? "Vus" : "Viewed"}
            value={stats.last30Days.viewed}
            sub={`${stats.last30Days.viewRate}%`}
            color="bg-indigo-100 text-indigo-600"
          />
          <StatCard
            icon={CheckCircle2}
            label={lang === "fr" ? "Complétés" : "Completed"}
            value={stats.last30Days.completed}
            sub={`${stats.last30Days.completionRate}%`}
            color="bg-green-100 text-green-600"
          />
          {stats.last30Days.byType.map((bt) => {
            const Icon = typeIcons[bt.type] || FileText;
            return (
              <StatCard
                key={bt.type}
                icon={Icon}
                label={typeLabels[bt.type]?.[lang] || bt.type}
                value={bt.count}
                color={typeColors[bt.type] || "bg-gray-100 text-gray-600"}
              />
            );
          })}
        </div>
      )}

      {/* ─── Recommendations List ─── */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Bot className="w-4 h-4" />
            {lang === "fr" ? "Historique des recommandations" : "Recommendation History"}
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="border rounded-lg px-2 py-1.5 text-xs"
            >
              <option value="">{lang === "fr" ? "Tous types" : "All types"}</option>
              <option value="exercise">{lang === "fr" ? "Exercices" : "Exercises"}</option>
              <option value="study_guide">{lang === "fr" ? "Guides" : "Guides"}</option>
              <option value="flashcard">Flashcards</option>
            </select>
            <button onClick={fetchRecs} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {recsLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-6 h-6 text-gray-300 animate-spin mx-auto" />
          </div>
        ) : recs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {lang === "fr" ? "Aucune recommandation générée" : "No recommendations generated yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2.5">{lang === "fr" ? "Date" : "Date"}</th>
                  <th className="text-left px-4 py-2.5">{lang === "fr" ? "Étudiant" : "Student"}</th>
                  <th className="text-left px-4 py-2.5">Type</th>
                  <th className="text-left px-4 py-2.5">{lang === "fr" ? "Raison" : "Reason"}</th>
                  <th className="text-center px-4 py-2.5">Email</th>
                  <th className="text-center px-4 py-2.5">{lang === "fr" ? "Vu" : "Viewed"}</th>
                  <th className="text-center px-4 py-2.5">{lang === "fr" ? "Complété" : "Done"}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recs.map((rec) => {
                  const Icon = typeIcons[rec.type] || FileText;
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap text-xs">
                        {formatDate(rec.createdAt)}
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-800 text-xs">{rec.user.name}</p>
                        <p className="text-[10px] text-gray-400">{rec.user.email}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[rec.type]}`}>
                          <Icon className="w-3 h-3" />
                          {typeLabels[rec.type]?.[lang] || rec.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 max-w-[250px] truncate" title={rec.reason}>
                        {rec.reason}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {rec.emailSent ? (
                          <Mail className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {rec.viewed ? (
                          <Eye className="w-4 h-4 text-blue-500 mx-auto" />
                        ) : (
                          <span className="w-4 h-4 block mx-auto rounded-full border-2 border-gray-200" />
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {rec.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <span className="w-4 h-4 block mx-auto rounded-full border-2 border-gray-200" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>
              {lang === "fr" ? `Page ${page} sur ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat card component ──
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Bot;
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
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {sub && <p className="text-[10px] text-blue-600 font-medium">{sub}</p>}
      </div>
    </div>
  );
}
