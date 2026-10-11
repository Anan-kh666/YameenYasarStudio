/** Read the real font-family string that next/font put in a CSS variable
    (e.g. "--font-tajawal" → "'Tajawal', 'Tajawal Fallback'"), for use in
    canvas `ctx.font`, which can't resolve CSS variables itself. */
export function cssFontFamily(variable: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v || fallback;
}
