import { Atom, Braces, BrainCircuit, ChartColumn, Megaphone, MessageSquareText, Palette, PenTool, Star } from "lucide-react";
import type { Cover } from "./data";

/* Small presentational pieces shared by the server page and the client
   components (no hooks, so they work on both sides). */

export const COVER_ICONS: Record<Cover, typeof Star> = {
  palette: Palette,
  pen: PenTool,
  message: MessageSquareText,
  braces: Braces,
  atom: Atom,
  chart: ChartColumn,
  brain: BrainCircuit,
  megaphone: Megaphone,
};

/** Five stars, filled up to `rating` (rounded). Decorative: pass the text label separately. */
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <span className="qalam-stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} className={i < full ? "is-on" : undefined} />
      ))}
    </span>
  );
}

/** Abstract course cover: tinted gradient, soft shapes and the course icon. */
export function CourseCover({ cover, hue }: { cover: Cover; hue: number }) {
  const Icon = COVER_ICONS[cover];
  return (
    <div className="qalam-cover" style={{ "--hue": hue } as React.CSSProperties} aria-hidden="true">
      <span className="qalam-cover-ring" />
      <span className="qalam-cover-dot" />
      <span className="qalam-cover-icon">
        <Icon size={28} strokeWidth={1.75} />
      </span>
    </div>
  );
}

export const usd = (n: number) => `$${n}`;
