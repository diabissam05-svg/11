import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Send,
} from "lucide-react";
import { useCms, buildWhatsAppLink } from "../lib/store";
import { loc } from "../lib/i18n";
import Reveal from "../components/Reveal";

export default function Contact() {
  const { state, lang, t } = useCms();
  const { settings } = state;
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const waLink = buildWhatsAppLink(
    settings.whatsapp,
    `Bonjour Dahra Motors 4x4 👋\n\nNom : ${form.name || "—"}\nTéléphone : ${form.phone || "—"}\n\n${form.message || "Je souhaite des informations sur vos produits Ironman 4x4."}`
  );

  const cards = [
    {
      icon: Phone,
      title: t("contact.phone"),
      value: (settings.phones?.length ? settings.phones : [settings.phone]).join("  ·  "),
      href: `tel:${(settings.phones?.[0] ?? settings.phone).replace(/\s/g, "")}`,
      dir: "ltr" as const,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: settings.whatsapp,
      href: waLink,
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      title: t("contact.email"),
      value: settings.email,
      href: `mailto:${settings.email}`,
      dir: "ltr" as const,
    },
    {
      icon: MapPin,
      title: t("contact.address"),
      value: loc(settings.address, lang),
      href: settings.mapLink,
      dir: undefined,
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      value: loc(settings.hours, lang),
      href: undefined,
      dir: undefined,
    },
  ];

  const inputClass =
    "w-full rounded border border-line bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors";

  return (
    <div className="bg-bg">
      {/* Hero */}
      <div className="relative overflow-hidden bg-onyx py-16">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(/images/cat-recovery.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide text-white sm:text-6xl">
            {t("contact.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">{t("contact.subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact cards */}
          <Reveal>
            <div>
              <h2 className="font-display mb-6 text-2xl font-extrabold uppercase tracking-wide text-ink">
                {settings.storeName} — Baraki, Alger
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {cards.map((card) => {
                  const inner = (
                    <div className="flex h-full items-start gap-3 rounded-lg border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-brand/15 text-brand">
                        <card.icon size={19} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-muted">
                          {card.title}
                        </div>
                        <div className="mt-0.5 break-words text-sm font-semibold text-ink" dir={card.dir}>
                          {card.value}
                        </div>
                      </div>
                    </div>
                  );
                  return card.href ? (
                    <a
                      key={card.title}
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="block"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={card.title}>{inner}</div>
                  );
                })}
              </div>

              {/* Socials */}
              <div className="mt-8">
                <h3 className="font-display mb-3 text-base font-extrabold uppercase tracking-widest text-ink">
                  {t("contact.follow")}
                </h3>
                <div className="flex gap-3">
                  {settings.social.facebook && (
                    <a href={settings.social.facebook} target="_blank" rel="noreferrer" className="rounded border border-line p-3 text-ink transition-all hover:border-brand hover:bg-brand hover:text-black"><Facebook size={18} /></a>
                  )}
                  {settings.social.instagram && (
                    <a href={settings.social.instagram} target="_blank" rel="noreferrer" className="rounded border border-line p-3 text-ink transition-all hover:border-brand hover:bg-brand hover:text-black"><Instagram size={18} /></a>
                  )}
                  {settings.social.tiktok && (
                    <a href={settings.social.tiktok} target="_blank" rel="noreferrer" className="rounded border border-line px-4 py-3 font-display text-sm font-bold text-ink transition-all hover:border-brand hover:bg-brand hover:text-black">TikTok</a>
                  )}
                  {settings.social.youtube && (
                    <a href={settings.social.youtube} target="_blank" rel="noreferrer" className="rounded border border-line p-3 text-ink transition-all hover:border-brand hover:bg-brand hover:text-black"><Youtube size={18} /></a>
                  )}
                </div>
              </div>

              {/* Map embed */}
              <div className="mt-8 overflow-hidden rounded-lg border border-line">
                <iframe
                  title="Dahra Motors Baraki"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=3.05%2C36.60%2C3.15%2C36.66&layer=mapnik&marker=36.63%2C3.10"
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          {/* Message form → WhatsApp */}
          <Reveal delay={0.15}>
            <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
              <h2 className="font-display mb-1 text-2xl font-extrabold uppercase tracking-wide text-ink">
                {t("contact.form.title")}
              </h2>
              <p className="mb-6 text-sm text-muted">
                {t("contact.subtitle")}
              </p>
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.open(waLink, "_blank");
                }}
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("cod.name")}
                  </label>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Mohamed Benali"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("cod.phone")}
                  </label>
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="0555 12 34 56"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Bonjour, je cherche un kit suspension Foam Cell Pro pour Toyota Hilux 2019…"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 font-display text-base font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/30"
                >
                  <Send size={17} /> {t("contact.form.send")}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
