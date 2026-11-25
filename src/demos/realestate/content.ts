/* Manzil (منزل) concept demo: every visible string, in both languages.
   `ar` is typed as `typeof en`, so the two trees can never drift apart. */

export type Deal = "buy" | "rent";
export type PropertyType = "apartment" | "villa" | "townhouse";
export type AreaId = "almouj" | "qurum" | "msq" | "khuwair" | "bausher" | "seeb";
export type AmenityId = "pool" | "gym" | "parking" | "garden" | "security" | "ac" | "furnished" | "seaview";
export type ListingId = "mouj-apt" | "msq-villa" | "mouj-town" | "khuwair-apt" | "qurum-villa" | "qurum-apt" | "bausher-town" | "seeb-villa" | "bausher-apt";

export type Listing = {
  id: ListingId;
  deal: Deal;
  type: PropertyType;
  area: AreaId;
  beds: number;
  baths: number;
  size: number; // m²
  price: number; // OMR; monthly for rentals
  amenities: AmenityId[];
  art: number; // palette variant for the card illustration
};

export const AREA_IDS: AreaId[] = ["almouj", "qurum", "msq", "khuwair", "bausher", "seeb"];
export const TYPE_IDS: PropertyType[] = ["apartment", "villa", "townhouse"];
export const BEDS = [1, 2, 3, 4];
export const MAX_PRICES: Record<Deal, number[]> = { buy: [150000, 250000, 400000], rent: [500, 1000, 1500] };

export const LISTINGS: Listing[] = [
  { id: "mouj-apt", deal: "buy", type: "apartment", area: "almouj", beds: 2, baths: 2, size: 128, price: 118000, amenities: ["seaview", "pool", "gym", "parking", "security"], art: 0 },
  { id: "msq-villa", deal: "buy", type: "villa", area: "msq", beds: 5, baths: 5, size: 420, price: 395000, amenities: ["garden", "pool", "parking", "security", "ac"], art: 1 },
  { id: "mouj-town", deal: "buy", type: "townhouse", area: "almouj", beds: 3, baths: 3, size: 210, price: 215000, amenities: ["seaview", "garden", "parking", "security"], art: 2 },
  { id: "khuwair-apt", deal: "rent", type: "apartment", area: "khuwair", beds: 1, baths: 1, size: 68, price: 320, amenities: ["furnished", "ac", "parking"], art: 3 },
  { id: "qurum-villa", deal: "rent", type: "villa", area: "qurum", beds: 4, baths: 4, size: 360, price: 1450, amenities: ["garden", "pool", "ac", "parking"], art: 0 },
  { id: "qurum-apt", deal: "buy", type: "apartment", area: "qurum", beds: 3, baths: 3, size: 165, price: 142000, amenities: ["gym", "pool", "parking", "ac", "security"], art: 1 },
  { id: "bausher-town", deal: "rent", type: "townhouse", area: "bausher", beds: 3, baths: 3, size: 230, price: 780, amenities: ["garden", "parking", "ac"], art: 3 },
  { id: "seeb-villa", deal: "buy", type: "villa", area: "seeb", beds: 4, baths: 5, size: 380, price: 168000, amenities: ["garden", "parking", "ac", "security"], art: 2 },
  { id: "bausher-apt", deal: "rent", type: "apartment", area: "bausher", beds: 2, baths: 2, size: 110, price: 480, amenities: ["furnished", "gym", "pool", "parking", "ac"], art: 0 },
];

export const PHONE = "+968 2412 3456";
export const EMAIL = "hello@manzil.om";

