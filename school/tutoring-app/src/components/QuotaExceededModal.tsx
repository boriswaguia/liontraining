"use client";

import { Coins, AlertTriangle, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { Language, t } from "@/lib/i18n";

interface QuotaExceededModalProps {
  show: boolean;
  onClose: () => void;
  reason?: string;
  creditBalance?: number;
  creditCost?: number;
  lang: Language;
}

export default function QuotaExceededModal({
  show,
  onClose,
  reason,
  creditBalance,
  creditCost,
  lang,
}: QuotaExceededModalProps) {
  if (!show) return null;

  const isInsufficient = reason === "insufficient_credits";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {isInsufficient ? t("credits.insufficientCredits", lang) : t("credits.quotaExceeded", lang)}
        </h3>

        {isInsufficient && creditCost !== undefined && creditBalance !== undefined && (
          <div className="bg-red-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-700">
                {creditCost} {t("credits.unit", lang)} {t("credits.needed", lang)}
              </span>
              <span className="flex items-center gap-1 font-bold text-red-600">
                <Coins className="w-4 h-4" />
                {creditBalance} {t("credits.unit", lang)}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-6">
          {t("credits.resetInfo", lang)}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            {t("close", lang)}
          </button>
          <Link
            href="/credits"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            {t("credits.buyCredits", lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}
