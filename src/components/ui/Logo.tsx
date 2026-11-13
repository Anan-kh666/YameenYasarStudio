import { useTranslations } from "next-intl";

/**
 * Horizontal logo with staggered reveal animation.
 * Dark-only site. The image is yy-logo-header.webp: the transparent intro logo
 * (yy-logo-intro.png) resized to 381×114 (Lanczos, exact ratio) with 62px/65px
 * of transparent space on the left/right, saved as lossless WebP: no crop, no
 * recolour, the logo pixels are the plain resize. So the wordmark fills the
 * whole height instead of sitting small inside a black box.
 * The side space copies the old yy-logo-new.png (28 | 171 | 29 px), so the
 * logo-reveal keyframes (tuned for that file: the "mark only" hold at 36% of
 * the width falls between the Y and the A) and the gleam sweep look the same.
 * That space is ~0.56× the logo height per side, so callers pull the link in
 * with a negative start margin (as far as the page gutter allows) to line the
 * visible logo up with the content edge.
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
        /* Must match the file's real pixel size (508×114): the browser uses
           this ratio to reserve the logo's width before the image loads.
           114px tall stays sharp on 2× screens up to ~h-14 (56px). */
        width={508}
        height={114}
        className={`block w-auto logo-reveal ${sizeClass}`}
      />
      {/* Gleam sweep element — clipped to logo bounds */}
      <span className="logo-gleam-bar" aria-hidden="true" />
    </span>
  );
}
