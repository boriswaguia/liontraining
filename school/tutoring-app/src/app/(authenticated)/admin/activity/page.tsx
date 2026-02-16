"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Shield,
  BookOpen,
  Cpu,
  LogIn,
  RefreshCw,
  X,
  Eye,
} from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  category: string;
  resource: string | null;
  resourceId: string | null;
  detail: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface FilterOptions {
  categories: string[];
  actions: string[];
  resources: string[];
}

// Labels for categories
const categoryLabels: Record<string, Record<string, string>> = {
  auth: { fr: "Authentification", en: "Authentication" },
  learning: { fr: "Apprentissage", en: "Learning" },
  ai: { fr: "IA / Génération", en: "AI / Generation" },
  admin: { fr: "Administration", en: "Administration" },
};

// Icons for categories
const categoryIcons: Record<string, typeof Activity> = {
  auth: LogIn,
  learning: BookOpen,
  ai: Cpu,
  admin: Shield,
};

// Colors for categories
const categoryColors: Record<string, string> = {
  auth: "bg-blue-100 text-blue-800",
  learning: "bg-green-100 text-green-800",
  ai: "bg-purple-100 text-purple-800",
  admin: "bg-amber-100 text-amber-800",
};

// Human-readable action labels
const actionLabels: Record<string, Record<string, string>> = {
  login: { fr: "Connexion", en: "Login" },
  register: { fr: "Inscription", en: "Registration" },
  "course.enroll": { fr: "Inscription à un cours", en: "Course enrollment" },
  "course.view": { fr: "Consultation d'un cours", en: "Course view" },
  "chat.message": { fr: "Message au tuteur IA", en: "AI tutor message" },
  "exercise.generate": { fr: "Génération d'exercices", en: "Exercise generation" },
  "exercise.score": { fr: "Score d'exercice", en: "Exercise score" },
  "study_guide.generate": { fr: "Génération de guide", en: "Guide generation" },
  "study_guide.complete": { fr: "Guide complété", en: "Guide completed" },
  "flashcard.generate": { fr: "Génération de flashcards", en: "Flashcard generation" },
  "flashcard.review": { fr: "Révision de flashcards", en: "Flashcard review" },
  "study_plan.generate": { fr: "Génération de plan", en: "Plan generation" },
  "study_plan.task_toggle": { fr: "Tâche cochée/décochée", en: "Task toggled" },
  "admin.user.create": { fr: "Création d'utilisateur", en: "User created" },
  "admin.user.update": { fr: "Modification d'utilisateur", en: "User updated" },
  "admin.user.delete": { fr: "Suppression d'utilisateur", en: "User deleted" },
  "admin.user.toggle_active": { fr: "Activation/Désactivation", en: "User toggled" },
  "admin.school.create": { fr: "Création d'école", en: "School created" },
  "admin.school.update": { fr: "Modification d'école", en: "School updated" },
  "admin.school.delete": { fr: "Suppression d'école", en: "School deleted" },
  "admin.department.create": { fr: "Création de département", en: "Department created" },
  "admin.department.update": { fr: "Modification de département", en: "Department updated" },
  "admin.department.delete": { fr: "Suppression de département", en: "Department deleted" },
  "admin.class.create": { fr: "Création de classe", en: "Class created" },
  "admin.class.update": { fr: "Modification de classe", en: "Class updated" },
  "admin.class.delete": { fr: "Suppression de classe", en: "Class deleted" },
  "admin.course.create": { fr: "Création de cours", en: "Course created" },
  "admin.course.update": { fr: "Modification de cours", en: "Course updated" },
  "admin.course.delete": { fr: "Suppression de cours", en: "Course deleted" },
};

