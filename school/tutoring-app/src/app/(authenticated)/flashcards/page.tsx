"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Star,
  MessageCircle,
  Bot,
} from "lucide-react";
import Link from "next/link";
import QuotaExceededModal from "@/components/QuotaExceededModal";
import { useLanguage } from "@/hooks/useLanguage";

interface Course {
  id: string;
  code: string;
  title: string;
}

interface FlashcardDeck {
  id: string;
  title: string;
  cards: string;
  reviewed: boolean;
  confidence: number | null;
  source?: string;
  createdAt: string;
  course: Course;
}

interface Card {
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const { language: lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("courseId");

  const [courses, setCourses] = useState<Course[]>([]);
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(
    preselectedCourseId || ""
  );
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [savingConfidence, setSavingConfidence] = useState(false);
  const [quotaModal, setQuotaModal] = useState<{ show: boolean; reason?: string; creditBalance?: number; creditCost?: number }>({ show: false });

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []));

    const url = preselectedCourseId
      ? `/api/flashcards?courseId=${preselectedCourseId}`
      : "/api/flashcards";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setDecks(d.decks || []));
  }, [preselectedCourseId]);

  const generateFlashcards = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          topic: topic || undefined,
          count: 15,
        }),
      });
      if (res.status === 402) {
        const err = await res.json();
        setQuotaModal({ show: true, reason: err.reason, creditBalance: err.creditBalance, creditCost: err.creditCost });
        return;
      }
      const data = await res.json();
      if (data.deck) {
        const newDeck = {
          ...data.deck,
          course: courses.find((c) => c.id === selectedCourse)!,
        };
        setDecks((prev) => [newDeck, ...prev]);
        setActiveDeck(newDeck);
        setCurrentCardIndex(0);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards: Card[] = activeDeck ? JSON.parse(activeDeck.cards) : [];

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      // Last card reached - show confidence rating
      setShowConfidence(true);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((i) => i - 1);
      setIsFlipped(false);
    }
  };

  const resetDeck = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowConfidence(false);
  };

  const submitConfidence = async (confidence: number) => {
    if (!activeDeck || savingConfidence) return;
    setSavingConfidence(true);
    try {
      await fetch("/api/flashcards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckId: activeDeck.id,
          reviewed: true,
          confidence,
        }),
      });
      const updated = { ...activeDeck, reviewed: true, confidence };
      setActiveDeck(updated);
      setDecks((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
      setShowConfidence(false);
    } catch (error) {
      console.error("Confidence error:", error);
    } finally {
      setSavingConfidence(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-purple-500" />
          {t("flash.title")}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("flash.subtitle")}
        </p>
      </div>

      {/* Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {t("flash.newDeck")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("flash.course")}
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">{t("flash.selectCourse")}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("flash.topic")}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("flash.topic.placeholder")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateFlashcards}
              disabled={loading || !selectedCourse}
              className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("flash.generating")}
                </>
              ) : (
                t("flash.generate")
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deck List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {t("flash.myDecks")} ({decks.length})
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {decks.map((deck) => {
                const deckCards: Card[] = JSON.parse(deck.cards);
                return (
                  <button
                    key={deck.id}
                    onClick={() => {
                      setActiveDeck(deck);
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                      setShowConfidence(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeDeck?.id === deck.id
                        ? "bg-purple-50 border border-purple-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {deck.reviewed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-800 truncate flex items-center gap-1">
                          {deck.source === "system" && <Bot className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                          <span className="truncate">{deck.title}</span>
                        </p>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {deck.source === "system" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                              📌 {lang === "en" ? "Daily" : "Quotidien"}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {deck.course?.code} • {deckCards.length} {t("flash.cards")}
                          </span>
                          {deck.confidence !== null && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 ml-1">
                              {deck.confidence}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Flashcard Viewer */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
            {activeDeck && cards.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {activeDeck.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {t("flash.cardOf")} {currentCardIndex + 1} {t("flash.of")} {cards.length}
                    </p>
                  </div>
                  <button
                    onClick={resetDeck}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t("flash.restart")}
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${((currentCardIndex + 1) / cards.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Card */}
                <div
                  className={`flashcard-container mx-auto max-w-lg cursor-pointer ${isFlipped ? "flashcard-flipped" : ""}`}
                  style={{ height: "300px" }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div
                    className="flashcard-inner"
                    style={{ height: "300px" }}
                  >
                    <div className="flashcard-front bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wide opacity-70 mb-3">
                          {t("flash.question")}
                        </p>
                        <p className="text-lg font-medium">
                          {cards[currentCardIndex]?.front}
                        </p>
                        <p className="text-xs opacity-50 mt-4">
                          {t("flash.clickToFlip")}
                        </p>
                      </div>
                    </div>
                    <div className="flashcard-back bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wide opacity-70 mb-3">
                          {t("flash.answer")}
                        </p>
                        <p className="text-lg font-medium">
                          {cards[currentCardIndex]?.back}
                        </p>
                        <p className="text-xs opacity-50 mt-4">
                          {t("flash.clickToFlip")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prevCard}
                    disabled={currentCardIndex === 0}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-500 min-w-[80px] text-center">
                    {currentCardIndex + 1} / {cards.length}
                  </span>
                  <button
                    onClick={nextCard}
                    disabled={showConfidence}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Confidence Rating (shown after completing all cards) */}
                {showConfidence && !activeDeck.reviewed && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1 text-center">
                      {t("flash.deckComplete")}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 text-center">
                      {t("flash.rateConfidence")}
                    </p>
                    <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                      {[
                        { score: 20, label: "20%", desc: t("flash.veryUnclear"), color: "bg-red-100 hover:bg-red-200 text-red-700" },
                        { score: 40, label: "40%", desc: t("flash.difficult"), color: "bg-orange-100 hover:bg-orange-200 text-orange-700" },
                        { score: 60, label: "60%", desc: t("flash.average"), color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700" },
                        { score: 80, label: "80%", desc: t("flash.good"), color: "bg-blue-100 hover:bg-blue-200 text-blue-700" },
                        { score: 100, label: "100%", desc: t("flash.mastered"), color: "bg-green-100 hover:bg-green-200 text-green-700" },
                      ].map((opt) => (
                        <button
                          key={opt.score}
                          onClick={() => submitConfidence(opt.score)}
                          disabled={savingConfidence}
                          className={`${opt.color} rounded-lg p-3 text-center transition-colors disabled:opacity-50`}
                        >
                          <p className="text-lg font-bold">{opt.label}</p>
                          <p className="text-xs">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discuss with AI */}
                <div className="mt-4 flex justify-center">
                  <Link
                    href={`/chat?courseId=${activeDeck.course?.id}&contextType=flashcard&contextId=${activeDeck.id}&contextTitle=${encodeURIComponent(activeDeck.title)}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t("discuss.withAI")}
                  </Link>
                </div>

                {/* Already reviewed badge */}
                {activeDeck.reviewed && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 bg-green-50 rounded-lg p-3 border border-green-200">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-700">
                        {t("flash.deckReviewed")}
                        {activeDeck.confidence !== null && (
                          <> — {t("flash.confidence")} {activeDeck.confidence}%</>
                        )}
                      </span>
                      <button
                        onClick={() => {
                          resetDeck();
                          setShowConfidence(false);
                          // Allow re-review
                          const updated = { ...activeDeck, reviewed: false, confidence: null };
                          setActiveDeck(updated);
                          setDecks((prev) =>
                            prev.map((d) => (d.id === updated.id ? updated : d))
                          );
                        }}
                        className="ml-2 text-xs text-green-600 hover:text-green-800 underline"
                      >
                        {t("flash.reviewAgain")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <GraduationCap className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>{t("flash.selectOrCreate")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <QuotaExceededModal
        show={quotaModal.show}
        onClose={() => setQuotaModal({ show: false })}
        reason={quotaModal.reason}
        creditBalance={quotaModal.creditBalance}
        creditCost={quotaModal.creditCost}
        lang={lang}
      />
    </div>
  );
}
