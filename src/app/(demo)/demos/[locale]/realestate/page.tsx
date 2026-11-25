import type { Metadata } from "next";
import { BadgeCheck, Clock, Mail, Phone, Sailboat, School, ShoppingBag, TreePalm, type LucideIcon } from "lucide-react";
import DemoBar from "@/components/demo/DemoBar";
import type { DemoLocale } from "@/demos/shared";
import { EMAIL, PHONE, realestateContent } from "@/demos/realestate/content";
import Market from "@/demos/realestate/Market";
import "@/styles/demo-realestate.css";

type Props = { params: Promise<{ locale: DemoLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = realestateContent[locale];
  return { title: t.meta.title, description: t.meta.description };
}

const HOODS: { id: "almouj" | "qurum" | "msq" | "bausher"; icon: LucideIcon }[] = [
  { id: "almouj", icon: Sailboat },
  { id: "qurum", icon: TreePalm },
  { id: "msq", icon: School },
  { id: "bausher", icon: ShoppingBag },
];

function Mark() {
  // Brand mark: a doorway under a roofline. Never mirrored.
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="var(--re-ink)" />
      <path d="M8 16 17 8l9 8" fill="none" stroke="var(--re-gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 15v11h12V15" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M15 26v-5a2 2 0 0 1 4 0v5" fill="var(--re-gold)" />
    </svg>
  );
}

export default async function RealEstatePage({ params }: Props) {
  const { locale } = await params;
  const t = realestateContent[locale];
  const a = t.agent;

  return (
    <>
      <DemoBar locale={locale} slug="realestate" />
      <div className="re">
        <header className="re-header">
          <div className="re-wrap re-header-in">
            <a href="#top" className="re-brand">
              <Mark />
              <span className="re-brand-name font-heading">{t.brand}</span>
            </a>
            <nav aria-label={t.navLabel} className="re-nav">
              <a href="#listings">{t.nav.listings}</a>
              <a href="#areas">{t.nav.areas}</a>
              <a href="#agent">{t.nav.agent}</a>
            </nav>
            <a href="#agent" className="re-btn re-btn-ink re-btn-sm">{t.cta}</a>
          </div>
        </header>

        <main id="top">
          <Market t={t} />

          <section id="areas" className="re-section re-section-sand" aria-labelledby="re-areas-title">
            <div className="re-wrap">
              <div className="re-head">
                <p className="re-eyebrow">{t.hoods.eyebrow}</p>
                <h2 id="re-areas-title" className="re-h2 font-heading">{t.hoods.title}</h2>
              </div>
              <ul className="re-hoods">
                {HOODS.map(({ id, icon: Icon }) => {
                  const h = t.hoods.items[id];
                  return (
                    <li key={id} className="re-hood">
                      <span className="re-hood-icon" aria-hidden="true"><Icon size={20} /></span>
                      <h3 className="re-h3 font-heading">{t.areas[id]}</h3>
                      <p className="re-muted">{h.desc}</p>
                      <p className="re-hood-stat"><bdi className="re-hood-num">{h.stat}</bdi> <span>{h.statLabel}</span></p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section id="agent" className="re-section" aria-labelledby="re-agent-title">
            <div className="re-wrap re-agent">
              <div className="re-agent-text">
                <p className="re-eyebrow">{a.eyebrow}</p>
                <h2 id="re-agent-title" className="re-h2 font-heading">{a.title}</h2>
                <p className="re-lead">{a.sub}</p>
              </div>
              <div className="re-agent-card">
                <div className="re-agent-id">
                  <span className="re-agent-avatar" aria-hidden="true">{a.initials}</span>
                  <div>
                    <p className="re-agent-name font-heading">{a.name} <BadgeCheck size={18} aria-hidden="true" className="re-verified" /></p>
                    <p className="re-muted">{a.role}</p>
                    <p className="re-agent-langs">{a.langs}</p>
                  </div>
                </div>
                <p className="re-agent-meta"><Clock size={16} aria-hidden="true" /> {a.hours}</p>
                <p className="re-agent-meta re-agent-live"><span className="re-dot" aria-hidden="true" /> {a.response}</p>
                <div className="re-agent-actions">
                  <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="re-btn re-btn-ink">
                    <Phone size={18} aria-hidden="true" /> {a.call} <span dir="ltr" className="re-agent-num">{PHONE}</span>
                  </a>
                  <a href={`mailto:${EMAIL}`} className="re-btn re-btn-ghost">
                    <Mail size={18} aria-hidden="true" /> <span dir="ltr">{EMAIL}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="re-footer">
          <div className="re-wrap re-footer-in">
            <div>
              <a href="#top" className="re-brand">
                <Mark />
                <span className="re-brand-name font-heading">{t.brand}</span>
              </a>
              <p className="re-footer-tag">{t.footer.tagline}</p>
            </div>
            <nav aria-label={t.navLabel} className="re-footer-nav">
              <a href="#listings">{t.nav.listings}</a>
              <a href="#areas">{t.nav.areas}</a>
              <a href="#agent">{t.nav.agent}</a>
            </nav>
            <div className="re-footer-contact">
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} dir="ltr">{PHONE}</a>
              <a href={`mailto:${EMAIL}`} dir="ltr">{EMAIL}</a>
            </div>
          </div>
          <div className="re-wrap"><p className="re-rights">{t.footer.rights}</p></div>
        </footer>
      </div>
    </>
  );
}
