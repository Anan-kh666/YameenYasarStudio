"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // check initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper/95 backdrop-blur-sm transition-[border-color] ${
        scrolled ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      {/* Skip to content */}
      <a href="#main" className="skip-to-content">
        {t("header.skipToContent")}
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <a href={`/${locale}/`} className="shrink-0">
          <Logo />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-small font-medium text-ink-muted transition-colors hover:text-yameen"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitch />
          <WhatsAppButton />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <WhatsAppButton compact />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={t("header.menu")}
            className="rounded-xl p-2 text-ink transition-colors hover:bg-yameen-soft"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav
          className="border-t border-line px-4 pb-4 pt-2 md:hidden sm:px-6"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-body font-medium text-ink transition-colors hover:text-yameen"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
          <div className="mt-3 border-t border-line pt-3">
            <LanguageSwitch />
          </div>
        </nav>
      )}
    </header>
  );
}
