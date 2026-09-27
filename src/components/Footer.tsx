import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Send,
  Check,
} from "lucide-react";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";

export default function Footer() {
  const { state, lang, t } = useCms();
  const { settings, categories } = state;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-onyx text-slate-300">
      {/* Social strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <img src={settings.footerLogo} alt="Dahra Motors" className="logo-on-dark h-12 w-12 object-contain" />
            <div>
              <div className="font-display text-lg font-extrabold uppercase tracking-wider text-white">
                Dahra <span className="text-brand">Motors</span> 4x4
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand">
                {t("footer.official")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {settings.social.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="rounded border border-white/15 p-2.5 transition-all hover:border-brand hover:bg-brand hover:text-black"><Facebook size={17} /></a>
            )}
            {settings.social.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="rounded border border-white/15 p-2.5 transition-all hover:border-brand hover:bg-brand hover:text-black"><Instagram size={17} /></a>
            )}
            {settings.social.tiktok && (
              <a href={settings.social.tiktok} target="_blank" rel="noreferrer" className="rounded border border-white/15 p-2.5 font-display text-xs font-bold transition-all hover:border-brand hover:bg-brand hover:text-black">TikTok</a>
            )}
            {settings.social.youtube && (
              <a href={settings.social.youtube} target="_blank" rel="noreferrer" className="rounded border border-white/15 p-2.5 transition-all hover:border-brand hover:bg-brand hover:text-black"><Youtube size={17} /></a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div>
          <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-white">
            {settings.storeName}
          </h3>
          <p className="text-sm leading-relaxed text-slate-400">
            {loc(state.content.aboutText, lang)}
          </p>
          <div className="mt-5 rounded border border-brand/30 bg-brand/10 p-3 text-xs text-brand-strong">
            ★ {loc(settings.tagline, lang)}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-white">
            {t("footer.quickLinks")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="transition-colors hover:text-brand">{t("nav.home")}</Link></li>
            <li><Link to="/shop" className="transition-colors hover:text-brand">{t("nav.shop")}</Link></li>
            <li><Link to="/calculator" className="transition-colors hover:text-brand">{t("nav.calculator")}</Link></li>
            <li><Link to="/visualizer" className="transition-colors hover:text-brand">{t("nav.visualizer")}</Link></li>
            <li><Link to="/gallery" className="transition-colors hover:text-brand">{t("nav.gallery")}</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-brand">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-brand">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-white">
            {t("footer.categories")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {categories.filter((c) => c.active).slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link to={`/shop?category=${cat.slug}`} className="transition-colors hover:text-brand">
                  {loc(cat.name, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + newsletter */}
        <div>
          <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-white">
            {t("footer.contact")}
          </h3>
          <ul className="space-y-3 text-sm">
            {(settings.phones?.length ? settings.phones : [settings.phone]).map((p, i) => (
              <li key={p + i} className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-brand" />
                <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-brand" dir="ltr">{p}</a>
              </li>
            ))}
            <li className="flex items-start gap-2.5">
              <Mail size={15} className="mt-0.5 shrink-0 text-brand" />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-brand">{settings.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-brand" />
              <a
                href={settings.mapLink}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-brand"
              >
                {loc(settings.address, lang)}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={15} className="mt-0.5 shrink-0 text-brand" />
              <span>{loc(settings.hours, lang)}</span>
            </li>
          </ul>
          <div className="mt-5">
            <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">{t("footer.newsletter")}</p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand-strong">
                <Check size={15} /> {t("footer.subscribed")}
              </div>
            ) : (
              <form
                className="flex overflow-hidden rounded border border-white/15 bg-white/5 focus-within:border-brand"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.emailPlaceholder")}
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button type="submit" className="bg-brand px-3 text-black transition-colors hover:bg-brand-strong" aria-label={t("footer.subscribe")}>
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Exclusive bottom brand badge */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-7">
          <div className="flex items-center gap-3 rounded-full border border-brand/40 bg-gradient-to-r from-brand/10 via-transparent to-brand/10 px-6 py-2.5 shadow-[0_0_30px_rgba(76,198,42,0.15)]">
            <img src={settings.footerLogo} alt="Dahra Motors 4x4" className="logo-on-dark h-10 w-10 object-contain" />
            <span className="font-display text-xl font-extrabold uppercase tracking-[0.2em] text-white">
              Dahra <span className="text-brand">Motors</span> 4x4
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            © {year} {settings.storeName}. {t("footer.rights")}
          </p>
          <Link
            to="/admin"
            className="text-[11px] uppercase tracking-[0.2em] text-slate-600 transition-colors hover:text-brand"
          >
            {t("nav.adminSpace")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
