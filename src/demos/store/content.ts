/* «لمسة» / Lamsa — fictional modest-fashion boutique in Dubai (concept demo).
   PRODUCTS holds the data that is the same in both languages (price, colours,
   sizes); `content[locale]` holds every visible string. Both locales share one
   type (StoreCopy), so their shapes can't drift apart. */

export type CategoryId = "abayas" | "kaftans" | "scarves" | "accessories";
export type Art = "abaya" | "abaya-open" | "kaftan" | "kaftan-belted" | "scarf" | "scarf-folded" | "tote" | "pins";
export type ColorId = keyof StoreCopy["colors"];
export type ProductId = keyof StoreCopy["products"];

export type Product = {
  id: ProductId;
  category: CategoryId;
  art: Art;
  price: number; // AED
  colors: { id: ColorId; hex: string }[];
  sizes: string[]; // abaya lengths are in inches (Gulf convention); "one" = one size
  isNew?: boolean;
};

const ABAYA_SIZES = ["52", "54", "56", "58", "60"];
const KAFTAN_SIZES = ["S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  { id: "noor", category: "abayas", art: "abaya", price: 420, isNew: true, sizes: ABAYA_SIZES,
    colors: [{ id: "black", hex: "#1d1b1a" }, { id: "mocha", hex: "#6b4f3f" }, { id: "navy", hex: "#2a3246" }] },
  { id: "sahar", category: "abayas", art: "abaya-open", price: 560, sizes: ABAYA_SIZES,
    colors: [{ id: "sand", hex: "#c4ab88" }, { id: "black", hex: "#1d1b1a" }] },
  { id: "rimal", category: "kaftans", art: "kaftan", price: 380, isNew: true, sizes: KAFTAN_SIZES,
    colors: [{ id: "linen", hex: "#ddcfb8" }, { id: "olive", hex: "#6f6a4a" }] },
  { id: "ward", category: "kaftans", art: "kaftan-belted", price: 640, sizes: KAFTAN_SIZES,
    colors: [{ id: "rose", hex: "#c39189" }, { id: "ivory", hex: "#ece3d3" }, { id: "mocha", hex: "#6b4f3f" }] },
  { id: "silk", category: "scarves", art: "scarf", price: 120, sizes: ["one"],
    colors: [{ id: "bronze", hex: "#9a6b3f" }, { id: "rose", hex: "#c39189" }, { id: "sage", hex: "#9aa58c" }, { id: "black", hex: "#1d1b1a" }] },
  { id: "jersey", category: "scarves", art: "scarf-folded", price: 85, sizes: ["one"],
    colors: [{ id: "sand", hex: "#c4ab88" }, { id: "navy", hex: "#2a3246" }, { id: "ivory", hex: "#ece3d3" }] },
  { id: "tote", category: "accessories", art: "tote", price: 450, sizes: ["one"],
    colors: [{ id: "bronze", hex: "#8a5a32" }, { id: "black", hex: "#1d1b1a" }] },
  { id: "pins", category: "accessories", art: "pins", price: 95, isNew: true, sizes: ["one"],
    colors: [{ id: "gold", hex: "#c8a35f" }, { id: "silver", hex: "#b9bcc0" }] },
];

export const CATEGORIES: CategoryId[] = ["abayas", "kaftans", "scarves", "accessories"];
export const FREE_SHIPPING_AED = 500;

