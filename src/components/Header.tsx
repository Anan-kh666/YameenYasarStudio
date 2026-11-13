"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import Logo from "@/components/ui/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const NAV_ITEMS = ["packages", "work", "about", "contact"] as const;
type NavItem = (typeof NAV_ITEMS)[number];

/* Every section id in page order. The active nav link is the last section
   whose top has passed under the header, but only if it is in the nav: while
   reading Process or FAQ nothing is highlighted rather than the wrong link. */
const SECTION_IDS = ["hero", "problem", "packages", "work", "process", "about", "faq", "contact"];

function findActive(): NavItem | null {
  // At the very bottom the short Contact section may never reach the line
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) return "contact";
  const line = window.innerHeight * 0.35;
  let current: string | null = null;
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }
  return (NAV_ITEMS as readonly string[]).includes(current ?? "") ? (current as NavItem) : null;
}

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<NavItem | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      setActive(findActive());
    };
    // One measurement per frame at most, however fast the scroll events come
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
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

  // Solid at the top (it sits on the hero's black edge); once the page moves,
  // or the menu is open, it turns translucent with blur and a hairline below.
  const raised = scrolled || menuOpen;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        raised
          ? "border-line/80 bg-bg/95 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md backdrop-saturate-150"
          : "border-transparent bg-bg"
      }`}
    >
      <a href="#main" className="skip-to-content">
        {t("header.skipToContent")}
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 md:h-[4.25rem]">
        <a href={`/${locale}/`} className="inline-flex min-h-11 shrink-0 items-center">
          <Logo sizeClass="h-8 md:h-9" />
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              aria-current={active === item ? "location" : undefined}
              className="nav-link text-[0.9375rem] font-medium"
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitch variant="pill" sizeClass="text-[0.875rem]" />
          <WhatsAppButton size="sm" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch variant="pill" sizeClass="text-[0.875rem]" />
          <WhatsAppButton compact />
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t("header.menu")}
            /* p-2.5 + 24px icon = 44px tap target */
            className={`rounded-xl border p-2.5 text-text transition-colors ${
              menuOpen ? "border-line bg-surface" : "border-transparent hover:bg-surface"
            }`}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-line px-4 pb-6 sm:px-6 md:hidden"
          aria-label="Mobile"
        >
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item} className="border-b border-line/70">
                <a
                  href={`#${item}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === item ? "location" : undefined}
                  className={`flex min-h-14 items-center justify-between font-heading text-[1.5rem] font-semibold transition-colors hover:text-crimson-bright ${
                    active === item ? "text-text" : "text-text/85"
                  }`}
                >
                  {t(`nav.${item}`)}
                  {/* Small crimson mark at the end of the row for the section on screen */}
                  {active === item && (
                    <span className="size-1.5 rounded-full bg-crimson-bright" aria-hidden="true" />
                  )}
                </a>
              </li>
            ))}
          </ul>
          <WhatsAppButton className="mt-6 w-full" />
          <a
            href={`mailto:${site.email}`}
            dir="ltr"
            className="mt-2 flex min-h-11 items-center justify-center text-small text-text-muted transition-colors hover:text-text"
          >
            {site.email}
          </a>
        </nav>
      )}
    </header>
  );
}
