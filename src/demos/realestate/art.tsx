import type { PropertyType } from "./content";

/* Card illustrations: flat architectural drawings in SVG, so there are no
   stock photos and no remote images. Decorative only (aria-hidden), and never
   mirrored: a building drawn for LTR looks just as right in RTL. */

const PALETTES = [
  { sky: ["#dfe9f1", "#f7f1e6"], sun: "#f2d7a6", wall: "#efe5d3", trim: "#d9c7a5", glass: "#1f3050", ground: "#e8dcc6" },
  { sky: ["#f2d8b7", "#f8ecdc"], sun: "#fff4e0", wall: "#fbf6ee", trim: "#e3cfae", glass: "#2a3c5e", ground: "#ead8bb" },
  { sky: ["#d8e8e4", "#f4efe6"], sun: "#f5e2bd", wall: "#f3ead9", trim: "#cdb68c", glass: "#16273f", ground: "#e2d6bf" },
  { sky: ["#18243b", "#2f3f60"], sun: "#e9d3a4", wall: "#3a4a68", trim: "#56678a", glass: "#f2c879", ground: "#24324d" },
];

type Props = { type: PropertyType; variant: number; uid: string };

export function ListingArt({ type, variant, uid }: Props) {
  const p = PALETTES[variant % PALETTES.length];
  const sky = `re-sky-${uid}`;
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="re-art">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${sky})`} />
      <circle cx="318" cy="62" r="26" fill={p.sun} opacity="0.9" />
      {/* distant hills, a nod to Muscat's mountains */}
      <path d="M0 190 L60 150 L110 172 L170 128 L230 168 L290 140 L350 170 L400 150 V260 H0z" fill={p.trim} opacity="0.35" />
      {type === "apartment" && <Apartment p={p} />}
      {type === "villa" && <Villa p={p} />}
      {type === "townhouse" && <Townhouse p={p} />}
      <rect y="228" width="400" height="32" fill={p.ground} />
    </svg>
  );
}

type P = (typeof PALETTES)[number];

function Apartment({ p }: { p: P }) {
  const cols = [0, 1, 2, 3];
  const rows = [0, 1, 2, 3, 4, 5, 6];
  return (
    <g>
      <rect x="250" y="96" width="70" height="132" fill={p.trim} opacity="0.7" />
      <rect x="140" y="38" width="120" height="190" rx="3" fill={p.wall} />
      <rect x="140" y="38" width="120" height="8" fill={p.trim} />
      {rows.map((r) =>
        cols.map((c) => (
          <rect key={`${r}-${c}`} x={152 + c * 26} y={56 + r * 24} width="18" height="14" rx="1.5" fill={p.glass} opacity={(r + c) % 3 === 0 ? 0.55 : 0.85} />
        )),
      )}
      {rows.map((r) => (
        <rect key={`b${r}`} x="146" y={72 + r * 24} width="108" height="2.5" fill={p.trim} />
      ))}
      <rect x="186" y="204" width="28" height="24" fill={p.glass} />
      <rect x="80" y="150" width="50" height="78" fill={p.trim} opacity="0.55" />
    </g>
  );
}

function Villa({ p }: { p: P }) {
  return (
    <g>
      <rect x="58" y="138" width="270" height="90" fill={p.wall} />
      <rect x="120" y="88" width="190" height="52" fill={p.wall} />
      <rect x="110" y="82" width="210" height="8" fill={p.trim} />
      <rect x="50" y="132" width="286" height="7" fill={p.trim} />
      <rect x="136" y="100" width="70" height="30" fill={p.glass} opacity="0.85" />
      <rect x="222" y="100" width="72" height="30" fill={p.glass} opacity="0.6" />
      <rect x="76" y="156" width="90" height="56" fill={p.glass} opacity="0.85" />
      <rect x="182" y="166" width="30" height="62" fill={p.trim} />
      <rect x="228" y="156" width="80" height="40" fill={p.glass} opacity="0.6" />
      {/* pool */}
      <rect x="210" y="232" width="120" height="10" rx="3" fill="#7fb6c9" />
      {/* palm */}
      <path d="M352 228 C350 196 352 170 356 150" stroke="#8a6a35" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M356 150 c-22 -6 -36 4 -42 14 M356 150 c18 -10 34 -6 42 4 M356 150 c-8 -18 -2 -30 8 -36 M356 150 c-20 6 -26 18 -26 28 M356 150 c16 2 26 14 28 24" stroke="#5f8a6a" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Townhouse({ p }: { p: P }) {
  const units = [0, 1, 2];
  return (
    <g>
      {units.map((i) => {
        const x = 62 + i * 92;
        const top = i === 1 ? 92 : 108;
        return (
          <g key={i}>
            <rect x={x} y={top} width="88" height={228 - top} fill={p.wall} />
            <rect x={x - 3} y={top - 6} width="94" height="7" fill={p.trim} />
            <rect x={x + 12} y={top + 16} width="64" height="34" fill={p.glass} opacity={i === 1 ? 0.85 : 0.65} />
            <rect x={x + 10} y={top + 54} width="68" height="3" fill={p.trim} />
            <rect x={x + 12} y={top + 70} width="30" height="30" fill={p.glass} opacity="0.7" />
            <rect x={x + 52} y={228 - 44} width="24" height="44" fill={p.trim} />
          </g>
        );
      })}
      <rect x="40" y="214" width="20" height="14" rx="7" fill="#5f8a6a" />
      <rect x="342" y="210" width="24" height="18" rx="9" fill="#5f8a6a" />
    </g>
  );
}