function formatDate(iso: string, lang: string) {
  return new Date(iso).toLocaleString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDetail(detail: string | null, lang: string): string {
  if (!detail) return "";
  try {
    const obj = JSON.parse(detail);
    const parts: string[] = [];
    for (const [key, val] of Object.entries(obj)) {
      if (val === null || val === undefined) continue;
      const label = key === "updatedFields" ? (lang === "fr" ? "Champs" : "Fields") : key;
      const value = Array.isArray(val) ? val.join(", ") : String(val);
      parts.push(`${label}: ${value}`);
    }
    return parts.join(" · ");
  } catch {
    return detail;
  }
}

export default function ActivityLogPage() {
  const { data: session } = useSession();
  const lang = ((session?.user as Record<string, unknown>)?.language as string || "fr") as Language;

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(30);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterResource, setFilterResource] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ categories: [], actions: [], resources: [] });

  // Users list for user filter
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);

  // Detail modal
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // Fetch users for filter dropdown
  useEffect(() => {
    fetch("/api/admin/users?pageSize=100")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {});
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    if (filterCategory) params.set("category", filterCategory);
    if (filterAction) params.set("action", filterAction);
    if (filterResource) params.set("resource", filterResource);
    if (filterUserId) params.set("userId", filterUserId);
    if (filterDateFrom) params.set("dateFrom", filterDateFrom);
    if (filterDateTo) params.set("dateTo", filterDateTo);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/admin/activity?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalCount(data.pagination?.totalCount || 0);
      setTotalPages(data.pagination?.totalPages || 0);
      if (data.filters) {
        setFilterOptions(data.filters);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterCategory, filterAction, filterResource, filterUserId, filterDateFrom, filterDateTo, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const clearFilters = () => {
    setFilterCategory("");
    setFilterAction("");
    setFilterResource("");
    setFilterUserId("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const activeFilterCount = [filterCategory, filterAction, filterResource, filterUserId, filterDateFrom, filterDateTo, search].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-7 h-7 text-amber-600" />
            {t("admin.activity.title", lang)}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t("admin.activity.subtitle", lang)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {totalCount.toLocaleString()} {lang === "fr" ? "entrées" : "entries"}
          </span>
          <button
            onClick={fetchLogs}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title={lang === "fr" ? "Actualiser" : "Refresh"}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search + Filters bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={lang === "fr" ? "Rechercher par nom, email, action..." : "Search by name, email, action..."}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            {lang === "fr" ? "Filtres" : "Filters"}
            {activeFilterCount > 0 && (
              <span className="bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-3 border-t">
            {/* Category filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {lang === "fr" ? "Catégorie" : "Category"}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">{lang === "fr" ? "Toutes" : "All"}</option>
                {filterOptions.categories.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c]?.[lang] || c}
                  </option>
                ))}
              </select>
            </div>

            {/* Action filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">{lang === "fr" ? "Toutes" : "All"}</option>
                {filterOptions.actions
                  .filter((a) => !filterCategory || a.startsWith(filterCategory === "admin" ? "admin." : ""))
                  .map((a) => (
                    <option key={a} value={a}>
                      {actionLabels[a]?.[lang] || a}
                    </option>
                  ))}
              </select>
            </div>

            {/* Resource filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {lang === "fr" ? "Ressource" : "Resource"}
              </label>
              <select
                value={filterResource}
                onChange={(e) => { setFilterResource(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">{lang === "fr" ? "Toutes" : "All"}</option>
                {filterOptions.resources.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* User filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {lang === "fr" ? "Utilisateur" : "User"}
              </label>
              <select
                value={filterUserId}
                onChange={(e) => { setFilterUserId(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">{lang === "fr" ? "Tous" : "All"}</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Date from */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {lang === "fr" ? "Du" : "From"}
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {lang === "fr" ? "Au" : "To"}
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Clear filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                {lang === "fr" ? "Réinitialiser" : "Clear"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Activity table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
            {t("loading", lang)}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">
              {lang === "fr" ? "Aucune activité trouvée" : "No activity found"}
            </p>
            <p className="text-sm mt-1">
              {lang === "fr"
                ? "Essayez de modifier vos filtres"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    {lang === "fr" ? "Date" : "Date"}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    {lang === "fr" ? "Utilisateur" : "User"}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    {lang === "fr" ? "Catégorie" : "Category"}
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Action
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    {lang === "fr" ? "Détails" : "Details"}
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 w-16">
                    {/* Actions */}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => {
                  const CatIcon = categoryIcons[log.category] || Activity;
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs">{formatDate(log.createdAt, lang)}</span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                            {log.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                              {log.user.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[160px]">
                              {log.user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[log.category] || "bg-gray-100 text-gray-800"}`}>
                          <CatIcon className="w-3 h-3" />
                          {categoryLabels[log.category]?.[lang] || log.category}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">
                          {actionLabels[log.action]?.[lang] || log.action}
                        </span>
                        {log.resource && (
                          <span className="text-xs text-gray-400 ml-1.5">
                            ({log.resource})
                          </span>
                        )}
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500 truncate max-w-[250px]">
                          {formatDetail(log.detail, lang)}
                        </p>
                      </td>

                      {/* View */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={lang === "fr" ? "Voir détails" : "View details"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-xs text-gray-500">
              {lang === "fr"
                ? `Page ${page} sur ${totalPages} (${totalCount} entrées)`
                : `Page ${page} of ${totalPages} (${totalCount} entries)`}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded text-sm transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedLog(null)}>
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                {lang === "fr" ? "Détails de l'activité" : "Activity Details"}
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <DetailRow
                label={lang === "fr" ? "Date" : "Date"}
                value={formatDate(selectedLog.createdAt, lang)}
              />
              <DetailRow
                label={lang === "fr" ? "Utilisateur" : "User"}
                value={`${selectedLog.user.name} (${selectedLog.user.email})`}
              />
              <DetailRow
                label={lang === "fr" ? "Rôle" : "Role"}
                value={selectedLog.user.role}
              />
              <DetailRow
                label={lang === "fr" ? "Catégorie" : "Category"}
                value={categoryLabels[selectedLog.category]?.[lang] || selectedLog.category}
              />
              <DetailRow
                label="Action"
                value={actionLabels[selectedLog.action]?.[lang] || selectedLog.action}
              />
              {selectedLog.resource && (
                <DetailRow
                  label={lang === "fr" ? "Ressource" : "Resource"}
                  value={selectedLog.resource}
                />
              )}
              {selectedLog.resourceId && (
                <DetailRow
                  label={lang === "fr" ? "ID Ressource" : "Resource ID"}
                  value={selectedLog.resourceId}
                />
              )}
              {selectedLog.detail && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    {lang === "fr" ? "Détails" : "Details"}
                  </p>
                  <pre className="bg-gray-50 text-xs text-gray-700 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(selectedLog.detail), null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.ipAddress && (
                <DetailRow
                  label={lang === "fr" ? "Adresse IP" : "IP Address"}
                  value={selectedLog.ipAddress}
                />
              )}
              {selectedLog.userAgent && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">User Agent</p>
                  <p className="text-sm text-gray-700 break-all">{selectedLog.userAgent}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
