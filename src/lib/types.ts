export interface Localized {
  fr: string;
  ar: string;
}

export interface Settings {
  storeName: string;
  tagline: Localized;
  phone: string;
  phones: string[];
  whatsapp: string;
  email: string;
  address: Localized;
  mapLink: string;
  hours: Localized;
  headerLogo: string;
  footerLogo: string;
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
}

export interface Credentials {
  username: string;
  password: string;
}

export interface HeroSlide {
  id: string;
  mediaType: "image" | "video";
  image: string;
  videoUrl: string;
  videoPoster: string;
  autoplay: boolean;
  muted: boolean;
  badge: Localized;
  title: Localized;
  subtitle: Localized;
  ctaLabel: Localized;
  ctaLink: string;
  active: boolean;
}

export interface VideoSection {
  enabled: boolean;
  videoUrl: string;
  poster: string;
  badge: Localized;
  title: Localized;
  subtitle: Localized;
  ctaLabel: Localized;
  ctaLink: string;
}

export interface Category {
  id: string;
  slug: string;
  name: Localized;
  image: string;
  description: Localized;
  active: boolean;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameAr: string;
  categorySlug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  badge: string;
  image: string;
  shortDescription: string;
  problem: string;
  solution: string;
  features: string[];
  specs: Spec[];
  fitment: string[];
  warranty: string;
  active: boolean;
  featured: boolean;
  showLowStockBadge: boolean;
  showDiscountBadge: boolean;
}

export type TrustBadgeIcon =
  | "warranty"
  | "install"
  | "shipping"
  | "genuine"
  | "phone"
  | "chat"
  | "star"
  | "zap"
  | "clock"
  | "medal";

export interface TrustBadge {
  icon: TrustBadgeIcon;
  title: Localized;
  text: Localized;
  enabled: boolean;
}

export interface GalleryItem {
  id: string;
  title: Localized;
  customerName: string;
  vehicle: string;
  wilaya: string;
  testimonial: Localized;
  rating: number;
  beforeImage: string;
  afterImage: string;
  videoSrc: string;
  active: boolean;
}

export interface SiteContent {
  aboutTitle: Localized;
  aboutText: Localized;
  aboutText2: Localized;
  aboutImage: string;
  stats: { value: string; label: Localized }[];
  trustBadges: TrustBadge[];
  categoriesTitle: Localized;
  categoriesSubtitle: Localized;
  featuredTitle: Localized;
  featuredSubtitle: Localized;
  selectorTitle: Localized;
  selectorSubtitle: Localized;
  bannerTitle: Localized;
  bannerText: Localized;
  bannerCta: Localized;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  reference: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  customerName: string;
  phone: string;
  wilaya: string;
  address: string;
  note: string;
  channel: "COD" | "WHATSAPP";
  status: OrderStatus;
  createdAt: number;
  installation: { date: string; slot: string } | null;
}

export interface CmsState {
  settings: Settings;
  credentials: Credentials;
  hero: HeroSlide[];
  videoSection: VideoSection;
  categories: Category[];
  products: Product[];
  content: SiteContent;
  gallery: GalleryItem[];
  orders: Order[];
}

export interface ActivityEntry {
  id: string;
  ts: number;
  user: string;
  action: string;
  item: string;
}

export interface Analytics {
  visits: number;
  orders: number;
  searches: number;
  queries: Record<string, number>;
  daily: Record<string, number>;
}
