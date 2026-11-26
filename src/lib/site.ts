/* Central config for contact details, pricing, and feature flags. */

export const site = {
  url: "https://yameenyasar.com",
  name: "Yameen Yasar Studio",
  nameAr: "يمين يسار",
  email: "anankherbek666@gmail.com",
  whatsappNumber: "60172051922",

  instagram: "https://www.instagram.com/yameenyasarstudio",
  // TODO(anan): verify this LinkedIn URL is correct
  linkedin: "https://www.linkedin.com/company/yameen-yasar-studio",

  /** November-offer banner on the packages section. Set false to hide. */
  launchOffer: true,
} as const;

/** Build a WhatsApp link with a prefilled message. */
export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