const en = {
  meta: {
    title: "Manzil — Homes for sale and rent in Muscat",
    description: "Browse verified apartments, villas and townhouses across Muscat, compare prices in OMR and estimate your monthly mortgage in seconds.",
  },
  brand: "Manzil",
  navLabel: "Main",
  nav: { listings: "Homes", areas: "Neighbourhoods", agent: "Talk to an advisor" },
  cta: "List your property",
  hero: {
    eyebrow: "Muscat · verified listings",
    title: "Find the home that fits the way you live",
    sub: "Apartments, villas and townhouses across Muscat, each one visited and verified by our team. Clear prices, real floor areas, no surprises.",
    stats: [
      { value: "1,240", label: "verified homes" },
      { value: "6", label: "neighbourhoods" },
      { value: "48h", label: "to book a viewing" },
    ],
    featured: { label: "Featured this week", tag: "New" },
  },
  search: {
    label: "Search homes",
    dealLabel: "I want to",
    deal: { buy: "Buy", rent: "Rent" },
    area: "Where",
    areaAny: "All of Muscat",
    type: "Property type",
    typeAny: "Any type",
    beds: "Bedrooms",
    bedsAny: "Any",
    bedsOpts: ["1+ bedrooms", "2+ bedrooms", "3+ bedrooms", "4+ bedrooms"],
    submit: "Search",
  },
  types: { apartment: "Apartment", villa: "Villa", townhouse: "Townhouse" },
  areas: { almouj: "Al Mouj", qurum: "Qurum", msq: "Madinat Sultan Qaboos", khuwair: "Al Khuwair", bausher: "Bausher", seeb: "Al Seeb" },
  listings: {
    eyebrow: "Listings",
    title: "Homes available now",
    filtersLabel: "Filter homes",
    maxPrice: "Max price",
    any: "Any",
    upTo: "Up to {p}",
    sort: "Sort by",
    sortOpts: { recommended: "Recommended", priceAsc: "Price: low to high", priceDesc: "Price: high to low" },
    count: { zero: "No homes match", one: "1 home found", two: "2 homes found", few: "{n} homes found" },
    saved: "Saved",
    reset: "Clear filters",
    emptyTitle: "Nothing matches these filters yet",
    emptyBody: "Try a higher budget or fewer bedrooms. New homes are added every week.",
    save: "Save {title}",
    view: "View details",
    currency: "OMR {n}",
    perMonth: "/ month",
    beds: { one: "1 bed", two: "2 beds", few: "{n} beds" },
    baths: { one: "1 bath", two: "2 baths", few: "{n} baths" },
    sqm: "{n} m²",
    forSale: "For sale",
    forRent: "For rent",
  },
  items: {
    "mouj-apt": { title: "Sea-view apartment in Al Mouj", desc: "A bright corner apartment on the marina with a wide balcony facing the sea, two en-suite bedrooms and residents' access to the beach club." },
    "msq-villa": { title: "Family villa in Madinat Sultan Qaboos", desc: "A generous five-bedroom villa on a quiet street close to the international schools, with a private pool, mature garden and a separate majlis." },
    "mouj-town": { title: "Marina townhouse in Al Mouj", desc: "Three floors of open living a short walk from the marina, with a rooftop terrace, a private garden and two covered parking spaces." },
    "khuwair-apt": { title: "One-bedroom apartment in Al Khuwair", desc: "A fully furnished one-bedroom close to the ministries and cafés of Al Khuwair. Ideal for a professional moving to Muscat." },
    "qurum-villa": { title: "Garden villa near Qurum Beach", desc: "A calm four-bedroom villa five minutes from Qurum Beach and the natural park, with a shaded garden and a pool for the summer evenings." },
    "qurum-apt": { title: "Three-bedroom apartment in Qurum Heights", desc: "A spacious apartment with city and mountain views, a residents' gym and pool, and 24-hour security in one of Qurum's best-kept buildings." },
    "bausher-town": { title: "Corner townhouse in Bausher", desc: "A corner townhouse with extra natural light, a small garden and quick access to Muscat Expressway and the city's main malls." },
    "seeb-villa": { title: "New-build villa in Al Seeb", desc: "A newly completed four-bedroom villa with high ceilings, a maid's room and a large plot, ten minutes from Muscat International Airport." },
    "bausher-apt": { title: "Two-bedroom apartment by Muscat Grand Mall", desc: "A furnished two-bedroom in a modern tower with a pool and gym, steps from Muscat Grand Mall and the Bausher cafés." },
  },
  amenities: { pool: "Swimming pool", gym: "Gym", parking: "Covered parking", garden: "Private garden", security: "24/7 security", ac: "Central A/C", furnished: "Furnished", seaview: "Sea view" },
  dialog: {
    close: "Close",
    overview: "About this home",
    amenities: "Amenities",
    size: "Floor area",
    beds: "Bedrooms",
    baths: "Bathrooms",
    area: "Neighbourhood",
    calcTitle: "Mortgage calculator",
    price: "Property price (OMR)",
    down: "Down payment",
    years: "Loan term",
    yearsOpt: "{n} years",
    rate: "Interest rate (% per year)",
    monthly: "Estimated monthly payment",
    loan: "Loan amount",
    interest: "Total interest",
    calcNote: "An estimate for planning only. Your bank will confirm the final rate and terms.",
    rentTitle: "Move-in costs",
    rentBody: "Rental contracts in Muscat are usually yearly. Expect one month's rent as a refundable deposit.",
    deposit: "Security deposit",
    yearly: "Yearly rent",
    contact: "Book a viewing",
  },
  agent: {
    eyebrow: "Your advisor",
    title: "Talk to someone who knows Muscat",
    sub: "Tell us what you need and we will shortlist homes, arrange viewings and walk you through the paperwork, in Arabic or English.",
    name: "Salma Al Harthy",
    initials: "SH",
    role: "Senior property advisor",
    langs: "Arabic · English",
    response: "Usually replies within an hour",
    call: "Call",
    email: "Email",
    hours: "Sunday to Thursday, 8 am to 6 pm",
  },
  hoods: {
    eyebrow: "Neighbourhoods",
    title: "Know the area before you visit",
    items: {
      almouj: { desc: "Marina living with a golf course, beach club and waterfront cafés.", stat: "OMR 920", statLabel: "average per m²" },
      qurum: { desc: "Leafy streets between the beach and the natural park, close to everything.", stat: "OMR 860", statLabel: "average per m²" },
      msq: { desc: "Quiet family villas near the best international schools in the city.", stat: "OMR 780", statLabel: "average per m²" },
      bausher: { desc: "Modern towers by the big malls, with quick links to the expressway.", stat: "OMR 640", statLabel: "average per m²" },
    },
  },
  footer: {
    tagline: "Verified homes for sale and rent across Muscat.",
    rights: "© 2026 Manzil Properties LLC. A concept demo by Yameen Yasar Studio.",
  },
};

