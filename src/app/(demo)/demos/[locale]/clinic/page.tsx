import type { Metadata } from "next";
import { CalendarDays, ChevronDown, Clock, Mail, MapPin, Phone, ShieldCheck, Star, Stethoscope, CircleParking } from "lucide-react";
import DemoBar from "@/components/demo/DemoBar";
import type { DemoLocale } from "@/demos/shared";
import { clinicContent, DOCTORS, EMAIL, PHONE, SERVICE_IDS } from "@/demos/clinic/content";
import { DoctorAvatar, SERVICE_ICONS } from "@/demos/clinic/art";
import BookingWizard from "@/demos/clinic/BookingWizard";
import "@/styles/demo-clinic.css";

type Props = { params: Promise<{ locale: DemoLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = clinicContent[locale];
  return { title: t.meta.title, description: t.meta.description };
}

function Mark() {
  // Brand mark: a smile arc inside a rounded square. Never mirrored.
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="var(--c-primary)" />
      <path d="M10 15c0 0 2 9 8 9s8-9 8-9" fill="none" stroke="var(--c-mint)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="11" r="2" fill="#fff" />
    </svg>
  );
}

export default async function ClinicPage({ params }: Props) {
  const { locale } = await params;
  const t = clinicContent[locale];
  const navIds = ["services", "booking", "doctors", "reviews", "faq", "visit"] as const;

  return (
    <>
      <DemoBar locale={locale} slug="clinic" />
      <div className="clinic">
        <header className="clinic-header">
          <div className="clinic-wrap clinic-header-in">
            <a href="#top" className="clinic-brand">
              <Mark />
              <span>
                <span className="clinic-brand-name font-heading">{t.brand}</span>
                <span className="clinic-brand-sub">{t.brandSub}</span>
              </span>
            </a>
            <nav aria-label={t.navLabel} className="clinic-nav">
              {navIds.map((id) => <a key={id} href={`#${id}`}>{t.nav[id]}</a>)}
            </nav>
            <a href="#booking" className="clinic-btn clinic-btn-primary clinic-btn-sm">
              <CalendarDays size={16} aria-hidden="true" /> {t.cta}
            </a>
          </div>
        </header>

        <main id="top">
          {/* Hero */}
          <section className="clinic-hero">
            <div className="clinic-wrap clinic-hero-grid">
              <div className="clinic-hero-text">
                <p className="clinic-pill"><span className="clinic-live" aria-hidden="true" /> {t.hero.eyebrow}</p>
                <h1 className="font-heading">{t.hero.title}</h1>
                <p className="clinic-lead">{t.hero.sub}</p>
                <div className="clinic-cta-row">
                  <a href="#booking" className="clinic-btn clinic-btn-primary">{t.hero.primary}</a>
                  <a href="#services" className="clinic-btn clinic-btn-ghost">{t.hero.secondary}</a>
                </div>
                <dl className="clinic-trust">
                  {t.hero.trust.map((s) => (
                    <div key={s.label}><dt>{s.label}</dt><dd dir="ltr">{s.value}</dd></div>
                  ))}
                </dl>
              </div>

              <div className="clinic-hero-art">
                <div className="clinic-hero-visual" aria-hidden="true">
                  <svg viewBox="0 0 400 420" className="clinic-hero-svg">
                    <defs>
                      <linearGradient id="clinic-hg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#0f766e" />
                        <stop offset="1" stopColor="#134e4a" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="420" rx="28" fill="url(#clinic-hg)" />
                    <circle cx="320" cy="80" r="120" fill="#5eead4" opacity="0.14" />
                    <circle cx="60" cy="380" r="140" fill="#99f6e4" opacity="0.1" />
                    {/* Stylised tooth */}
                    <path d="M200 110c-30-22-82-16-90 34-6 38 14 66 22 104 6 30 10 66 30 66 18 0 18-46 38-46s20 46 38 46c20 0 24-36 30-66 8-38 28-66 22-104-8-50-60-56-90-34z"
                      fill="#f0fdfa" opacity="0.95" />
                    <path d="M150 150c10-14 28-18 40-12" stroke="#5eead4" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <g fill="#ccfbf1">
                      <path d="M300 170l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" />
                      <path d="M96 270l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" opacity="0.8" />
                    </g>
                  </svg>
                </div>

                <div className="clinic-slot-card">
                  <p className="clinic-slot-label"><span className="clinic-live" aria-hidden="true" /> {t.hero.slot.label}</p>
                  <p className="clinic-slot-when font-heading"><Clock size={18} aria-hidden="true" /> {t.hero.slot.when}</p>
                  <div className="clinic-slot-doc">
                    <DoctorAvatar hue={150} initials={t.doctors.items.lama.initials} size={40} />
                    <span>
                      <span className="clinic-slot-doc-name">{t.hero.slot.doctor}</span>
                      <span className="clinic-slot-doc-role">{t.hero.slot.role}</span>
                    </span>
                  </div>
                  <a href="#booking" className="clinic-btn clinic-btn-primary clinic-btn-block clinic-btn-sm">{t.hero.slot.action}</a>
                </div>

                <div className="clinic-badge-card">
                  <ShieldCheck size={20} aria-hidden="true" />
                  <span><strong>{t.hero.badge}</strong><span>{t.hero.badgeNote}</span></span>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section id="services" className="clinic-section">
            <div className="clinic-wrap">
              <div className="clinic-head">
                <p className="clinic-eyebrow">{t.services.eyebrow}</p>
                <h2 className="font-heading">{t.services.title}</h2>
                <p>{t.services.sub}</p>
              </div>
              <ul className="clinic-services">
                {SERVICE_IDS.map((id) => {
                  const s = t.services.items[id];
                  const Icon = SERVICE_ICONS[id];
                  return (
                    <li key={id} className="clinic-card clinic-service">
                      <span className="clinic-icon" aria-hidden="true"><Icon size={22} /></span>
                      <h3 className="font-heading">{s.name}</h3>
                      <p>{s.desc}</p>
                      <div className="clinic-service-foot">
                        <span className="clinic-price">{s.price}</span>
                        <span className="clinic-duration"><Clock size={14} aria-hidden="true" /> {s.duration}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Booking */}
          <section id="booking" className="clinic-section clinic-section-tint">
            <div className="clinic-wrap clinic-booking-grid">
              <div className="clinic-head clinic-head-side">
                <p className="clinic-eyebrow">{t.booking.eyebrow}</p>
                <h2 className="font-heading">{t.booking.title}</h2>
                <p>{t.booking.sub}</p>
                <ul className="clinic-ticks">
                  {t.visit.hours.map((h) => (
                    <li key={h.day}><Clock size={16} aria-hidden="true" /> <span>{h.day}</span> <strong>{h.time}</strong></li>
                  ))}
                </ul>
              </div>
              <BookingWizard t={t} />
            </div>
          </section>

          {/* Doctors */}
          <section id="doctors" className="clinic-section">
            <div className="clinic-wrap">
              <div className="clinic-head">
                <p className="clinic-eyebrow">{t.doctors.eyebrow}</p>
                <h2 className="font-heading">{t.doctors.title}</h2>
                <p>{t.doctors.sub}</p>
              </div>
              <ul className="clinic-doctors">
                {DOCTORS.map((d) => {
                  const doc = t.doctors.items[d.id];
                  return (
                    <li key={d.id} className="clinic-card clinic-doctor">
                      <div className="clinic-doctor-art">
                        <DoctorAvatar hue={d.hue} initials={doc.initials} size={96} />
                      </div>
                      <h3 className="font-heading">{doc.name}</h3>
                      <p className="clinic-doctor-role"><Stethoscope size={15} aria-hidden="true" /> {doc.role}</p>
                      <p className="clinic-doctor-meta">{doc.years}</p>
                      <p className="clinic-doctor-meta">{doc.langs}</p>
                    </li>
                  );
                })}
              </ul>

              <div className="clinic-insurance">
                <div>
                  <h3 className="font-heading">{t.insurance.title}</h3>
                  <p>{t.insurance.sub}</p>
                </div>
                <ul className="clinic-chips">
                  {t.insurance.items.map((i) => <li key={i} className="clinic-chip">{i}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section id="reviews" className="clinic-section clinic-section-tint">
            <div className="clinic-wrap">
              <div className="clinic-head">
                <p className="clinic-eyebrow">{t.reviews.eyebrow}</p>
                <h2 className="font-heading">{t.reviews.title}</h2>
                <p className="clinic-rating">
                  <span className="clinic-stars" role="img" aria-label={t.reviews.starsLabel}>
                    {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={18} aria-hidden="true" />)}
                  </span>
                  {t.reviews.rating}
                </p>
              </div>
              <ul className="clinic-reviews">
                {t.reviews.items.map((r) => (
                  <li key={r.name} className="clinic-card clinic-review">
                    <span className="clinic-stars" role="img" aria-label={t.reviews.starsLabel}>
                      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} aria-hidden="true" />)}
                    </span>
                    <blockquote>{r.quote}</blockquote>
                    <p className="clinic-review-by"><strong>{r.name}</strong> · {r.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="clinic-section">
            <div className="clinic-wrap clinic-faq-grid">
              <div className="clinic-head clinic-head-side">
                <p className="clinic-eyebrow">{t.faq.eyebrow}</p>
                <h2 className="font-heading">{t.faq.title}</h2>
              </div>
              <div className="clinic-faq">
                {t.faq.items.map((f) => (
                  <details key={f.q} className="clinic-details">
                    <summary>{f.q}<ChevronDown size={18} aria-hidden="true" /></summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Visit */}
          <section id="visit" className="clinic-section clinic-section-tint">
            <div className="clinic-wrap">
              <div className="clinic-head">
                <p className="clinic-eyebrow">{t.visit.eyebrow}</p>
                <h2 className="font-heading">{t.visit.title}</h2>
              </div>
              <div className="clinic-visit">
                <div className="clinic-card clinic-visit-info">
                  <p className="clinic-visit-row"><MapPin size={18} aria-hidden="true" /> {t.visit.address}</p>
                  <h3 className="font-heading">{t.visit.hoursTitle}</h3>
                  <dl className="clinic-hours">
                    {t.visit.hours.map((h) => <div key={h.day}><dt>{h.day}</dt><dd>{h.time}</dd></div>)}
                  </dl>
                  <h3 className="font-heading">{t.visit.contactTitle}</h3>
                  <p className="clinic-visit-row"><Phone size={18} aria-hidden="true" /> <a href={`tel:${PHONE.replace(/\s/g, "")}`} dir="ltr">{PHONE}</a></p>
                  <p className="clinic-visit-row"><Mail size={18} aria-hidden="true" /> <a href={`mailto:${EMAIL}`} dir="ltr">{EMAIL}</a></p>
                  <p className="clinic-visit-row clinic-muted"><CircleParking size={18} aria-hidden="true" /> {t.visit.parking}</p>
                </div>
                {/* Stylised map (SVG, no third-party embed). Geography never mirrors. */}
                <figure className="clinic-map" role="img" aria-label={t.visit.mapLabel}>
                  <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <rect width="600" height="420" fill="#eef7f5" />
                    <g fill="#dcefea">
                      <rect x="30" y="30" width="150" height="110" rx="10" /><rect x="220" y="30" width="120" height="110" rx="10" />
                      <rect x="400" y="30" width="170" height="110" rx="10" /><rect x="30" y="190" width="150" height="90" rx="10" />
                      <rect x="400" y="190" width="170" height="90" rx="10" /><rect x="30" y="330" width="150" height="70" rx="10" />
                      <rect x="220" y="330" width="120" height="70" rx="10" />
                    </g>
                    <rect x="400" y="330" width="170" height="70" rx="10" fill="#cfe9d8" />
                    <rect x="220" y="190" width="120" height="90" rx="10" fill="#c7ebe2" />
                    <path d="M-10 165 L610 165" stroke="#fff" strokeWidth="26" />
                    <path d="M-10 165 L610 165" stroke="#a7d8cd" strokeWidth="2" strokeDasharray="10 10" />
                    <path d="M370 -10 L370 430" stroke="#fff" strokeWidth="20" />
                    <path d="M200 -10 L200 430" stroke="#fff" strokeWidth="12" />
                    <path d="M-10 305 L610 305" stroke="#fff" strokeWidth="12" />
                    <text x="40" y="158" fontSize="13" fill="#4b6f69">{t.visit.mapRoad}</text>
                    <text x="364" y="120" fontSize="13" fill="#4b6f69" transform="rotate(-90 364 120)">{t.visit.mapRoad2}</text>
                    <circle cx="280" cy="232" r="46" fill="#0f766e" opacity="0.12" />
                    <path d="M280 250c-16-18-24-30-24-42a24 24 0 0 1 48 0c0 12-8 24-24 42z" fill="#0f766e" />
                    <circle cx="280" cy="208" r="8" fill="#fff" />
                    <rect x="235" y="258" width="90" height="26" rx="13" fill="#fff" />
                    <text x="280" y="276" fontSize="13" fontWeight="700" textAnchor="middle" fill="#0f766e">{t.visit.mapPin}</text>
                  </svg>
                </figure>
              </div>
            </div>
          </section>
        </main>

        <footer className="clinic-footer">
          <div className="clinic-wrap clinic-footer-in">
            <div className="clinic-brand">
              <Mark />
              <span>
                <span className="clinic-brand-name font-heading">{t.brand}</span>
                <span className="clinic-brand-sub">{t.footer.tagline}</span>
              </span>
            </div>
            <nav aria-label={t.navLabel} className="clinic-footer-nav">
              {navIds.map((id) => <a key={id} href={`#${id}`}>{t.nav[id]}</a>)}
            </nav>
            <p className="clinic-footer-rights">{t.footer.rights}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
