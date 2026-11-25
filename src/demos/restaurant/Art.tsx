import type { PlateVariant, RestaurantCopy } from "./content";

/* Hand-drawn SVG scenes (no photos, nothing external). All decorative except
   the map, which is an image with a text label. None of them mirror in RTL:
   they are pictures, not directions. */

const STAR = "M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z";

export function HeroArt() {
  return (
    <svg viewBox="0 0 480 560" className="sumac-hero-svg" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sumac-glow" cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#f0b37e" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#a9471f" stopOpacity="0.28" />
          <stop offset="1" stopColor="#171a12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sumac-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4130" />
          <stop offset="1" stopColor="#262b1e" />
        </linearGradient>
        <linearGradient id="sumac-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3a22" />
          <stop offset="1" stopColor="#3b2616" />
        </linearGradient>
      </defs>

      {/* stone arch with a glowing interior */}
      <path d="M40 560 L40 220 Q40 40 240 40 Q440 40 440 220 L440 560 Z" fill="url(#sumac-stone)" />
      <path d="M84 560 L84 236 Q84 86 240 86 Q396 86 396 236 L396 560 Z" fill="#1d2117" />
      <path d="M84 560 L84 236 Q84 86 240 86 Q396 86 396 236 L396 560 Z" fill="url(#sumac-glow)" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const a = Math.PI * (i / 8);
        const x = 240 - Math.cos(a) * 178;
        const y = 228 - Math.sin(a) * 166;
        return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3" fill="#8c9a5b" opacity="0.7" />;
      })}

      {/* hanging brass lantern */}
      <path d="M240 86 L240 168" stroke="#c9a36a" strokeWidth="1.5" />
      <g transform="translate(240 196)">
        <path d="M-18 -24 L18 -24 L26 6 L0 30 L-26 6 Z" fill="#c9a36a" opacity="0.9" />
        <path d="M-12 -16 L12 -16 L17 4 L0 20 L-17 4 Z" fill="#ffd9a3" />
        <path d={STAR} transform="scale(0.55) translate(0 4)" fill="#c9a36a" />
      </g>
      <circle cx="240" cy="200" r="70" fill="#ffd9a3" opacity="0.08" />

      {/* olive branch growing in from the arch */}
      <g stroke="#8c9a5b" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M396 150 Q350 170 318 214" />
      </g>
      {[[384, 154, -30], [368, 164, 20], [352, 174, -40], [340, 188, 30], [328, 200, -20]].map(([x, y, r]) => (
        <ellipse key={`${x}`} cx={x} cy={y} rx="11" ry="4" transform={`rotate(${r} ${x} ${y})`} fill="#8c9a5b" />
      ))}
      <circle cx="336" cy="196" r="4" fill="#3b3f2a" />

      {/* table and a plate of hummus */}
      <rect x="84" y="438" width="312" height="18" fill="url(#sumac-wood)" />
      <rect x="84" y="456" width="312" height="104" fill="#20251a" />
      <ellipse cx="240" cy="430" rx="104" ry="22" fill="#f2e9d8" />
      <ellipse cx="240" cy="426" rx="78" ry="15" fill="#e7d3ac" />
      <path d="M182 426 Q240 404 298 426 Q240 444 182 426" fill="none" stroke="#c9ad7c" strokeWidth="2" />
      <ellipse cx="240" cy="424" rx="22" ry="5" fill="#b9892b" opacity="0.8" />
      {[[212, 420], [228, 432], [258, 418], [270, 430], [236, 414], [250, 434]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="#a9471f" />
      ))}
      {/* bread and a glass of tea */}
      <ellipse cx="128" cy="436" rx="34" ry="8" fill="#d9b27c" />
      <path d="M340 404 L362 404 L358 438 L344 438 Z" fill="#a9471f" opacity="0.85" />
      <path d="M340 404 L362 404" stroke="#f2e9d8" strokeWidth="1.5" />
      <path d="M350 396 Q346 388 352 380 M356 396 Q352 388 358 380" stroke="#f2e9d8" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />

      {/* eight-point star tiles at the foot of the arch */}
      {[62, 418].map((x) => (
        <g key={x} transform={`translate(${x} 510)`}>
          <path d={STAR} fill="none" stroke="#d9774b" strokeWidth="1.5" />
          <path d={STAR} transform="rotate(45)" fill="none" stroke="#d9774b" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

const PLATE_FOOD: Record<PlateVariant, React.ReactNode> = {
  mansaf: (
    <>
      <circle cx="100" cy="100" r="54" fill="#f3e3b8" />
      <circle cx="100" cy="100" r="40" fill="#e9c66f" />
      {[[86, 88], [112, 92], [98, 112], [118, 112], [80, 110]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="11" ry="8" fill="#7a4a2b" />
      ))}
      {[[92, 76], [108, 80], [124, 98], [76, 98], [100, 124], [88, 100]].map(([x, y]) => (
        <ellipse key={`a${x}${y}`} cx={x} cy={y} rx="3.5" ry="1.6" fill="#f7efe0" />
      ))}
    </>
  ),
  lamb: (
    <>
      <ellipse cx="100" cy="104" rx="56" ry="46" fill="#8b6b3d" />
      <path d="M58 104 Q70 64 112 66 Q150 70 144 106 Q132 136 94 134 Q62 128 58 104 Z" fill="#6a3a22" />
      <path d="M76 96 Q100 82 128 98" stroke="#a65a33" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M140 72 L160 52" stroke="#f2e9d8" strokeWidth="7" strokeLinecap="round" />
      <circle cx="138" cy="126" r="12" fill="#f2e9d8" />
      {[[70, 80], [128, 120], [84, 128]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill="#8c9a5b" />
      ))}
    </>
  ),
  musakhan: (
    <>
      <circle cx="100" cy="100" r="58" fill="#d9a865" />
      <circle cx="100" cy="100" r="46" fill="#8a3b5a" opacity="0.9" />
      {[[84, 88], [114, 90], [100, 114], [80, 112], [120, 116]].map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x - 10} ${y} Q${x} ${y - 9} ${x + 10} ${y}`} stroke="#f0d9b0" strokeWidth="3" fill="none" />
      ))}
      <path d="M86 98 Q100 86 116 100 Q104 112 86 98 Z" fill="#b8743d" />
      {[[92, 74], [110, 128], [130, 96], [70, 100]].map(([x, y]) => (
        <circle key={`p${x}${y}`} cx={x} cy={y} r="2.6" fill="#f2e9d8" />
      ))}
    </>
  ),
};

export function PlateArt({ variant }: { variant: PlateVariant }) {
  return (
    <svg viewBox="0 0 200 200" className="sumac-plate" aria-hidden="true" focusable="false">
      <circle cx="100" cy="104" r="88" fill="#0f120b" opacity="0.45" />
      <circle cx="100" cy="100" r="86" fill="#f2e9d8" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="#d8c8a8" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#a9471f" strokeWidth="1" strokeDasharray="2 6" />
      {PLATE_FOOD[variant]}
    </svg>
  );
}

export function MapArt({ c }: { c: RestaurantCopy["visit"]["map"] }) {
  return (
    <svg viewBox="0 0 400 280" className="sumac-map" role="img" aria-label={c.label}>
      <rect width="400" height="280" fill="#232819" />
      {/* city blocks */}
      {[[20, 20, 90, 60], [126, 16, 70, 52], [214, 22, 80, 44], [312, 18, 70, 70], [24, 200, 80, 60], [150, 196, 96, 64],
        [270, 186, 110, 76], [210, 96, 60, 50], [300, 104, 76, 56]].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="6" fill="#2c3222" />
      ))}
      <path d="M0 120 Q60 112 100 140" stroke="#3a4130" strokeWidth="14" fill="none" />
      <path d="M118 0 L112 116" stroke="#3a4130" strokeWidth="12" fill="none" />
      <path d="M100 166 L84 280" stroke="#3a4130" strokeWidth="12" fill="none" />
      {/* Rainbow Street, highlighted */}
      <path d="M130 146 Q200 150 248 132 Q300 112 400 92" stroke="#a9471f" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M130 146 Q200 150 248 132 Q300 112 400 92" stroke="#d9774b" strokeWidth="2" strokeDasharray="6 6" fill="none" />
      {/* First Circle */}
      <circle cx="110" cy="146" r="26" fill="none" stroke="#3a4130" strokeWidth="12" />
      <circle cx="110" cy="146" r="14" fill="#55623a" />
      {/* pin */}
      <g transform="translate(250 130)">
        <circle r="22" fill="#d9774b" opacity="0.18" />
        <path d="M0 0 C-14 -16 -14 -34 0 -38 C14 -34 14 -16 0 0 Z" fill="#d9774b" />
        <circle cy="-26" r="5" fill="#171a12" />
      </g>
      <g fill="#f2e9d8" fontSize="13" textAnchor="middle" fontFamily="inherit">
        <text x="330" y="88" transform="rotate(-10 330 88)">{c.street}</text>
        <text x="110" y="192" fill="#b4ad9c">{c.circle}</text>
        <text x="250" y="168" fill="#b4ad9c">{c.area}</text>
      </g>
    </svg>
  );
}
