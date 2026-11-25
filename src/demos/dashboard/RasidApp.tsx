"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowDownRight, ArrowUpRight, Bell, ChevronDown, ChevronsUpDown, ArrowUp, ArrowDown, LayoutDashboard, Menu,
  Package, Pause, Play, Search, Settings, ShoppingBag, Star, TriangleAlert, Truck, Undo2, UserPlus, Users, X,
} from "lucide-react";
import { content } from "./content";
import { ACTIVITY, ORDERS, RANGES, rangeData, type ActivityKind, type Range, type Status } from "./data";
import { ChannelChart, RevenueChart } from "./Charts";
import type { DemoLocale } from "@/demos/shared";

// Western digits in both locales (house rule); en-US grouping gives "12,480".
const int = (n: number) => Math.round(n).toLocaleString("en-US");

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const KIND_ICON: Record<ActivityKind, typeof ShoppingBag> = {
  order: ShoppingBag, review: Star, stock: TriangleAlert, refund: Undo2, customer: UserPlus, shipped: Truck,
};

type SortKey = "id" | "customer" | "date" | "amount";

function Mark() {
  // Radar mark: concentric rings and a sweep. Brand art, never mirrored.
  return (
    <svg className="rasid-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--rasid-accent-fill)" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="#0b1210" strokeOpacity="0.35" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="5" fill="none" stroke="#0b1210" strokeOpacity="0.55" strokeWidth="1.6" />
      <path d="M16 16 L16 6.5 A9.5 9.5 0 0 1 24.2 11.2 Z" fill="#0b1210" fillOpacity="0.75" />
      <circle cx="16" cy="16" r="1.8" fill="#0b1210" />
    </svg>
  );
}

