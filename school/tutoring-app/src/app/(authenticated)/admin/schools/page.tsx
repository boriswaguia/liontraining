"use client";

import { useState, useEffect, useCallback } from "react";
import {
  School,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
  MapPin,
} from "lucide-react";

interface SchoolItem {
  id: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  logo: string | null;
  description: string | null;
  isActive: boolean;
  _count: { departments: number; users: number };
}

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    city: "",
    country: "Cameroun",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/schools");
    const data = await res.json();
    setSchools(data.schools || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: "", shortName: "", city: "", country: "Cameroun", description: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (s: SchoolItem) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      shortName: s.shortName,
      city: s.city,
      country: s.country,
      description: s.description || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (editId) {
        const res = await fetch("/api/admin/schools", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form }),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error);
        }
      } else {
        const res = await fetch("/api/admin/schools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error);
        }
      }
      setShowModal(false);
      fetchSchools();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
    setSaving(false);
  };

  const toggleActive = async (s: SchoolItem) => {
    await fetch("/api/admin/schools", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, isActive: !s.isActive }),
    });
    fetchSchools();
  };

  const handleDelete = async (s: SchoolItem) => {
    if (!confirm(`Supprimer l'école "${s.shortName}" et toutes ses données ?`)) return;
    await fetch(`/api/admin/schools?id=${s.id}`, { method: "DELETE" });
    fetchSchools();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <School className="w-7 h-7 text-blue-600" />
            Gestion des Écoles
          </h1>
          <p className="text-gray-500 mt-1">
            Créez, modifiez ou désactivez des établissements
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle École
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : schools.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Aucune école. Cliquez sur &quot;Nouvelle École&quot; pour commencer.
        </div>
      ) : (
        <div className="grid gap-4">
          {schools.map((s) => (
            <div
              key={s.id}
              className={`bg-white rounded-xl border p-6 transition-all ${
                s.isActive ? "border-gray-200" : "border-red-200 bg-red-50 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">{s.name}</h3>
                    {!s.isActive && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Désactivée
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Code: <span className="font-medium">{s.shortName}</span>
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {s.city}, {s.country}
                    </span>
                    <span>{s._count.departments} département(s)</span>
                    <span>{s._count.users} utilisateur(s)</span>
                  </div>
                  {s.description && (
                    <p className="text-sm text-gray-400 mt-2">{s.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(s)}
                    className={`p-2 rounded-lg transition-colors ${
                      s.isActive
                        ? "text-green-600 hover:bg-green-50"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                    title={s.isActive ? "Désactiver" : "Activer"}
                  >
                    {s.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(s)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                {editId ? "Modifier l'école" : "Nouvelle école"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Institut Universitaire de Technologie de Douala"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom court *
                  </label>
                  <input
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="UIT Douala"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Douala"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Cameroun"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.shortName || !form.city}
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
