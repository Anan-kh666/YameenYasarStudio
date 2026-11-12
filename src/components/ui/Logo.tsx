import { useTranslations } from "next-intl";

/**
 * Horizontal logo with staggered reveal animation.
 * Dark-only site — always shows the new Higgsfield-rendered logo on dark bg.
 * Wrapped in dir="ltr" so the logo never flips in RTL.
 */
type Props = {
  /** Height utility for the image (width follows the aspect ratio). */
  sizeClass?: string;
};

export default function Logo({ sizeClass = "h-8" }: Props) {
  const t = useTranslations("header");
  const alt = t("logoAlt");

  return (
    <span dir="ltr" className="logo-glow inline-block relative">
      <img
        src="/brand/yy-logo-new.png"
        alt={alt}
        /* Must match the file's real pixel size (228×128): the browser uses
           this ratio to reserve the logo's width before the image loads. */
        width={228}
        height={128}
        className={`block w-auto logo-reveal ${sizeClass}`}
      />
      {/* Gleam sweep element — clipped to logo bounds */}
      <span className="logo-gleam-bar" aria-hidden="true" />
    </span>
  );
}
