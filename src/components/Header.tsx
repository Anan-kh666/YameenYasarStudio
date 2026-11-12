"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const NAV_ITEMS = ["packages", "work", "about", "contact"] as const;

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      // The menu's links unmount with it, so put focus back on the toggle
      // instead of letting it fall to <body>.
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-bg/95 backdrop-blur-sm transition-[border-color] ${
        scrolled ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <a href="#main" className="skip-to-content">
        {t("header.skipToContent")}
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href={`/${locale}/`} className="inline-flex min-h-11 shrink-0 items-center">
          <Logo sizeClass="h-9" />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-[0.9375rem] font-medium text-text-muted transition-colors hover:text-crimson-bright"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitch sizeClass="text-[0.9375rem]" />
          <WhatsAppButton />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch sizeClass="text-[0.9375rem]" />
          <WhatsAppButton compact />
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t("header.menu")}
            /* p-2.5 + 24px icon = 44px tap target */
            className="rounded-xl p-2.5 text-text transition-colors hover:bg-surface"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-line px-4 pb-4 pt-2 md:hidden sm:px-6"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-body font-medium text-text transition-colors hover:text-crimson-bright"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
