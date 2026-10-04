import { useTranslations } from "next-intl";

/**
 * Horizontal logo with staggered reveal animation.
 * Dark-only site — always shows the reversed (light-on-dark) variant.
 * Wrapped in dir="ltr" so the logo never flips in RTL.
 */
export default function Logo() {
  const t = useTranslations("header");
  const alt = t("logoAlt");

  return (
    <span dir="ltr" className="logo-glow inline-block relative">
      <img
        src="/brand/yy-logo-horizontal-reversed.svg"
        alt={alt}
        width={138}
        height={32}
        className="block h-8 w-auto logo-reveal"
      />
      {/* Gleam sweep element — clipped to logo bounds */}
      <span className="logo-gleam-bar" aria-hidden="true" />
    </span>
  );
}
