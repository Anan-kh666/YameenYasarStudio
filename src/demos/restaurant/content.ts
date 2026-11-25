/* «سمّاق» / Sumac — fictional modern Levantine restaurant in Amman.
   Every visible string lives here; `ar` is typed against `en`, so both
   locales always have the same shape. Prices are numbers (JOD) and are
   formatted with Western digits in both languages. */

export type TabId = "mezze" | "grills" | "desserts" | "drinks";
export const TABS: TabId[] = ["mezze", "grills", "desserts", "drinks"];

export type Dish = { id: DishId; price: number; veg?: boolean; spicy?: boolean };

export const MENU: Record<TabId, Dish[]> = {
  mezze: [
    { id: "hummus", price: 3.5, veg: true },
    { id: "muhammara", price: 3.75, veg: true, spicy: true },
    { id: "fattoush", price: 4.25, veg: true },
    { id: "kibbeh", price: 5 },
    { id: "batata", price: 3.5, veg: true, spicy: true },
    { id: "labneh", price: 3.25, veg: true },
  ],
  grills: [
    { id: "tawook", price: 9.5 },
    { id: "kofta", price: 10.5 },
    { id: "arayes", price: 8.5, spicy: true },
    { id: "chops", price: 16 },
    { id: "halloumi", price: 7, veg: true },
  ],
  desserts: [
    { id: "knafeh", price: 4.5, veg: true },
    { id: "muhallabia", price: 3.5, veg: true },
    { id: "jibn", price: 4.75, veg: true },
    { id: "bouza", price: 4, veg: true },
  ],
  drinks: [
    { id: "lemonade", price: 2.75 },
    { id: "jallab", price: 3 },
    { id: "spritz", price: 3.5 },
    { id: "coffee", price: 2 },
    { id: "tea", price: 2.25 },
  ],
};

export type PlateVariant = "mansaf" | "lamb" | "musakhan";
export const SPECIALS: { id: PlateVariant; price: number }[] = [
  { id: "mansaf", price: 14 },
  { id: "lamb", price: 18.5 },
  { id: "musakhan", price: 11 },
];

/* Booking slots, 24h "HH:MM" (Western digits in both locales). */
export const SLOTS = {
  lunch: ["13:00", "13:30", "14:00", "14:30"],
  dinner: ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"],
};
export const MAX_GUESTS = 10;

