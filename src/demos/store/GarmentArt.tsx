import { useId } from "react";
import type { Art } from "./content";

/* Flat SVG "product photos": one silhouette per product type, filled with the
   selected colour plus a shared sheen/shadow overlay so dark and light fabrics
   both read as cloth. Decorative (the product name is always next to it).
   Never mirrored in RTL: it is a picture, not a direction. */

const SHAPES: Record<"abaya" | "kaftan", string> = {
  abaya:
    "M86 34 Q100 46 114 34 L140 41 Q151 45 156 58 L178 127 L160 134 L146 92 L153 222 Q100 231 47 222 L54 92 L40 134 L22 127 L44 58 Q49 45 60 41 Z",
  kaftan:
    "M84 36 Q100 50 116 36 L168 45 Q181 49 184 61 L187 106 L150 110 L147 222 Q100 229 53 222 L50 110 L13 106 L16 61 Q19 49 32 45 Z",
};

export default function GarmentArt({ art, color, className }: { art: Art; color: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const sheen = `url(#s${id})`;
  const isLight = parseInt(color.slice(1, 3), 16) > 0xb0;
  const ink = isLight ? "rgb(28 25 22 / 0.18)" : "rgb(255 255 255 / 0.14)";

  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.38" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.26" />
        </linearGradient>
        <radialGradient id={`p${id}`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="0.6" stopColor="#efe6d6" />
          <stop offset="1" stopColor="#cbbba2" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="226" rx="62" ry="6" fill="rgb(28 25 22 / 0.12)" />

      {(art === "abaya" || art === "abaya-open") && (
        <g>
          <path d={SHAPES.abaya} fill={color} />
          {art === "abaya-open" ? (
            <>
              <path d="M93 40 L86 223 L114 223 L107 40 Q100 46 93 40 Z" fill={isLight ? "#3a302a" : "#ece3d3"} />
              <path d="M93 40 L86 223 M107 40 L114 223" stroke="#9a6b3f" strokeWidth="2.2" fill="none" />
            </>
          ) : (
            <path d="M100 44 L100 224" stroke={ink} strokeWidth="1.4" />
          )}
          <path d="M72 100 Q70 160 66 220 M128 100 Q130 160 134 220" stroke={ink} strokeWidth="1.2" fill="none" />
          <path d={SHAPES.abaya} fill={sheen} />
        </g>
      )}

      {(art === "kaftan" || art === "kaftan-belted") && (
        <g>
          <path d={SHAPES.kaftan} fill={color} />
          <path d="M88 39 Q100 60 112 39" stroke={ink} strokeWidth="1.6" fill="none" />
          <path d="M60 186 L58 222 M140 186 L142 222" stroke={ink} strokeWidth="1.4" />
          {art === "kaftan-belted" && (
            <>
              <path d="M51 118 Q100 126 149 118 L149 128 Q100 136 51 128 Z" fill={color} />
              <path d="M51 118 Q100 126 149 118 L149 128 Q100 136 51 128 Z" fill="rgb(0 0 0 / 0.14)" />
              <path d="M96 128 L90 160 M104 128 L110 158" stroke={color} strokeWidth="5" strokeLinecap="round" />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <circle key={i} cx={82 + i * 6} cy={66 + Math.abs(3 - i) * -3 + 9} r="1.8" fill="#c8a35f" />
              ))}
              <path d="M84 52 Q100 80 116 52" stroke="#c8a35f" strokeWidth="1.4" fill="none" strokeDasharray="2 3" />
            </>
          )}
          <path d={SHAPES.kaftan} fill={sheen} />
        </g>
      )}

      {art === "scarf" && (
        <g>
          {/* square silk scarf folded into a triangle, hung over a brass rail */}
          <path d="M36 58 L164 58" stroke="#a58a5c" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M40 60 L160 60 L100 196 Z" fill={color} />
          <path d="M52 66 L148 66 L100 176 Z" fill="none" stroke={ink} strokeWidth="1.4" strokeDasharray="1 5" strokeLinecap="round" />
          <path d="M70 60 L100 128 L130 60" stroke={ink} strokeWidth="1.2" fill="none" />
          <circle cx="100" cy="96" r="9" fill="none" stroke={ink} strokeWidth="1.4" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const t = (i + 1) / 9;
            const lx = 40 + 60 * t, ly = 60 + 136 * t, rx = 160 - 60 * t;
            return (
              <g key={i} stroke={color} strokeWidth="1.6" strokeLinecap="round">
                <path d={`M${lx} ${ly} l-6 9`} />
                <path d={`M${rx} ${ly} l6 9`} />
              </g>
            );
          })}
          <path d="M40 60 L160 60 L100 196 Z" fill={sheen} />
        </g>
      )}

      {art === "scarf-folded" && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${i * -26})`}>
              <rect x="36" y="160" width="128" height="40" rx="8" fill={color} />
              <rect x="36" y="160" width="128" height="40" rx="8" fill={sheen} />
              <path d="M44 172 Q100 166 156 172" stroke={ink} strokeWidth="1.2" fill="none" />
            </g>
          ))}
        </g>
      )}

      {art === "tote" && (
        <g>
          <path d="M72 106 C72 44 128 44 128 106" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M72 106 C72 44 128 44 128 106" stroke="rgb(0 0 0 / 0.2)" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M44 100 L156 100 L164 212 Q164 218 157 218 L43 218 Q36 218 36 212 Z" fill={color} />
          <path d="M50 110 L150 110 L156 206 L44 206 Z" stroke="rgb(255 255 255 / 0.22)" strokeWidth="1.2" strokeDasharray="3 4" fill="none" />
          <rect x="92" y="120" width="16" height="10" rx="2" fill="#c8a35f" />
          <path d="M44 100 L156 100 L164 212 Q164 218 157 218 L43 218 Q36 218 36 212 Z" fill={sheen} />
        </g>
      )}

      {art === "pins" && (
        <g>
          <rect x="40" y="56" width="120" height="156" rx="10" fill="#f3ece0" stroke="rgb(28 25 22 / 0.1)" />
          {[60, 110, 160].map((y, i) => (
            <g key={y} transform={`rotate(-28 100 ${y})`}>
              <path d={`M70 ${y} L146 ${y}`} stroke={color} strokeWidth="2.4" strokeLinecap="round" />
              <path d={`M70 ${y} L146 ${y}`} stroke="rgb(0 0 0 / 0.18)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="64" cy={y} r={11 - i * 1.5} fill={`url(#p${id})`} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
