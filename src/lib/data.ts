import type { CmsState, Product, Category, HeroSlide, GalleryItem, VideoSection } from "./types";

export const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna",
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun",
  "50 - Bordj Badji Mokhtar", "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah",
  "54 - In Guezzam", "55 - Touggourt", "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa",
];

export const VEHICLE_DATABASE: {
  brand: string;
  models: { name: string; years: number[] }[];
}[] = [
  {
    brand: "Toyota",
    models: [
      { name: "Hilux", years: range(2005, 2026) },
      { name: "Land Cruiser", years: range(1990, 2026) },
      { name: "Land Cruiser Prado", years: range(2003, 2026) },
      { name: "Fortuner", years: range(2006, 2026) },
    ],
  },
  {
    brand: "Ford",
    models: [
      { name: "Ranger", years: range(2012, 2026) },
      { name: "Everest", years: range(2015, 2026) },
    ],
  },
  {
    brand: "Nissan",
    models: [
      { name: "Patrol", years: range(1998, 2026) },
      { name: "Navara", years: range(2005, 2026) },
    ],
  },
  {
    brand: "Mitsubishi",
    models: [
      { name: "L200", years: range(2006, 2026) },
      { name: "Pajero", years: range(2000, 2021) },
    ],
  },
  {
    brand: "Isuzu",
    models: [{ name: "D-Max", years: range(2007, 2026) }],
  },
  {
    brand: "Volkswagen",
    models: [{ name: "Amarok", years: range(2010, 2026) }],
  },
];

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let y = to; y >= from; y--) out.push(y);
  return out;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-suspension",
    slug: "suspension",
    name: { fr: "Suspension & Lift Kits", ar: "نظام التعليق ورفعات الهيكل" },
    image: "/images/cat-suspension.jpg",
    description: {
      fr: "Amortisseurs Foam Cell Pro, ressorts et kits complets Ironman 4x4.",
      ar: "ممتصات صدمات فوم سيل برو، نوابض وأطقم كاملة من آيرون مان 4x4.",
    },
    active: true,
  },
  {
    id: "cat-protection",
    slug: "protection",
    name: { fr: "Bull Bars & Protection", ar: "مصاعد أمامية وحماية" },
    image: "/images/cat-bullbar.jpg",
    description: {
      fr: "Pare-buffles acier, protections soubassement et side steps.",
      ar: "مصاعد فولاذية أمامية، حماية الهيكل السفلي ودرجات جانبية.",
    },
    active: true,
  },
  {
    id: "cat-roof",
    slug: "roof-racks",
    name: { fr: "Roof Racks & Tentes", ar: "حاملات السقف والخيام" },
    image: "/images/cat-roofrack.jpg",
    description: {
      fr: "Galeries aluminium, tentes de toit et auvents Ironman 4x4.",
      ar: "حاملات ألمنيوم للسقف، خيام سقف ومظلات آيرون مان 4x4.",
    },
    active: true,
  },
  {
    id: "cat-snorkel",
    slug: "snorkels",
    name: { fr: "Snorkels & Admission", ar: "أنابيب الغطس والسحب" },
    image: "/images/cat-snorkel.jpg",
    description: {
      fr: "Snorkels haute performance pour traversées et pistes sablonneuses.",
      ar: "أنابيب غطس عالية الأداء لعبور الأنهار والمسالك الرملية.",
    },
    active: true,
  },
  {
    id: "cat-recovery",
    slug: "recovery",
    name: { fr: "Récupération & Treuils", ar: "معدات الإنقاذ والونشات" },
    image: "/images/cat-recovery.jpg",
    description: {
      fr: "Treuils, sangles, crics et kits de récupération tout-terrain.",
      ar: "ونشات، أحزمة سحب، روافع وأطقم إنقاذ للطرق الوعرة.",
    },
    active: true,
  },
  {
    id: "cat-camping",
    slug: "camping",
    name: { fr: "Camping & Overlanding", ar: "التخييم ورحلات الأوفرلاند" },
    image: "/images/cat-camping.jpg",
    description: {
      fr: "Réfrigérateurs portables, auvents et équipement de bivouac.",
      ar: "ثلاجات محمولة، مظلات ومعدات التخييم.",
    },
    active: true,
  },
  {
    id: "cat-lighting",
    slug: "lighting",
    name: { fr: "Éclairage & Électrique", ar: "الإضاءة والكهرباء" },
    image: "/images/cat-lighting.jpg",
    description: {
      fr: "Barres LED, batteries AGM double système et compresseurs.",
      ar: "أشرطة إضاءة LED، بطاريات AGM مزدوجة ومضخات هواء.",
    },
    active: true,
  },
  {
    id: "cat-tires",
    slug: "wheels-tires",
    name: { fr: "Roues & Pneumatiques", ar: "العجلات والإطارات" },
    image: "/images/cat-tires.jpg",
    description: {
      fr: "Jantes alliage tout-terrain et pneus All-Terrain / Mud-Terrain.",
      ar: "جنوط ألمنيوم للطرق الوعرة وإطارات All-Terrain / Mud-Terrain.",
    },
    active: true,
  },
];

