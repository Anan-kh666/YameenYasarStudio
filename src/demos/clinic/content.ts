/* Copy for the Basma Dental Clinic concept demo (fictional business).
   `ar` is typed as `typeof en`, so both languages keep identical shapes. */

export type ServiceId = "cleaning" | "whitening" | "implants" | "ortho" | "kids" | "emergency";
export type DoctorId = "reem" | "faisal" | "lama" | "omar";

export const SERVICE_IDS: ServiceId[] = ["cleaning", "whitening", "implants", "ortho", "kids", "emergency"];

/* Which doctor offers which treatment (drives the wizard's doctor step). */
export const DOCTORS: { id: DoctorId; services: ServiceId[]; hue: number }[] = [
  { id: "reem", services: ["ortho", "cleaning"], hue: 172 },
  { id: "faisal", services: ["implants", "emergency", "cleaning"], hue: 200 },
  { id: "lama", services: ["kids", "cleaning", "emergency"], hue: 150 },
  { id: "omar", services: ["whitening", "implants", "cleaning", "emergency"], hue: 188 },
];

/* Fixed daily slots (24h). Some are marked taken per day/doctor in the wizard. */
export const SLOTS = ["09:00", "09:45", "10:30", "11:15", "12:00", "13:30", "16:00", "16:45", "17:30", "18:15", "19:00", "19:45"];

export const PHONE = "+966 11 456 7890";
export const EMAIL = "care@basmadental.sa";

