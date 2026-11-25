import { Toothbrush, Sparkles, Bone, AlignHorizontalDistributeCenter, Baby, Ambulance, type LucideIcon } from "lucide-react";
import type { ServiceId } from "./content";

export const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  cleaning: Toothbrush,
  whitening: Sparkles,
  implants: Bone,
  ortho: AlignHorizontalDistributeCenter,
  kids: Baby,
  emergency: Ambulance,
};

/* Abstract doctor portrait: soft gradient disc, shoulders in a white coat,
   initials on the "badge". No faces, no stock photos. Decorative only. */
export function DoctorAvatar({ hue, initials, size = 64 }: { hue: number; initials: string; size?: number }) {
  const id = `clinic-av-${hue}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="clinic-avatar">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 55% 88%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 45% 72%)`} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#${id})`} />
      <circle cx="32" cy="25" r="10" fill={`hsl(${hue} 35% 40% / 0.85)`} />
      <path d="M12 58c2-11 10-17 20-17s18 6 20 17a32 32 0 0 1-40 0z" fill="#fff" />
      <path d="M32 41l-5 8 5 9 5-9z" fill={`hsl(${hue} 60% 30%)`} />
      <text x="44" y="53" textAnchor="middle" fontSize="7" fontWeight="700" fill={`hsl(${hue} 60% 25%)`}>{initials}</text>
    </svg>
  );
}