/** IDs of the former factory demo catalog — used only to purge cached demo
 *  products from returning visitors' localStorage (v1 -> v2 migration).
 *  The storefront displays exclusively admin-created products. */
export const DEMO_PRODUCT_IDS = [
  "p-fcp-kit-hilux",
  "p-fcp-shock",
  "p-bullbar-hilux",
  "p-roofrack-alu",
  "p-snorkel-hilux",
  "p-winch-12000",
  "p-rooftop-tent",
  "p-led-bar",
  "p-fridge-45",
  "p-side-steps",
  "p-awning-2500",
  "p-compressor",
  "p-kit-medium",
  "p-kit-heavy",
];

// The shop starts empty: every product shown on Accueil / Boutique /
// Nos Projets is created and managed by the admin from the dashboard.
export const DEFAULT_PRODUCTS: Product[] = [];

export const DEFAULT_HERO: HeroSlide[] = [
  {
    id: "slide-1",
    mediaType: "image",
    image: "/images/hero-dual-4x4.jpg",
    videoUrl: "",
    videoPoster: "",
    autoplay: true,
    muted: true,
    badge: {
      fr: "Représentant Officiel Ironman 4x4 — Algérie",
      ar: "الممثل الرسمي لآيرون مان 4x4 — الجزائر",
    },
    title: {
      fr: "DAHRA MOTORS 4x4",
      ar: "الضهرة موتورز 4x4",
    },
    subtitle: {
      fr: "Le Représentant Officiel d'Ironman 4x4 en Algérie. Suspension, protection et équipement overlanding 100% d'origine — avec garantie officielle et installation experte.",
      ar: "الممثل الرسمي لآيرون مان 4x4 في الجزائر. أنظمة تعليق وحماية ومعدات أوفرلاند أصلية 100% — مع ضمان رسمي وتركيب احترافي.",
    },
    ctaLabel: { fr: "Découvrir la Boutique", ar: "اكتشف المتجر" },
    ctaLink: "/shop",
    active: true,
  },
  {
    id: "slide-2",
    mediaType: "image",
    image: "/images/hero-mud.jpg",
    videoUrl: "",
    videoPoster: "",
    autoplay: true,
    muted: true,
    badge: {
      fr: "Forgé pour les Pistes Algériennes",
      ar: "مصنوع للمسالك الجزائرية",
    },
    title: { fr: "DOMINEZ CHAQUE PISTE", ar: "سيطر على كل مسار" },
    subtitle: {
      fr: "Amortisseurs Foam Cell Pro, pare-buffles acier et treuils Ironman 4x4 — testés dans les conditions les plus extrêmes au monde, prêts pour le Hoggar et la Kabylie.",
      ar: "ممتصات فوم سيل برو، مصاعد فولاذية وونشات آيرون مان 4x4 — مُختبرة في أقسى الظروف عالمياً، جاهزة للهقار والقبائل.",
    },
    ctaLabel: { fr: "Voir les Suspensions", ar: "شاهد أنظمة التعليق" },
    ctaLink: "/shop?category=suspension",
    active: true,
  },
  {
    id: "slide-3",
    mediaType: "image",
    image: "/images/hero-desert.jpg",
    videoUrl: "",
    videoPoster: "",
    autoplay: true,
    muted: true,
    badge: {
      fr: "Livraison 69 Wilayas — Paiement à la Livraison",
      ar: "توصيل إلى 69 ولاية — الدفع عند الاستلام",
    },
    title: { fr: "L'AVENTURE COMMENCE ICI", ar: "المغامرة تبدأ هنا" },
    subtitle: {
      fr: "Commandez en ligne ou via WhatsApp, payez à la livraison partout en Algérie. Pièces 100% genuines importées directement d'Australie.",
      ar: "اطلب عبر الموقع أو واتساب، وادفع عند الاستلام في كل ولايات الجزائر. قطع أصلية 100% مستوردة مباشرة من أستراليا.",
    },
    ctaLabel: { fr: "Commander Maintenant", ar: "اطلب الآن" },
    ctaLink: "/shop",
    active: true,
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: { fr: "Hilux Expedition Build", ar: "تجهيز هايلوكس للرحلات" },
    customerName: "Karim B.",
    vehicle: "Toyota Hilux 2019",
    wilaya: "16 - Alger",
    testimonial: {
      fr: "Kit Foam Cell Pro, bull bar acier et tente de toit installés en 2 jours chez Dahra Motors. Le véhicule est méconnaissable — un vrai char d'expédition, confort incroyable sur piste.",
      ar: "تم تركيب طقم فوم سيل برو والمصعد الفولاذي وخيمة السقف في يومين لدى الضهرة موتورز. السيارة لا تُعرف — دبابة رحلات حقيقية وراحة مذهلة على المسالك.",
    },
    rating: 5,
    beforeImage: "/images/about-workshop.jpg",
    afterImage: "/images/hero-dual-4x4.jpg",
    videoSrc: "",
    active: true,
  },
  {
    id: "gal-2",
    title: { fr: "Ranger Overland Setup", ar: "تجهيز رينجر أوفرلاند" },
    customerName: "Sofiane M.",
    vehicle: "Ford Ranger T6 2018",
    wilaya: "31 - Oran",
    testimonial: {
      fr: "Galerie aluminium, auvent batwing et frigo 45L : mon Ranger est prêt pour le grand sud. Équipe experte, pièces 100% d'origine avec garantie officielle.",
      ar: "حاملة ألمنيوم، مظلة باتوينغ وثلاجة 45 لتر: الرينجر جاهز للجنوب الكبير. فريق خبير وقطع أصلية 100% مع ضمان رسمي.",
    },
    rating: 5,
    beforeImage: "/images/cat-suspension.jpg",
    afterImage: "/images/cat-roofrack.jpg",
    videoSrc: "",
    active: true,
  },
  {
    id: "gal-3",
    title: { fr: "Patrol Sahara Ready", ar: "باترول جاهز للصحراء" },
    customerName: "Yacine T.",
    vehicle: "Nissan Patrol Y62 2016",
    wilaya: "30 - Ouargla",
    testimonial: {
      fr: "Suspension Heavy Duty, treuil 12 000 lb, barre LED et compresseur. Trois raids dans l'erg depuis — zéro souci, zéro surchauffe. Dahra Motors est LA référence Ironman 4x4 en Algérie.",
      ar: "تعليق هيفي ديوتي، ونش 12000 رطل، شريط LED ومضخة هواء. ثلاث رحلات في العرق منذ ذلك الحين — بدون أي مشكلة. الضهرة موتورز هي المرجع لآيرون مان 4x4 في الجزائر.",
    },
    rating: 5,
    beforeImage: "/images/cat-bullbar.jpg",
    afterImage: "/images/hero-desert.jpg",
    videoSrc: "",
    active: true,
  },
];

