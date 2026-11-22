/**
 * Compile-system section marker: ‹02› ── LABEL  ar ⇄ en
 * Goes directly above a section's <SectionHeading> (same tone).
 *
 *   <SectionMarker index={2} label={t("marker")} />
 *   <SectionMarker index={6} label={t("marker")} tone="paper" />
 *
 * `index` is the section's place on the page (hero 0, problem 1, packages 2,
 * work 3, process 4, about 5, faq 6, contact 7; the footer index uses the same
 * codes), printed with Western digits in both locales. `label` comes from the
 * messages. The code and the "ar ⇄ en" tag are decorative and hidden from
 * screen readers; the label is read.
 * Styles: .section-marker block in globals.css ("Compile system").
 */
export default function SectionMarker({
  index,
  label,
  tone = "dark",
  className = "",
}: {
  index: number;
  label: string;
  tone?: "dark" | "paper";
  className?: string;
}) {
  return (
    <div
      className={`section-marker ${tone === "paper" ? "section-marker-paper text-bg" : "text-text"} ${className}`}
    >
      {/* dir="ltr" keeps the ‹ › pair from being mirrored in RTL */}
      <span className="marker-code" dir="ltr" aria-hidden="true">
        ‹{String(index).padStart(2, "0")}›
      </span>
      <span className="marker-rule" aria-hidden="true" />
      <span className="mono-label mono-muted">{label}</span>
      <span className="marker-tag hidden sm:inline" dir="ltr" aria-hidden="true">
        ar ⇄ en
      </span>
    </div>
  );
}
