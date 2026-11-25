"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Day } from "./data";

/* Hand-built SVG charts (no chart library).
   RTL choice: in Arabic the time axis runs right-to-left, the reading
   direction, so the oldest day sits on the right and "today" on the left.
   Every position is computed as a distance from the inline-start edge (`s`)
   and only turned into a physical x at the end (`px`). Tooltips are placed
   with inset-inline-start, so the same number works in both directions.
   SVG <text> inherits `direction` from <html dir>, so text-anchor "end"
   means "toward inline-end" in both locales. */

function useWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const niceMax = (v: number) => {
  const step = Math.pow(10, Math.floor(Math.log10(v / 4)));
  return Math.ceil(v / 4 / step) * step * 4;
};

/** Tooltip alignment near the edges so it never leaves the card. */
const tipEdge = (s: number, width: number) => (s < 90 ? "rasid-tip-start" : s > width - 90 ? "rasid-tip-end" : "");

type RevenueProps = {
  current: Day[];
  previous: Day[];
  rtl: boolean;
  money: (n: number) => string;
  date: (d: Day) => string;
  axis: (n: number) => string;
  labels: { current: string; previous: string; hint: string };
};

export function RevenueChart({ current, previous, rtl, money, date, axis, labels }: RevenueProps) {
  const [ref, width] = useWidth(640);
  const [active, setActive] = useState<number | null>(null);
  const n = current.length;
  const H = width < 480 ? 210 : 260;
  const pad = { top: 14, bottom: 30, start: 50, end: 14 };
  const plotW = width - pad.start - pad.end;
  const plotH = H - pad.top - pad.bottom;
  const max = niceMax(Math.max(...current.map((d) => d.revenue), ...previous.map((d) => d.revenue)));
  const s = (i: number) => pad.start + (n === 1 ? 0 : (i / (n - 1)) * plotW);
  const px = (i: number) => (rtl ? width - s(i) : s(i));
  const y = (v: number) => pad.top + (1 - v / max) * plotH;

  const line = (days: Day[]) => days.map((d, i) => `${i ? "L" : "M"}${px(i).toFixed(1)},${y(d.revenue).toFixed(1)}`).join("");
  const area = `${line(current)}L${px(n - 1).toFixed(1)},${y(0)}L${px(0).toFixed(1)},${y(0)}Z`;
  const ticks = Math.min(n, width < 480 ? 4 : 6);
  const xTicks = Array.from({ length: ticks }, (_, k) => Math.round((k * (n - 1)) / (ticks - 1)));

  // Clear a stale index when the range (and so the number of days) changes.
  const shown = active !== null && active < n ? active : null;

  function onPointer(e: PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fromLeft = e.clientX - rect.left;
    const fromStart = rtl ? rect.width - fromLeft : fromLeft;
    setActive(Math.min(n - 1, Math.max(0, Math.round(((fromStart - pad.start) / plotW) * (n - 1)))));
  }

  function onKey(e: KeyboardEvent<SVGSVGElement>) {
    // Arrow keys follow the screen: in RTL, ArrowLeft moves forward in time.
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const now = shown ?? n - 1;
    const next = e.key === forward ? now + 1 : e.key === back ? now - 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (next === null) return;
    e.preventDefault();
    setActive(Math.min(n - 1, Math.max(0, next)));
  }

  const tip = shown !== null ? `${date(current[shown])}: ${money(current[shown].revenue)}` : "";

  return (
    <div ref={ref} className="rasid-chart">
      <svg
        width={width}
        height={H}
        role="img"
        aria-label={labels.hint}
        tabIndex={0}
        onPointerMove={onPointer}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={onKey}
      >
        <defs>
          <linearGradient id="rasid-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--rasid-accent)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--rasid-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((k) => {
          const v = (max / 4) * k;
          return (
            <g key={k}>
              <line className="rasid-grid" x1={rtl ? width - pad.start : pad.start} x2={rtl ? pad.end : width - pad.end} y1={y(v)} y2={y(v)} />
              <text className="rasid-axis" x={rtl ? width - pad.start + 10 : pad.start - 10} y={y(v) + 4} textAnchor="end">
                {axis(v)}
              </text>
            </g>
          );
        })}
        {xTicks.map((i, k) => (
          <text key={i} className="rasid-axis" x={px(i)} y={H - 8} textAnchor={k === ticks - 1 ? "end" : k === 0 ? "start" : "middle"}>
            {date(current[i])}
          </text>
        ))}
        <path d={area} fill="url(#rasid-area)" />
        <path d={line(previous)} className="rasid-line-prev" />
        <path d={line(current)} className="rasid-line" />
        {shown !== null && (
          <g>
            <line className="rasid-cursor" x1={px(shown)} x2={px(shown)} y1={pad.top} y2={y(0)} />
            <circle cx={px(shown)} cy={y(previous[shown].revenue)} r={3.5} className="rasid-dot-prev" />
            <circle cx={px(shown)} cy={y(current[shown].revenue)} r={5} className="rasid-dot" />
          </g>
        )}
      </svg>
      {shown !== null && (
        <div
          className={`rasid-tip ${tipEdge(s(shown), width)}`}
          style={{ insetInlineStart: s(shown), top: Math.min(y(current[shown].revenue), y(previous[shown].revenue)) - 12 }}
          aria-hidden="true"
        >
          <p className="rasid-tip-title">{date(current[shown])}</p>
          <p><span className="rasid-key rasid-key-now" />{labels.current}<b>{money(current[shown].revenue)}</b></p>
          <p><span className="rasid-key rasid-key-prev" />{labels.previous}<b>{money(previous[shown].revenue)}</b></p>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{tip}</p>
    </div>
  );
}

