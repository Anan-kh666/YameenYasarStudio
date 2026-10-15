/* Section title + the short crimson→silver brand rule under it.
   One component so every section below the hero shares the same rhythm.
   `tone="paper"` for the light sections (dark text). */
export default function SectionHeading({
  children,
  tone = "dark",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "paper";
  className?: string;
}) {
  return (
    <div className={className}>
      <h2
        className={`font-heading text-balance text-[1.875rem] font-semibold leading-[1.2] md:text-[2.75rem] md:leading-[1.12] ${
          tone === "paper" ? "text-bg" : "text-text"
        }`}
      >
        {children}
      </h2>
      <span className="brand-rule mt-5" aria-hidden="true" />
    </div>
  );
}