const en = {
  intlLocale: "en-GB-u-ca-gregory-nu-latn",
  meta: {
    title: "Basma Dental Clinic — Riyadh",
    description: "Family dentistry in Al Olaya, Riyadh: cleaning, whitening, implants, orthodontics and children's care. Book online in a minute.",
  },
  brand: "Basma",
  brandSub: "Dental Clinic",
  nav: { services: "Treatments", booking: "Booking", doctors: "Doctors", reviews: "Reviews", faq: "FAQ", visit: "Visit us" },
  navLabel: "Main",
  cta: "Book appointment",
  hero: {
    eyebrow: "Al Olaya, Riyadh · Open today until 9 PM",
    title: "Calm, careful dentistry for the whole family",
    sub: "Modern treatment, clear prices and doctors who explain every step before they begin. Book your visit online in under a minute.",
    primary: "Book appointment",
    secondary: "View treatments",
    trust: [
      { value: "4.9", label: "average rating" },
      { value: "12", label: "years in Riyadh" },
      { value: "15,000+", label: "patients treated" },
    ],
    slot: {
      label: "Next available",
      when: "Tomorrow · 10:30 AM",
      doctor: "Dr. Lama Al-Otaibi",
      role: "Pediatric dentistry",
      action: "Reserve this slot",
    },
    badge: "MOH licensed clinic",
    badgeNote: "Sterilisation checked daily",
  },
  services: {
    eyebrow: "Treatments",
    title: "Everything your smile needs, under one roof",
    sub: "Starting prices are shown up front. Your exact plan and cost are confirmed after the first examination.",
    items: {
      cleaning: { name: "Cleaning & check-up", desc: "Scaling, polishing and a full examination with digital X-rays.", price: "from SAR 250", duration: "45 min" },
      whitening: { name: "Teeth whitening", desc: "In-clinic whitening that lifts several shades in one visit.", price: "from SAR 900", duration: "60 min" },
      implants: { name: "Dental implants", desc: "Titanium implants and crowns planned with 3D imaging.", price: "from SAR 3,500", duration: "90 min" },
      ortho: { name: "Orthodontics", desc: "Clear aligners and modern braces for teens and adults.", price: "from SAR 6,500", duration: "30 min" },
      kids: { name: "Children's dentistry", desc: "Gentle first visits, fluoride care and fissure sealants.", price: "from SAR 200", duration: "30 min" },
      emergency: { name: "Emergency care", desc: "Same-day relief for pain, swelling or a broken tooth.", price: "from SAR 300", duration: "30 min" },
    } as Record<ServiceId, { name: string; desc: string; price: string; duration: string }>,
  },
  booking: {
    eyebrow: "Online booking",
    title: "Book your visit",
    sub: "Six short steps, no account needed. You can go back and change your choices at any point.",
    steps: ["Treatment", "Doctor", "Date", "Time", "Details", "Confirm"],
    stepOf: "Step {n} of 6",
    headings: ["Which treatment do you need?", "Choose your doctor", "Pick a day", "Pick a time", "Your details", "Check and confirm"],
    back: "Back",
    next: "Continue",
    confirm: "Confirm booking",
    again: "Book another visit",
    closed: "Closed",
    closedNote: "The clinic is closed on Fridays.",
    taken: "Booked",
    morning: "Morning",
    evening: "Evening",
    name: "Full name",
    phone: "Mobile number",
    phoneHint: "Saudi mobile, for example 05X XXX XXXX",
    nameError: "Please enter your name.",
    phoneError: "Please enter a valid Saudi mobile number.",
    summary: { service: "Treatment", doctor: "Doctor", date: "Date", time: "Time", patient: "Patient", phone: "Mobile", price: "Starting price" },
    edit: "Change",
    doneTitle: "Your appointment is booked",
    doneBody: "We look forward to seeing you. A reminder will be sent to your mobile the day before your visit.",
    reference: "Booking reference",
    demoNote: "This is a concept demo: nothing was sent and no appointment was made.",
  },
  doctors: {
    eyebrow: "Our team",
    title: "Meet the doctors",
    sub: "Specialists who take the time to listen, explain the options and agree the plan with you.",
    items: {
      reem: { name: "Dr. Reem Al-Harbi", initials: "RH", role: "Orthodontist", years: "14 years of experience", langs: "Arabic · English" },
      faisal: { name: "Dr. Faisal Al-Qahtani", initials: "FQ", role: "Implants & oral surgery", years: "17 years of experience", langs: "Arabic · English" },
      lama: { name: "Dr. Lama Al-Otaibi", initials: "LO", role: "Pediatric dentist", years: "9 years of experience", langs: "Arabic · English" },
      omar: { name: "Dr. Omar Al-Shehri", initials: "OS", role: "Cosmetic & general dentist", years: "11 years of experience", langs: "Arabic · English · French" },
    } as Record<DoctorId, { name: string; initials: string; role: string; years: string; langs: string }>,
  },
  insurance: {
    title: "Accepted insurance",
    sub: "Direct billing with major insurers. Bring your card and ID on the day of your visit.",
    items: ["Bupa Arabia", "Tawuniya", "MedGulf", "Malath", "Al Rajhi Takaful", "GIG Saudi", "Walaa"],
  },
  reviews: {
    eyebrow: "Reviews",
    title: "What our patients say",
    rating: "4.9 out of 5 from 1,200+ reviews",
    starsLabel: "5 out of 5 stars",
    items: [
      { quote: "My daughter used to dread the dentist. Dr. Lama turned the visit into a game, and now she asks when we are going back.", name: "Nora A.", detail: "Children's dentistry" },
      { quote: "The implant plan was explained clearly, with the full cost on paper before anything started. No surprises at all.", name: "Khalid M.", detail: "Dental implants" },
      { quote: "I booked online at midnight with a broken tooth and was seen at nine the next morning. Calm, quick and kind.", name: "Sara H.", detail: "Emergency care" },
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Before your visit",
    items: [
      { q: "Do I need a referral to book?", a: "No. You can book any treatment directly. If you have a referral or recent X-rays, bring them along and we will add them to your file." },
      { q: "Is my insurance accepted?", a: "We bill most major Saudi insurers directly. Coverage depends on your policy, so our front desk confirms your benefits before treatment begins." },
      { q: "How early should I arrive?", a: "Please arrive ten minutes before your appointment on your first visit, so we can complete your medical history without rushing." },
      { q: "Can I cancel or move my appointment?", a: "Yes. Reply to your reminder message or call us at least twelve hours before your visit, and we will offer you another time." },
      { q: "What counts as a dental emergency?", a: "Severe pain, swelling, bleeding that will not stop, or a broken or knocked-out tooth. Call our emergency line and we will see you the same day." },
    ],
  },
  visit: {
    eyebrow: "Visit us",
    title: "Easy to reach, easy to park",
    address: "King Fahd Road, Al Olaya District, Riyadh 12214",
    hoursTitle: "Opening hours",
    hours: [
      { day: "Saturday – Thursday", time: "9:00 AM – 9:00 PM" },
      { day: "Friday", time: "Closed" },
      { day: "Emergency line", time: "24 hours" },
    ],
    contactTitle: "Contact",
    parking: "Free parking at the rear entrance, with step-free access to every room.",
    mapLabel: "Stylised map showing the clinic on King Fahd Road, near Olaya Street",
    mapRoad: "King Fahd Rd",
    mapRoad2: "Olaya St",
    mapPin: "Basma",
  },
  footer: {
    tagline: "Family dentistry in the heart of Riyadh.",
    rights: "© 2026 Basma Dental Clinic. A fictional clinic, shown as a concept demo.",
  },
};

export type ClinicContent = typeof en;

const ar: ClinicContent = {
  intlLocale: "ar-u-ca-gregory-nu-latn",
  meta: {
    title: "عيادة بسمة لطب الأسنان — الرياض",
    description: "طب أسنان للعائلة في حي العليا بالرياض: تنظيف وتبييض وزراعة وتقويم ورعاية للأطفال. احجز موعدك عبر الإنترنت في دقيقة.",
  },
  brand: "بسمة",
  brandSub: "لطب الأسنان",
  nav: { services: "العلاجات", booking: "الحجز", doctors: "الأطباء", reviews: "الآراء", faq: "الأسئلة", visit: "زيارتنا" },
  navLabel: "القائمة الرئيسية",
  cta: "احجز موعدًا",
  hero: {
    eyebrow: "حي العليا، الرياض · مفتوح اليوم حتى 9 مساءً",
    title: "طب أسنان هادئ ودقيق لجميع أفراد العائلة",
    sub: "علاج حديث وأسعار واضحة وأطباء يشرحون كل خطوة قبل البدء بها. احجز زيارتك عبر الإنترنت في أقل من دقيقة.",
    primary: "احجز موعدًا",
    secondary: "استعرض العلاجات",
    trust: [
      { value: "4.9", label: "متوسط التقييم" },
      { value: "12", label: "عامًا في الرياض" },
      { value: "+15,000", label: "مراجع عولجوا لدينا" },
    ],
    slot: {
      label: "أقرب موعد متاح",
      when: "غدًا · 10:30 صباحًا",
      doctor: "د. لمى العتيبي",
      role: "طب أسنان الأطفال",
      action: "احجز هذا الموعد",
    },
    badge: "عيادة مرخّصة من وزارة الصحة",
    badgeNote: "فحص يومي لأنظمة التعقيم",
  },
  services: {
    eyebrow: "العلاجات",
    title: "كل ما تحتاجه ابتسامتك في مكان واحد",
    sub: "نعرض الأسعار المبدئية بوضوح، ونؤكد خطة العلاج وتكلفتها النهائية بعد الفحص الأول.",
    items: {
      cleaning: { name: "التنظيف والفحص الدوري", desc: "إزالة الجير والتلميع وفحص شامل مع أشعة رقمية.", price: "ابتداءً من 250 ريالًا", duration: "45 دقيقة" },
      whitening: { name: "تبييض الأسنان", desc: "تبييض داخل العيادة يفتّح لون الأسنان عدة درجات في جلسة واحدة.", price: "ابتداءً من 900 ريال", duration: "60 دقيقة" },
      implants: { name: "زراعة الأسنان", desc: "غرسات من التيتانيوم وتيجان تُخطَّط بالتصوير ثلاثي الأبعاد.", price: "ابتداءً من 3,500 ريال", duration: "90 دقيقة" },
      ortho: { name: "تقويم الأسنان", desc: "مصففات شفافة وتقويم حديث للمراهقين والبالغين.", price: "ابتداءً من 6,500 ريال", duration: "30 دقيقة" },
      kids: { name: "طب أسنان الأطفال", desc: "زيارات أولى لطيفة وعلاج بالفلورايد وسدّ للشقوق.", price: "ابتداءً من 200 ريال", duration: "30 دقيقة" },
      emergency: { name: "الطوارئ", desc: "تخفيف فوري في اليوم نفسه للألم أو التورم أو الأسنان المكسورة.", price: "ابتداءً من 300 ريال", duration: "30 دقيقة" },
    },
  },
  booking: {
    eyebrow: "الحجز الإلكتروني",
    title: "احجز زيارتك",
    sub: "ست خطوات قصيرة دون الحاجة إلى إنشاء حساب، ويمكنك الرجوع وتعديل اختياراتك في أي وقت.",
    steps: ["العلاج", "الطبيب", "اليوم", "الوقت", "البيانات", "التأكيد"],
    stepOf: "الخطوة {n} من 6",
    headings: ["ما العلاج الذي تحتاجه؟", "اختر طبيبك", "اختر اليوم", "اختر الوقت", "بياناتك", "راجع الحجز وأكّده"],
    back: "السابق",
    next: "متابعة",
    confirm: "تأكيد الحجز",
    again: "احجز زيارة أخرى",
    closed: "مغلق",
    closedNote: "العيادة مغلقة يوم الجمعة.",
    taken: "محجوز",
    morning: "الفترة الصباحية",
    evening: "الفترة المسائية",
    name: "الاسم الكامل",
    phone: "رقم الجوال",
    phoneHint: "رقم جوال سعودي، مثل 05X XXX XXXX",
    nameError: "يُرجى إدخال اسمك.",
    phoneError: "يُرجى إدخال رقم جوال سعودي صحيح.",
    summary: { service: "العلاج", doctor: "الطبيب", date: "اليوم", time: "الوقت", patient: "المراجع", phone: "الجوال", price: "السعر المبدئي" },
    edit: "تعديل",
    doneTitle: "تم حجز موعدك",
    doneBody: "يسعدنا استقبالك. سنرسل إليك تذكيرًا على جوالك قبل موعد زيارتك بيوم.",
    reference: "رقم الحجز",
    demoNote: "هذا نموذج تجريبي: لم يُرسل أي شيء ولم يُحجز أي موعد فعلي.",
  },
  doctors: {
    eyebrow: "فريقنا",
    title: "تعرّف إلى أطبائنا",
    sub: "أطباء متخصصون يمنحونك الوقت الكافي للإصغاء وشرح الخيارات والاتفاق معك على خطة العلاج.",
    items: {
      reem: { name: "د. ريم الحربي", initials: "ر", role: "أخصائية تقويم الأسنان", years: "خبرة 14 عامًا", langs: "العربية · الإنجليزية" },
      faisal: { name: "د. فيصل القحطاني", initials: "ف", role: "زراعة الأسنان وجراحة الفم", years: "خبرة 17 عامًا", langs: "العربية · الإنجليزية" },
      lama: { name: "د. لمى العتيبي", initials: "ل", role: "طبيبة أسنان الأطفال", years: "خبرة 9 أعوام", langs: "العربية · الإنجليزية" },
      omar: { name: "د. عمر الشهري", initials: "ع", role: "طب الأسنان التجميلي والعام", years: "خبرة 11 عامًا", langs: "العربية · الإنجليزية · الفرنسية" },
    },
  },
  insurance: {
    title: "شركات التأمين المعتمدة",
    sub: "نتعامل مباشرة مع كبرى شركات التأمين. أحضر بطاقة التأمين والهوية يوم زيارتك.",
    items: ["بوبا العربية", "التعاونية", "ميدغلف", "ملاذ", "الراجحي تكافل", "جي آي جي السعودية", "ولاء"],
  },
  reviews: {
    eyebrow: "آراء المراجعين",
    title: "ماذا يقول مراجعونا",
    rating: "4.9 من 5 بناءً على أكثر من 1,200 تقييم",
    starsLabel: "5 نجوم من 5",
    items: [
      { quote: "كانت ابنتي تخشى زيارة طبيب الأسنان، فحوّلت الدكتورة لمى الزيارة إلى لعبة، وصارت تسألني متى نعود.", name: "نورة ع.", detail: "طب أسنان الأطفال" },
      { quote: "شُرحت لي خطة الزراعة بوضوح، واستلمت التكلفة كاملةً مكتوبةً قبل البدء. لم تكن هناك أي مفاجآت.", name: "خالد م.", detail: "زراعة الأسنان" },
      { quote: "حجزت عبر الإنترنت في منتصف الليل بسبب سنٍّ مكسورة، واستُقبلت في التاسعة صباحًا. هدوء وسرعة ولطف.", name: "سارة ح.", detail: "الطوارئ" },
    ],
  },
  faq: {
    eyebrow: "الأسئلة",
    title: "قبل زيارتك",
    items: [
      { q: "هل أحتاج إلى تحويل طبي للحجز؟", a: "لا، يمكنك حجز أي علاج مباشرة. وإن كان لديك تحويل أو صور أشعة حديثة فأحضرها معك لنضيفها إلى ملفك." },
      { q: "هل تقبلون تأميني الصحي؟", a: "نتعامل مباشرة مع معظم شركات التأمين الكبرى في المملكة. تعتمد التغطية على وثيقتك، لذا يتحقق مكتب الاستقبال من مزاياك قبل بدء العلاج." },
      { q: "متى يجب أن أصل قبل الموعد؟", a: "يُرجى الحضور قبل موعدك بعشر دقائق في زيارتك الأولى، لنستكمل تاريخك الطبي دون استعجال." },
      { q: "هل يمكنني إلغاء موعدي أو تغييره؟", a: "نعم. ردّ على رسالة التذكير أو اتصل بنا قبل موعدك باثنتي عشرة ساعة على الأقل، وسنقترح عليك موعدًا آخر." },
      { q: "ما الحالات التي تُعدّ طارئة؟", a: "الألم الشديد أو التورم أو النزيف المستمر أو كسر السن أو سقوطها. اتصل بخط الطوارئ وسنستقبلك في اليوم نفسه." },
    ],
  },
  visit: {
    eyebrow: "زيارتنا",
    title: "سهولة في الوصول وفي إيجاد موقف",
    address: "طريق الملك فهد، حي العليا، الرياض 12214",
    hoursTitle: "ساعات العمل",
    hours: [
      { day: "السبت – الخميس", time: "9:00 صباحًا – 9:00 مساءً" },
      { day: "الجمعة", time: "مغلق" },
      { day: "خط الطوارئ", time: "على مدار الساعة" },
    ],
    contactTitle: "التواصل",
    parking: "مواقف مجانية عند المدخل الخلفي، مع إمكانية الوصول إلى جميع الغرف دون درج.",
    mapLabel: "خريطة توضيحية تُظهر موقع العيادة على طريق الملك فهد بالقرب من شارع العليا",
    mapRoad: "طريق الملك فهد",
    mapRoad2: "شارع العليا",
    mapPin: "بسمة",
  },
  footer: {
    tagline: "طب أسنان للعائلة في قلب الرياض.",
    rights: "© 2026 عيادة بسمة لطب الأسنان. عيادة غير حقيقية تُعرض نموذجًا تجريبيًا.",
  },
};

export const clinicContent = { ar, en };
