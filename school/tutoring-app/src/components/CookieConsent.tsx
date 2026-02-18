"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Shield } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem("lionlearn-cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Try to detect language from document or localStorage
    const stored = localStorage.getItem("lionlearn-lang");
    if (stored === "en" || stored === "fr") {
      setLang(stored);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lionlearn-cookie-consent", "accepted");
    localStorage.setItem("lionlearn-cookie-consent-date", new Date().toISOString());
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("lionlearn-cookie-consent", "declined");
    localStorage.setItem("lionlearn-cookie-consent-date", new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  const text = {
    fr: {
      title: "Respect de votre vie privée",
      description:
        "LionLearn utilise des cookies essentiels pour le fonctionnement de la plateforme (authentification, sécurité). Nous n'utilisons aucun cookie de tracking ou publicitaire.",
      essentialLabel: "Cookies essentiels",
      essentialDesc: "Requis pour la connexion et la sécurité (ne peut pas être désactivé)",
      functionalLabel: "Cookies fonctionnels",
      functionalDesc: "Mémorise vos préférences (langue, consentement)",
      accept: "Tout accepter",
      decline: "Essentiels uniquement",
      learnMore: "Politique de cookies",
    },
    en: {
      title: "Your Privacy Matters",
      description:
        "LionLearn uses essential cookies for platform operation (authentication, security). We do not use any tracking or advertising cookies.",
      essentialLabel: "Essential cookies",
      essentialDesc: "Required for login and security (cannot be disabled)",
      functionalLabel: "Functional cookies",
      functionalDesc: "Remembers your preferences (language, consent)",
      accept: "Accept all",
      decline: "Essentials only",
      learnMore: "Cookie policy",
    },
  };

  const t = text[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t.title}</h3>
            </div>
            <button
              onClick={handleDecline}
              className="text-gray-400 hover:text-gray-600 transition p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">{t.description}</p>

          {/* Cookie types */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
              <div>
                <span className="text-sm font-medium text-gray-800">{t.essentialLabel}</span>
                <p className="text-xs text-gray-500">{t.essentialDesc}</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
              <div>
                <span className="text-sm font-medium text-gray-800">{t.functionalLabel}</span>
                <p className="text-xs text-gray-500">{t.functionalDesc}</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition"
            >
              {t.accept}
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition"
            >
              {t.decline}
            </button>
          </div>

          {/* Learn more link */}
          <div className="text-center mt-3">
            <Link href="/terms#cookies" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
              {t.learnMore} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
