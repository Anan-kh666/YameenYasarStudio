/* Central config for contact details, pricing, and feature flags. */

export const site = {
  name: "Yameen Yasar Studio",
  nameAr: "يمين يسار",
  email: "hello@yameenyasar.com",

  // TODO(anan): replace with your WhatsApp number in international format (no + or spaces)
  whatsappNumber: "60172051922",

  // TODO(anan): add real URLs once created
  instagram: "",
  linkedin: "",

  // TODO(anan): replace with the real Zait & Za'atar live URL
  zaitZaatarUrl: "",

  /** Launch-offer banner on the packages section. Set false to hide. */
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