export type RealEstateContent = typeof en;

const ar: RealEstateContent = {
  meta: {
    title: "منزل — عقارات للبيع والإيجار في مسقط",
    description: "تصفّح شققًا وفللًا وتاون هاوس موثّقة في أنحاء مسقط، وقارن الأسعار بالريال العُماني، واحسب قسطك الشهري في ثوانٍ.",
  },
  brand: "منزل",
  navLabel: "الرئيسية",
  nav: { listings: "العقارات", areas: "الأحياء", agent: "تحدّث إلى مستشار" },
  cta: "اعرض عقارك",
  hero: {
    eyebrow: "مسقط · عقارات موثّقة",
    title: "اعثر على المنزل الذي يناسب أسلوب حياتك",
    sub: "شقق وفلل وتاون هاوس في أنحاء مسقط، زار فريقنا كلًّا منها وتحقّق من بياناته. أسعار واضحة ومساحات حقيقية، بلا مفاجآت.",
    stats: [
      { value: "1,240", label: "عقارًا موثّقًا" },
      { value: "6", label: "أحياء" },
      { value: "48", label: "ساعة لحجز معاينة" },
    ],
    featured: { label: "مميّز هذا الأسبوع", tag: "جديد" },
  },
  search: {
    label: "البحث عن عقار",
    dealLabel: "أرغب في",
    deal: { buy: "الشراء", rent: "الإيجار" },
    area: "الموقع",
    areaAny: "كل مسقط",
    type: "نوع العقار",
    typeAny: "كل الأنواع",
    beds: "غرف النوم",
    bedsAny: "أي عدد",
    bedsOpts: ["غرفة أو أكثر", "غرفتان أو أكثر", "3 غرف أو أكثر", "4 غرف أو أكثر"],
    submit: "ابحث",
  },
  types: { apartment: "شقة", villa: "فيلا", townhouse: "تاون هاوس" },
  areas: { almouj: "الموج", qurum: "القرم", msq: "مدينة السلطان قابوس", khuwair: "الخوير", bausher: "بوشر", seeb: "السيب" },
  listings: {
    eyebrow: "العقارات",
    title: "عقارات متاحة الآن",
    filtersLabel: "تصفية العقارات",
    maxPrice: "أقصى سعر",
    any: "أي سعر",
    upTo: "حتى {p}",
    sort: "الترتيب",
    sortOpts: { recommended: "الأنسب لك", priceAsc: "السعر: من الأقل", priceDesc: "السعر: من الأعلى" },
    count: { zero: "لا توجد عقارات مطابقة", one: "عقار واحد مطابق", two: "عقاران مطابقان", few: "{n} عقارات مطابقة" },
    saved: "المحفوظة",
    reset: "مسح عوامل التصفية",
    emptyTitle: "لا يوجد ما يطابق هذه الخيارات حاليًا",
    emptyBody: "جرّب ميزانية أعلى أو عددًا أقل من الغرف. نضيف عقارات جديدة كل أسبوع.",
    save: "حفظ {title}",
    view: "عرض التفاصيل",
    currency: "{n} ر.ع.",
    perMonth: "شهريًا",
    beds: { one: "غرفة واحدة", two: "غرفتان", few: "{n} غرف" },
    baths: { one: "حمّام واحد", two: "حمّامان", few: "{n} حمّامات" },
    sqm: "{n} م²",
    forSale: "للبيع",
    forRent: "للإيجار",
  },
  items: {
    "mouj-apt": { title: "شقة مطلّة على البحر في الموج", desc: "شقة زاوية مشرقة على المارينا بشرفة واسعة تطل على البحر، وغرفتي نوم بحمّامين خاصّين، مع دخول إلى نادي الشاطئ للسكان." },
    "msq-villa": { title: "فيلا عائلية في مدينة السلطان قابوس", desc: "فيلا رحبة بخمس غرف نوم في شارع هادئ قرب المدارس الدولية، بمسبح خاص وحديقة ناضجة ومجلس منفصل." },
    "mouj-town": { title: "تاون هاوس على المارينا في الموج", desc: "ثلاثة طوابق بتصميم مفتوح على بُعد خطوات من المارينا، مع سطح خاص وحديقة صغيرة وموقفين مظلّلين." },
    "khuwair-apt": { title: "شقة بغرفة نوم واحدة في الخوير", desc: "شقة مفروشة بالكامل قرب الوزارات ومقاهي الخوير، مناسبة لمن ينتقل للعمل في مسقط." },
    "qurum-villa": { title: "فيلا بحديقة قرب شاطئ القرم", desc: "فيلا هادئة بأربع غرف نوم على بُعد خمس دقائق من شاطئ القرم والحديقة الطبيعية، بحديقة مظلّلة ومسبح لأمسيات الصيف." },
    "qurum-apt": { title: "شقة بثلاث غرف نوم في مرتفعات القرم", desc: "شقة واسعة بإطلالة على المدينة والجبال، مع نادٍ رياضي ومسبح للسكان وحراسة على مدار الساعة في أحد أفضل مباني القرم." },
    "bausher-town": { title: "تاون هاوس على زاوية في بوشر", desc: "تاون هاوس على زاوية بإضاءة طبيعية إضافية وحديقة صغيرة، وبوصول سريع إلى طريق مسقط السريع وأكبر المجمّعات التجارية." },
    "seeb-villa": { title: "فيلا حديثة البناء في السيب", desc: "فيلا اكتمل بناؤها حديثًا بأربع غرف نوم وأسقف عالية وغرفة للعاملة وأرض واسعة، على بُعد عشر دقائق من مطار مسقط الدولي." },
    "bausher-apt": { title: "شقة بغرفتي نوم قرب مسقط جراند مول", desc: "شقة مفروشة في برج حديث بمسبح ونادٍ رياضي، على بُعد خطوات من مسقط جراند مول ومقاهي بوشر." },
  },
  amenities: { pool: "مسبح", gym: "نادٍ رياضي", parking: "موقف مظلّل", garden: "حديقة خاصة", security: "حراسة على مدار الساعة", ac: "تكييف مركزي", furnished: "مفروشة", seaview: "إطلالة بحرية" },
  dialog: {
    close: "إغلاق",
    overview: "عن هذا العقار",
    amenities: "المرافق",
    size: "المساحة",
    beds: "غرف النوم",
    baths: "الحمّامات",
    area: "الحي",
    calcTitle: "حاسبة التمويل العقاري",
    price: "سعر العقار (ر.ع.)",
    down: "الدفعة الأولى",
    years: "مدة التمويل",
    yearsOpt: "{n} سنة",
    rate: "نسبة الفائدة السنوية (%)",
    monthly: "القسط الشهري التقديري",
    loan: "مبلغ التمويل",
    interest: "إجمالي الفوائد",
    calcNote: "تقدير للتخطيط فقط، ويحدّد البنك النسبة والشروط النهائية.",
    rentTitle: "تكاليف الانتقال",
    rentBody: "عقود الإيجار في مسقط سنوية عادةً، ويُدفع إيجار شهر واحد تأمينًا مستردًّا.",
    deposit: "مبلغ التأمين",
    yearly: "الإيجار السنوي",
    contact: "احجز معاينة",
  },
  agent: {
    eyebrow: "مستشارتك العقارية",
    title: "تحدّث إلى من يعرف مسقط جيدًا",
    sub: "أخبرنا بما تحتاج إليه، وسنختار لك العقارات المناسبة، وننظّم المعاينات، ونرافقك في الإجراءات بالعربية أو الإنجليزية.",
    name: "سلمى الحارثية",
    initials: "س",
    role: "مستشارة عقارية أولى",
    langs: "العربية · الإنجليزية",
    response: "تردّ عادةً خلال ساعة",
    call: "اتصال",
    email: "بريد إلكتروني",
    hours: "من الأحد إلى الخميس، من 8 صباحًا حتى 6 مساءً",
  },
  hoods: {
    eyebrow: "الأحياء",
    title: "تعرّف إلى الحي قبل أن تزوره",
    items: {
      almouj: { desc: "حياة على المارينا مع ملعب غولف ونادي شاطئ ومقاهٍ على الواجهة البحرية.", stat: "920 ر.ع.", statLabel: "متوسط سعر المتر" },
      qurum: { desc: "شوارع خضراء بين الشاطئ والحديقة الطبيعية، وقريبة من كل شيء.", stat: "860 ر.ع.", statLabel: "متوسط سعر المتر" },
      msq: { desc: "فلل عائلية هادئة قرب أفضل المدارس الدولية في المدينة.", stat: "780 ر.ع.", statLabel: "متوسط سعر المتر" },
      bausher: { desc: "أبراج حديثة بجوار المجمّعات الكبرى، مع وصول سريع إلى الطريق السريع.", stat: "640 ر.ع.", statLabel: "متوسط سعر المتر" },
    },
  },
  footer: {
    tagline: "عقارات موثّقة للبيع والإيجار في أنحاء مسقط.",
    rights: "© 2026 منزل للعقارات ش.م.م. موقع تجريبي من استوديو يمين يسار.",
  },
};

export const realestateContent = { ar, en };
