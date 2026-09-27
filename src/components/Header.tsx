import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Calculator,
  Palette,
  Camera,
} from "lucide-react";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";

const NAV_LINKS = [
  { to: "/", key: "nav.home" as const },
  { to: "/shop", key: "nav.shop" as const },
  { to: "/calculator", key: "nav.calculator" as const, icon: Calculator },
  { to: "/visualizer", key: "nav.visualizer" as const, icon: Palette },
  { to: "/gallery", key: "nav.gallery" as const, icon: Camera },
  { to: "/about", key: "nav.about" as const },
  { to: "/contact", key: "nav.contact" as const },
];

export default function Header() {
  const { state, lang, theme, toggleTheme, setLang, t } = useCms();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const { settings } = state;

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden bg-onyx text-slate-300 lg:block border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-brand" />
              <span className="flex items-center gap-1.5" dir="ltr">
                {(settings.phones?.length ? settings.phones : [settings.phone]).map((p, i) => (
                  <span key={p + i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="opacity-40">/</span>}
                    <a href={`tel:${p.replace(/\s/g, "")}`} className="transition-colors hover:text-brand">{p}</a>
                  </span>
                ))}
              </span>
            </span>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-brand transition-colors">
              <Mail size={13} className="text-brand" /> {settings.email}
            </a>
            <a
              href={settings.mapLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <MapPin size={13} className="text-brand" /> {loc(settings.address, lang)}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display tracking-widest text-brand uppercase" style={{ fontWeight: 700 }}>
              {t("topbar.official").split("—")[0]}
            </span>
            <div className="flex items-center gap-2">
              {settings.social.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="hover:text-brand transition-colors"><Facebook size={14} /></a>
              )}
              {settings.social.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="hover:text-brand transition-colors"><Instagram size={14} /></a>
              )}
              {settings.social.youtube && (
                <a href={settings.social.youtube} target="_blank" rel="noreferrer" className="hover:text-brand transition-colors"><Youtube size={14} /></a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "bg-bg/95 backdrop-blur-md border-line shadow-lg shadow-black/10"
            : "bg-bg border-line"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={settings.headerLogo}
              alt="Dahra Motors 4x4"
              className="logo-theme-aware h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
            />
            <div className="leading-none">
              <div className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-ink">
                Dahra <span className="text-brand">Motors</span>
              </div>
              <div className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted sm:block">
                Official Ironman 4x4 — Algeria
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `font-display px-3 py-2 text-[15px] font-bold uppercase tracking-wide transition-colors ${
                    isActive
                      ? "text-brand"
                      : "text-ink hover:text-brand"
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
              className="font-display rounded border border-line px-2.5 py-1.5 text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:border-brand hover:text-brand"
              aria-label="Switch language"
            >
              {lang === "fr" ? "عربي" : "FR"}
            </button>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded border border-line p-2 text-ink transition-colors hover:border-brand hover:text-brand"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded bg-brand px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30 md:flex"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded border border-line p-2 text-ink xl:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-line bg-surface xl:hidden"
          >
            <nav className="flex flex-col px-4 py-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `font-display flex items-center gap-2.5 border-b border-line py-3 text-lg font-bold uppercase tracking-wider ${
                      isActive ? "text-brand" : "text-ink"
                    }`
                  }
                >
                  {link.icon && <link.icon size={18} className="text-brand" />}
                  {t(link.key)}
                </NavLink>
              ))}
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded bg-brand px-4 py-3 font-display font-bold uppercase tracking-wider text-black"
              >
                <MessageCircle size={17} /> {t("cta.whatsapp")}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
