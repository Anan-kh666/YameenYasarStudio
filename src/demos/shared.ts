/* Shared bits for the concept demos (src/app/(demo)). */
export const DEMO_LOCALES = ["ar", "en"] as const;
export type DemoLocale = (typeof DEMO_LOCALES)[number];

export const demoBarCopy = {
  ar: { label: "نموذج تجريبي من تصميم", studio: "يمين يسار", back: "العودة إلى الاستوديو", other: "English" },
  en: { label: "Concept demo by", studio: "Yameen Yasar Studio", back: "Back to the studio", other: "عربي" },
} as const;
