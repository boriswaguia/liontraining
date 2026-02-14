"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
} from "lucide-react";

interface SchoolOption {
  id: string;
  shortName: string;
}

interface DepartmentItem {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  school: { id: string; shortName: string };
  _count: { classes: number; users: number };
}

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [filterSchool, setFilterSchool] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    schoolId: "",
    name: "",
    code: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qp = filterSchool ? `?schoolId=${filterSchool}` : "";
    const [dRes, sRes] = await Promise.all([
      fetch(`/api/admin/departments${qp}`),
      fetch("/api/admin/schools"),
    ]);
    const dData = await dRes.json();
    const sData = await sRes.json();
    setDepartments(dData.departments || []);
    setSchools(
      (sData.schools || []).map((s: { id: string; shortName: string }) => ({
        id: s.id,
        shortName: s.shortName,
      }))
    );
    setLoading(false);
  }, [filterSchool]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditId(null);
    setForm({ schoolId: filterSchool || (schools[0]?.id ?? ""), name: "", code: "", description: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (d: DepartmentItem) => {
    setEditId(d.id);
    setForm({
      schoolId: d.schoolId,
      name: d.name,
      code: d.code,
      description: d.description || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (editId) {
        const res = await fetch("/api/admin/departments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, name: form.name, code: form.code, description: form.description }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        const res = await fetch("/api/admin/departments", {
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

  const toggleActive = async (d: DepartmentItem) => {
    await fetch("/api/admin/departments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: d.id, isActive: !d.isActive }),
    });
    fetchData();
  };

  const handleDelete = async (d: DepartmentItem) => {
    if (!confirm(`Supprimer "${d.code} - ${d.name}" et toutes ses classes ?`)) return;
    await fetch(`/api/admin/departments?id=${d.id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-600" />
            Gestion des Départements
          </h1>
          <p className="text-gray-500 mt-1">Gérez les départements de chaque école</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Département
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Toutes les écoles</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shortName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Aucun département trouvé.
        </div>
      ) : (
        <div className="grid gap-4">
          {departments.map((d) => (
            <div
              key={d.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                d.isActive ? "border-gray-200" : "border-red-200 bg-red-50 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                      {d.code}
                    </span>
                    <h3 className="font-semibold text-gray-800">{d.name}</h3>
                    {!d.isActive && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Désactivé
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                    <span>{d.school.shortName}</span>
                    <span>{d._count.classes} classe(s)</span>
                    <span>{d._count.users} étudiant(s)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(d)}
                    className={`p-2 rounded-lg transition-colors ${
                      d.isActive ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"
                    }`}
                    title={d.isActive ? "Désactiver" : "Activer"}
                  >
                    {d.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => openEdit(d)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(d)}
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
                {editId ? "Modifier le département" : "Nouveau département"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">École *</label>
                  <select
                    value={form.schoolId}
                    onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sélectionner...</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>{s.shortName}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Génie Informatique"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="GI"
                  />
                </div>
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
                disabled={saving || !form.name || !form.code || (!editId && !form.schoolId)}
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
