"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Award, BookOpen, Clock, Search, X } from "lucide-react";
import type { DemoLocale } from "@/demos/shared";
import { content } from "./content";
import { CATEGORIES, COURSES, LEVELS, type Category, type Level } from "./data";
import { CourseCover, Stars, usd } from "./ui";

/* Hero + catalog in one client component, so the hero search box filters the
   catalog right below it. Search matches title, instructor, level and field
   in the current language, with Arabic letter variants folded together. */

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "") // tashkeel and tatweel
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();

export default function Catalog({ locale }: { locale: DemoLocale }) {
  const t = content[locale];
  const c = t.catalog;
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<Level | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");

  const results = useMemo(() => {
    const q = norm(query);
    return COURSES.map((course, i) => ({ course, copy: t.courses[i] })).filter(({ course, copy }) => {
      if (level !== "all" && course.level !== level) return false;
      if (category !== "all" && course.category !== category) return false;
      if (!q) return true;
      const hay = norm([copy.title, copy.instructor, c.levels[course.level], c.categories[course.category]].join(" "));
      return q.split(/\s+/).every((word) => hay.includes(word));
    });
  }, [query, level, category, t, c]);

  const filtered = query !== "" || level !== "all" || category !== "all";
  const clear = () => {
    setQuery("");
    setLevel("all");
    setCategory("all");
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    document.getElementById("courses")?.scrollIntoView({ block: "start" });
  }

  return (
    <>
      <section className="qalam-hero" aria-labelledby="qalam-title">
        <div className="qalam-wrap qalam-hero-grid">
          <div>
            <p className="qalam-eyebrow">{t.hero.eyebrow}</p>
            <h1 id="qalam-title" className="qalam-h1 font-heading">{t.hero.title}</h1>
            <p className="qalam-lead">{t.hero.lead}</p>
            <form role="search" className="qalam-search" onSubmit={onSubmit}>
              <label htmlFor="qalam-q" className="sr-only">{t.hero.searchLabel}</label>
              <Search size={18} aria-hidden="true" className="qalam-search-icon" />
              <input
                id="qalam-q"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.hero.placeholder}
                autoComplete="off"
                maxLength={60}
              />
              <button type="submit" className="qalam-btn qalam-btn-primary">{t.hero.submit}</button>
            </form>
            <div className="qalam-popular">
              <span>{t.hero.popular}</span>
              {t.hero.popularTerms.map((term) => (
                <button key={term} type="button" className="qalam-chip" onClick={() => setQuery(term)} aria-pressed={query === term}>
                  {term}
                </button>
              ))}
            </div>
            <dl className="qalam-stats">
              {t.hero.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd className="qalam-num" dir="ltr">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroArt locale={locale} />
        </div>
      </section>

      <section id="courses" className="qalam-section" aria-labelledby="qalam-courses">
        <div className="qalam-wrap">
          <div className="qalam-head">
            <h2 id="qalam-courses" className="qalam-h2 font-heading">{c.title}</h2>
            <p className="qalam-muted">{c.lead}</p>
          </div>

          <div className="qalam-filters">
            <div role="group" aria-label={c.levelLabel} className="qalam-seg">
              {(["all", ...LEVELS] as const).map((l) => (
                <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)}>
                  {l === "all" ? c.all : c.levels[l]}
                </button>
              ))}
            </div>
            <div role="group" aria-label={c.categoryLabel} className="qalam-chips">
              {(["all", ...CATEGORIES] as const).map((k) => (
                <button key={k} type="button" className="qalam-chip" aria-pressed={category === k} onClick={() => setCategory(k)}>
                  {k === "all" ? c.all : c.categories[k]}
                </button>
              ))}
            </div>
          </div>

          <div className="qalam-count">
            <p aria-live="polite">{c.count(results.length)}</p>
            {filtered && (
              <button type="button" className="qalam-link" onClick={clear}>
                <X size={14} aria-hidden="true" />
                {c.clear}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <p className="qalam-empty">{c.empty}</p>
          ) : (
            <ul className="qalam-grid">
              {results.map(({ course, copy }) => (
                <li key={course.id}>
                  <article className={`qalam-card${course.featured ? " is-featured" : ""}`}>
                    <CourseCover cover={course.cover} hue={course.hue} />
                    <div className="qalam-card-body">
                      <div className="qalam-tags">
                        <span className="qalam-tag">{c.categories[course.category]}</span>
                        <span className="qalam-tag qalam-tag-soft">{c.levels[course.level]}</span>
                        {course.featured && <span className="qalam-tag qalam-tag-amber">{c.featured}</span>}
                      </div>
                      <h3 className="qalam-card-title font-heading">{copy.title}</h3>
                      <p className="qalam-muted qalam-small">{copy.instructor}</p>
                      <p className="qalam-meta qalam-small">
                        <span><BookOpen size={14} aria-hidden="true" />{c.lessons(course.lessons)}</span>
                        <span><Clock size={14} aria-hidden="true" />{c.hours(course.hours)}</span>
                      </p>
                      <div className="qalam-card-foot">
                        <p className="qalam-rating">
                          <span className="sr-only">{c.rating(course.rating)}</span>
                          <b className="qalam-num" aria-hidden="true">{course.rating}</b>
                          <Stars rating={course.rating} />
                          <span className="qalam-muted qalam-num" dir="ltr">{c.reviews(course.reviews.toLocaleString("en-US"))}</span>
                        </p>
                        <p className={`qalam-price${course.price === 0 ? " is-free" : ""}`}>
                          {course.price === 0 ? c.free : <span className="qalam-num" dir="ltr">{usd(course.price)}</span>}
                        </p>
                      </div>
                      {course.featured && (
                        <a href="#course" className="qalam-btn qalam-btn-soft qalam-card-cta">{c.view}</a>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

/** Decorative product glimpse next to the hero copy. */
function HeroArt({ locale }: { locale: DemoLocale }) {
  const a = content[locale].hero.art;
  return (
    <div className="qalam-hero-art" aria-hidden="true">
      <div className="qalam-art-card">
        <div className="qalam-art-screen">
          <span className="qalam-art-play" />
          <span className="qalam-art-bar"><span style={{ inlineSize: "64%" }} /></span>
        </div>
        <p className="qalam-art-title font-heading">{a.course}</p>
        <div className="qalam-art-row">
          <span className="qalam-muted qalam-small">{a.progress}</span>
          <b className="qalam-num" dir="ltr">29%</b>
        </div>
        <span className="qalam-meter"><span style={{ inlineSize: "29%" }} /></span>
        <div className="qalam-art-next">
          <span className="qalam-muted qalam-small">{a.next}</span>
          <span>{a.nextLesson}</span>
        </div>
      </div>
      <div className="qalam-art-badge">
        <Award size={18} />
        {a.badge}
      </div>
    </div>
  );
}
