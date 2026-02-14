"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
} from "lucide-react";

interface ClassOption {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  department: { code: string; school: { shortName: string } };
}

interface CourseItem {
  id: string;
  code: string;
  title: string;
  description: string;
  hours: number;
  semester: number;
  level: number;
  category: string;
  isActive: boolean;
  classId: string | null;
  academicClass: {
    name: string;
    code: string;
    department: { code: string; school: { shortName: string } };
  } | null;
  _count: { enrollments: number };
}

const CATEGORIES = [
  { value: "math", label: "Mathématiques" },
  { value: "cs", label: "Informatique" },
  { value: "electronics", label: "Électronique" },
  { value: "language", label: "Langues" },
  { value: "business", label: "Gestion" },
  { value: "law", label: "Droit" },
  { value: "science", label: "Sciences" },
  { value: "other", label: "Autre" },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [filterClass, setFilterClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    classId: "",
    code: "",
    title: "",
    description: "",
    hours: 36,
    semester: 1,
    level: 1,
    category: "cs",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qp = filterClass ? `?classId=${filterClass}` : "";
    const [coRes, clRes] = await Promise.all([
      fetch(`/api/admin/courses${qp}`),
      fetch("/api/admin/classes"),
    ]);
    const coData = await coRes.json();
    const clData = await clRes.json();
    setCourses(coData.courses || []);
    setClasses(clData.classes || []);
    setLoading(false);
  }, [filterClass]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditId(null);
    setForm({
      classId: filterClass || "",
      code: "",
      title: "",
      description: "",
      hours: 36,
      semester: 1,
      level: 1,
      category: "cs",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (c: CourseItem) => {
    setEditId(c.id);
    setForm({
      classId: c.classId || "",
      code: c.code,
      title: c.title,
      description: c.description,
      hours: c.hours,
      semester: c.semester,
      level: c.level,
      category: c.category,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (editId) {
        const res = await fetch("/api/admin/courses", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editId,
            title: form.title,
            description: form.description,
            hours: form.hours,
            semester: form.semester,
            level: form.level,
            category: form.category,
            classId: form.classId || null,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            classId: form.classId || null,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      }
      setShowModal(false);
      fetchData();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
    setSaving(false);
  };

  const toggleActive = async (c: CourseItem) => {
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, isActive: !c.isActive }),
    });
    fetchData();
  };

  const handleDelete = async (c: CourseItem) => {
    if (!confirm(`Supprimer le cours "${c.code} - ${c.title}" ?`)) return;
    await fetch(`/api/admin/courses?id=${c.id}`, { method: "DELETE" });
    fetchData();
  };

  const catLabel = (val: string) =>
    CATEGORIES.find((c) => c.value === val)?.label || val;

  const catColor = (val: string) => {
    const colors: Record<string, string> = {
      math: "bg-blue-100 text-blue-700",
      cs: "bg-green-100 text-green-700",
      electronics: "bg-yellow-100 text-yellow-700",
      language: "bg-pink-100 text-pink-700",
      business: "bg-orange-100 text-orange-700",
      law: "bg-violet-100 text-violet-700",
      science: "bg-cyan-100 text-cyan-700",
    };
    return colors[val] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Gestion des Cours
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les cours de chaque classe
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Cours
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Toutes les classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.department.school.shortName} — {c.department.code} — {c.name} ({c.academicYear})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Aucun cours trouvé.
        </div>
      ) : (
        <div className="grid gap-3">
          {courses.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                c.isActive ? "border-gray-200" : "border-red-200 bg-red-50 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2 py-0.5 bg-gray-800 text-white text-xs font-mono font-bold rounded">
                      {c.code}
                    </span>
                    <h3 className="font-semibold text-gray-800 truncate">{c.title}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${catColor(c.category)}`}>
                      {catLabel(c.category)}
                    </span>
                    {!c.isActive && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Désactivé
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                    {c.academicClass && (
                      <span>
                        {c.academicClass.department.school.shortName} — {c.academicClass.department.code} — {c.academicClass.name}
                      </span>
                    )}
                    <span>{c.hours}h</span>
                    <span>S{c.semester}</span>
                    <span>{c._count.enrollments} inscrit(s)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`p-2 rounded-lg transition-colors ${
                      c.isActive ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"
                    }`}
                    title={c.isActive ? "Désactiver" : "Activer"}
                  >
                    {c.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-800">
                {editId ? "Modifier le cours" : "Nouveau cours"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe (optionnel)</label>
                <select
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Aucune classe</option>
                  {classes.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      {cl.department.school.shortName} — {cl.department.code} — {cl.name} ({cl.academicYear})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="MTIN-121"
                    disabled={!!editId}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Analyse Mathématique"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heures</label>
                  <input
                    type="number"
                    value={form.hours}
                    onChange={(e) => setForm({ ...form, hours: parseInt(e.target.value) || 36 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                  <input
                    type="number"
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    min={1}
                    max={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <input
                    type="number"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    min={1}
                    max={5}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.code || !form.title || !form.description || !form.category}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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