const en = {
  meta: {
    title: "Sumac — Modern Levantine kitchen, Amman",
    description: "Mezze, charcoal grills and Jordanian classics on Rainbow Street. Book a table online.",
  },
  brand: "Sumac",
  nav: { label: "Main", menu: "Menu", specials: "Chef's specials", reserve: "Reserve", visit: "Visit" },
  book: "Book a table",
  hero: {
    eyebrow: "Rainbow Street · Jabal Amman",
    title: "Levantine food, cooked over charcoal and shared slowly",
    text: "Our grandmothers' recipes, a wood-fired grill and a terrace above the old city. Come hungry, stay for the second pot of tea.",
    cta: "Book a table",
    secondary: "See the menu",
    facts: [
      { value: "Since 2019", label: "on Rainbow Street" },
      { value: "Charcoal", label: "grill, lit at noon" },
      { value: "Terrace", label: "with a city view" },
    ],
  },
  menu: {
    eyebrow: "The menu",
    title: "Made for the middle of the table",
    intro: "Order a few plates and share them. Bread comes warm from the oven, and it keeps coming.",
    tabsLabel: "Menu sections",
    tabs: { mezze: "Mezze", grills: "Grills", desserts: "Desserts", drinks: "Drinks" },
    veg: "Vegetarian",
    spicy: "Spicy",
    price: "JOD {n}",
    note: "Prices include tax and service. Tell us about any allergy and the kitchen will adapt your dish.",
  },
  dishes: {
    hummus: { name: "Hummus with burnt butter", desc: "Silky chickpeas, tahini, brown butter, pine nuts and a pinch of sumac." },
    muhammara: { name: "Muhammara", desc: "Roasted red pepper, walnut and pomegranate molasses, with a slow chilli heat." },
    fattoush: { name: "Fattoush", desc: "Crisp leaves, radish, toasted bread and a sharp sumac dressing." },
    kibbeh: { name: "Fried kibbeh", desc: "Bulgur shells filled with spiced lamb and onion, four pieces." },
    batata: { name: "Batata harra", desc: "Crisp potatoes tossed with garlic, coriander and red chilli." },
    labneh: { name: "Labneh and za'atar", desc: "Thick strained yoghurt, wild thyme, olive oil from Ajloun." },
    tawook: { name: "Shish tawook", desc: "Chicken marinated in garlic and yoghurt, grilled with peppers." },
    kofta: { name: "Kofta with tahini", desc: "Minced lamb and parsley on skewers, over a warm tahini sauce." },
    arayes: { name: "Arayes", desc: "Pita filled with spiced meat and pressed over the coals until crisp." },
    chops: { name: "Lamb chops", desc: "Four chops from a local farm, with seven spices and grilled onion." },
    halloumi: { name: "Grilled halloumi", desc: "Halloumi, grilled tomatoes and a mint and lemon salad." },
    knafeh: { name: "Knafeh Nabulsiyeh", desc: "Warm sweet cheese, golden semolina and orange-blossom syrup." },
    muhallabia: { name: "Muhallabia", desc: "Milk pudding with rose water, pistachio and dried rose." },
    jibn: { name: "Halawet el jibn", desc: "Soft cheese rolls filled with cream, finished with syrup." },
    bouza: { name: "Ashta bouza", desc: "Stretchy mastic ice cream rolled in pistachio." },
    lemonade: { name: "Mint lemonade", desc: "Fresh lemons blended with mint and crushed ice." },
    jallab: { name: "Jallab", desc: "Date and grape molasses with rose water, pine nuts and raisins." },
    spritz: { name: "Sumac spritz", desc: "Sumac, pomegranate and sparkling water. Alcohol-free." },
    coffee: { name: "Arabic coffee", desc: "Lightly roasted with cardamom, poured at the table." },
    tea: { name: "Sage tea", desc: "Black tea with fresh sage from the hills, by the pot." },
  },
  specials: {
    eyebrow: "Chef's specials",
    title: "Three dishes we cook only a few times a day",
    quote: "I cook the way my grandmother did in Salt, with better charcoal and a little more patience.",
    chef: "Rania Haddad, head chef",
    items: {
      mansaf: { tag: "Fridays", name: "Mansaf", desc: "Lamb cooked in jameed, saffron rice, toasted almonds and thin shrak bread." },
      lamb: { tag: "Serves two", name: "Slow lamb shoulder", desc: "Eight hours in the oven with baharat, served over freekeh with yoghurt." },
      musakhan: { tag: "Seasonal", name: "Musakhan", desc: "Taboon bread, sumac onions and roast chicken, finished with olive oil." },
    },
  },
  reserve: {
    eyebrow: "Reservations",
    title: "Book a table",
    text: "Tables are held for 15 minutes. For groups larger than ten, call us and we will set the long table.",
    date: "Date",
    today: "Today",
    tomorrow: "Tomorrow",
    time: "Time",
    lunch: "Lunch",
    dinner: "Dinner",
    full: "Fully booked",
    guests: "Guests",
    guestLabels: ["1 guest", "2 guests", "3 guests", "4 guests", "5 guests", "6 guests", "7 guests", "8 guests", "9 guests", "10 guests"],
    fewer: "Fewer guests",
    more: "More guests",
    name: "Full name",
    phone: "Mobile number",
    phoneHint: "We will send a confirmation by SMS.",
    submit: "Confirm booking",
    errors: {
      time: "Choose a time for your table.",
      name: "Enter the name for the booking.",
      phone: "Enter a mobile number with at least 8 digits.",
    },
    summary: { date: "Date", time: "Time", guests: "Guests", name: "Name" },
    done: {
      title: "Your table is booked",
      text: "We look forward to welcoming you, {name}. See you soon on Rainbow Street.",
      again: "Book another table",
      demo: "This is a concept demo, so no booking was sent.",
    },
  },
  visit: {
    eyebrow: "Visit us",
    title: "Find the terrace above Rainbow Street",
    hoursTitle: "Opening hours",
    hours: [
      { days: "Saturday to Thursday", time: "12:30 – 23:30" },
      { days: "Friday", time: "13:30 – 00:30" },
    ],
    kitchen: "The kitchen takes its last order an hour before closing.",
    address: "24 Rainbow Street, Jabal Amman",
    landmark: "Two minutes' walk from the First Circle",
    parking: "Valet parking from 18:00",
    phone: "+962 6 555 0187",
    call: "Call",
    map: { street: "Rainbow St", circle: "First Circle", area: "Jabal Amman", label: "Map of the area around Sumac on Rainbow Street, near the First Circle" },
  },
  footer: {
    tagline: "Levantine kitchen and terrace, Amman.",
    instagram: "@sumac.amman",
    copyright: "© 2026 Sumac. A fictional restaurant, designed as a concept demo.",
  },
};

