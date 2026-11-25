import type { Metadata } from "next";
import { RotateCcw, Truck, CreditCard, Scissors, MapPin, Phone, Clock } from "lucide-react";
import DemoBar from "@/components/demo/DemoBar";
import type { DemoLocale } from "@/demos/shared";
import { content, PRODUCTS, CATEGORIES } from "@/demos/store/content";
import GarmentArt from "@/demos/store/GarmentArt";
import Store from "@/demos/store/Store";
import Newsletter from "@/demos/store/Newsletter";
import "@/styles/demo-store.css";

type Props = { params: Promise<{ locale: DemoLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: content[locale].meta.title, description: content[locale].meta.description };
}

const TRUST_ICONS = [RotateCcw, Truck, CreditCard, Scissors];

export default async function StorePage({ params }: Props) {
  const { locale } = await params;
  const c = content[locale];

  const hero = (
    <section className="lamsa-hero" aria-labelledby="lamsa-hero-title">
      <div className="lamsa-wrap lamsa-hero-grid">
        <div className="lamsa-hero-copy">
          <p className="lamsa-kicker">{c.hero.eyebrow}</p>
          <h1 id="lamsa-hero-title" className="lamsa-display lamsa-h1">{c.hero.title}</h1>
          <p className="lamsa-lead">{c.hero.text}</p>
          <div className="lamsa-hero-ctas">
            <a href="#shop" className="lamsa-btn lamsa-btn-primary">{c.hero.cta}</a>
            <a href="#story" className="lamsa-btn lamsa-btn-ghost">{c.hero.secondary}</a>
          </div>
          <ul className="lamsa-stats">
            {c.hero.stats.map((s) => (
              <li key={s.label}><strong>{s.value}</strong> <span>{s.label}</span></li>
            ))}
          </ul>
        </div>
        <figure className="lamsa-hero-art">
          <div className="lamsa-arch lamsa-arch-back" aria-hidden="true">
            <GarmentArt art="kaftan-belted" color="#c39189" className="lamsa-art" />
          </div>
          <div className="lamsa-arch lamsa-arch-front">
            <GarmentArt art="abaya" color="#1d1b1a" className="lamsa-art" />
          </div>
          <figcaption className="lamsa-hero-caption">
            <span>{c.hero.caption}</span>
            <span className="lamsa-muted">{c.hero.note}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );

  const after = (
    <>
      <section id="trust" className="lamsa-trust" aria-label={c.footer.help}>
        <ul className="lamsa-wrap lamsa-trust-row">
          {c.trust.map((t, i) => {
            const Icon = TRUST_ICONS[i];
            return (
              <li key={t.title}>
                <Icon size={22} strokeWidth={1.5} aria-hidden className="lamsa-trust-icon" />
                <div><h3>{t.title}</h3><p>{t.text}</p></div>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="story" className="lamsa-section lamsa-story" aria-labelledby="lamsa-story-title">
        <div className="lamsa-wrap lamsa-story-grid">
          <div className="lamsa-fabrics" aria-hidden="true">
            {["#1d1b1a", "#c4ab88", "#c39189", "#6f6a4a", "#ece3d3", "#9a6b3f"].map((hex) => (
              <span key={hex} style={{ "--sw": hex } as React.CSSProperties} />
            ))}
          </div>
          <div>
            <p className="lamsa-kicker">{c.story.eyebrow}</p>
            <h2 id="lamsa-story-title" className="lamsa-display lamsa-h2">{c.story.title}</h2>
            <p className="lamsa-lead">{c.story.text}</p>
          </div>
        </div>
      </section>

      <section className="lamsa-news" aria-labelledby="lamsa-news-title">
        <div className="lamsa-wrap lamsa-news-inner">
          <div>
            <h2 id="lamsa-news-title" className="lamsa-display lamsa-h2">{c.newsletter.title}</h2>
            <p>{c.newsletter.text}</p>
          </div>
          <Newsletter c={c.newsletter} />
        </div>
      </section>
    </>
  );

  return (
    <>
      <DemoBar locale={locale} slug="store" />
      <Store c={c} hero={hero} after={after} />
      <footer id="visit" className="lamsa-footer">
        <div className="lamsa-wrap lamsa-footer-grid">
          <div>
            <p className="lamsa-wordmark">{c.brand}</p>
            <p className="lamsa-footer-tag">{c.footer.tagline}</p>
          </div>
          <div>
            <h2 className="lamsa-footer-h">{c.footer.shop}</h2>
            <ul>{CATEGORIES.map((id) => (
              <li key={id}><a href="#shop">{c.shop.categories[id]}</a> <span className="lamsa-footer-n">({PRODUCTS.filter((p) => p.category === id).length})</span></li>
            ))}</ul>
          </div>
          <div>
            <h2 className="lamsa-footer-h">{c.footer.help}</h2>
            <ul>{c.footer.helpItems.map((h) => <li key={h}><a href="#trust">{h}</a></li>)}</ul>
          </div>
          <div>
            <h2 className="lamsa-footer-h">{c.footer.visit}</h2>
            <ul className="lamsa-footer-contact">
              <li><MapPin size={16} aria-hidden /> {c.footer.address}</li>
              <li><Clock size={16} aria-hidden /> {c.footer.hours}</li>
              <li><Phone size={16} aria-hidden /> <a href={`tel:${c.footer.phone.replace(/\s/g, "")}`} dir="ltr">{c.footer.phone}</a></li>
            </ul>
          </div>
        </div>
        <p className="lamsa-wrap lamsa-copy">{c.footer.copyright}</p>
      </footer>
    </>
  );
}
