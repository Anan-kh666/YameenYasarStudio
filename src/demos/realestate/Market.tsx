"use client";

import { useEffect, useRef, useState } from "react";
import {
  AirVent, Bath, BedDouble, Calculator, Dumbbell, Heart, MapPin, Ruler, Search, Shield, Sofa, SquareParking, Trees,
  WavesHorizontal, WavesLadder, X, type LucideIcon,
} from "lucide-react";
import {
  AREA_IDS, BEDS, LISTINGS, MAX_PRICES, TYPE_IDS,
  type AmenityId, type AreaId, type Deal, type Listing, type ListingId, type PropertyType, type RealEstateContent,
} from "./content";
import { ListingArt } from "./art";

const AMENITY_ICONS: Record<AmenityId, LucideIcon> = {
  pool: WavesLadder, gym: Dumbbell, parking: SquareParking, garden: Trees, security: Shield, ac: AirVent, furnished: Sofa, seaview: WavesHorizontal,
};
const FEATURED: ListingId = "msq-villa";
type Sort = "recommended" | "priceAsc" | "priceDesc";
type Counted = { one: string; two: string; few: string };

// Western digits with thousands separators in both locales.
const num = (n: number) => n.toLocaleString("en-US");
const counted = (c: Counted, n: number) => (n === 1 ? c.one : n === 2 ? c.two : c.few.replace("{n}", String(n)));

/* Standard annuity formula: monthly payment for a loan `principal` at
   `yearlyRate` % over `years`. Zero rate falls back to a straight split. */
export function monthlyPayment(principal: number, yearlyRate: number, years: number) {
  const n = years * 12;
  const r = yearlyRate / 100 / 12;
  if (principal <= 0 || n <= 0) return 0;
  return r === 0 ? principal / n : (principal * r) / (1 - (1 + r) ** -n);
}

