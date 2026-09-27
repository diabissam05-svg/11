import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import TrustBadges from "../components/TrustBadges";
import VehicleSelector from "../components/VehicleSelector";
import ProductCard from "../components/ProductCard";
import VideoBackground from "../components/VideoBackground";
import VideoSectionBanner from "../components/VideoSectionBanner";
import { useCodModal } from "../components/useCodModal";

export default function Home() {
  const { state, lang, t } = useCms();
  const slides = state.hero.filter((s) => s.active);
  const [current, setCurrent] = useState(0);
  const { openCod, codModal } = useCodModal();

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      6500
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const featured = state.products.filter((p) => p.active && p.featured).slice(0, 8);
  const categories = state.categories.filter((c) => c.active);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div>
      {/* ============ HERO SLIDER ============ */}
      <section className="relative h-[78vh] min-h-[540px] overflow-hidden bg-onyx">
        <AnimatePresence mode="sync">
          {slides[current] && (
            <motion.div
              key={slides[current].id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {slides[current].mediaType === "video" && slides[current].videoUrl ? (
                <VideoBackground
                  url={slides[current].videoUrl}
                  poster={slides[current].videoPoster || slides[current].image}
                  autoplay={slides[current].autoplay !== false}
                  muted={slides[current].muted !== false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={slides[current].image}
                  alt={loc(slides[current].title, lang)}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4">
          <AnimatePresence mode="wait">
            {slides[current] && (
              <motion.div
                key={slides[current].id + "-content"}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded border border-brand/50 bg-brand/10 px-4 py-1.5 backdrop-blur-sm">
                  <ShieldCheck size={15} className="text-brand" />
                  <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">
                    {loc(slides[current].badge, lang)}
                  </span>
                </div>
                <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-wide text-white sm:text-7xl lg:text-8xl">
                  {loc(slides[current].title, lang).split(" ")[0]}
                  <br />
                  <span className="text-brand">
                    {loc(slides[current].title, lang).split(" ").slice(1).join(" ")}
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                  {loc(slides[current].subtitle, lang)}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to={slides[current].ctaLink}
                    className="group flex items-center gap-2 rounded bg-brand px-7 py-3.5 font-display text-base font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/40"
                  >
                    {loc(slides[current].ctaLabel, lang)}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                  </Link>
                  <Link
                    to="/about"
                    className="rounded border-2 border-white/40 px-7 py-3 font-display text-base font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-brand hover:bg-brand hover:text-black"
                  >
                    {t("nav.about")}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slider controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute start-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/40 p-2.5 text-white backdrop-blur-sm transition-all hover:border-brand hover:bg-brand hover:text-black"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} className="rtl:rotate-180" />
            </button>
            <button
              onClick={next}
              className="absolute end-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/40 p-2.5 text-white backdrop-blur-sm transition-all hover:border-brand hover:bg-brand hover:text-black"
              aria-label="Next slide"
            >
              <ChevronRight size={22} className="rtl:rotate-180" />
            </button>
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-10 bg-brand" : "w-4 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ============ TRUST BADGES ============ */}
      <section className="border-b border-line bg-bg-alt py-10">
        <div className="mx-auto max-w-7xl px-4">
          <TrustBadges />
        </div>
      </section>

      {/* ============ VEHICLE SELECTOR ============ */}
      <section className="relative overflow-hidden bg-onyx py-16">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(/images/hero-mud.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/40 to-onyx/80" />
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <Reveal>
            <VehicleSelector />
          </Reveal>
        </div>
      </section>

      {/* ============ VIDEO SECTION BANNER (admin-driven) ============ */}
      <VideoSectionBanner />

      {/* ============ CATEGORIES ============ */}
      <section className="bg-bg py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <SectionHeading
              title={state.content.categoriesTitle}
              subtitle={state.content.categoriesSubtitle}
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 0.06}>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-lg"
                >
                  <img
                    src={cat.image}
                    alt={loc(cat.name, lang)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-all group-hover:from-brand/80" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-white">
                      {loc(cat.name, lang)}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {loc(cat.description, lang)}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-widest text-brand">
                      {t("cta.explore")} <ArrowRight size={13} className="rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS (admin-created only) ============ */}
      {featured.length > 0 && (
      <section className="bg-bg-alt py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <SectionHeading
              title={state.content.featuredTitle}
              subtitle={state.content.featuredSubtitle}
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onOrder={openCod} />
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded border-2 border-brand px-8 py-3.5 font-display text-base font-bold uppercase tracking-wider text-brand transition-all hover:bg-brand hover:text-black"
            >
              {t("cta.viewAll")}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </Reveal>
        </div>
      </section>
      )}

      {/* ============ ABOUT / BRAND AUTHORITY ============ */}
      <section className="overflow-hidden bg-bg py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={state.content.aboutImage}
                  alt="Dahra Motors workshop"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -end-4 rounded-lg border border-brand/40 bg-surface p-5 shadow-2xl sm:-end-6">
                <div className="flex items-center gap-3">
                  <Sparkles size={28} className="text-brand" />
                  <div>
                    <div className="font-display text-2xl font-extrabold text-ink">100%</div>
                    <div className="text-xs uppercase tracking-widest text-muted">
                      Genuine Ironman 4x4
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -start-3 hidden rounded bg-brand px-4 py-2 font-display text-sm font-extrabold uppercase tracking-widest text-black shadow-xl sm:block">
                Official Distributor
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[3px] w-10 bg-brand" />
                <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-brand">
                  {t("about.officialRep")}
                </span>
              </div>
              <h2 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-wide text-ink sm:text-4xl lg:text-5xl">
                {loc(state.content.aboutTitle, lang)}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {loc(state.content.aboutText, lang)}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {loc(state.content.aboutText2, lang)}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {state.content.stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-lg border border-line bg-surface p-4 text-center transition-colors hover:border-brand/60"
                  >
                    <div className="font-display text-3xl font-extrabold text-brand">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {loc(stat.label, lang)}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="group mt-8 inline-flex items-center gap-2 rounded bg-brand px-7 py-3.5 font-display text-base font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/30"
              >
                {t("nav.about")}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ IRONMAN BANNER CTA ============ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/hero-desert.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "scroll",
          }}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-wide text-white sm:text-5xl">
              {loc(state.content.bannerTitle, lang).split(" ")[0]}{" "}
              <span className="text-brand">
                {loc(state.content.bannerTitle, lang).split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
              {loc(state.content.bannerText, lang)}
            </p>
            <Link
              to="/shop"
              className="group mt-8 inline-flex items-center gap-2 rounded bg-brand px-9 py-4 font-display text-lg font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-2xl hover:shadow-brand/40"
            >
              {loc(state.content.bannerCta, lang)}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </Reveal>
        </div>
      </section>

      {codModal}
    </div>
  );
}
