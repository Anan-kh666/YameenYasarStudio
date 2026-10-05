/* Central config for contact details, pricing, and feature flags. */

export const site = {
  url: "https://yameenyasar.com",
  name: "Yameen Yasar Studio",
  nameAr: "يمين يسار",
  email: "hello@yameenyasar.com",

  // TODO(anan): replace with your WhatsApp number in international format (no + or spaces)
  whatsappNumber: "60172051922",

  instagram: "https://www.instagram.com/yameenyasarstudio",
  // TODO(anan): verify this LinkedIn URL is correct
  linkedin: "https://www.linkedin.com/company/yameen-yasar-studio",

  /** November-offer banner on the packages section. Set false to hide. */
  launchOffer: true,

  prices: {
    launch: 300,
    business: 750,
    customFrom: 1500,
    monthlyCare: 40,
    copywriting: 30,
  },
} as const;

/** Build a WhatsApp link with a prefilled message for the given locale. */
export function whatsappUrl(locale: string, message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
