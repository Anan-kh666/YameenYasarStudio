import { useTranslations } from "next-intl";

/**
 * Horizontal logo with staggered reveal animation.
 * Dark-only site. The image is yy-logo-header.webp: the transparent intro logo
 * (yy-logo-intro.png) resized to 360px wide (Lanczos) and saved as lossless
 * WebP: no crop, no recolour, every pixel is the plain resize. So the
 * wordmark fills the whole height instead of sitting small inside a black box.
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
        src="/brand/yy-logo-header.webp"
        alt={alt}
        /* Must match the file's real pixel size (360×108): the browser uses
           this ratio to reserve the logo's width before the image loads.
           360px wide stays sharp on 2× screens up to ~h-13 (52px). */
        width={360}
        height={108}
        className={`block w-auto logo-reveal ${sizeClass}`}
      />
      {/* Gleam sweep element — clipped to logo bounds */}
      <span className="logo-gleam-bar" aria-hidden="true" />
    </span>
  );
}
