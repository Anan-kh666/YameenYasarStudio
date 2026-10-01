import { useTranslations } from "next-intl";

/**
 * Horizontal logo with a staggered reveal animation:
 *  1. Mark (chevron) slides in first
 *  2. Brief pause — mark visible alone
 *  3. Text sweeps in
 *
 * A breathing glow pulses behind and a subtle gleam sweeps
 * across periodically. All motion is disabled for reduced-motion.
 *
 * Wrapped in dir="ltr" so the logo never flips in RTL.
 */
export default function Logo() {
  const t = useTranslations("header");
  const alt = t("logoAlt");

  return (
    <span dir="ltr" className="logo-glow inline-block relative">
      {/* Light mode */}
      <img
        src="/brand/yy-logo-horizontal.svg"
        alt={alt}
        width={138}
        height={32}
        className="block h-8 w-auto dark:hidden logo-reveal"
      />
      {/* Dark mode */}
      <img
        src="/brand/yy-logo-horizontal-reversed.svg"
        alt={alt}
        width={138}
        height={32}
        className="hidden h-8 w-auto dark:block logo-reveal"
      />
      {/* Gleam sweep element — clipped to logo bounds */}
      <span className="logo-gleam-bar" aria-hidden="true" />
    </span>
  );
}
