"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
} from "lucide-react";

interface DeptOption {
  id: string;
  code: string;
  school: { shortName: string };
}

interface ClassItem {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  academicYear: string;
  description: string | null;
  isActive: boolean;
  department: { id: string; code: string; school: { shortName: string } };
  _count: { courses: number; users: number };
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [departments, setDepartments] = useState<DeptOption[]>([]);
  const [filterDept, setFilterDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    departmentId: "",
    name: "",
    code: "",
    academicYear: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qp = filterDept ? `?departmentId=${filterDept}` : "";
    const [cRes, dRes] = await Promise.all([
      fetch(`/api/admin/classes${qp}`),
      fetch("/api/admin/departments"),
    ]);
    const cData = await cRes.json();
    const dData = await dRes.json();
    setClasses(cData.classes || []);
    setDepartments(
      (dData.departments || []).map(
        (d: { id: string; code: string; school: { shortName: string } }) => ({
          id: d.id,
          code: d.code,
          school: d.school,
        })
      )
    );
    setLoading(false);
  }, [filterDept]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditId(null);
    setForm({
      departmentId: filterDept || (departments[0]?.id ?? ""),
      name: "",
      code: "",
      academicYear: "2025/2026",
      description: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (c: ClassItem) => {
    setEditId(c.id);
    setForm({
      departmentId: c.departmentId,
      name: c.name,
      code: c.code,
      academicYear: c.academicYear,
      description: c.description || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (editId) {
        const res = await fetch("/api/admin/classes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editId,
            name: form.name,
            code: form.code,
            academicYear: form.academicYear,
            description: form.description,
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        const res = await fetch("/api/admin/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
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

  const toggleActive = async (c: ClassItem) => {
    await fetch("/api/admin/classes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, isActive: !c.isActive }),
    });
    fetchData();
  };

  const handleDelete = async (c: ClassItem) => {
    if (!confirm(`Supprimer la classe "${c.name} (${c.academicYear})" ?`)) return;
    await fetch(`/api/admin/classes?id=${c.id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            Gestion des Classes
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les classes et années académiques
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Classe
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Tous les départements</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.school.shortName} — {d.code}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Aucune classe trouvée.
        </div>
      ) : (
        <div className="grid gap-4">
          {classes.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                c.isActive ? "border-gray-200" : "border-red-200 bg-red-50 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                      {c.code}
                    </span>
                    <h3 className="font-semibold text-gray-800">{c.name}</h3>
                    <span className="text-sm text-gray-400">{c.academicYear}</span>
                    {!c.isActive && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Désactivée
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                    <span>
                      {c.department.school.shortName} — {c.department.code}
                    </span>
                    <span>{c._count.courses} cours</span>
                    <span>{c._count.users} étudiant(s)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editId ? "Modifier la classe" : "Nouvelle classe"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>
              )}
              {!editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                  <select
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sélectionner...</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.school.shortName} — {d.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="L1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Licence 1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année académique *</label>
                <input
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="2025/2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.code || !form.academicYear || (!editId && !form.departmentId)}
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
