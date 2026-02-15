"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Search,
  Filter,
  Users,
  Mail,
  Shield,
  Calendar,
  BookOpen,
  MessageCircle,
  Lightbulb,
  FileText,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Power,
} from "lucide-react";

interface SchoolOption {
  id: string;
  shortName: string;
}

interface DepartmentOption {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

interface ClassOption {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  departmentId: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  isActive: boolean;
  schoolId: string | null;
  departmentId: string | null;
  classId: string | null;
  createdAt: string;
  updatedAt: string;
  school: { id: string; shortName: string } | null;
  department: { id: string; name: string; code: string } | null;
  academicClass: { id: string; name: string; code: string; academicYear: string } | null;
  _count: {
    enrollments: number;
    chatSessions: number;
    exercises: number;
    studyGuides: number;
    flashcardDecks: number;
  };
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  school_admin: "bg-amber-100 text-amber-700",
  student: "bg-blue-100 text-blue-700",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  school_admin: "School Admin",
  student: "Étudiant",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    language: "fr",
    isActive: true,
    schoolId: "",
    departmentId: "",
    classId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filterSchool, setFilterSchool] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterIsActive, setFilterIsActive] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting state
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dropdown options
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);

  // Stats
  const [stats, setStats] = useState({ total: 0, students: 0, admins: 0, schoolAdmins: 0, active: 0, inactive: 0 });

  // Fetch dropdown options
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/schools").then((r) => r.json()),
      fetch("/api/admin/departments").then((r) => r.json()),
      fetch("/api/admin/classes").then((r) => r.json()),
    ]).then(([s, d, c]) => {
      setSchools(s.schools || []);
      setDepartments(d.departments || []);
      setClasses(c.classes || []);
    });
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterSchool) params.set("schoolId", filterSchool);
    if (filterDept) params.set("departmentId", filterDept);
    if (filterClass) params.set("classId", filterClass);
    if (filterRole) params.set("role", filterRole);
    if (filterSearch) params.set("search", filterSearch);
    if (filterDateFrom) params.set("dateFrom", filterDateFrom);
    if (filterDateTo) params.set("dateTo", filterDateTo);
    if (filterIsActive) params.set("isActive", filterIsActive);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();
    const list: UserItem[] = data.users || [];
    setUsers(list);
    setTotalCount(data.pagination?.totalCount || list.length);
    setTotalPages(data.pagination?.totalPages || 1);
    setStats({
      total: data.pagination?.totalCount || list.length,
      students: list.filter((u) => u.role === "student").length,
      admins: list.filter((u) => u.role === "admin").length,
      schoolAdmins: list.filter((u) => u.role === "school_admin").length,
      active: list.filter((u) => u.isActive).length,
      inactive: list.filter((u) => !u.isActive).length,
    });
    setLoading(false);
  }, [filterSchool, filterDept, filterClass, filterRole, filterSearch, filterDateFrom, filterDateTo, filterIsActive, page, pageSize, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtered department/class dropdowns based on selected school/dept
  const filteredDepartments = filterSchool
    ? departments.filter((d) => d.schoolId === filterSchool)
    : departments;

  const filteredClasses = filterDept
    ? classes.filter((c) => c.departmentId === filterDept)
    : classes;

  // Form department/class filtered
  const formDepartments = form.schoolId
    ? departments.filter((d) => d.schoolId === form.schoolId)
    : departments;

  const formClasses = form.departmentId
    ? classes.filter((c) => c.departmentId === form.departmentId)
    : classes;

  const clearFilters = () => {
    setFilterSchool("");
    setFilterDept("");
    setFilterClass("");
    setFilterRole("");
    setFilterSearch("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterIsActive("");
    setPage(1);
  };

  const hasActiveFilters =
    filterSchool || filterDept || filterClass || filterRole || filterSearch || filterDateFrom || filterDateTo || filterIsActive;

  const openCreate = () => {
    setEditId(null);
    setForm({ name: "", email: "", password: "", role: "student", language: "fr", isActive: true, schoolId: "", departmentId: "", classId: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (u: UserItem) => {
    setEditId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      language: u.language,
      isActive: u.isActive,
      schoolId: u.schoolId || "",
      departmentId: u.departmentId || "",
      classId: u.classId || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = { ...form };
      // Don't send empty strings as IDs
      if (!payload.schoolId) delete payload.schoolId;
      if (!payload.departmentId) delete payload.departmentId;
      if (!payload.classId) delete payload.classId;

      if (editId) {
        // Don't send empty password on edit
        if (!payload.password) delete payload.password;
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...payload }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error);
        }
      } else {
        if (!payload.password) throw new Error("Le mot de passe est requis");
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error);
        }
      }
      setShowModal(false);
      fetchUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
    setSaving(false);
  };

  const handleDelete = async (u: UserItem) => {
    if (!confirm(`Supprimer l'utilisateur "${u.name}" (${u.email}) et toutes ses données ?\n\nCette action est irréversible.`)) return;
    const res = await fetch(`/api/admin/users?id=${u.id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Erreur lors de la suppression");
      return;
    }
    fetchUsers();
  };

  const toggleActive = async (u: UserItem) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, isActive: !u.isActive }),
    });
    if (res.ok) {
      fetchUsers();
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600" />
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérer les comptes étudiants, administrateurs et leurs affectations
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-2xl font-bold text-blue-700">{stats.students}</p>
          <p className="text-sm text-blue-600">Étudiants</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <p className="text-2xl font-bold text-amber-700">{stats.schoolAdmins}</p>
          <p className="text-sm text-amber-600">Admins École</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-2xl font-bold text-red-700">{stats.admins}</p>
          <p className="text-sm text-red-600">Admins</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          <p className="text-sm text-green-600">Actifs</p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
          <p className="text-sm text-gray-400">Inactifs</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border shadow-sm mb-6">
        {/* Search + Toggle */}
        <div className="flex items-center gap-3 p-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition ${
              hasActiveFilters
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
            )}
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="border-t px-4 pb-4 pt-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">École</label>
              <select
                value={filterSchool}
                onChange={(e) => { setFilterSchool(e.target.value); setFilterDept(""); setFilterClass(""); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Toutes</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>{s.shortName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Département</label>
              <select
                value={filterDept}
                onChange={(e) => { setFilterDept(e.target.value); setFilterClass(""); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tous</option>
                {filteredDepartments.map((d) => (
                  <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Classe</label>
              <select
                value={filterClass}
                onChange={(e) => { setFilterClass(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Toutes</option>
                {filteredClasses.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name} ({c.academicYear})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Rôle</label>
              <select
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tous</option>
                <option value="student">Étudiant</option>
                <option value="school_admin">Admin École</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Statut</label>
              <select
                value={filterIsActive}
                onChange={(e) => { setFilterIsActive(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Tous</option>
                <option value="true">Actifs</option>
                <option value="false">Inactifs</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Inscription</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }}
                  className="flex-1 border rounded-lg px-2 py-2 text-sm"
                  title="Depuis"
                />
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }}
                  className="flex-1 border rounded-lg px-2 py-2 text-sm"
                  title="Jusqu'à"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Aucun utilisateur trouvé</p>
          <p className="text-sm mt-1">Essayez de modifier vos filtres ou créez un nouvel utilisateur.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th
                    className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900"
                    onClick={() => handleSort("name")}
                  >
                    <span className="flex items-center gap-1">
                      Utilisateur <SortIcon field="name" />
                    </span>
                  </th>
                  <th
                    className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900"
                    onClick={() => handleSort("role")}
                  >
                    <span className="flex items-center gap-1">
                      Rôle <SortIcon field="role" />
                    </span>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Organisation</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Activité</th>
                  <th
                    className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell cursor-pointer select-none hover:text-gray-900"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span className="flex items-center gap-1">
                      Inscrit le <SortIcon field="createdAt" />
                    </span>
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className={`hover:bg-gray-50 transition ${!u.isActive ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${u.isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{u.name}</p>
                          <p className="text-gray-500 text-xs truncate flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-700"}`}>
                        <Shield className="w-3 h-3" />
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          <XCircle className="w-3 h-3" /> Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-xs space-y-0.5">
                        {u.school && <p className="text-gray-700">{u.school.shortName}</p>}
                        {u.department && <p className="text-gray-500">{u.department.code} — {u.department.name}</p>}
                        {u.academicClass && <p className="text-gray-400">{u.academicClass.code} ({u.academicClass.academicYear})</p>}
                        {!u.school && !u.department && <p className="text-gray-400 italic">Non affecté</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1" title="Cours">
                          <BookOpen className="w-3 h-3" /> {u._count.enrollments}
                        </span>
                        <span className="flex items-center gap-1" title="Chats">
                          <MessageCircle className="w-3 h-3" /> {u._count.chatSessions}
                        </span>
                        <span className="flex items-center gap-1" title="Exercices">
                          <Lightbulb className="w-3 h-3" /> {u._count.exercises}
                        </span>
                        <span className="flex items-center gap-1" title="Guides">
                          <FileText className="w-3 h-3" /> {u._count.studyGuides}
                        </span>
                        <span className="flex items-center gap-1" title="Flashcards">
                          <GraduationCap className="w-3 h-3" /> {u._count.flashcardDecks}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => router.push(`/admin/users/${u.id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Voir le profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleActive(u)}
                          className={`p-2 rounded-lg transition ${
                            u.isActive
                              ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={u.isActive ? "Désactiver" : "Activer"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {totalCount} utilisateur{totalCount > 1 ? "s" : ""} au total —
              page {page} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Précédent
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 text-xs rounded-lg transition ${
                      pageNum === page
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100 border"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Suivant
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Jean Dupont"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="jean@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe {editId ? "(laisser vide pour ne pas changer)" : "*"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder={editId ? "••••••••" : "Mot de passe"}
                />
              </div>

              {/* Role + Language */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="student">Étudiant</option>
                    <option value="school_admin">Admin École</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Organization */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Affectation organisationnelle</p>
                  {/* isActive toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-gray-500">Compte actif</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                        form.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                          form.isActive ? "translate-x-4.5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">École</label>
                    <select
                      value={form.schoolId}
                      onChange={(e) => setForm({ ...form, schoolId: e.target.value, departmentId: "", classId: "" })}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">— Aucune —</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>{s.shortName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Département</label>
                    <select
                      value={form.departmentId}
                      onChange={(e) => setForm({ ...form, departmentId: e.target.value, classId: "" })}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      disabled={!form.schoolId}
                    >
                      <option value="">— Aucun —</option>
                      {formDepartments.map((d) => (
                        <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Classe</label>
                    <select
                      value={form.classId}
                      onChange={(e) => setForm({ ...form, classId: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      disabled={!form.departmentId}
                    >
                      <option value="">— Aucune —</option>
                      {formClasses.map((c) => (
                        <option key={c.id} value={c.id}>{c.code} — {c.name} ({c.academicYear})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
