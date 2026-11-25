"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search, ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import GarmentArt from "./GarmentArt";
import {
  CATEGORIES, FREE_SHIPPING_AED, PRODUCTS, fill,
  type CategoryId, type ColorId, type Product, type ProductId, type StoreCopy,
} from "./content";

/* The interactive part of the Lamsa demo: header (search + bag), category
   filter, product grid, quick-view dialog and cart drawer. Static sections
   (hero, trust row, footer…) are server-rendered and passed in as slots.
   Dialogs use native <dialog>.showModal(): the browser traps focus, closes on
   Escape and returns focus to the button that opened it. */

type Line = { key: string; id: ProductId; color: ColorId; size: string; qty: number };
const byId = (id: ProductId) => PRODUCTS.find((p) => p.id === id)!;
const hexOf = (p: Product, color: ColorId) => p.colors.find((c) => c.id === color)?.hex ?? p.colors[0].hex;
const money = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

export default function Store({ c, hero, after }: { c: StoreCopy; hero: ReactNode; after: ReactNode }) {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [colorOf, setColorOf] = useState<Partial<Record<ProductId, ColorId>>>({});
  const [quick, setQuick] = useState<ProductId | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [status, setStatus] = useState(""); // live region inside the drawer
  const [checkoutTried, setCheckoutTried] = useState(false);

  const quickRef = useRef<HTMLDialogElement>(null);
  const cartRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (quick && !quickRef.current?.open) quickRef.current?.showModal(); }, [quick]);
  useEffect(() => { if (cartOpen && !cartRef.current?.open) cartRef.current?.showModal(); }, [cartOpen]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
  const remaining = Math.max(0, FREE_SHIPPING_AED - subtotal);

  const q = query.trim().toLowerCase();
  const visible = PRODUCTS.filter(
    (p) => (cat === "all" || p.category === cat) &&
      (!q || `${c.products[p.id].name} ${c.shop.categories[p.category]}`.toLowerCase().includes(q)),
  );

  const colorFor = (p: Product) => colorOf[p.id] ?? p.colors[0].id;
  const nameOf = (id: ProductId) => c.products[id].name;

  function add(p: Product, color: ColorId, size: string) {
    const key = `${p.id}|${color}|${size}`;
    setLines((ls) => ls.some((l) => l.key === key)
      ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l))
      : [...ls, { key, id: p.id, color, size, qty: 1 }]);
    quickRef.current?.close();
    setToast(`${fill(c.cart.added, { name: nameOf(p.id) })} · ${fill(c.cart.items, { n: count + 1 })}`);
  }

  function setQty(key: string, qty: number) {
    const line = lines.find((l) => l.key === key)!;
    if (qty < 1) {
      setLines((ls) => ls.filter((l) => l.key !== key));
      setStatus(fill(c.cart.removed, { name: nameOf(line.id) }));
    } else {
      setLines((ls) => ls.map((l) => (l.key === key ? { ...l, qty } : l)));
      setStatus(`${nameOf(line.id)}: ${qty}`);
    }
  }

  const openCart = () => { setToast(""); setCheckoutTried(false); setCartOpen(true); };
  const priceOf = (n: number) => fill(c.price, { n: money(n) });
  const sizeLabel = (s: string) => (s === "one" ? c.quick.oneSize : s);

  return (
    <div className="lamsa">
      <p className="lamsa-announce">{c.announcement}</p>

      <header className="lamsa-header">
        <div className="lamsa-wrap lamsa-header-row">
          <a href="#top" className="lamsa-wordmark">{c.brand}</a>
          <nav aria-label={c.nav.label} className="lamsa-nav">
            <a href="#shop" onClick={() => setCat("all")}>{c.nav.newIn}</a>
            {CATEGORIES.slice(0, 3).map((id) => (
              <a key={id} href="#shop" onClick={() => setCat(id)}>{c.shop.categories[id]}</a>
            ))}
            <a href="#story">{c.nav.journal}</a>
            <a href="#visit">{c.nav.visit}</a>
          </nav>
          <div className="lamsa-actions">
            <button type="button" className="lamsa-icon-btn" aria-expanded={searchOpen} aria-controls="lamsa-search"
              aria-label={searchOpen ? c.search.close : c.search.open} onClick={() => setSearchOpen((o) => !o)}>
              {searchOpen ? <X size={20} aria-hidden /> : <Search size={20} aria-hidden />}
            </button>
            <button type="button" className="lamsa-bag-btn" onClick={openCart} aria-label={`${c.cartButton} · ${fill(c.cart.items, { n: count })}`}>
              <ShoppingBag size={20} aria-hidden />
              <span className="lamsa-bag-count" key={count} aria-hidden>{count}</span>
            </button>
            {/* Announces additions; stays in the DOM so screen readers hear changes. */}
            <div className="lamsa-toast" data-show={toast ? "" : undefined} aria-live="polite">
              {toast && (
                <>
                  <span>{toast}</span>
                  <button type="button" onClick={openCart}>{c.cartButton}</button>
                </>
              )}
            </div>
          </div>
        </div>
        {searchOpen && (
          <form id="lamsa-search" role="search" className="lamsa-search" onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
          }}>
            <div className="lamsa-wrap lamsa-search-row">
              <Search size={18} aria-hidden className="lamsa-search-icon" />
              <label htmlFor="lamsa-q" className="lamsa-sr">{c.search.label}</label>
              <input id="lamsa-q" ref={searchRef} type="search" value={query} placeholder={c.search.placeholder}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") setSearchOpen(false); }} />
            </div>
          </form>
        )}
      </header>

      <main id="top">
        {hero}

        <section id="shop" className="lamsa-section lamsa-shop" aria-labelledby="lamsa-shop-title">
          <div className="lamsa-wrap">
            <div className="lamsa-shop-head">
              <div>
                <p className="lamsa-kicker">{c.shop.eyebrow}</p>
                <h2 id="lamsa-shop-title" className="lamsa-display lamsa-h2">{c.shop.title}</h2>
              </div>
              <p className="lamsa-count" aria-live="polite">{fill(c.shop.count, { n: visible.length })}</p>
            </div>

            <div className="lamsa-chips" role="group" aria-label={c.shop.filterLabel}>
              {(["all", ...CATEGORIES] as const).map((id) => (
                <button key={id} type="button" className="lamsa-chip" aria-pressed={cat === id} onClick={() => setCat(id)}>
                  {id === "all" ? c.shop.all : c.shop.categories[id]}
                  <span className="lamsa-chip-n">{id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === id).length}</span>
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="lamsa-empty">
                <p>{fill(c.shop.empty, { q: query.trim() })}</p>
                <button type="button" className="lamsa-btn lamsa-btn-ghost" onClick={() => setQuery("")}>{c.shop.clearSearch}</button>
              </div>
            ) : (
              <ul className="lamsa-grid">
                {visible.map((p) => {
                  const color = colorFor(p);
                  return (
                    <li key={p.id} className="lamsa-card">
                      <button type="button" className="lamsa-card-art" onClick={() => setQuick(p.id)} aria-label={`${c.shop.quickView}: ${nameOf(p.id)}`}>
                        <GarmentArt art={p.art} color={hexOf(p, color)} className="lamsa-art" />
                        {p.isNew && <span className="lamsa-badge">{c.shop.newBadge}</span>}
                        <span className="lamsa-card-quick" aria-hidden>{c.shop.quickView}</span>
                      </button>
                      <div className="lamsa-card-body">
                        <h3 className="lamsa-card-name">{nameOf(p.id)}</h3>
                        <p className="lamsa-price">{priceOf(p.price)}</p>
                      </div>
                      <div className="lamsa-swatches" role="group" aria-label={`${c.shop.colorLabel}: ${nameOf(p.id)}`}>
                        {p.colors.map((col) => (
                          <button key={col.id} type="button" className="lamsa-swatch" style={{ "--sw": col.hex } as React.CSSProperties}
                            aria-pressed={color === col.id} aria-label={c.colors[col.id]} title={c.colors[col.id]}
                            onClick={() => setColorOf((m) => ({ ...m, [p.id]: col.id }))} />
                        ))}
                        <span className="lamsa-swatch-name">{c.colors[color]}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {after}
      </main>

      <dialog ref={quickRef} className="lamsa-dialog lamsa-quick" aria-labelledby="lamsa-quick-title"
        onClose={() => setQuick(null)}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        {quick && (
          <QuickView key={quick} c={c} p={byId(quick)} initialColor={colorFor(byId(quick))} priceOf={priceOf} sizeLabel={sizeLabel}
            onClose={() => quickRef.current?.close()}
            onAdd={(color, size) => { setColorOf((m) => ({ ...m, [quick]: color })); add(byId(quick), color, size); }} />
        )}
      </dialog>

      <dialog ref={cartRef} className="lamsa-dialog lamsa-drawer" aria-labelledby="lamsa-cart-title"
        onClose={() => setCartOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        <div className="lamsa-drawer-inner">
          <div className="lamsa-drawer-head">
            <h2 id="lamsa-cart-title" className="lamsa-display lamsa-h3">{c.cart.title} <span className="lamsa-muted">({count})</span></h2>
            <button type="button" className="lamsa-icon-btn" aria-label={c.cart.close} onClick={() => cartRef.current?.close()}>
              <X size={20} aria-hidden />
            </button>
          </div>

          <div className="lamsa-ship">
            <p>{remaining > 0 ? fill(c.cart.remaining, { n: money(remaining) }) : c.cart.unlocked}</p>
            <div className="lamsa-ship-bar" role="progressbar" aria-label={c.cart.subtotal}
              aria-valuemin={0} aria-valuemax={FREE_SHIPPING_AED} aria-valuenow={Math.min(subtotal, FREE_SHIPPING_AED)}>
              <span style={{ inlineSize: `${Math.min(100, (subtotal / FREE_SHIPPING_AED) * 100)}%` }} />
            </div>
          </div>

          <p className="lamsa-sr" aria-live="polite">{status}</p>

          {lines.length === 0 ? (
            <div className="lamsa-drawer-empty">
              <ShoppingBag size={32} aria-hidden />
              <p>{c.cart.empty}</p>
              <button type="button" className="lamsa-btn lamsa-btn-primary" onClick={() => cartRef.current?.close()}>{c.cart.continue}</button>
            </div>
          ) : (
            <>
              <ul className="lamsa-lines">
                {lines.map((l) => {
                  const p = byId(l.id);
                  return (
                    <li key={l.key} className="lamsa-line">
                      <div className="lamsa-line-art"><GarmentArt art={p.art} color={hexOf(p, l.color)} /></div>
                      <div className="lamsa-line-main">
                        <p className="lamsa-line-name">{nameOf(l.id)}</p>
                        <p className="lamsa-muted lamsa-small">{c.colors[l.color]} · {sizeLabel(l.size)}</p>
                        <div className="lamsa-line-row">
                          <div className="lamsa-stepper">
                            <button type="button" aria-label={`${c.cart.decrease}: ${nameOf(l.id)}`} onClick={() => setQty(l.key, l.qty - 1)}><Minus size={14} aria-hidden /></button>
                            <span>{l.qty}</span>
                            <button type="button" aria-label={`${c.cart.increase}: ${nameOf(l.id)}`} onClick={() => setQty(l.key, l.qty + 1)}><Plus size={14} aria-hidden /></button>
                          </div>
                          <button type="button" className="lamsa-remove" onClick={() => setQty(l.key, 0)}>
                            <Trash2 size={14} aria-hidden /> {c.cart.remove}
                          </button>
                        </div>
                      </div>
                      <p className="lamsa-price">{priceOf(p.price * l.qty)}</p>
                    </li>
                  );
                })}
              </ul>
              <div className="lamsa-drawer-foot">
                <p className="lamsa-subtotal"><span>{c.cart.subtotal}</span><span>{priceOf(subtotal)}</span></p>
                <p className="lamsa-muted lamsa-small">{c.cart.taxNote}</p>
                <button type="button" className="lamsa-btn lamsa-btn-primary lamsa-btn-block" onClick={() => setCheckoutTried(true)}>{c.cart.checkout}</button>
                <p className="lamsa-small lamsa-muted" aria-live="polite">{checkoutTried ? c.cart.checkoutNote : ""}</p>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}

function QuickView({ c, p, initialColor, priceOf, sizeLabel, onClose, onAdd }: {
  c: StoreCopy; p: Product; initialColor: ColorId;
  priceOf: (n: number) => string; sizeLabel: (s: string) => string;
  onClose: () => void; onAdd: (color: ColorId, size: string) => void;
}) {
  const [color, setColor] = useState(initialColor);
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [warn, setWarn] = useState(false);
  const name = c.products[p.id].name;

  return (
    <div className="lamsa-quick-inner">
      <div className="lamsa-quick-art">
        <GarmentArt art={p.art} color={hexOf(p, color)} className="lamsa-art" />
      </div>
      <div className="lamsa-quick-main">
        <button type="button" className="lamsa-icon-btn lamsa-quick-close" aria-label={c.quick.close} onClick={onClose}>
          <X size={20} aria-hidden />
        </button>
        <p className="lamsa-kicker">{c.shop.categories[p.category]}</p>
        <h2 id="lamsa-quick-title" className="lamsa-display lamsa-h3">{name}</h2>
        <p className="lamsa-quick-price">{priceOf(p.price)}</p>
        <p className="lamsa-small lamsa-muted">{fill(c.quick.installments, { n: money(p.price / 4) })}</p>
        <p className="lamsa-quick-desc">{c.products[p.id].desc}</p>

        <fieldset className="lamsa-field">
          <legend>{c.shop.colorLabel}: <span className="lamsa-muted">{c.colors[color]}</span></legend>
          <div className="lamsa-swatches">
            {p.colors.map((col) => (
              <button key={col.id} type="button" className="lamsa-swatch lamsa-swatch-lg" style={{ "--sw": col.hex } as React.CSSProperties}
                aria-pressed={color === col.id} aria-label={c.colors[col.id]} onClick={() => setColor(col.id)} />
            ))}
          </div>
        </fieldset>

        <fieldset className="lamsa-field">
          <legend>{c.quick.size}{p.category === "abayas" && <span className="lamsa-muted"> · {c.quick.sizeHint}</span>}</legend>
          <div className="lamsa-sizes">
            {p.sizes.map((s) => (
              <button key={s} type="button" className="lamsa-size" aria-pressed={size === s}
                onClick={() => { setSize(s); setWarn(false); }}>{sizeLabel(s)}</button>
            ))}
          </div>
        </fieldset>

        <p className="lamsa-warn" aria-live="assertive">{warn ? c.quick.chooseSize : ""}</p>
        <button type="button" className="lamsa-btn lamsa-btn-primary lamsa-btn-block"
          onClick={() => (size ? onAdd(color, size) : setWarn(true))}>
          {c.quick.add} · {priceOf(p.price)}
        </button>
      </div>
    </div>
  );
}