export const DEFAULT_VIDEO_SECTION: VideoSection = {
  enabled: true,
  videoUrl: "https://www.youtube.com/watch?v=X_MdJuPfg_0",
  poster: "/images/cat-suspension.jpg",
  badge: {
    fr: "EXPÉRIENCE IMMERSIVE — TECHNOLOGIE MONOTUBE",
    ar: "تجربة غامرة — تقنية الأنبوب الأحادي",
  },
  title: {
    fr: "IM2.5 MONOTUBE SUSPENSION",
    ar: "تعليق IM2.5 أحادي الأنبوب",
  },
  subtitle: {
    fr: "Un amortissement à réponse ultra-rapide : aluminium 6061-T6 forgé, piston 60 mm et bombonne séparée à ailettes de dissipation thermique. La technologie Ironman 4x4 en action sur les pistes algériennes.",
    ar: "استجابة فائقة السرعة: ألمنيوم 6061-T6 مطروق، مكبس 60 مم وخزان منفصل بزعانف تبديد الحرارة. تقنية آيرون مان 4x4 في action على المسالك الجزائرية.",
  },
  ctaLabel: {
    fr: "Découvrir les Suspensions",
    ar: "اكتشف أنظمة التعليق",
  },
  ctaLink: "/shop?category=suspension",
};

