import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator as CalcIcon,
  CarFront,
  Weight,
  Gauge,
  ShoppingCart,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useCms, buildWhatsAppLink, productWhatsAppMessage } from "../lib/store";
import { formatPrice } from "../lib/i18n";
import { VEHICLE_DATABASE } from "../lib/data";
import type { Localized, Product } from "../lib/types";
import Reveal from "../components/Reveal";
import { useCodModal } from "../components/useCodModal";

interface Accessory {
  id: string;
  name: Localized;
  weightKg: number;
}

const ACCESSORIES: Accessory[] = [
  { id: "bullbar", name: { fr: "Pare-buffles acier (Heavy Bullbar)", ar: "مصعد أمامي فولاذي (ثقيل)" }, weightKg: 80 },
  { id: "winch", name: { fr: "Treuil 12 000 lb", ar: "ونش 12000 رطل" }, weightKg: 45 },
  { id: "tent", name: { fr: "Tente de toit rigide", ar: "خيمة سقف صلبة" }, weightKg: 65 },
  { id: "rack", name: { fr: "Galerie alu + équipement", ar: "حاملة سقف ألمنيوم + معدات" }, weightKg: 50 },
  { id: "canopy", name: { fr: "Canopy / tiroirs arrière", ar: "كانوبي / أدراج خلفية" }, weightKg: 90 },
  { id: "snorkel", name: { fr: "Snorkel", ar: "أنبوب غطس" }, weightKg: 8 },
  { id: "awning", name: { fr: "Auvent batwing 2,5 m", ar: "مظلة جانبية 2.5 م" }, weightKg: 15 },
  { id: "fridge", name: { fr: "Réfrigérateur portable 45L", ar: "ثلاجة محمولة 45 لتر" }, weightKg: 20 },
  { id: "battery", name: { fr: "Double batterie + électrique", ar: "بطارية مزدوجة + كهرباء" }, weightKg: 30 },
  { id: "rearbar", name: { fr: "Pare-chocs arrière acier", ar: "مصعد خلفي فولاذي" }, weightKg: 45 },
];

const HEAVY_THRESHOLD_KG = 110;

function isHeavyDuty(p: Product): boolean {
  return /heavy|hd|constant|lourd/i.test(`${p.name} ${p.sku}`);
}