const en = {
  meta: {
    title: "Lamsa | Abayas & kaftans from Dubai",
    description: "Lamsa is a modest-fashion boutique in Dubai: abayas, kaftans, scarves and accessories in fine fabrics, with same-day delivery.",
  },
  brand: "Lamsa",
  announcement: "Free UAE shipping on orders over AED 500 · Free returns within 14 days",
  nav: { label: "Main", newIn: "New in", journal: "Journal", visit: "Visit us" },
  search: { open: "Search the collection", close: "Close search", label: "Search the collection", placeholder: "Try: abaya, silk…" },
  cartButton: "Shopping bag",
  hero: {
    eyebrow: "Winter collection 2026",
    title: "Quiet elegance, made to move with you",
    text: "Relaxed cuts and breathable fabrics, designed in Dubai to be worn every day and kept for years.",
    cta: "Shop the collection",
    secondary: "Our fabrics",
    caption: "Noor abaya · Japanese crepe",
    note: "Free hemming to your length",
    stats: [
      { value: "14", label: "days free returns" },
      { value: "4", label: "interest-free payments" },
      { value: "1", label: "day delivery in Dubai" },
    ],
  },
  shop: {
    eyebrow: "Shop",
    title: "The collection",
    filterLabel: "Filter by category",
    all: "All",
    categories: { abayas: "Abayas", kaftans: "Kaftans", scarves: "Scarves", accessories: "Accessories" },
    count: "{n} pieces",
    empty: "Nothing matches “{q}”. Try another word.",
    clearSearch: "Clear search",
    quickView: "Quick view",
    newBadge: "New",
    colorLabel: "Colour",
    colorsCount: "{n} colours",
  },
  colors: {
    black: "Black", mocha: "Mocha", navy: "Navy", sand: "Sand", linen: "Linen", olive: "Olive",
    rose: "Dusty rose", ivory: "Ivory", bronze: "Bronze", sage: "Sage", gold: "Gold", silver: "Silver",
  },
  products: {
    noor: { name: "Noor abaya", desc: "A straight cut in matte Japanese crepe, with wide sleeves and hidden buttons." },
    sahar: { name: "Sahar open abaya", desc: "An open abaya in a linen blend with fine bronze piping, made to layer over anything." },
    rimal: { name: "Rimal kaftan", desc: "Washed linen with a round neckline, light enough for warm Dubai days." },
    ward: { name: "Ward embroidered kaftan", desc: "Hand embroidery across the yoke and a self-fabric belt, for evenings out." },
    silk: { name: "Silk scarf", desc: "Soft silk modal, 180 × 70 cm, that stays in place and resists creasing." },
    jersey: { name: "Jersey hijab", desc: "Stretch cotton jersey with a matte finish, comfortable all day." },
    tote: { name: "Leather tote", desc: "Full-grain leather with a cotton lining and a zipped inner pocket; fits a laptop." },
    pins: { name: "Pearl pin set", desc: "Three faux-pearl pins that hold a scarf without snagging the fabric." },
  },
  price: "AED {n}",
  quick: {
    close: "Close",
    size: "Size",
    sizeHint: "Abaya sizes are lengths in inches",
    oneSize: "One size",
    chooseSize: "Choose a size first",
    add: "Add to bag",
    installments: "or 4 interest-free payments of AED {n}",
  },
  cart: {
    title: "Shopping bag",
    close: "Close bag",
    empty: "Your bag is empty.",
    continue: "Continue shopping",
    remaining: "AED {n} away from free shipping",
    unlocked: "You've unlocked free shipping",
    subtotal: "Subtotal",
    taxNote: "Prices include VAT. Shipping is calculated at checkout.",
    checkout: "Checkout",
    checkoutNote: "This is a demo store; no order will be placed.",
    remove: "Remove",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    added: "{name} added to your bag",
    removed: "{name} removed from your bag",
    items: "{n} items in bag",
  },
  trust: [
    { title: "Free returns within 14 days", text: "We collect from your door at no cost." },
    { title: "Same-day delivery", text: "Across Dubai for orders before 2 pm; 1–3 days for the rest of the UAE." },
    { title: "Pay in 4", text: "Split your order into four monthly payments, with no interest and no fees." },
    { title: "Free hemming", text: "Send us your length and we tailor the abaya before it ships." },
  ],
  story: {
    eyebrow: "Our fabrics",
    title: "Chosen by hand, cut in Jumeirah",
    text: "We source crepe from Japan, linen from Portugal and silk modal from Italy, then cut and finish every piece in our studio on Al Wasl Road.",
  },
  newsletter: {
    title: "Join the Lamsa circle",
    text: "Be the first to see new collections, and get 10% off your first order.",
    label: "Email address",
    button: "Subscribe",
    success: "Thank you! Your welcome email is on its way.",
    invalid: "Please enter a valid email address.",
  },
  footer: {
    tagline: "Modest fashion in fine fabrics, from our Jumeirah studio to your wardrobe.",
    shop: "Shop",
    help: "Help",
    helpItems: ["Shipping & delivery", "Returns & exchanges", "Size guide", "Pay in instalments"],
    visit: "Visit us",
    address: "Al Wasl Road, Jumeirah 1, Dubai",
    hours: "Daily, 10 am – 10 pm",
    phone: "+971 4 555 0142",
    copyright: "© 2026 Lamsa. A fictional brand for demonstration.",
  },
};

