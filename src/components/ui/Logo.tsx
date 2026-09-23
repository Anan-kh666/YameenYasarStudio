import { useTranslations } from "next-intl";

/**
 * Logo placeholder — renders studio name as styled text.
 * TODO(anan): replace with <img> of public/brand/yy-logo-horizontal.svg
 * (and -reversed variant for dark mode) once the final SVGs are ready.
 */
export default function Logo() {
  const t = useTranslations("header");

  return (
    <span className="flex items-center gap-1.5 text-h2 font-semibold leading-none" aria-label={t("logoAlt")}>
      <span className="text-yameen">YY</span>
    </span>
  );
}