export const DEFAULT_STATE: CmsState = {
  settings: {
    storeName: "Dahra Motors 4x4",
    tagline: {
      fr: "Représentant Officiel Ironman 4x4 en Algérie",
      ar: "الممثل الرسمي لآيرون مان 4x4 في الجزائر",
    },
    phone: "+213 556 40 08 30",
    phones: ["+213 556 40 08 30"],
    whatsapp: "+213556400830",
    email: "contact@dahramotors.b3na.com",
    address: {
      fr: "Zone d'activité, Baraki — Alger, Algérie",
      ar: "المنطقة النشاطية، براقي — الجزائر العاصمة، الجزائر",
    },
    mapLink: "https://maps.app.goo.gl/p4LuKnYaCnGDtwLg",
    hours: {
      fr: "Sam - Jeu : 8h30 - 18h00 | Ven : fermé",
      ar: "السبت - الخميس: 8:30 - 18:00 | الجمعة: مغلق",
    },
    headerLogo: "/images/logo-dahra.png",
    footerLogo: "/images/logo-dahra.png",
    social: {
      facebook: "https://facebook.com/dahramotors4x4",
      instagram: "https://instagram.com/dahramotors4x4",
      tiktok: "https://tiktok.com/@dahramotors4x4",
    youtube: "https://www.youtube.com/watch?v=X_MdJuPfg_0",
    },
  },
  credentials: {
    username: "dahramotors",
    password: "dahra123",
  },
  hero: DEFAULT_HERO,
  videoSection: DEFAULT_VIDEO_SECTION,
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS,
  gallery: DEFAULT_GALLERY,
  content: {
    aboutTitle: {
      fr: "La Référence Ironman 4x4 en Algérie",
      ar: "المرجع الأول لآيرون مان 4x4 في الجزائر",
    },
    aboutText: {
      fr: "Dahra Motors est le représentant officiel et distributeur autorisé d'Ironman 4x4 en Algérie. Nous apportons l'excellence 4x4 mondiale, une durabilité extrême et des garanties officielles directement aux passionnés de tout-terrain algériens.",
      ar: "الضهرة موتورز هي الممثل الرسمي والموزع المعتمد لآيرون مان 4x4 في الجزائر. نجلب التميز العالمي في عالم الدفع الرباعي والمتانة الفائقة والضمانات الرسمية مباشرة إلى عشاق الطرق الوعرة الجزائريين.",
    },
    aboutText2: {
      fr: "Depuis notre showroom et atelier de Baraki (Alger), notre équipe d'experts certifiés conçoit, fournit et installe des solutions complètes : suspension Foam Cell Pro, protection acier, roof racks, tentes de toit et équipement overlanding — testés dans le désert australien, éprouvés sur les pistes du Sahara.",
      ar: "من معرضنا وورشتنا في براقي (الجزائر العاصمة)، يقوم فريقنا من الخبراء المعتمدين بتصميم وتوفير وتركيب حلول متكاملة: تعليق فوم سيل برو، حماية فولاذية، حاملات سقف، خيام سقف ومعدات أوفرلاند — مُختبرة في الصحراء الأسترالية ومُجرّبة على مسالك الصحراء الكبرى.",
    },
    aboutImage: "/images/about-workshop.jpg",
    stats: [
      { value: "69", label: { fr: "Wilayas livrées", ar: "ولاية نغطيها" } },
      { value: "100%", label: { fr: "Pièces genuines", ar: "قطع أصلية" } },
      { value: "10+", label: { fr: "Années d'expertise", ar: "سنوات خبرة" } },
      { value: "5000+", label: { fr: "4x4 équipés", ar: "سيارة 4x4 جهزناها" } },
    ],
    trustBadges: [
      {
        icon: "install",
        title: { fr: "Installation Experte", ar: "تركيب احترافي" },
        text: {
          fr: "Atelier certifié à Baraki — montage et réglage par nos techniciens.",
          ar: "ورشة معتمدة في براقي — تركيب ومعايرة من فنيينا.",
        },
        enabled: true,
      },
      {
        icon: "shipping",
        title: { fr: "Livraison 69 Wilayas", ar: "توصيل 69 ولاية" },
        text: {
          fr: "Expédition rapide partout en Algérie, paiement à la livraison.",
          ar: "شحن سريع لكل الجزائر، الدفع عند الاستلام.",
        },
        enabled: true,
      },
      {
        icon: "genuine",
        title: { fr: "100% Pièces d'Origine", ar: "قطع أصلية 100%" },
        text: {
          fr: "Importation directe d'Australie — zéro contrefaçon, zéro doute.",
          ar: "استيراد مباشر من أستراليا — بدون تقليد، بدون شك.",
        },
        enabled: true,
      },
    ],
    categoriesTitle: {
      fr: "Équipez Votre 4x4 par Catégorie",
      ar: "جهّز سيارتك حسب الفئة",
    },
    categoriesSubtitle: {
      fr: "Toute la gamme Ironman 4x4 disponible en Algérie",
      ar: "كل تشكيلة آيرون مان 4x4 متوفرة في الجزائر",
    },
    featuredTitle: { fr: "Produits Phares", ar: "المنتجات المميزة" },
    featuredSubtitle: {
      fr: "Les équipements préférés des raiders algériens",
      ar: "المعدات المفضلة لدى محبي الرحلات في الجزائر",
    },
    selectorTitle: {
      fr: "Trouvez les Pièces pour Votre Véhicule",
      ar: "اعثر على القطع المناسبة لسيارتك",
    },
    selectorSubtitle: {
      fr: "Sélectionnez votre marque, modèle et année — nous filtrons les pièces 100% compatibles.",
      ar: "اختر الماركة والموديل والسنة — وسنعرض لك القطع المتوافقة 100%.",
    },
    bannerTitle: {
      fr: "IRONMAN 4x4 — FORGÉ EN AUSTRALIE, ÉPROUVÉ EN ALGÉRIE",
      ar: "آيرون مان 4x4 — صُنع في أستراليا، أُثبت في الجزائر",
    },
    bannerText: {
      fr: "Dahra Motors est votre accès direct et officiel à la gamme complète Ironman 4x4 : des milliers de références, un stock local, une garantie officielle et l'expertise d'installation que seul un distributeur autorisé peut offrir.",
      ar: "الضهرة موتورز هي بوابتك المباشرة والرسمية لتشكيلة آيرون مان 4x4 الكاملة: آلاف المراجع، مخزون محلي، ضمان رسمي وخبرة تركيب لا يقدمها إلا موزع معتمد.",
    },
    bannerCta: { fr: "Explorer Tout le Catalogue", ar: "استكشف الكتالوج كاملاً" },
  },
  orders: [],
};
