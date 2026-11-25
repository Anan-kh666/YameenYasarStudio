import type { Metadata } from "next";
import { Clock, MapPin, Phone, Car, Navigation, AtSign } from "lucide-react";
import DemoBar from "@/components/demo/DemoBar";
import type { DemoLocale } from "@/demos/shared";
import { content, SPECIALS, fill, jod } from "@/demos/restaurant/content";
import { HeroArt, PlateArt, MapArt } from "@/demos/restaurant/Art";
import Menu from "@/demos/restaurant/Menu";
import Reservation from "@/demos/restaurant/Reservation";
import "@/styles/demo-restaurant.css";

type Props = { params: Promise<{ locale: DemoLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: content[locale].meta.title, description: content[locale].meta.description };
}

export default async function RestaurantPage({ params }: Props) {
  const { locale } = await params;
  const c = content[locale];
  const tel = `tel:${c.visit.phone.replace(/\s/g, "")}`;

  return (
    <>
      <DemoBar locale={locale} slug="restaurant" />
      <div className="sumac">
        <header className="sumac-header">
          <div className="sumac-wrap sumac-header-inner">
            <a href="#top" className="sumac-wordmark">{c.brand}</a>
            <nav aria-label={c.nav.label} className="sumac-nav">
              <a href="#menu">{c.nav.menu}</a>
              <a href="#specials">{c.nav.specials}</a>
              <a href="#visit">{c.nav.visit}</a>
            </nav>
            <a href="#reserve" className="sumac-btn sumac-btn-primary sumac-btn-sm">{c.book}</a>
          </div>
        </header>

        <main id="top">
          <section className="sumac-hero" aria-labelledby="sumac-hero-title">
            <div className="sumac-wrap sumac-hero-grid">
              <div className="sumac-hero-copy">
                <p className="sumac-eyebrow">{c.hero.eyebrow}</p>
                <h1 id="sumac-hero-title" className="sumac-h1">{c.hero.title}</h1>
                <p className="sumac-lead">{c.hero.text}</p>
                <div className="sumac-ctas">
                  <a href="#reserve" className="sumac-btn sumac-btn-primary">{c.hero.cta}</a>
                  <a href="#menu" className="sumac-btn sumac-btn-ghost">{c.hero.secondary}</a>
                </div>
                <ul className="sumac-facts">
                  {c.hero.facts.map((f) => <li key={f.label}><strong>{f.value}</strong><span>{f.label}</span></li>)}
                </ul>
              </div>
              <div className="sumac-hero-art"><HeroArt /></div>
            </div>
          </section>

          <section id="menu" className="sumac-section" aria-labelledby="sumac-menu-title">
            <div className="sumac-wrap">
              <div className="sumac-head">
                <p className="sumac-eyebrow">{c.menu.eyebrow}</p>
                <h2 id="sumac-menu-title" className="sumac-h2">{c.menu.title}</h2>
                <p className="sumac-lead">{c.menu.intro}</p>
              </div>
              <Menu c={c.menu} dishes={c.dishes} />
              <p className="sumac-note">{c.menu.note}</p>
            </div>
          </section>

          <section id="specials" className="sumac-section sumac-specials" aria-labelledby="sumac-specials-title">
            <div className="sumac-wrap">
              <div className="sumac-head">
                <p className="sumac-eyebrow">{c.specials.eyebrow}</p>
                <h2 id="sumac-specials-title" className="sumac-h2">{c.specials.title}</h2>
              </div>
              <ul className="sumac-special-grid">
                {SPECIALS.map((s) => {
                  const it = c.specials.items[s.id];
                  return (
                    <li key={s.id} className="sumac-special">
                      <PlateArt variant={s.id} />
                      <p className="sumac-special-tag">{it.tag}</p>
                      <h3>{it.name}</h3>
                      <p>{it.desc}</p>
                      <p className="sumac-price">{fill(c.menu.price, { n: jod(s.price) })}</p>
                    </li>
                  );
                })}
              </ul>
              <figure className="sumac-quote">
                <blockquote><p>{c.specials.quote}</p></blockquote>
                <figcaption>{c.specials.chef}</figcaption>
              </figure>
            </div>
          </section>

          <section id="reserve" className="sumac-section" aria-labelledby="sumac-reserve-title">
            <div className="sumac-wrap sumac-reserve-grid">
              <div className="sumac-head">
                <p className="sumac-eyebrow">{c.reserve.eyebrow}</p>
                <h2 id="sumac-reserve-title" className="sumac-h2">{c.reserve.title}</h2>
                <p className="sumac-lead">{c.reserve.text}</p>
                <p className="sumac-call">
                  <Phone size={18} aria-hidden /> <a href={tel} dir="ltr">{c.visit.phone}</a>
                </p>
              </div>
              <div className="sumac-card">
                <Reservation c={c.reserve} locale={locale} />
              </div>
            </div>
          </section>

          <section id="visit" className="sumac-section sumac-visit" aria-labelledby="sumac-visit-title">
            <div className="sumac-wrap">
              <div className="sumac-head">
                <p className="sumac-eyebrow">{c.visit.eyebrow}</p>
                <h2 id="sumac-visit-title" className="sumac-h2">{c.visit.title}</h2>
              </div>
              <div className="sumac-visit-grid">
                <div className="sumac-card">
                  <h3 className="sumac-card-h"><Clock size={20} aria-hidden /> {c.visit.hoursTitle}</h3>
                  <table className="sumac-hours">
                    <tbody>
                      {c.visit.hours.map((h) => (
                        <tr key={h.days}><th scope="row">{h.days}</th><td dir="ltr">{h.time}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="sumac-muted">{c.visit.kitchen}</p>
                </div>
                <div className="sumac-card sumac-location">
                  <MapArt c={c.visit.map} />
                  <div className="sumac-location-body">
                    <h3 className="sumac-card-h"><MapPin size={20} aria-hidden /> {c.visit.address}</h3>
                    <ul className="sumac-list">
                      <li><Navigation size={16} aria-hidden /> {c.visit.landmark}</li>
                      <li><Car size={16} aria-hidden /> {c.visit.parking}</li>
                    </ul>
                    <a href={tel} className="sumac-btn sumac-btn-ghost">
                      <Phone size={16} aria-hidden /> {c.visit.call} <span dir="ltr">{c.visit.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="sumac-footer">
          <div className="sumac-wrap sumac-footer-inner">
            <div>
              <p className="sumac-wordmark">{c.brand}</p>
              <p className="sumac-muted">{c.footer.tagline}</p>
            </div>
            <ul className="sumac-list">
              <li><MapPin size={16} aria-hidden /> {c.visit.address}</li>
              <li><Phone size={16} aria-hidden /> <a href={tel} dir="ltr">{c.visit.phone}</a></li>
              <li><AtSign size={16} aria-hidden /> <span dir="ltr">{c.footer.instagram}</span></li>
            </ul>
          </div>
          <p className="sumac-wrap sumac-copy">{c.footer.copyright}</p>
        </footer>
      </div>
    </>
  );
}
