import type { Metadata } from "next";
import { Award, BookOpen, Captions, Clock, FileText, GraduationCap, Infinity as InfinityIcon, Languages, Play, ShieldCheck } from "lucide-react";
import DemoBar from "@/components/demo/DemoBar";
import Catalog from "@/demos/academy/Catalog";
import CourseDetail from "@/demos/academy/CourseDetail";
import { content } from "@/demos/academy/content";
import { COURSES, FEATURED_PRICE } from "@/demos/academy/data";
import { Stars, usd } from "@/demos/academy/ui";
import type { DemoLocale } from "@/demos/shared";
import "@/styles/demo-academy.css";

type Props = { params: Promise<{ locale: DemoLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: content[locale].meta.title, description: content[locale].meta.description };
}

const FEATURED = COURSES.findIndex((c) => c.featured);
const INCLUDE_ICONS = [Play, FileText, Languages, Captions, InfinityIcon, Award];

export default async function AcademyDemo({ params }: Props) {
  const { locale } = await params;
  const t = content[locale];
  const course = COURSES[FEATURED];
  const title = t.courses[FEATURED].title;
  const { instructor, reviews, enroll, certificate } = t.course;

  return (
    <>
      <DemoBar locale={locale} slug="academy" />
      <div className="qalam">
        <header className="qalam-header">
          <div className="qalam-wrap qalam-header-row">
            <a href="#top" className="qalam-brand">
              <Mark />
              <span className="font-heading">{t.brand}</span>
            </a>
            <nav aria-label={t.nav.label} className="qalam-nav">
              <a href="#courses">{t.nav.courses}</a>
              <a href="#course">{t.nav.featured}</a>
              <a href="#pricing">{t.nav.pricing}</a>
            </nav>
            <a href="#courses" className="qalam-btn qalam-btn-primary">{t.nav.start}</a>
          </div>
        </header>

        <main id="top">
          <Catalog locale={locale} />

          <section id="course" className="qalam-section qalam-course" aria-labelledby="qalam-course-title">
            <div className="qalam-wrap qalam-course-grid">
              <div className="qalam-course-intro">
                <p className="qalam-eyebrow">{t.course.eyebrow}</p>
                <h2 id="qalam-course-title" className="qalam-h2 font-heading">{title}</h2>
                <p className="qalam-lead">{t.course.summary}</p>
                <ul className="qalam-facts">
                  <li className="qalam-rating">
                    <span className="sr-only">{t.catalog.rating(course.rating)}</span>
                    <b className="qalam-num" aria-hidden="true">{course.rating}</b>
                    <Stars rating={course.rating} />
                    <span className="qalam-muted">{reviews.total}</span>
                  </li>
                  <li><BookOpen size={16} aria-hidden="true" />{t.catalog.lessons(course.lessons)}</li>
                  <li><Clock size={16} aria-hidden="true" />{t.catalog.hours(course.hours)}</li>
                  <li><Languages size={16} aria-hidden="true" />{t.course.language}</li>
                </ul>
                <p className="qalam-muted qalam-small">{t.course.updated}</p>
              </div>

              <aside id="pricing" className="qalam-enroll" aria-labelledby="qalam-enroll-title">
                <h2 id="qalam-enroll-title" className="qalam-h3 font-heading">{enroll.title}</h2>
                <p className="qalam-price-row">
                  <b className="qalam-num qalam-price-now" dir="ltr">{usd(FEATURED_PRICE.now)}</b>
                  <span className="qalam-was">
                    <span className="sr-only">{enroll.was}: </span>
                    <s className="qalam-num" dir="ltr">{usd(FEATURED_PRICE.was)}</s>
                  </span>
                </p>
                <p className="qalam-saving">{enroll.saving}</p>
                <a href="#course-content" className="qalam-btn qalam-btn-primary qalam-btn-block">{enroll.cta}</a>
                <a href="#player" className="qalam-btn qalam-btn-ghost qalam-btn-block">{enroll.trial}</a>
                <h3 className="qalam-small qalam-strong">{enroll.includesTitle}</h3>
                <ul className="qalam-includes">
                  {enroll.includes.map((item, i) => {
                    const Icon = INCLUDE_ICONS[i];
                    return (
                      <li key={item}><Icon size={16} aria-hidden="true" />{item}</li>
                    );
                  })}
                </ul>
                <p className="qalam-guarantee"><ShieldCheck size={16} aria-hidden="true" />{enroll.guarantee}</p>
              </aside>

              <div className="qalam-course-body">
                <CourseDetail locale={locale} />

                <section className="qalam-block" aria-labelledby="qalam-instructor">
                  <h2 id="qalam-instructor" className="qalam-h3 font-heading">{instructor.title}</h2>
                  <div className="qalam-instructor">
                    <Avatar />
                    <div>
                      <p className="qalam-strong font-heading qalam-name">{instructor.name}</p>
                      <p className="qalam-muted qalam-small">{instructor.role}</p>
                    </div>
                  </div>
                  <p className="qalam-body">{instructor.bio}</p>
                  <dl className="qalam-mini-stats">
                    {instructor.stats.map((s) => (
                      <div key={s.label}>
                        <dt>{s.label}</dt>
                        <dd className="qalam-num" dir="ltr">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section className="qalam-block" aria-labelledby="qalam-reviews">
                  <h2 id="qalam-reviews" className="qalam-h3 font-heading">{reviews.title}</h2>
                  <div className="qalam-review-summary">
                    <div className="qalam-average">
                      <b className="qalam-num">{reviews.average}</b>
                      <Stars rating={reviews.average} size={16} />
                      <span className="qalam-muted qalam-small">{reviews.total}</span>
                    </div>
                    <ul className="qalam-dist">
                      {reviews.stars.map((label, i) => (
                        <li key={label}>
                          <span className="qalam-small">{label}</span>
                          <span className="qalam-meter" aria-hidden="true"><span style={{ inlineSize: `${reviews.distribution[i]}%` }} /></span>
                          <span className="qalam-num qalam-small qalam-muted" dir="ltr">{reviews.distribution[i]}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="qalam-reviews">
                    {reviews.items.map((r) => (
                      <li key={r.name}>
                        <figure>
                          <p className="qalam-rating">
                            <span className="sr-only">{t.catalog.rating(r.rating)}</span>
                            <Stars rating={r.rating} />
                          </p>
                          <blockquote>{r.text}</blockquote>
                          <figcaption>
                            <span className="qalam-initial" aria-hidden="true">{r.name.charAt(0)}</span>
                            <span>
                              <b>{r.name}</b>
                              <span className="qalam-muted qalam-small">{r.role}</span>
                            </span>
                          </figcaption>
                        </figure>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </section>

          <section className="qalam-section qalam-cert-section" aria-labelledby="qalam-cert">
            <div className="qalam-wrap qalam-cert-grid">
              <div>
                <p className="qalam-eyebrow"><GraduationCap size={14} aria-hidden="true" />{certificate.heading}</p>
                <h2 id="qalam-cert" className="qalam-h2 font-heading">{certificate.title}</h2>
                <p className="qalam-lead">{certificate.lead}</p>
              </div>
              <figure className="qalam-cert">
                <div className="qalam-cert-top">
                  <Mark />
                  <span className="font-heading">{t.brand}</span>
                </div>
                <p className="qalam-cert-heading font-heading">{certificate.heading}</p>
                <p className="qalam-muted qalam-small">{certificate.awarded}</p>
                <p className="qalam-cert-name font-heading">{certificate.name}</p>
                <p className="qalam-muted qalam-small">{certificate.for}</p>
                <p className="qalam-strong">{title}</p>
                <dl className="qalam-cert-meta">
                  <div><dt>{certificate.issuedLabel}</dt><dd>{certificate.issued}</dd></div>
                  <div><dt>{certificate.idLabel}</dt><dd className="qalam-num" dir="ltr">{certificate.id}</dd></div>
                  <div><dt>{certificate.signerRole}</dt><dd className="qalam-sign">{certificate.signer}</dd></div>
                </dl>
                <span className="qalam-seal" aria-hidden="true"><Award size={26} /></span>
              </figure>
            </div>
          </section>
        </main>

        <footer className="qalam-footer">
          <div className="qalam-wrap qalam-footer-row">
            <div className="qalam-brand">
              <Mark />
              <span className="font-heading">{t.brand}</span>
            </div>
            <p className="qalam-muted">{t.footer.tagline}</p>
            <p className="qalam-muted qalam-small">{t.footer.rights}</p>
          </div>
        </footer>
      </div>
    </>
  );
}

/** Brand mark: a reed pen nib on a violet tile. */
function Mark() {
  return (
    <svg className="qalam-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--qalam-violet)" />
      <path d="M16 6 L23 17 L16 26 L9 17 Z" fill="#fff" />
      <path d="M16 13 V22" stroke="var(--qalam-violet)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="13" r="2" fill="var(--qalam-amber)" />
    </svg>
  );
}

/** Instructor portrait as abstract art (no photo of a real person). */
function Avatar() {
  return (
    <svg className="qalam-avatar" viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <linearGradient id="qalam-av" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1EBFE" />
          <stop offset="1" stopColor="#FEF3C7" />
        </linearGradient>
        <clipPath id="qalam-av-clip"><circle cx="40" cy="40" r="40" /></clipPath>
      </defs>
      <g clipPath="url(#qalam-av-clip)">
        <rect width="80" height="80" fill="url(#qalam-av)" />
        <circle cx="62" cy="16" r="10" fill="var(--qalam-amber)" opacity="0.5" />
        <path d="M14 84 C14 60 26 52 40 52 C54 52 66 60 66 84 Z" fill="var(--qalam-deep)" />
        <path d="M22 44 C20 22 30 14 40 14 C52 14 60 22 58 44 C58 52 54 58 40 58 C26 58 22 52 22 44 Z" fill="var(--qalam-violet)" />
        <ellipse cx="40" cy="38" rx="12" ry="14" fill="#E9C6A6" />
        <path d="M28 34 C30 24 50 24 52 34 C48 28 32 28 28 34 Z" fill="var(--qalam-violet)" />
      </g>
    </svg>
  );
}
