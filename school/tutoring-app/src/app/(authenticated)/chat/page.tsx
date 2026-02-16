"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageCircle,
  Send,
  Loader2,
  Plus,
  Bot,
  User,
  Lightbulb,
  GraduationCap,
  FileText,
  CalendarDays,
} from "lucide-react";
import MathMarkdown from "@/components/MathMarkdown";
import QuotaExceededModal from "@/components/QuotaExceededModal";
import { useLanguage } from "@/hooks/useLanguage";
import type { TranslationKey } from "@/lib/i18n";

interface Course {
  id: string;
  code: string;
  title: string;
}

interface ChatSessionItem {
  id: string;
  title: string;
  createdAt: string;
  course: Course;
  contextType?: string | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CONTEXT_LABELS: Record<string, { icon: typeof MessageCircle; labelKey: TranslationKey; color: string }> = {
  exercise: { icon: Lightbulb, labelKey: "chat.context.exercise", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  flashcard: { icon: GraduationCap, labelKey: "chat.context.flashcard", color: "bg-purple-50 text-purple-700 border-purple-200" },
  study_guide: { icon: FileText, labelKey: "chat.context.studyGuide", color: "bg-green-50 text-green-700 border-green-200" },
  study_plan: { icon: CalendarDays, labelKey: "chat.context.studyPlan", color: "bg-blue-50 text-blue-700 border-blue-200" },
};

export default function ChatPage() {
  const { language: lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get("courseId");
  const contextType = searchParams.get("contextType");
  const contextId = searchParams.get("contextId");
  const contextTitle = searchParams.get("contextTitle");

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(
    preselectedCourseId || ""
  );
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeContextType, setActiveContextType] = useState<string | null>(contextType);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [quotaModal, setQuotaModal] = useState<{ show: boolean; reason?: string; creditBalance?: number; creditCost?: number }>({ show: false });

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []));

    const url = preselectedCourseId
      ? `/api/chat?courseId=${preselectedCourseId}`
      : "/api/chat";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []));
  }, [preselectedCourseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSession = async (sessionId: string) => {
    const res = await fetch(`/api/chat?sessionId=${sessionId}`);
    const data = await res.json();
    if (data.session) {
      setActiveSessionId(data.session.id);
      setSelectedCourse(data.session.courseId);
      setActiveContextType(data.session.contextType || null);
      setMessages(
        data.session.messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        }))
      );
    }
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setActiveContextType(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedCourse) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          sessionId: activeSessionId,
          message: userMessage,
          contextType: !activeSessionId ? contextType : undefined,
          contextId: !activeSessionId ? contextId : undefined,
        }),
      });
      if (res.status === 402) {
        const err = await res.json();
        setQuotaModal({ show: true, reason: err.reason, creditBalance: err.creditBalance, creditCost: err.creditCost });
        // Remove the user message we optimistically added
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
        return;
      }
      const data = await res.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }

      if (data.sessionId && !activeSessionId) {
        setActiveSessionId(data.sessionId);
        // Refresh session list
        const sessRes = await fetch("/api/chat");
        const sessData = await sessRes.json();
        setSessions(sessData.sessions || []);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.errorMessage"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          {t("chat.title")}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("chat.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100%-5rem)]">
        {/* Session List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">
            <div className="mb-3">
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  startNewChat();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">{t("chat.selectCourse")}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startNewChat}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1 mb-3"
            >
              <Plus className="w-4 h-4" />
              {t("chat.newConversation")}
            </button>

            <div className="flex-1 overflow-y-auto space-y-1">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors text-sm ${
                    activeSessionId === s.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium text-gray-700 truncate text-xs">
                    {s.contextType && CONTEXT_LABELS[s.contextType] && (() => {
                      const Icon = CONTEXT_LABELS[s.contextType!].icon;
                      return <Icon className="w-3 h-3 inline mr-1 opacity-60" />;
                    })()}
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {s.course?.code} •{" "}
                    {new Date(s.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR")}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Context Banner */}
              {activeContextType && CONTEXT_LABELS[activeContextType] && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm ${CONTEXT_LABELS[activeContextType].color}`}>
                  {(() => { const Icon = CONTEXT_LABELS[activeContextType].icon; return <Icon className="w-4 h-4" />; })()}
                  <span className="font-medium">{t(CONTEXT_LABELS[activeContextType].labelKey)}</span>
                  {contextTitle && <span className="opacity-75">— {contextTitle}</span>}
                </div>
              )}

              {messages.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <Bot className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">
                    {t("chat.welcomeTitle")}
                  </p>
                  <p className="text-sm mt-2 max-w-md mx-auto">
                    {t("chat.welcomeDesc")}
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <MathMarkdown>{msg.content}</MathMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{t("chat.thinking")}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedCourse
                      ? t("chat.inputPlaceholder")
                      : t("chat.inputDisabled")
                  }
                  disabled={!selectedCourse}
                  rows={1}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim() || !selectedCourse}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
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