export type StoreCopy = typeof en;

const ar: StoreCopy = {
  meta: {
    title: "لمسة | عبايات وقفاطين من دبي",
    description: "لمسة متجر للأزياء المحتشمة في دبي: عبايات وقفاطين وأوشحة وإكسسوارات بخامات فاخرة، مع توصيل في اليوم نفسه.",
  },
  brand: "لمسة",
  announcement: "شحن مجاني داخل الإمارات للطلبات التي تتجاوز 500 درهم · إرجاع مجاني خلال 14 يومًا",
  nav: { label: "القائمة الرئيسية", newIn: "وصل حديثًا", journal: "خاماتنا", visit: "زورينا" },
  search: { open: "البحث في المجموعة", close: "إغلاق البحث", label: "البحث في المجموعة", placeholder: "مثلًا: عباية، حرير…" },
  cartButton: "حقيبة التسوق",
  hero: {
    eyebrow: "مجموعة شتاء 2026",
    title: "أناقة هادئة ترافقكِ أينما ذهبتِ",
    text: "قصّات واسعة وخامات تتنفّس، صمّمناها في دبي لتُلبس كل يوم وتدوم سنوات.",
    cta: "تسوّقي المجموعة",
    secondary: "تعرّفي إلى خاماتنا",
    caption: "عباية نور · كريب ياباني",
    note: "تعديل الطول مجانًا حسب مقاسكِ",
    stats: [
      { value: "14", label: "يومًا للإرجاع المجاني" },
      { value: "4", label: "دفعات بلا فوائد" },
      { value: "1", label: "يوم للتوصيل داخل دبي" },
    ],
  },
  shop: {
    eyebrow: "المتجر",
    title: "المجموعة",
    filterLabel: "تصفية حسب الفئة",
    all: "الكل",
    categories: { abayas: "عبايات", kaftans: "قفاطين", scarves: "أوشحة", accessories: "إكسسوارات" },
    count: "{n} قطع",
    empty: "لا توجد قطع تطابق «{q}». جرّبي كلمة أخرى.",
    clearSearch: "مسح البحث",
    quickView: "عرض سريع",
    newBadge: "جديد",
    colorLabel: "اللون",
    colorsCount: "{n} ألوان",
  },
  colors: {
    black: "أسود", mocha: "موكا", navy: "كحلي", sand: "رملي", linen: "كتّاني", olive: "زيتي",
    rose: "وردي هادئ", ivory: "عاجي", bronze: "برونزي", sage: "أخضر مريمي", gold: "ذهبي", silver: "فضي",
  },
  products: {
    noor: { name: "عباية نور", desc: "قصّة مستقيمة من الكريب الياباني غير اللامع، بأكمام واسعة وأزرار مخفية." },
    sahar: { name: "عباية سحر المفتوحة", desc: "عباية مفتوحة من مزيج الكتان بحواف برونزية رفيعة، تُلبس فوق أي إطلالة." },
    rimal: { name: "قفطان رمال", desc: "قفطان من الكتان المغسول بفتحة رقبة مستديرة، خفيف يناسب أيام دبي الدافئة." },
    ward: { name: "قفطان ورد المطرّز", desc: "تطريز يدوي على الصدر وحزام من القماش نفسه، لإطلالات المساء." },
    silk: { name: "وشاح حرير", desc: "حرير مودال ناعم بمقاس 180 × 70 سم، يثبت في مكانه ولا يتجعّد بسهولة." },
    jersey: { name: "طرحة جيرسي", desc: "جيرسي قطني مرن بلمسة غير لامعة، مريح طوال اليوم." },
    tote: { name: "حقيبة توت جلدية", desc: "جلد طبيعي ببطانة قطنية وجيب داخلي بسحّاب، تتّسع لحاسوب محمول." },
    pins: { name: "طقم دبابيس اللؤلؤ", desc: "ثلاثة دبابيس بلؤلؤ صناعي تثبّت الوشاح دون أن تُتلف القماش." },
  },
  price: "{n} درهم",
  quick: {
    close: "إغلاق",
    size: "المقاس",
    sizeHint: "مقاسات العبايات هي الطول بالإنش",
    oneSize: "مقاس واحد",
    chooseSize: "اختاري المقاس أولًا",
    add: "أضيفي إلى الحقيبة",
    installments: "أو 4 دفعات بلا فوائد، قيمة كلٍّ منها {n} درهم",
  },
  cart: {
    title: "حقيبة التسوق",
    close: "إغلاق الحقيبة",
    empty: "حقيبتكِ فارغة.",
    continue: "متابعة التسوق",
    remaining: "بقي {n} درهم لتحصلي على الشحن المجاني",
    unlocked: "حصلتِ على الشحن المجاني",
    subtotal: "المجموع الفرعي",
    taxNote: "الأسعار شاملة ضريبة القيمة المضافة. تُحسب رسوم الشحن عند الدفع.",
    checkout: "إتمام الطلب",
    checkoutNote: "هذا متجر تجريبي، ولن يُنفَّذ أي طلب.",
    remove: "إزالة",
    decrease: "إنقاص الكمية",
    increase: "زيادة الكمية",
    added: "أُضيف «{name}» إلى الحقيبة",
    removed: "أُزيل «{name}» من الحقيبة",
    items: "عدد القطع في الحقيبة: {n}",
  },
  trust: [
    { title: "إرجاع مجاني خلال 14 يومًا", text: "نستلم القطعة من بابكِ دون أي رسوم." },
    { title: "توصيل في اليوم نفسه", text: "داخل دبي للطلبات قبل الساعة 2 ظهرًا، ومن يوم إلى 3 أيام في باقي الإمارات." },
    { title: "ادفعي على 4 دفعات", text: "قسّمي قيمة طلبكِ على أربع دفعات شهرية بلا فوائد ولا رسوم." },
    { title: "تعديل الطول مجانًا", text: "أرسلي إلينا طولكِ، ونعدّل العباية قبل شحنها." },
  ],
  story: {
    eyebrow: "خاماتنا",
    title: "نختارها بعناية، ونفصّلها في جميرا",
    text: "نستورد الكريب من اليابان، والكتان من البرتغال، والحرير المودال من إيطاليا، ثم نقصّ كل قطعة ونُنهيها في مشغلنا بشارع الوصل.",
  },
  newsletter: {
    title: "انضمّي إلى دائرة لمسة",
    text: "كوني أول من يطّلع على المجموعات الجديدة، واحصلي على خصم 10% على طلبكِ الأول.",
    label: "البريد الإلكتروني",
    button: "اشتركي",
    success: "شكرًا لكِ! ستصلكِ رسالة الترحيب قريبًا.",
    invalid: "يُرجى إدخال بريد إلكتروني صحيح.",
  },
  footer: {
    tagline: "أزياء محتشمة بخامات فاخرة، من مشغلنا في جميرا إلى خزانتكِ.",
    shop: "تسوّقي",
    help: "المساعدة",
    helpItems: ["الشحن والتوصيل", "الإرجاع والاستبدال", "دليل المقاسات", "الدفع بالتقسيط"],
    visit: "زورينا",
    address: "شارع الوصل، جميرا 1، دبي",
    hours: "يوميًا من 10 صباحًا حتى 10 مساءً",
    phone: "+971 4 555 0142",
    copyright: "© 2026 لمسة. علامة تجارية خيالية لأغراض العرض.",
  },
};

export const content = { ar, en };

/** Fill a "{n}" / "{name}" template. */
export const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
