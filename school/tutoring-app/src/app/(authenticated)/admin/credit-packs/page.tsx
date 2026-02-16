"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CreditCard, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, ArrowUpDown } from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceCFA: number;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminCreditPacksPage() {
  const { data: session } = useSession();
  const lang = ((session?.user as Record<string, unknown>)?.language as string || "fr") as Language;

  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPack, setEditPack] = useState<CreditPack | null>(null);
  const [form, setForm] = useState({ name: "", credits: "", priceCFA: "", description: "", sortOrder: "0" });
  const [saving, setSaving] = useState(false);

  const fetchPacks = async () => {
    const res = await fetch("/api/admin/credit-packs");
    const data = await res.json();
    setPacks(data.packs || []);
    setLoading(false);
  };

  useEffect(() => { fetchPacks(); }, []);

  const openCreate = () => {
    setEditPack(null);
    setForm({ name: "", credits: "", priceCFA: "", description: "", sortOrder: "0" });
    setShowForm(true);
  };

  const openEdit = (pack: CreditPack) => {
    setEditPack(pack);
    setForm({
      name: pack.name,
      credits: String(pack.credits),
      priceCFA: String(pack.priceCFA),
      description: pack.description || "",
      sortOrder: String(pack.sortOrder),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editPack) {
        await fetch("/api/admin/credit-packs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editPack.id, ...form }),
        });
      } else {
        await fetch("/api/admin/credit-packs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      fetchPacks();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (pack: CreditPack) => {
    await fetch("/api/admin/credit-packs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pack.id, isActive: !pack.isActive }),
    });
    fetchPacks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === "fr" ? "Supprimer ce pack ?" : "Delete this pack?")) return;
    await fetch(`/api/admin/credit-packs?id=${id}`, { method: "DELETE" });
    fetchPacks();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("admin.creditPacks.title", lang)}
            </h1>
            <p className="text-sm text-gray-500">
              {t("admin.creditPacks.subtitle", lang)}
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          <Plus className="w-4 h-4" />
          {t("admin.creditPacks.add", lang)}
        </button>
      </div>

      {/* Credit Packs Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("admin.creditPacks.name", lang)}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("admin.creditPacks.credits", lang)}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("admin.creditPacks.price", lang)}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("admin.creditPacks.perCredit", lang)}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("admin.creditPacks.status", lang)}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {packs.map((pack) => (
              <tr key={pack.id} className={!pack.isActive ? "opacity-50" : ""}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{pack.name}</p>
                    {pack.description && <p className="text-sm text-gray-500">{pack.description}</p>}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-amber-600">{pack.credits}</td>
                <td className="px-6 py-4 font-medium">{pack.priceCFA.toLocaleString()} FCFA</td>
                <td className="px-6 py-4 text-sm text-gray-500">{Math.round(pack.priceCFA / pack.credits)} FCFA</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggle(pack)} title="Toggle">
                    {pack.isActive ? (
                      <ToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEdit(pack)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(pack.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {packs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  {t("admin.creditPacks.empty", lang)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pricing info */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">{t("admin.creditPacks.costsTitle", lang)}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { action: "exercise", cost: 3, icon: "📝" },
            { action: "study_guide", cost: 3, icon: "📖" },
            { action: "flashcards", cost: 2, icon: "🃏" },
            { action: "chat", cost: 1, icon: "💬" },
            { action: "study_plan", cost: 5, icon: "📅" },
          ].map((item) => (
            <div key={item.action} className="bg-white rounded-lg p-3 text-center">
              <span className="text-xl">{item.icon}</span>
              <p className="text-xs text-gray-600 mt-1">{t(`credits.action.${item.action}` as never, lang)}</p>
              <p className="font-bold text-amber-600">{item.cost} {t("credits.unit", lang)}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-blue-700 mt-3">
          {t("admin.creditPacks.freeTierInfo", lang)}
        </p>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editPack ? t("admin.creditPacks.edit", lang) : t("admin.creditPacks.add", lang)}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.creditPacks.name", lang)}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Starter Pack"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.creditPacks.credits", lang)}</label>
                  <input
                    type="number"
                    value={form.credits}
                    onChange={(e) => setForm({ ...form, credits: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.creditPacks.priceFCFA", lang)}</label>
                  <input
                    type="number"
                    value={form.priceCFA}
                    onChange={(e) => setForm({ ...form, priceCFA: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="1000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder={lang === "fr" ? "Description optionnelle" : "Optional description"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <ArrowUpDown className="w-3 h-3 inline mr-1" />
                  {t("admin.creditPacks.sortOrder", lang)}
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {t("cancel", lang)}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.credits || !form.priceCFA}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                {saving ? t("loading", lang) : t("save", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