export default function Calculator() {
  const { state, lang, t } = useCms();
  const { openCod, codModal } = useCodModal();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const models = useMemo(
    () => VEHICLE_DATABASE.find((b) => b.brand === brand)?.models ?? [],
    [brand]
  );

  const totalWeight = useMemo(
    () =>
      ACCESSORIES.filter((a) => selected.includes(a.id)).reduce(
        (sum, a) => sum + a.weightKg,
        0
      ),
    [selected]
  );

  const idealHeavy = totalWeight > HEAVY_THRESHOLD_KG;

  // Inventory-aware recommendation: only suggest kits that are actually
  // available, silently falling back to the closest alternative.
  const recommendation = useMemo<Product | null>(() => {
    if (!model) return null;
    const inStock = state.products.filter(
      (p) =>
        p.active &&
        p.categorySlug === "suspension" &&
        p.stock > 0 &&
        p.fitment.some((f) => f.toLowerCase().includes(model.toLowerCase()))
    );
    if (inStock.length === 0) return null;
    const ideal = inStock.find((p) => isHeavyDuty(p) === idealHeavy);
    return ideal ?? inStock.find((p) => isHeavyDuty(p)) ?? inStock[0];
  }, [state.products, model, idealHeavy]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const gaugePct = Math.min(100, (totalWeight / 350) * 100);
  const recName = recommendation
    ? lang === "ar" && recommendation.nameAr
      ? recommendation.nameAr
      : recommendation.name
    : "";

  return (
    <div className="bg-bg">
      {/* Hero */}
      <div className="relative overflow-hidden bg-onyx py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/images/cat-suspension.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/15">
            <CalcIcon size={28} className="text-brand" />
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide text-white sm:text-5xl">
            {t("calc.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">{t("calc.subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_400px]">
        {/* Config column */}
        <div className="grid gap-6">
          {/* Step 1 — vehicle */}
          <Reveal>
            <div className="rounded-lg border border-line bg-surface p-6">
              <h2 className="font-display mb-4 flex items-center gap-2.5 text-xl font-extrabold uppercase tracking-wide text-ink">
                <CarFront size={22} className="text-brand" /> {t("calc.step1")}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="rounded border border-line bg-bg px-3.5 py-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel("");
                  }}
                >
                  <option value="">{t("selector.brand")}</option>
                  {VEHICLE_DATABASE.map((b) => (
                    <option key={b.brand} value={b.brand}>{b.brand}</option>
                  ))}
                </select>
                <select
                  className="rounded border border-line bg-bg px-3.5 py-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                >
                  <option value="">{t("selector.model")}</option>
                  {models.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Reveal>

          {/* Step 2 — accessories */}
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-line bg-surface p-6">
              <h2 className="font-display mb-4 flex items-center gap-2.5 text-xl font-extrabold uppercase tracking-wide text-ink">
                <Weight size={22} className="text-brand" /> {t("calc.step2")}
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {ACCESSORIES.map((acc) => {
                  const checked = selected.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      onClick={() => toggle(acc.id)}
                      className={`flex items-center justify-between gap-3 rounded border px-4 py-3 text-start transition-all ${
                        checked
                          ? "border-brand bg-brand-soft shadow-md shadow-brand/10"
                          : "border-line bg-bg hover:border-brand/50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            checked ? "border-brand bg-brand text-black" : "border-line"
                          }`}
                        >
                          {checked && <CheckCircle2 size={13} />}
                        </span>
                        <span className={`text-sm font-semibold ${checked ? "text-ink" : "text-muted"}`}>
                          {acc.name[lang]}
                        </span>
                      </span>
                      <span className="font-display text-sm font-extrabold text-brand">
                        +{acc.weightKg} kg
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Result column */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-lg border border-line bg-surface">
              <div className="border-b border-line bg-bg-alt p-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                    <Gauge size={15} className="text-brand" /> {t("calc.totalWeight")}
                  </span>
                  <span className="font-display text-3xl font-extrabold text-brand">
                    {totalWeight} kg
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className={`h-full rounded-full ${idealHeavy ? "bg-red-500" : "bg-brand"}`}
                    animate={{ width: `${gaugePct}%` }}
                    transition={{ type: "spring", damping: 20 }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
                  <span>0 kg</span>
                  <span className={idealHeavy ? "text-red-500" : "text-brand"}>
                    {idealHeavy ? t("calc.classHeavy") : t("calc.classMedium")}
                  </span>
                  <span>350 kg</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wide text-ink">
                  {t("calc.result")}
                </h3>
                {!model ? (
                  <p className="rounded border border-dashed border-line bg-bg-alt p-5 text-center text-sm text-muted">
                    {t("calc.selectFirst")}
                  </p>
                ) : !recommendation ? (
                  <div className="rounded border border-dashed border-line bg-bg-alt p-5 text-center">
                    <p className="text-sm text-muted">{t("calc.noKit")}</p>
                    <Link
                      to="/contact"
                      className="mt-3 inline-flex items-center gap-1.5 rounded bg-brand px-5 py-2 font-display text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-brand-strong"
                    >
                      {t("nav.contact")} <ArrowRight size={14} className="rtl:rotate-180" />
                    </Link>
                  </div>
                ) : (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-brand/50 bg-brand-soft p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-brand px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-black">
                        {isHeavyDuty(recommendation) ? t("calc.classHeavy") : t("calc.classMedium")}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                        {brand} {model}
                      </span>
                    </div>
                    <img
                      src={recommendation.image}
                      alt={recName}
                      className="mb-3 aspect-video w-full rounded object-cover"
                    />
                    <Link to={`/product/${recommendation.id}`}>
                      <h4 className="font-display text-base font-extrabold uppercase leading-snug tracking-wide text-ink transition-colors hover:text-brand">
                        {recName}
                      </h4>
                    </Link>
                    <p className="mt-1 text-xs text-muted">{t("calc.why")}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-2xl font-extrabold text-brand">
                        {formatPrice(recommendation.price, lang)}
                      </span>
                      {recommendation.oldPrice && recommendation.oldPrice > recommendation.price && (
                        <span className="text-sm text-muted line-through">
                          {formatPrice(recommendation.oldPrice, lang)}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openCod(recommendation)}
                        className="flex items-center justify-center gap-1.5 rounded bg-brand px-3 py-2.5 font-display text-[13px] font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30"
                      >
                        <ShoppingCart size={14} /> {t("cta.shop")}
                      </button>
                      <a
                        href={buildWhatsAppLink(
                          state.settings.whatsapp,
                          `${productWhatsAppMessage(recName, recommendation.sku, formatPrice(recommendation.price, lang))}\n\n⚙️ ${t("calc.title")} — ${brand} ${model}, +${totalWeight} kg d'accessoires.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded border border-brand px-3 py-2.5 font-display text-[13px] font-bold uppercase tracking-wider text-brand transition-all hover:bg-brand hover:text-black"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    </div>
                    <Link
                      to={`/product/${recommendation.id}`}
                      className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-brand"
                    >
                      {t("calc.viewKit")} <ArrowRight size={13} className="rtl:rotate-180" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {codModal}
    </div>
  );
}
