/**
 * Section eyebrow: a small pill with a crimson dot and the section's label,
 * directly above a section's <SectionHeading> (same tone).
 *
 *   <SectionMarker index={2} label={t("marker")} />
 *   <SectionMarker index={6} label={t("marker")} tone="paper" />
 *
 * `index` is kept so existing callers keep compiling; the Nov 24 redesign
 * no longer prints section codes. Styles: .eyebrow in src/styles/system.css.
 */
export default function SectionMarker({
  label,
  tone = "dark",
  className = "",
}: {
  index?: number;
  label: string;
  tone?: "dark" | "paper";
  className?: string;
}) {
  return (
    <p className={`eyebrow ${tone === "paper" ? "eyebrow-paper text-bg" : "text-text"} ${className}`}>
      {label}
    </p>
  );
}
