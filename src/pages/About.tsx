import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Award, Users, MapPin } from "lucide-react";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";
import Reveal from "../components/Reveal";
import TrustBadges from "../components/TrustBadges";
import SectionHeading from "../components/SectionHeading";

export default function About() {
  const { state, lang, t } = useCms();
  const { content, settings } = state;

  const pillars = [
    {
      icon: Award,
      title: { fr: "Distributeur Autorisé", ar: "موزع معتمد" },
      text: {
        fr: "Accès direct à toute la gamme Ironman 4x4, importée d'Australie avec certificats d'authenticité.",
        ar: "وصول مباشر لتشكيلة آيرون مان 4x4 الكاملة، مستوردة من أستراليا مع شهادات أصالة.",
      },
    },
    {
      icon: ShieldCheck,
      title: { fr: "Garantie Officielle", ar: "ضمان رسمي" },
      text: {
        fr: "Chaque produit est couvert par la garantie officielle Ironman 4x4 — jusqu'à 3 ans, kilométrage illimité.",
        ar: "كل منتج مغطى بالضمان الرسمي لآيرون مان 4x4 — حتى 3 سنوات، بدون حد للمسافة.",
      },
    },
    {
      icon: Users,
      title: { fr: "Experts Certifiés", ar: "خبراء معتمدون" },
      text: {
        fr: "Techniciens formés aux standards Ironman 4x4 : conception, montage et réglage de votre setup complet.",
        ar: "فنيون مدربون وفق معايير آيرون مان 4x4: تصميم وتركيب ومعايرة تجهيزك الكامل.",
      },
    },
    {
      icon: MapPin,
      title: { fr: "Ancrage Local", ar: "جذور محلية" },
      text: {
        fr: "Showroom et atelier à Baraki (Alger), livraison et installation sur les 69 wilayas.",
        ar: "معرض وورشة في براقي (الجزائر)، توصيل وتركيب في 69 ولاية.",
      },
    },
  ];

  return (
    <div className="bg-bg">
      {/* Hero */}
      <div className="relative overflow-hidden bg-onyx py-24">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "url(/images/about-workshop.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/60 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded border border-brand/50 bg-brand/10 px-4 py-1.5">
            <ShieldCheck size={15} className="text-brand" />
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">
              {t("about.officialRep")}
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide text-white sm:text-6xl">
            {t("about.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            {loc(settings.tagline, lang)}
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src="/images/hero-dual-4x4.jpg"
                alt="Dahra Motors 4x4 fleet"
                className="rounded-lg object-cover shadow-2xl"
              />
              <div className="absolute -bottom-6 -end-4 rounded-lg border border-brand/40 bg-surface px-6 py-4 shadow-2xl sm:-end-6">
                <div className="font-display text-3xl font-extrabold text-brand">58</div>
                <div className="text-xs uppercase tracking-widest text-muted">
                  {loc(content.stats[0].label, lang)}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[3px] w-10 bg-brand" />
                <span className="font-display text-sm font-bold uppercase tracking-[0.3em] text-brand">
                  {settings.storeName}
                </span>
              </div>
              <h2 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-wide text-ink sm:text-4xl">
                {loc(content.aboutTitle, lang)}
              </h2>
              <p className="mt-5 leading-relaxed text-muted">{loc(content.aboutText, lang)}</p>
              <p className="mt-4 leading-relaxed text-muted">{loc(content.aboutText2, lang)}</p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {content.stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-lg border border-line bg-surface p-4 text-center"
                  >
                    <div className="font-display text-2xl font-extrabold text-brand">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {loc(stat.label, lang)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-bg-alt py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <SectionHeading
              title={{ fr: "Notre Mission", ar: "مهمتنا" }}
              subtitle={{
                fr: "L'excellence 4x4 mondiale, directement aux passionnés algériens",
                ar: "التميز العالمي في الدفع الرباعي، مباشرة إلى عشاق الجزائر",
              }}
            />
          </Reveal>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="text-center text-lg leading-relaxed text-muted">
                {t("about.missionText")}
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title.fr} delay={i * 0.08}>
                <div className="group h-full rounded-lg border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl hover:shadow-brand/10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-black">
                    <pillar.icon size={24} />
                  </div>
                  <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-ink">
                    {loc(pillar.title, lang)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {loc(pillar.text, lang)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <TrustBadges />
          <Reveal className="mt-12 text-center">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded bg-brand px-8 py-4 font-display text-base font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/30"
            >
              {t("cta.viewAll")}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