type ChannelProps = {
  channels: { current: number; previous: number }[];
  names: string[];
  rtl: boolean;
  money: (n: number) => string;
  labels: { current: string; previous: string; title: string };
};

export function ChannelChart({ channels, names, rtl, money, labels }: ChannelProps) {
  const [ref, width] = useWidth(320);
  const [active, setActive] = useState<number | null>(null);
  const H = 200;
  const pad = { top: 16, bottom: 4 };
  const plotH = H - pad.top - pad.bottom;
  const max = niceMax(Math.max(...channels.flatMap((c) => [c.current, c.previous])));
  const group = width / channels.length;
  const bar = Math.min(18, group * 0.26);
  const y = (v: number) => pad.top + (1 - v / max) * plotH;
  // Reading order: first channel at inline-start, "this period" bar before "previous".
  const center = (i: number) => group * i + group / 2;
  const px = (fromStart: number, w: number) => (rtl ? width - fromStart - w : fromStart);

  return (
    <div ref={ref} className="rasid-chart">
      <svg width={width} height={H} role="group" aria-label={labels.title}>
        {[1, 2, 3, 4].map((k) => (
          <line key={k} className="rasid-grid" x1={0} x2={width} y1={y((max / 4) * k)} y2={y((max / 4) * k)} />
        ))}
        <line className="rasid-grid rasid-grid-base" x1={0} x2={width} y1={y(0)} y2={y(0)} />
        {channels.map((c, i) => {
          const c0 = center(i);
          return (
            <g
              key={i}
              tabIndex={0}
              role="img"
              aria-label={`${names[i]}: ${labels.current} ${money(c.current)}, ${labels.previous} ${money(c.previous)}`}
              className={`rasid-bar-group${active === i ? " is-active" : ""}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <rect className="rasid-hit" x={px(group * i, group)} y={0} width={group} height={H} />
              <rect className="rasid-bar" x={px(c0 - bar - 2, bar)} y={y(c.current)} width={bar} height={y(0) - y(c.current)} rx={4} />
              <rect className="rasid-bar-prev" x={px(c0 + 2, bar)} y={y(c.previous)} width={bar} height={y(0) - y(c.previous)} rx={4} />
            </g>
          );
        })}
      </svg>
      <ol className="rasid-bar-labels" aria-hidden="true">
        {names.map((n) => <li key={n}>{n}</li>)}
      </ol>
      {active !== null && (
        <div
          className={`rasid-tip ${tipEdge(center(active), width)}`}
          style={{ insetInlineStart: center(active), top: y(Math.max(channels[active].current, channels[active].previous)) - 10 }}
          aria-hidden="true"
        >
          <p className="rasid-tip-title">{names[active]}</p>
          <p><span className="rasid-key rasid-key-now" />{labels.current}<b>{money(channels[active].current)}</b></p>
          <p><span className="rasid-key rasid-key-bar-prev" />{labels.previous}<b>{money(channels[active].previous)}</b></p>
        </div>
      )}
    </div>
  );
}
