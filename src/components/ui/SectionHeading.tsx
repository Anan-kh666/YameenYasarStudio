/* Section title + the short crimson→silver brand rule under it.
   One component so every section below the hero shares the same rhythm.
   `tone="paper"` for the light sections (dark text).
   Optional: `align="center"` centres the block (rule included), `lead` adds
   the section's intro line under the rule in the matching muted colour. */
export default function SectionHeading({
  children,
  tone = "dark",
  align = "start",
  lead,
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "paper";
  align?: "start" | "center";
  lead?: React.ReactNode;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <h2
        className={`font-heading text-balance text-[1.875rem] font-semibold leading-[1.2] md:text-[2.75rem] md:leading-[1.12] ${
          tone === "paper" ? "text-bg" : "text-text"
        }`}
      >
        {children}
      </h2>
      <span className={`brand-rule mt-5 ${centered ? "mx-auto" : ""}`} aria-hidden="true" />
      {lead && (
        <p
          className={`mt-6 max-w-2xl text-pretty text-body ${centered ? "mx-auto" : ""} ${
            tone === "paper" ? "text-bg/70" : "text-text-muted"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