export default function RasidApp({ locale }: { locale: DemoLocale }) {
  const t = content[locale];
  const rtl = locale === "ar";
  const [range, setRange] = useState<Range>("30d");
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [showFeed, setShowFeed] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "date", dir: -1 });
  const reduce = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const data = useMemo(() => rangeData(range), [range]);
  const money = (n: number) => `${int(n)} ${t.currency}`;
  const date = (d: { month: number; day: number }) => (t.dayFirst ? `${d.day} ${t.months[d.month]}` : `${t.months[d.month]} ${d.day}`);
  const axis = (n: number) => (n === 0 ? "0" : `${int(n / 1000)}${t.thousand}`);

  // Live feed: a new event slides in every 5 s, unless paused or the user prefers reduced motion.
  const live = showFeed && !paused && !reduce;
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTick((k) => k + 1), 5000);
    return () => clearInterval(id);
  }, [live]);

  // Mobile drawer: Escape closes it, focus moves in on open and back to the menu button on close.
  useEffect(() => {
    if (!menuOpen) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  const closeMenu = () => {
    setMenuOpen(false);
    menuBtn.current?.focus();
  };

  const orders = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = ORDERS.filter(
      (o) => (status === "all" || o.status === status) && (!q || o.id.toLowerCase().includes(q) || t.customers[o.customer].toLowerCase().includes(q)),
    );
    const val = (o: (typeof ORDERS)[number]) =>
      sort.key === "amount" ? o.amount : sort.key === "date" ? o.month * 100 + o.day : sort.key === "id" ? o.id : t.customers[o.customer];
    return [...rows].sort((a, b) => {
      const va = val(a), vb = val(b);
      const c = typeof va === "number" ? va - (vb as number) : String(va).localeCompare(String(vb), locale);
      return (c || a.id.localeCompare(b.id)) * sort.dir;
    });
  }, [query, status, sort, t, locale]);

  const feed = Array.from({ length: 5 }, (_, i) => {
    const idx = (((i - tick) % ACTIVITY.length) + ACTIVITY.length) % ACTIVITY.length;
    return { idx, ...ACTIVITY[idx] };
  });

  const kpis = [
    { key: "revenue", label: t.kpis.revenue, value: int(data.kpis.revenue.value), unit: t.currency, delta: data.kpis.revenue.delta },
    { key: "orders", label: t.kpis.orders, value: int(data.kpis.orders.value), unit: "", delta: data.kpis.orders.delta },
    { key: "conversion", label: t.kpis.conversion, value: `${data.kpis.conversion.value.toFixed(2)}%`, unit: "", delta: data.kpis.conversion.delta },
    { key: "aov", label: t.kpis.aov, value: int(data.kpis.aov.value), unit: t.currency, delta: data.kpis.aov.delta },
  ];
  const maxUnits = Math.max(...data.products);
  const nav = [
    { href: "#overview", label: t.nav.overview, icon: LayoutDashboard, current: true },
    { href: "#orders", label: t.nav.orders, icon: ShoppingBag },
    { href: "#products", label: t.nav.products, icon: Package },
    { href: "#activity", label: t.nav.customers, icon: Users },
  ];

  const sortHeader = (key: SortKey, label: string, end = false) => {
    const on = sort.key === key;
    const Icon = !on ? ChevronsUpDown : sort.dir === 1 ? ArrowUp : ArrowDown;
    return (
      <th scope="col" aria-sort={on ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={end ? "rasid-end" : undefined}>
        <button type="button" className="rasid-sort" onClick={() => setSort({ key, dir: on ? (-sort.dir as 1 | -1) : key === "customer" || key === "id" ? 1 : -1 })}>
          {label}
          <Icon size={14} aria-hidden="true" />
        </button>
      </th>
    );
  };

  return (
    <div className={`rasid${compact ? " rasid-compact" : ""}`}>
      <div className={`rasid-side${menuOpen ? " is-open" : ""}`}>
        <div className="rasid-side-head">
          <a className="rasid-brand" href="#overview">
            <Mark />
            <span className="font-heading">{t.brand}</span>
          </a>
          <button ref={closeBtn} type="button" className="rasid-icon-btn rasid-close" onClick={closeMenu} aria-label={t.nav.close}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="rasid-workspace">
          <span className="rasid-ws-logo" aria-hidden="true">{t.workspace.name.slice(0, 1)}</span>
          <span>
            <span className="rasid-ws-name">{t.workspace.name}</span>
            <span className="rasid-ws-plan">{t.workspace.plan}</span>
          </span>
        </div>
        <nav aria-label={t.nav.label}>
          <ul className="rasid-nav">
            {nav.map(({ href, label, icon: Icon, current }) => (
              <li key={href}>
                <a href={href} aria-current={current ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
            <li>
              <details className="rasid-settings">
                <summary>
                  <Settings size={18} aria-hidden="true" />
                  {t.nav.settings}
                  <ChevronDown size={16} className="rasid-chev" aria-hidden="true" />
                </summary>
                <label className="rasid-toggle">
                  <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
                  {t.nav.compact}
                </label>
                <label className="rasid-toggle">
                  <input type="checkbox" checked={showFeed} onChange={(e) => setShowFeed(e.target.checked)} />
                  {t.nav.showFeed}
                </label>
              </details>
            </li>
          </ul>
        </nav>
        <div className="rasid-user">
          <span className="rasid-avatar" aria-hidden="true">{t.user.initials}</span>
          <span>
            <span className="rasid-ws-name">{t.user.name}</span>
            <span className="rasid-ws-plan">{t.user.role}</span>
          </span>
        </div>
      </div>
      {menuOpen && <button type="button" className="rasid-scrim" aria-label={t.nav.close} tabIndex={-1} onClick={closeMenu} />}

      <div className="rasid-main">
        <header className="rasid-top">
          <button
            ref={menuBtn}
            type="button"
            className="rasid-icon-btn rasid-menu"
            aria-label={t.nav.open}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="rasid-search">
            <Search size={16} aria-hidden="true" />
            <label htmlFor="rasid-q" className="sr-only">{t.search.label}</label>
            <input
              id="rasid-q"
              type="search"
              value={query}
              placeholder={t.search.placeholder}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="rasid-tabs" role="group" aria-label={t.range.label}>
            {RANGES.map((r) => (
              <button key={r} type="button" aria-pressed={range === r} aria-label={t.range.long[r]} onClick={() => setRange(r)}>
                {t.range.short[r]}
              </button>
            ))}
          </div>
          <button type="button" className="rasid-icon-btn rasid-bell" aria-label={t.notifications}>
            <Bell size={18} aria-hidden="true" />
            <span className="rasid-badge" aria-hidden="true" />
          </button>
          <span className="rasid-avatar rasid-avatar-top" role="img" aria-label={t.user.name}>{t.user.initials}</span>
        </header>

        <main id="overview" className="rasid-content">
          <div className="rasid-page-head">
            <h1 className="font-heading">{t.title}</h1>
            <p>
              {t.subtitle} · {t.range.long[range]}
            </p>
          </div>
          <p className="sr-only" aria-live="polite">
            {`${t.range.long[range]}: ${t.kpis.revenue} ${money(data.kpis.revenue.value)}`}
          </p>

          <section className="rasid-kpis" aria-label={t.title}>
            {kpis.map((k) => {
              // Round first so a tiny negative change never shows as "−0.0%".
              const delta = Math.round(k.delta * 10) / 10;
              const up = delta >= 0;
              const Trend = up ? ArrowUpRight : ArrowDownRight;
              return (
                <article key={k.key} className="rasid-card rasid-kpi">
                  <h2>{k.label}</h2>
                  <p className="rasid-kpi-value">
                    <span className="rasid-num" dir="ltr">{k.value}</span>
                    {k.unit && <span className="rasid-unit">{k.unit}</span>}
                  </p>
                  <p className="rasid-kpi-foot">
                    <span className={`rasid-delta ${up ? "is-up" : "is-down"}`}>
                      {/* Trend arrows point along the time axis, which runs right-to-left in Arabic. */}
                      <Trend size={14} className="rtl:-scale-x-100" aria-hidden="true" />
                      <span dir="ltr">{`${up ? "+" : "−"}${Math.abs(delta).toFixed(1)}%`}</span>
                    </span>
                    <span>{t.kpis.vsPrev}</span>
                  </p>
                </article>
              );
            })}
          </section>

          <div className="rasid-row rasid-row-charts">
            <section className="rasid-card" aria-labelledby="rasid-rev">
              <div className="rasid-card-head">
                <h2 id="rasid-rev">{t.revenueChart.title}</h2>
                <ul className="rasid-legend">
                  <li><span className="rasid-key rasid-key-now" />{t.revenueChart.current}</li>
                  <li><span className="rasid-key rasid-key-prev" />{t.revenueChart.previous}</li>
                </ul>
              </div>
              <RevenueChart
                current={data.current}
                previous={data.previous}
                rtl={rtl}
                money={money}
                date={date}
                axis={axis}
                labels={t.revenueChart}
              />
            </section>
            <section className="rasid-card" aria-labelledby="rasid-ch">
              <div className="rasid-card-head">
                <h2 id="rasid-ch">{t.channelChart.title}</h2>
                <ul className="rasid-legend">
                  <li><span className="rasid-key rasid-key-now" />{t.revenueChart.current}</li>
                  <li><span className="rasid-key rasid-key-bar-prev" />{t.revenueChart.previous}</li>
                </ul>
              </div>
              <ChannelChart
                channels={data.channels}
                names={t.channelChart.channels}
                rtl={rtl}
                money={money}
                labels={{ current: t.revenueChart.current, previous: t.revenueChart.previous, title: t.channelChart.title }}
              />
            </section>
          </div>

          <div className="rasid-row rasid-row-bottom">
            <section id="orders" className="rasid-card rasid-orders" aria-labelledby="rasid-orders-h">
              <div className="rasid-card-head">
                <h2 id="rasid-orders-h">{t.orders.title}</h2>
                <div className="rasid-filter" role="group" aria-label={t.orders.filterLabel}>
                  {(["all", "paid", "shipped", "refunded"] as const).map((s) => (
                    <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}>
                      {s === "all" ? t.orders.all : t.orders.status[s]}
                    </button>
                  ))}
                </div>
              </div>
              <p className="rasid-count" aria-live="polite">
                {t.orders.showing} <span dir="ltr">{orders.length}</span>
              </p>
              <div className="rasid-table-wrap">
                <table className="rasid-table">
                  <caption className="sr-only">{t.orders.title}</caption>
                  <thead>
                    <tr>
                      {sortHeader("id", t.orders.cols.id)}
                      {sortHeader("customer", t.orders.cols.customer)}
                      {sortHeader("date", t.orders.cols.date)}
                      <th scope="col">{t.orders.cols.channel}</th>
                      <th scope="col">{t.orders.cols.status}</th>
                      {sortHeader("amount", t.orders.cols.amount, true)}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="rasid-mono" dir="ltr">#{o.id}</td>
                        <td>{t.customers[o.customer]}</td>
                        <td className="rasid-muted">{date(o)}</td>
                        <td className="rasid-muted">{t.channelChart.channels[o.channel]}</td>
                        <td><span className={`rasid-chip rasid-chip-${o.status}`}>{t.orders.status[o.status]}</span></td>
                        <td className="rasid-end rasid-amount">{money(o.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="rasid-empty">{t.orders.empty}</p>}
              </div>
            </section>

            <div className="rasid-stack">
              <section id="products" className="rasid-card" aria-labelledby="rasid-prod-h">
                <div className="rasid-card-head">
                  <h2 id="rasid-prod-h">{t.products.title}</h2>
                </div>
                <ol className="rasid-products">
                  {t.products.items.map((p, i) => (
                    <li key={p.name}>
                      <div className="rasid-prod-row">
                        <span className="rasid-rank" aria-hidden="true">{i + 1}</span>
                        <span className="rasid-prod-name">
                          {p.name}
                          <span>{p.category}</span>
                        </span>
                        <span className="rasid-prod-units">
                          <span dir="ltr">{int(data.products[i])}</span> {t.products.units}
                        </span>
                      </div>
                      <div className="rasid-meter" aria-hidden="true">
                        <span style={{ width: `${(data.products[i] / maxUnits) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {showFeed && (
                <section id="activity" className="rasid-card" aria-labelledby="rasid-act-h">
                  <div className="rasid-card-head">
                    <h2 id="rasid-act-h">
                      {t.activity.title}
                      <span className={`rasid-live${live ? "" : " is-off"}`}>{t.activity.live}</span>
                    </h2>
                    {!reduce && (
                      <button type="button" className="rasid-icon-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? t.activity.resume : t.activity.pause}>
                        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                  <ol className="rasid-feed">
                    {feed.map((e, i) => {
                      const Icon = KIND_ICON[e.kind];
                      return (
                        <li key={`${tick - i}`} className={i === 0 && tick > 0 ? "is-new" : undefined}>
                          <span className={`rasid-feed-icon rasid-feed-${e.kind}`} aria-hidden="true">
                            <Icon size={15} />
                          </span>
                          <span className="rasid-feed-text">
                            {t.activity.events[e.idx]}
                            {e.ref && <> <bdi dir="ltr" className="rasid-mono">#{e.ref}</bdi></>}
                            {e.amount !== undefined && <> · {money(e.amount)}</>}
                            <span className="rasid-feed-time">{t.activity.ago[i]}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
