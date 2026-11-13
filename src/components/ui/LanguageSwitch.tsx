"use client";

import { useLocale, useTranslations } from "next-intl";

/**
 * Shows the OTHER language in its own script.
 * "English" on /ar, "عربي" on /en. Preserves the current section hash.
 * Saves the choice to localStorage so the / redirect remembers it.
 */
export default function LanguageSwitch({
  sizeClass = "text-small",
  variant = "plain",
}: {
  sizeClass?: string;
  /** "pill" = hairline-outlined control (header, footer); "plain" = text link */
  variant?: "plain" | "pill";
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
      className={`${sizeClass} inline-flex min-h-11 min-w-11 items-center justify-center font-medium text-text-muted transition-colors hover:text-text ${
        variant === "pill"
          ? "rounded-full border border-text/15 px-4 hover:border-text/40 md:min-h-10"
          : ""
      }`}
    >
      {t("label")}
    </a>
  );
}
