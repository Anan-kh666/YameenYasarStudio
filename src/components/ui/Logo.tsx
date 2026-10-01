import { useTranslations } from "next-intl";

/**
 * Horizontal logo — swaps to the reversed variant in dark mode via CSS only
 * (two <img>, toggled with display), so there's no flash on load.
 * Wrapped in dir="ltr" so it never flips in RTL layouts.
 * Minimum height: 32px (per brand guidelines).
 */
export default function Logo() {
  const t = useTranslations("header");
  const alt = t("logoAlt");

  return (
    <span dir="ltr" className="logo-glow inline-block">
      {/* Light mode */}
      <img
        src="/brand/yy-logo-horizontal.svg"
        alt={alt}
        width={138}
        height={32}
        className="block h-8 w-auto dark:hidden"
      />
      {/* Dark mode */}
      <img
        src="/brand/yy-logo-horizontal-reversed.svg"
        alt={alt}
        width={138}
        height={32}
        className="hidden h-8 w-auto dark:block"
      />
    </span>
  );
}
