import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Images,
  Brush,
  FileText,
  Contact,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Camera,
  BarChart3,
  History,
  Clapperboard,
} from "lucide-react";
import { useCms } from "../../lib/store";
import AdminLogin from "./AdminLogin";
import {
  OverviewTab,
  OrdersTab,
  AnalyticsTab,
  ProductsTab,
  CategoriesTab,
  HeroTab,
  BrandingTab,
  ContentTab,
  ContactTab,
  SecurityTab,
  GalleryTab,
  ActivityTab,
  VideoSectionTab,
} from "./tabs";

type TabKey =
  | "overview"
  | "orders"
  | "analytics"
  | "products"
  | "categories"
  | "hero"
  | "videoSection"
  | "gallery"
  | "branding"
  | "content"
  | "contact"
  | "security"
  | "activity";

const TABS: { key: TabKey; icon: typeof Package; labelKey: string }[] = [
  { key: "overview", icon: LayoutDashboard, labelKey: "admin.dashboard" },
  { key: "orders", icon: ShoppingBag, labelKey: "admin.orders" },
  { key: "analytics", icon: BarChart3, labelKey: "admin.analytics" },
  { key: "products", icon: Package, labelKey: "admin.products" },
  { key: "categories", icon: FolderTree, labelKey: "admin.categoriesAdmin" },
  { key: "hero", icon: Images, labelKey: "admin.heroAdmin" },
  { key: "videoSection", icon: Clapperboard, labelKey: "admin.videoSection" },
  { key: "gallery", icon: Camera, labelKey: "admin.galleryAdmin" },
  { key: "branding", icon: Brush, labelKey: "admin.branding" },
  { key: "content", icon: FileText, labelKey: "admin.contentAdmin" },
  { key: "contact", icon: Contact, labelKey: "admin.contactAdmin" },
  { key: "security", icon: ShieldCheck, labelKey: "admin.security" },
  { key: "activity", icon: History, labelKey: "admin.activity" },
];

export default function AdminDashboard() {
  const { isAdmin, logout, t, state } = useCms();
  const [tab, setTab] = useState<TabKey>("overview");
  const [navOpen, setNavOpen] = useState(false);

  if (!isAdmin) return <AdminLogin />;

  const pendingOrders = state.orders.filter((o) => o.status === "pending").length;

  const sidebar = (
    <nav className="grid gap-1">
      {TABS.map(({ key, icon: Icon, labelKey }) => (
        <button
          key={key}
          onClick={() => {
            setTab(key);
            setNavOpen(false);
          }}
          className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-start text-sm font-bold uppercase tracking-wide transition-colors ${
            tab === key
              ? "bg-emerald-600 text-black"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Icon size={17} />
          <span className="flex-1">{t(labelKey as never)}</span>
          {key === "orders" && pendingOrders > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-black">
              {pendingOrders}
            </span>
          )}
        </button>
      ))}
      <div className="mt-4 grid gap-1 border-t border-slate-800 pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <ExternalLink size={17} /> {t("admin.viewSite")}
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-950/50"
        >
          <LogOut size={17} /> {t("admin.logout")}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Admin top bar */}
      <div className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNavOpen((o) => !o)}
              className="rounded border border-slate-700 p-2 text-slate-300 lg:hidden"
              aria-label="Menu"
            >
              {navOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <img src={state.settings.headerLogo} alt="Dahra Motors" className="logo-on-dark h-10 w-10 object-contain" />
            <div>
              <div className="font-display text-lg font-extrabold uppercase tracking-wider">
                Dahra <span className="text-emerald-500">Motors</span> — CMS
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Administration complète du site
              </div>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/50 px-4 py-1.5 text-xs font-bold text-emerald-400 sm:flex">
            <ShieldCheck size={14} /> {state.credentials.username}
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[250px_1fr]">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">{sidebar}</div>
        </aside>

        {/* Sidebar mobile */}
        {navOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setNavOpen(false)}>
            <div
              className="h-full w-72 overflow-y-auto border-e border-slate-800 bg-slate-950 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebar}
            </div>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0">
          {tab === "overview" && <OverviewTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "analytics" && <AnalyticsTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "hero" && <HeroTab />}
          {tab === "videoSection" && <VideoSectionTab />}
          {tab === "gallery" && <GalleryTab />}
          {tab === "branding" && <BrandingTab />}
          {tab === "content" && <ContentTab />}
          {tab === "contact" && <ContactTab />}
          {tab === "security" && <SecurityTab />}
          {tab === "activity" && <ActivityTab />}
        </main>
      </div>
    </div>
  );
}

export function AdminRoute() {
  return <AdminDashboard />;
}

export function RequireNothing({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const AdminRedirect = () => <Navigate to="/admin" replace />;