export default function Market({ t }: { t: RealEstateContent }) {
  const L = t.listings;
  const [deal, setDeal] = useState<Deal>("buy");
  const [area, setArea] = useState<AreaId | "any">("any");
  const [type, setType] = useState<PropertyType | "any">("any");
  const [beds, setBeds] = useState(0);
  const [max, setMax] = useState(0);
  const [sort, setSort] = useState<Sort>("recommended");
  const [saved, setSaved] = useState<ListingId[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [openId, setOpenId] = useState<ListingId | null>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const skipRefocus = useRef(false);

  const money = (n: number) => L.currency.replace("{n}", num(n));

  function changeDeal(d: Deal) {
    setDeal(d);
    setMax(0); // budgets for buying and renting live on different scales
  }
  function reset() {
    setArea("any");
    setType("any");
    setBeds(0);
    setMax(0);
    setSavedOnly(false);
  }
  function toggleSaved(id: ListingId) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function openListing(id: ListingId, el: HTMLElement) {
    triggerRef.current = el;
    setOpenId(id);
  }

  // Open the native modal once its content is rendered. showModal() gives us
  // the focus trap, Escape to close and the inert background for free.
  useEffect(() => {
    const d = dialogRef.current;
    if (openId && d && !d.open) d.showModal();
  }, [openId]);

  function onDialogClose() {
    setOpenId(null);
    if (!skipRefocus.current) triggerRef.current?.focus();
    skipRefocus.current = false;
  }

  const results = LISTINGS.filter(
    (l) =>
      l.deal === deal &&
      (area === "any" || l.area === area) &&
      (type === "any" || l.type === type) &&
      l.beds >= beds &&
      (max === 0 || l.price <= max) &&
      (!savedOnly || saved.includes(l.id)),
  );
  if (sort !== "recommended") results.sort((a, b) => (sort === "priceAsc" ? a.price - b.price : b.price - a.price));
  const countText = results.length === 0 ? L.count.zero : counted({ one: L.count.one, two: L.count.two, few: L.count.few }, results.length);

  const open = openId ? LISTINGS.find((l) => l.id === openId) : undefined;
  const featured = LISTINGS.find((l) => l.id === FEATURED)!;

  const priceLine = (l: Listing) => (
    <>
      <bdi>{money(l.price)}</bdi>
      {l.deal === "rent" && <span className="re-per"> {L.perMonth}</span>}
    </>
  );

  // The same controls appear in the hero panel and the results toolbar; both
  // drive one shared filter state, so they always agree.
  const dealToggle = (name: string) => (
    <fieldset className="re-seg">
      <legend className="re-sr">{t.search.dealLabel}</legend>
      {(["buy", "rent"] as const).map((d) => (
        <label key={d} className="re-seg-opt">
          <input type="radio" name={name} value={d} checked={deal === d} onChange={() => changeDeal(d)} />
          <span>{t.search.deal[d]}</span>
        </label>
      ))}
    </fieldset>
  );
  const areaSelect = (id: string) => (
    <div className="re-field">
      <label htmlFor={id}>{t.search.area}</label>
      <select id={id} value={area} onChange={(e) => setArea(e.target.value as AreaId | "any")}>
        <option value="any">{t.search.areaAny}</option>
        {AREA_IDS.map((a) => <option key={a} value={a}>{t.areas[a]}</option>)}
      </select>
    </div>
  );
  const typeSelect = (id: string) => (
    <div className="re-field">
      <label htmlFor={id}>{t.search.type}</label>
      <select id={id} value={type} onChange={(e) => setType(e.target.value as PropertyType | "any")}>
        <option value="any">{t.search.typeAny}</option>
        {TYPE_IDS.map((k) => <option key={k} value={k}>{t.types[k]}</option>)}
      </select>
    </div>
  );
  const bedsSelect = (id: string) => (
    <div className="re-field">
      <label htmlFor={id}>{t.search.beds}</label>
      <select id={id} value={beds} onChange={(e) => setBeds(Number(e.target.value))}>
        <option value={0}>{t.search.bedsAny}</option>
        {BEDS.map((b, i) => <option key={b} value={b}>{t.search.bedsOpts[i]}</option>)}
      </select>
    </div>
  );

  return (
    <>
      <section className="re-hero" aria-labelledby="re-hero-title">
        <div className="re-wrap re-hero-grid">
          <div className="re-hero-text">
            <p className="re-eyebrow">{t.hero.eyebrow}</p>
            <h1 id="re-hero-title" className="re-display font-heading">{t.hero.title}</h1>
            <p className="re-lead">{t.hero.sub}</p>

            <form className="re-search" role="search" aria-label={t.search.label}
              onSubmit={(e) => { e.preventDefault(); resultsRef.current?.focus(); }}>
              {dealToggle("re-s-deal")}
              <div className="re-search-fields">
                {areaSelect("re-s-area")}
                {typeSelect("re-s-type")}
                {bedsSelect("re-s-beds")}
                <button type="submit" className="re-btn re-btn-gold re-search-go">
                  <Search size={18} aria-hidden="true" /> {t.search.submit}
                </button>
              </div>
            </form>

            <dl className="re-stats">
              {t.hero.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="re-hero-art">
            <div className="re-feature">
              <ListingArt type={featured.type} variant={1} uid="hero" />
              <span className="re-chip re-chip-light">{t.hero.featured.tag}</span>
            </div>
            <div className="re-feature-card">
              <p className="re-feature-label">{t.hero.featured.label}</p>
              <p className="re-feature-title font-heading">{t.items[featured.id].title}</p>
              <p className="re-price">{priceLine(featured)}</p>
              <button type="button" className="re-btn re-btn-ink re-btn-sm" onClick={(e) => openListing(featured.id, e.currentTarget)}>
                {L.view}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="listings" className="re-section" aria-labelledby="re-results-title">
        <div className="re-wrap">
          <div className="re-head">
            <p className="re-eyebrow">{L.eyebrow}</p>
            <h2 id="re-results-title" ref={resultsRef} tabIndex={-1} className="re-h2 font-heading">{L.title}</h2>
          </div>

          <form className="re-filters" aria-label={L.filtersLabel} onSubmit={(e) => e.preventDefault()}>
            {dealToggle("re-f-deal")}
            {areaSelect("re-f-area")}
            {typeSelect("re-f-type")}
            {bedsSelect("re-f-beds")}
            <div className="re-field">
              <label htmlFor="re-f-max">{L.maxPrice}</label>
              <select id="re-f-max" value={max} onChange={(e) => setMax(Number(e.target.value))}>
                <option value={0}>{L.any}</option>
                {MAX_PRICES[deal].map((p) => <option key={p} value={p}>{L.upTo.replace("{p}", money(p))}</option>)}
              </select>
            </div>
            <div className="re-field">
              <label htmlFor="re-f-sort">{L.sort}</label>
              <select id="re-f-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {(["recommended", "priceAsc", "priceDesc"] as const).map((s) => <option key={s} value={s}>{L.sortOpts[s]}</option>)}
              </select>
            </div>
          </form>

          <div className="re-bar">
            <p className="re-count" aria-live="polite" aria-atomic="true">{countText}</p>
            <div className="re-bar-actions">
              <button type="button" className="re-pill" aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}>
                <Heart size={16} aria-hidden="true" /> {L.saved} <span className="re-pill-n">{saved.length}</span>
              </button>
              <button type="button" className="re-link" onClick={reset}>{L.reset}</button>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="re-empty">
              <p className="re-empty-title font-heading">{L.emptyTitle}</p>
              <p>{L.emptyBody}</p>
              <button type="button" className="re-btn re-btn-ink re-btn-sm" onClick={reset}>{L.reset}</button>
            </div>
          ) : (
            <ul className="re-grid">
              {results.map((l) => {
                const title = t.items[l.id].title;
                const isSaved = saved.includes(l.id);
                return (
                  <li key={l.id} className="re-card">
                    <div className="re-card-media">
                      <ListingArt type={l.type} variant={l.art} uid={l.id} />
                      <span className="re-chip re-chip-light">{l.deal === "buy" ? L.forSale : L.forRent}</span>
                      <button type="button" className="re-fav" aria-pressed={isSaved} aria-label={L.save.replace("{title}", title)} onClick={() => toggleSaved(l.id)}>
                        <Heart size={18} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="re-card-body">
                      <p className="re-price">{priceLine(l)}</p>
                      <h3 className="re-card-title font-heading">
                        {/* The title button stretches over the whole card (see ::after in CSS). */}
                        <button type="button" className="re-card-link" onClick={(e) => openListing(l.id, e.currentTarget)}>{title}</button>
                      </h3>
                      <p className="re-card-area"><MapPin size={15} aria-hidden="true" /> {t.areas[l.area]} · {t.types[l.type]}</p>
                      <ul className="re-specs">
                        <li><BedDouble size={16} aria-hidden="true" /> {counted(L.beds, l.beds)}</li>
                        <li><Bath size={16} aria-hidden="true" /> {counted(L.baths, l.baths)}</li>
                        <li><Ruler size={16} aria-hidden="true" /> <bdi>{L.sqm.replace("{n}", num(l.size))}</bdi></li>
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <dialog ref={dialogRef} className="re-dialog" aria-labelledby="re-dlg-title" onClose={onDialogClose}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        {open && (
          <div className="re-dlg">
            <div className="re-dlg-media">
              <ListingArt type={open.type} variant={open.art} uid={`dlg-${open.id}`} />
              <button type="button" className="re-dlg-close" aria-label={t.dialog.close} onClick={() => dialogRef.current?.close()}>
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="re-dlg-body">
              <div className="re-dlg-head">
                <div>
                  <p className="re-card-area"><MapPin size={15} aria-hidden="true" /> {t.areas[open.area]} · {t.types[open.type]}</p>
                  <h2 id="re-dlg-title" className="re-dlg-title font-heading">{t.items[open.id].title}</h2>
                </div>
                <p className="re-price re-price-lg">{priceLine(open)}</p>
              </div>

              <dl className="re-dlg-specs">
                <div><dt>{t.dialog.beds}</dt><dd>{open.beds}</dd></div>
                <div><dt>{t.dialog.baths}</dt><dd>{open.baths}</dd></div>
                <div><dt>{t.dialog.size}</dt><dd><bdi>{L.sqm.replace("{n}", num(open.size))}</bdi></dd></div>
                <div><dt>{t.dialog.area}</dt><dd>{t.areas[open.area]}</dd></div>
              </dl>

              <h3 className="re-h3 font-heading">{t.dialog.overview}</h3>
              <p className="re-muted">{t.items[open.id].desc}</p>

              <h3 className="re-h3 font-heading">{t.dialog.amenities}</h3>
              <ul className="re-amenities">
                {open.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a];
                  return <li key={a}><Icon size={16} aria-hidden="true" /> {t.amenities[a]}</li>;
                })}
              </ul>

              {open.deal === "buy" ? (
                <Mortgage key={open.id} price={open.price} t={t} money={money} />
              ) : (
                <div className="re-calc">
                  <h3 className="re-h3 font-heading">{t.dialog.rentTitle}</h3>
                  <p className="re-muted">{t.dialog.rentBody}</p>
                  <dl className="re-calc-out">
                    <div><dt>{t.dialog.deposit}</dt><dd><bdi>{money(open.price)}</bdi></dd></div>
                    <div><dt>{t.dialog.yearly}</dt><dd><bdi>{money(open.price * 12)}</bdi></dd></div>
                  </dl>
                </div>
              )}

              <a href="#agent" className="re-btn re-btn-gold re-btn-block"
                onClick={() => { skipRefocus.current = true; dialogRef.current?.close(); }}>
                {t.dialog.contact}
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function Mortgage({ price, t, money }: { price: number; t: RealEstateContent; money: (n: number) => string }) {
  const D = t.dialog;
  const [priceIn, setPriceIn] = useState(String(price));
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState("5.5");

  const principal = Math.max(0, Number(priceIn) || 0) * (1 - down / 100);
  const monthly = monthlyPayment(principal, Math.max(0, Number(rate) || 0), years);
  const interest = Math.max(0, monthly * years * 12 - principal);

  return (
    <div className="re-calc">
      <h3 className="re-h3 font-heading"><Calculator size={18} aria-hidden="true" /> {D.calcTitle}</h3>
      <div className="re-calc-grid">
        <div className="re-field">
          <label htmlFor="re-c-price">{D.price}</label>
          {/* Numbers stay LTR inside the Arabic page. */}
          <input id="re-c-price" type="number" inputMode="numeric" dir="ltr" min={0} step={1000} value={priceIn} onChange={(e) => setPriceIn(e.target.value)} />
        </div>
        <div className="re-field">
          <label htmlFor="re-c-rate">{D.rate}</label>
          <input id="re-c-rate" type="number" inputMode="decimal" dir="ltr" min={0} max={15} step={0.1} value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="re-field">
          <label htmlFor="re-c-down">{D.down} <output htmlFor="re-c-down" className="re-out"><bdi>{down}%</bdi></output></label>
          <input id="re-c-down" type="range" min={10} max={50} step={5} value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </div>
        <div className="re-field">
          <label htmlFor="re-c-years">{D.years}</label>
          <select id="re-c-years" value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {[10, 15, 20, 25, 30].map((y) => <option key={y} value={y}>{D.yearsOpt.replace("{n}", String(y))}</option>)}
          </select>
        </div>
      </div>
      <dl className="re-calc-out" aria-live="polite">
        <div className="re-calc-main"><dt>{D.monthly}</dt><dd><bdi>{money(Math.round(monthly))}</bdi></dd></div>
        <div><dt>{D.loan}</dt><dd><bdi>{money(Math.round(principal))}</bdi></dd></div>
        <div><dt>{D.interest}</dt><dd><bdi>{money(Math.round(interest))}</bdi></dd></div>
      </dl>
      <p className="re-note">{D.calcNote}</p>
    </div>
  );
}
