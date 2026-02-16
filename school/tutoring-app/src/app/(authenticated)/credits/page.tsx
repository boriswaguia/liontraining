"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Coins,
  Zap,
  MessageCircle,
  Clock,
  ShoppingBag,
  History,
  ArrowDown,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface QuotaStatus {
  creditBalance: number;
  plan: string;
  role: string;
  today: {
    generations: number;
    chatMessages: number;
    generationsLimit: number;
    chatMessagesLimit: number;
  };
}

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceCFA: number;
  description: string | null;
}

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  action: string | null;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export default function CreditsPage() {
  const { data: session } = useSession();
  const lang = ((session?.user as Record<string, unknown>)?.language as string || "fr") as Language;

  const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "packs" | "history">("overview");
  const [loading, setLoading] = useState(true);
  const [creditCosts, setCreditCosts] = useState<Record<string, number>>({});
  const [freeLimits, setFreeLimits] = useState({ generations: 5, chatMessages: 15 });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tab = activeTab === "overview" ? "" : `?tab=${activeTab === "packs" ? "packs" : "history"}`;
      const res = await fetch(`/api/credits${tab}`);
      const data = await res.json();
      setQuotaStatus(data.quotaStatus);
      if (data.creditCosts) setCreditCosts(data.creditCosts);
      if (data.freeLimits) setFreeLimits(data.freeLimits);
      if (data.packs) setPacks(data.packs);
      if (data.transactions) setTransactions(data.transactions);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !quotaStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const today = quotaStatus?.today;
  const genUsed = today?.generations || 0;
  const genLimit = today?.generationsLimit || freeLimits.generations;
  const chatUsed = today?.chatMessages || 0;
  const chatLimit = today?.chatMessagesLimit || freeLimits.chatMessages;
  const genPercent = Math.min((genUsed / genLimit) * 100, 100);
  const chatPercent = Math.min((chatUsed / chatLimit) * 100, 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <Coins className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("credits.title", lang)}</h1>
          <p className="text-sm text-gray-500">{t("credits.subtitle", lang)}</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm font-medium">{t("credits.balance", lang)}</p>
            <p className="text-4xl font-bold mt-1">{quotaStatus?.creditBalance || 0}</p>
            <p className="text-amber-200 text-sm mt-1">{t("credits.unit", lang)}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Daily Free Tier Status */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          {t("credits.dailyFree", lang)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Generations meter */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-1 text-gray-600">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                {t("credits.generations", lang)}
              </span>
              <span className="font-medium">{genUsed}/{genLimit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${genPercent >= 100 ? "bg-red-500" : genPercent >= 80 ? "bg-amber-500" : "bg-blue-500"}`}
                style={{ width: `${genPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {t("credits.genDesc", lang)}
            </p>
          </div>

          {/* Chat meter */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-1 text-gray-600">
                <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                {t("credits.chatMessages", lang)}
              </span>
              <span className="font-medium">{chatUsed}/{chatLimit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${chatPercent >= 100 ? "bg-red-500" : chatPercent >= 80 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${chatPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {t("credits.chatDesc", lang)}
            </p>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-4 bg-blue-50 rounded-lg p-2">
          {t("credits.resetInfo", lang)}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border shadow-sm p-1.5">
        {[
          { key: "overview" as const, label: t("credits.tab.costs", lang), icon: Zap },
          { key: "packs" as const, label: t("credits.tab.packs", lang), icon: ShoppingBag },
          { key: "history" as const, label: t("credits.tab.history", lang), icon: History },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg whitespace-nowrap font-medium transition ${
              activeTab === tab.key
                ? "bg-amber-100 text-amber-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Costs Overview */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t("credits.costsTitle", lang)}</h3>
          <div className="space-y-3">
            {[
              { action: "exercise", icon: "📝", cost: creditCosts.exercise || 3 },
              { action: "study_guide", icon: "📖", cost: creditCosts.study_guide || 3 },
              { action: "flashcards", icon: "🃏", cost: creditCosts.flashcards || 2 },
              { action: "chat", icon: "💬", cost: creditCosts.chat || 1 },
              { action: "study_plan", icon: "📅", cost: creditCosts.study_plan || 5 },
            ].map((item) => (
              <div key={item.action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-gray-900">{t(`credits.action.${item.action}` as never, lang)}</span>
                </div>
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Coins className="w-4 h-4" />
                  {item.cost}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">{t("credits.costsNote", lang)}</p>
        </div>
      )}

      {/* Credit Packs */}
      {activeTab === "packs" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packs.length === 0 ? (
            <div className="col-span-3 bg-white rounded-xl border text-center py-12 text-gray-500">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>{t("credits.noPacks", lang)}</p>
            </div>
          ) : (
            packs.map((pack, i) => (
              <div
                key={pack.id}
                className={`bg-white rounded-xl border shadow-sm p-6 relative ${
                  i === 1 ? "ring-2 ring-amber-500" : ""
                }`}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {t("credits.popular", lang)}
                  </span>
                )}
                <h4 className="font-bold text-gray-900 text-lg">{pack.name}</h4>
                {pack.description && (
                  <p className="text-sm text-gray-500 mt-1">{pack.description}</p>
                )}
                <div className="mt-4">
                  <p className="text-3xl font-bold text-amber-600">{pack.credits}</p>
                  <p className="text-sm text-gray-500">{t("credits.unit", lang)}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-4">
                  {pack.priceCFA.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round(pack.priceCFA / pack.credits)} FCFA / {t("credits.perCredit", lang)}
                </p>
                <button className="w-full mt-4 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium">
                  {t("credits.buy", lang)}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Transaction History */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <History className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>{t("credits.noHistory", lang)}</p>
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? "bg-green-100" : "bg-red-100"}`}>
                      {tx.amount > 0 ? <ArrowDown className="w-4 h-4 text-green-600" /> : <ArrowUp className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </p>
                    <p className="text-xs text-gray-400">{t("credits.balanceAfter", lang)}: {tx.balanceAfter}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
