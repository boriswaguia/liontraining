"use client";

import { useSession } from "next-auth/react";
import { Language, t as translate, TranslationKey } from "@/lib/i18n";

/**
 * Client-side hook for accessing language and translation function.
 * Reads the user's language preference from the NextAuth session.
 */
export function useLanguage() {
  const { data: session } = useSession();
  const userExt = session?.user as Record<string, unknown> | undefined;
  const language = ((userExt?.language as string) || "fr") as Language;

  const t = (key: TranslationKey) => translate(key, language);

  return { language, t };
}
