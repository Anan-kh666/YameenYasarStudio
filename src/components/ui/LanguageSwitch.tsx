"use client";

import { useLocale, useTranslations } from "next-intl";

/**
 * Shows the OTHER language in its own script.
 * "English" on /ar, "عربي" on /en. Preserves the current section hash.
 * Saves the choice to localStorage so the / redirect remembers it.
 */
export default function LanguageSwitch({
  sizeClass = "text-small",
}: {
  sizeClass?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("languageSwitch");
  const otherLocale = locale === "ar" ? "en" : "ar";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Grab current hash so the user stays on the same section
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    e.currentTarget.href = `/${otherLocale}/${hash}`;

    try {
      localStorage.setItem("yy-locale", otherLocale);
    } catch {
      // Storage unavailable — ignore
    }
  }

  return (
    <a
      href={`/${otherLocale}/`}
      onClick={handleClick}
      /* The label is already in the other language's script, so set its lang */
      lang={otherLocale}
      /* min-h-11/min-w-11: 44px tap target on phones */
      className={`${sizeClass} inline-flex min-h-11 min-w-11 items-center justify-center font-medium text-text-muted hover:text-text transition-colors`}
    >
      {t("label")}
    </a>
  );
}
