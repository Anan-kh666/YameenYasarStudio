"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Leaf, Flame } from "lucide-react";
import { MENU, TABS, fill, jod, type RestaurantCopy, type TabId } from "./content";

/* ARIA tabs with a roving tabindex. Arrow keys follow the reading direction:
   in RTL the "next" tab sits to the left, so ArrowLeft moves forward. */
export default function Menu({ c, dishes }: { c: RestaurantCopy["menu"]; dishes: RestaurantCopy["dishes"] }) {
  const [active, setActive] = useState<TabId>("mezze");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const i = TABS.indexOf(active);
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    let next: number | undefined;
    if (step) next = (i + step + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    setActive(TABS[next]);
    refs.current[TABS[next]]?.focus();
  }

  return (
    <div className="sumac-menu">
      <div role="tablist" aria-label={c.tabsLabel} className="sumac-tabs" onKeyDown={onKey}>
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" id={`sumac-tab-${t}`} aria-controls={`sumac-panel-${t}`}
            aria-selected={active === t} tabIndex={active === t ? 0 : -1}
            ref={(el) => { refs.current[t] = el; }} onClick={() => setActive(t)} className="sumac-tab">
            {c.tabs[t]} <span className="sumac-tab-n">{MENU[t].length}</span>
          </button>
        ))}
      </div>
      {TABS.map((t) => (
        <div key={t} role="tabpanel" id={`sumac-panel-${t}`} aria-labelledby={`sumac-tab-${t}`} hidden={active !== t}
          tabIndex={0} className="sumac-panel">
          <ul className="sumac-dishes">
            {MENU[t].map((d) => (
              <li key={d.id} className="sumac-dish">
                <div className="sumac-dish-head">
                  <h3>{dishes[d.id].name}</h3>
                  <span className="sumac-leader" aria-hidden="true" />
                  <span className="sumac-price">{fill(c.price, { n: jod(d.price) })}</span>
                </div>
                <p>{dishes[d.id].desc}</p>
                {(d.veg || d.spicy) && (
                  <ul className="sumac-tags">
                    {d.veg && <li className="sumac-tag sumac-tag-veg"><Leaf size={14} aria-hidden /> {c.veg}</li>}
                    {d.spicy && <li className="sumac-tag sumac-tag-spicy"><Flame size={14} aria-hidden /> {c.spicy}</li>}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