export type RestaurantCopy = typeof en;

const ar: RestaurantCopy = {
  meta: {
    title: "سمّاق — مطبخ شامي معاصر في عمّان",
    description: "مقبلات ومشاوٍ على الفحم وأطباق أردنية أصيلة في شارع الرينبو. احجز طاولتك عبر الإنترنت.",
  },
  brand: "سمّاق",
  nav: { label: "الرئيسية", menu: "القائمة", specials: "أطباق الشيف", reserve: "الحجز", visit: "زورونا" },
  book: "احجز طاولة",
  hero: {
    eyebrow: "شارع الرينبو · جبل عمّان",
    title: "مطبخ شامي يُطهى على الفحم ويُتقاسم على مهل",
    text: "وصفات جدّاتنا، وشوّاية على الحطب، وشرفة تطلّ على المدينة القديمة. تعال جائعًا، وابقَ لإبريق الشاي الثاني.",
    cta: "احجز طاولة",
    secondary: "تصفّح القائمة",
    facts: [
      { value: "منذ 2019", label: "في شارع الرينبو" },
      { value: "على الفحم", label: "شوّايتنا تُشعل ظهرًا" },
      { value: "شرفة", label: "بإطلالة على المدينة" },
    ],
  },
  menu: {
    eyebrow: "القائمة",
    title: "أطباق تُوضع في منتصف الطاولة",
    intro: "اطلب بضعة أطباق وتقاسمها مع من معك. يصل الخبز ساخنًا من الفرن، ولا يتوقف.",
    tabsLabel: "أقسام القائمة",
    tabs: { mezze: "المقبلات", grills: "المشاوي", desserts: "الحلويات", drinks: "المشروبات" },
    veg: "نباتي",
    spicy: "حار",
    price: "{n} د.أ",
    note: "الأسعار شاملة الضريبة والخدمة. أخبرنا بأي حساسية غذائية وسيكيّف المطبخ طبقك.",
  },
  dishes: {
    hummus: { name: "حمّص بالزبدة المحمّصة", desc: "حمّص ناعم وطحينة وزبدة محمّصة وصنوبر ورشّة سمّاق." },
    muhammara: { name: "محمّرة", desc: "فليفلة حمراء مشوية وجوز ودبس رمان، بحرارة فلفل هادئة." },
    fattoush: { name: "فتّوش", desc: "خضار مقرمشة وفجل وخبز محمّص وصلصة سمّاق لاذعة." },
    kibbeh: { name: "كبّة مقلية", desc: "أقراص برغل محشوة بلحم الضأن المتبّل والبصل، أربع قطع." },
    batata: { name: "بطاطا حارّة", desc: "بطاطا مقرمشة مع الثوم والكزبرة والفلفل الأحمر." },
    labneh: { name: "لبنة وزعتر", desc: "لبنة كثيفة وزعتر برّي وزيت زيتون من عجلون." },
    tawook: { name: "شيش طاووق", desc: "دجاج متبّل بالثوم واللبن، مشويّ مع الفليفلة." },
    kofta: { name: "كفتة بالطحينة", desc: "لحم ضأن مفروم مع البقدونس على أسياخ، فوق صلصة طحينة دافئة." },
    arayes: { name: "عرايس", desc: "خبز محشو باللحم المتبّل يُضغط على الجمر حتى يقرمش." },
    chops: { name: "ريش غنم", desc: "أربع قطع من مزرعة محلية، بالبهارات السبعة والبصل المشوي." },
    halloumi: { name: "حلّوم مشوي", desc: "جبنة حلّوم وبندورة مشوية وسلطة نعناع وليمون." },
    knafeh: { name: "كنافة نابلسية", desc: "جبنة حلوة دافئة وسميد ذهبي وقطر بماء الزهر." },
    muhallabia: { name: "مهلّبية", desc: "مهلّبية بماء الورد والفستق الحلبي وبتلات الورد المجففة." },
    jibn: { name: "حلاوة الجبن", desc: "لفائف جبن طرية محشوة بالقشطة ومزيّنة بالقطر." },
    bouza: { name: "بوظة عربية بالقشطة", desc: "بوظة بالمستكة مطّاطة القوام، ملفوفة بالفستق الحلبي." },
    lemonade: { name: "ليمون بالنعناع", desc: "ليمون طازج مع النعناع والثلج المجروش." },
    jallab: { name: "جلّاب", desc: "دبس التمر والعنب بماء الورد مع الصنوبر والزبيب." },
    spritz: { name: "سبريتز السمّاق", desc: "سمّاق ورمان ومياه فوّارة، خالٍ من الكحول." },
    coffee: { name: "قهوة عربية", desc: "تحميص خفيف مع الهيل، تُصبّ على الطاولة." },
    tea: { name: "شاي بالميرمية", desc: "شاي أسود مع ميرمية طازجة من التلال، بالإبريق." },
  },
  specials: {
    eyebrow: "أطباق الشيف",
    title: "ثلاثة أطباق نطهوها بضع مرات في اليوم فقط",
    quote: "أطبخ كما كانت جدّتي تطبخ في السلط، بفحم أجود وصبر أكثر قليلًا.",
    chef: "رانيا حدّاد، رئيسة الطهاة",
    items: {
      mansaf: { tag: "أيام الجمعة", name: "منسف", desc: "لحم ضأن مطبوخ بالجميد، وأرز بالزعفران، ولوز محمّص، وخبز الشراك." },
      lamb: { tag: "لشخصين", name: "كتف خروف على نار هادئة", desc: "ثماني ساعات في الفرن مع البهارات، يُقدَّم على الفريكة مع اللبن." },
      musakhan: { tag: "موسمي", name: "مسخّن", desc: "خبز الطابون وبصل بالسمّاق ودجاج محمّر، مع زيت الزيتون." },
    },
  },
  reserve: {
    eyebrow: "الحجوزات",
    title: "احجز طاولتك",
    text: "نحتفظ بالطاولة 15 دقيقة. للمجموعات الأكبر من عشرة أشخاص، اتصل بنا وسنجهّز الطاولة الطويلة.",
    date: "التاريخ",
    today: "اليوم",
    tomorrow: "غدًا",
    time: "الوقت",
    lunch: "الغداء",
    dinner: "العشاء",
    full: "محجوز بالكامل",
    guests: "عدد الضيوف",
    guestLabels: ["ضيف واحد", "ضيفان", "3 ضيوف", "4 ضيوف", "5 ضيوف", "6 ضيوف", "7 ضيوف", "8 ضيوف", "9 ضيوف", "10 ضيوف"],
    fewer: "ضيوف أقل",
    more: "ضيوف أكثر",
    name: "الاسم الكامل",
    phone: "رقم الهاتف المحمول",
    phoneHint: "سنرسل لك تأكيدًا برسالة نصية.",
    submit: "تأكيد الحجز",
    errors: {
      time: "اختر وقتًا لطاولتك.",
      name: "أدخل الاسم الذي سيكون الحجز باسمه.",
      phone: "أدخل رقم هاتف من 8 أرقام على الأقل.",
    },
    summary: { date: "التاريخ", time: "الوقت", guests: "الضيوف", name: "الاسم" },
    done: {
      title: "تم حجز طاولتك",
      text: "يسعدنا استقبالك يا {name}. نراك قريبًا في شارع الرينبو.",
      again: "احجز طاولة أخرى",
      demo: "هذا موقع تجريبي، لذا لم يُرسَل أي حجز.",
    },
  },
  visit: {
    eyebrow: "زورونا",
    title: "ستجد الشرفة فوق شارع الرينبو",
    hoursTitle: "ساعات العمل",
    hours: [
      { days: "من السبت إلى الخميس", time: "12:30 – 23:30" },
      { days: "الجمعة", time: "13:30 – 00:30" },
    ],
    kitchen: "يستقبل المطبخ آخر طلب قبل الإغلاق بساعة.",
    address: "24 شارع الرينبو، جبل عمّان",
    landmark: "على بُعد دقيقتين سيرًا من الدوار الأول",
    parking: "خدمة صفّ السيارات من الساعة 18:00",
    phone: "+962 6 555 0187",
    call: "اتصل",
    map: { street: "شارع الرينبو", circle: "الدوار الأول", area: "جبل عمّان", label: "خريطة المنطقة المحيطة بمطعم سمّاق في شارع الرينبو قرب الدوار الأول" },
  },
  footer: {
    tagline: "مطبخ شامي وشرفة في عمّان.",
    instagram: "@sumac.amman",
    copyright: "© 2026 سمّاق. مطعم خيالي صُمّم موقعًا تجريبيًا.",
  },
};

export type DishId = keyof RestaurantCopy["dishes"];

export const content = { ar, en };

export const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? ""));

export const jod = (n: number) => n.toFixed(2);
