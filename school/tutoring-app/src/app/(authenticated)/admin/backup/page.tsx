"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Database,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Archive,
  AlertTriangle,
} from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface BackupStatus {
  automated: {
    schedule: string;
    keepDays: number;
    keepWeeks: number;
    keepMonths: number;
    storage: string;
  };
  manual: {
    available: boolean;
    pgDumpVersion: string;
  };
}

export default function BackupPage() {
  const { data: session } = useSession();
  const lang = ((session?.user as Record<string, unknown>)?.language as Language) || "fr";

  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [lastDownload, setLastDownload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/backup")
      .then((r) => r.json())
      .then(setStatus)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/backup", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Backup failed");
        return;
      }
      // Stream the download
      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition") || "";
      const match = contentDisposition.match(/filename="(.+)"/);
      const filename = match ? match[1] : "backup.sql.gz";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastDownload(new Date().toLocaleString(lang === "en" ? "en-US" : "fr-FR"));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDownloading(false);
    }
  };

  const lbl = (fr: string, en: string) => lang === "en" ? en : fr;

  if (loading) {
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
          <Database className="w-7 h-7 text-blue-600" />
          {lbl("Sauvegarde de la Base de Données", "Database Backup")}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {lbl(
            "Gérez les sauvegardes automatiques et manuelles de la base de données.",
            "Manage automated and manual database backups."
          )}
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-800">{lbl("Sauvegarde auto", "Auto backup")}</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{lbl("Activée", "Active")}</p>
          <p className="text-xs text-gray-500 mt-1">{status?.automated.schedule}</p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Archive className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-800">{lbl("Rétention", "Retention")}</span>
          </div>
          <div className="space-y-0.5 text-sm text-gray-600">
            <p>{status?.automated.keepDays} {lbl("sauvegardes quotidiennes", "daily backups")}</p>
            <p>{status?.automated.keepWeeks} {lbl("hebdomadaires", "weekly")}</p>
            <p>{status?.automated.keepMonths} {lbl("mensuelles", "monthly")}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="font-semibold text-gray-800">{lbl("Stockage", "Storage")}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{status?.automated.storage}</p>
          <p className="text-xs text-gray-500 mt-1">
            {lbl("Volume Docker géré automatiquement", "Auto-managed Docker volume")}
          </p>
        </div>
      </div>

      {/* Manual backup */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          {lbl("Sauvegarde Manuelle", "Manual Backup")}
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          {lbl(
            "Téléchargez une sauvegarde complète de la base de données à tout moment. Le fichier est compressé (gzip) et contient toutes les données.",
            "Download a complete database backup at any time. The file is gzip-compressed and contains all data."
          )}
        </p>

        {!status?.manual.available && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{lbl("pg_dump non disponible dans ce conteneur.", "pg_dump not available in this container.")}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-600">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {lastDownload && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{lbl("Téléchargé le", "Downloaded at")} {lastDownload}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            disabled={downloading || !status?.manual.available}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
          >
            {downloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {lbl("Génération en cours...", "Generating...")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {lbl("Télécharger la sauvegarde", "Download backup")} (.sql.gz)
              </>
            )}
          </button>
          {status?.manual.pgDumpVersion && (
            <span className="text-xs text-gray-400">{status.manual.pgDumpVersion}</span>
          )}
        </div>
      </div>

      {/* Automated schedule info */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {lbl("Calendrier des sauvegardes automatiques", "Automated Backup Schedule")}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">{lbl("Quotidien — 00h00 UTC", "Daily — 00:00 UTC")}</p>
              <p className="text-xs text-gray-500">{lbl("Conservation : 7 jours", "Kept for 7 days")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">{lbl("Hebdomadaire", "Weekly")}</p>
              <p className="text-xs text-gray-500">{lbl("Conservation : 4 semaines", "Kept for 4 weeks")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">{lbl("Mensuel", "Monthly")}</p>
              <p className="text-xs text-gray-500">{lbl("Conservation : 3 mois", "Kept for 3 months")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restore instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          {lbl("Comment restaurer la base de données", "How to restore the database")}
        </h2>
        <p className="text-sm text-amber-800 mb-3">
          {lbl(
            "En cas de perte de données, connectez-vous au serveur et exécutez :",
            "In case of data loss, connect to the server and run:"
          )}
        </p>
        <div className="bg-amber-900 rounded-lg p-4 space-y-2">
          <p className="text-xs text-amber-200 font-mono">
            {lbl("# Depuis un fichier .sql.gz téléchargé manuellement :", "# From a manually downloaded .sql.gz file:")}
          </p>
          <p className="text-xs text-green-300 font-mono">
            {"gunzip -c backup.sql.gz | docker compose exec -T db psql -U lionlearn lionlearn"}
          </p>
          <p className="text-xs text-amber-200 font-mono mt-2">
            {lbl("# Depuis le volume automatique (fichier .sql.gz dans le volume pgbackups) :", "# From the auto volume (pgbackups volume):")}
          </p>
          <p className="text-xs text-green-300 font-mono">
            {"docker compose exec backup ls /backups/daily"}
          </p>
          <p className="text-xs text-green-300 font-mono">
            {"docker compose exec backup gunzip -c /backups/daily/<file>.sql.gz | docker compose exec -T db psql -U lionlearn lionlearn"}
          </p>
          <p className="text-xs text-amber-200 font-mono mt-2">
            {lbl("# Forcer une sauvegarde manuelle via le conteneur backup :", "# Force a manual backup via backup container:")}
          </p>
          <p className="text-xs text-green-300 font-mono">
            {"docker compose exec backup /backup.sh"}
          </p>
        </div>
      </div>
    </div>
  );
}
