import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ShoppingCart,
  MessageCircle,
  PackageCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";
import { useCms, buildWhatsAppLink, productWhatsAppMessage } from "../lib/store";
import { formatPrice } from "../lib/i18n";
import ProductCard from "../components/ProductCard";
import TrustBadges from "../components/TrustBadges";
import { useCodModal } from "../components/useCodModal";

type Tab = "specs" | "fitment";

export default function ProductDetail() {
  const { id } = useParams();
  const { state, lang, t } = useCms();
  const { openCod, codModal } = useCodModal();
  const [tab, setTab] = useState<Tab>("specs");
  const [qty, setQty] = useState(1);

  const product = state.products.find((p) => p.id === id && p.active);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
        <h1 className="font-display text-3xl font-extrabold uppercase text-ink">
          {t("common.notFound")}
        </h1>
        <Link
          to="/shop"
          className="rounded bg-brand px-6 py-3 font-display font-bold uppercase tracking-wider text-black transition-colors hover:bg-brand-strong"
        >
          {t("common.backHome")}
        </Link>
      </div>
    );
  }

  const name = lang === "ar" && product.nameAr ? product.nameAr : product.name;
  const price = formatPrice(product.price, lang);
  const category = state.categories.find((c) => c.slug === product.categorySlug);
  const related = state.products
    .filter(
      (p) =>
        p.active &&
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug ||
          p.fitment.some((f) => product.fitment.includes(f)))
    )
    .slice(0, 4);

  const outOfStock = product.stock <= 0;
  const showLowStock = product.stock <= 5 && product.showLowStockBadge !== false;

  // Only render tabs that actually contain data (no empty boxes / orphan icons).
  const availableTabs: Tab[] = [
    ...(product.specs.length > 0 ? (["specs"] as Tab[]) : []),
    ...(product.fitment.length > 0 ? (["fitment"] as Tab[]) : []),
  ];
  const activeTab: Tab | undefined = availableTabs.includes(tab)
    ? tab
    : availableTabs[0];

  const tabClass = (active: boolean) =>
    `font-display border-b-2 px-5 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
      active
        ? "border-brand text-brand"
        : "border-transparent text-muted hover:text-ink"
    }`;

  return (
    <div className="bg-bg">
      {/* Breadcrumb */}
      <div className="border-b border-line bg-bg-alt">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-muted">
          <Link to="/" className="hover:text-brand">{t("common.breadcrumb.home")}</Link>
          <ChevronRight size={13} className="rtl:rotate-180" />
          <Link to="/shop" className="hover:text-brand">{t("nav.shop")}</Link>
          <ChevronRight size={13} className="rtl:rotate-180" />
          {category && (
            <>
              <Link to={`/shop?category=${category.slug}`} className="hover:text-brand">
                {category.name[lang]}
              </Link>
              <ChevronRight size={13} className="rtl:rotate-180" />
            </>
          )}
          <span className="truncate text-ink">{name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-lg border border-line bg-bg-alt">
              <img
                src={product.image}
                alt={name}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {product.badge && (
              <span className="absolute start-4 top-4 rounded bg-brand px-3 py-1 font-display text-sm font-bold uppercase tracking-wider text-black shadow-lg">
                {product.badge}
              </span>
            )}
            <div className="absolute end-4 top-4 rounded bg-black/70 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              Ironman 4x4 Official
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-wide text-ink sm:text-4xl">
              {name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="text-muted">
                {t("product.sku")} <span className="font-bold text-ink">{product.sku}</span>
              </span>
              <span
                className={`flex items-center gap-1.5 font-bold ${
                  outOfStock
                    ? "text-red-500"
                    : showLowStock
                      ? "text-amber-500"
                      : "text-brand"
                }`}
              >
                <PackageCheck size={15} />
                {outOfStock
                  ? t("product.outOfStock")
                  : showLowStock
                    ? `${t("product.lowStock")} (${product.stock})`
                    : t("product.inStock")}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold text-brand">
                {formatPrice(product.price * qty, lang)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.oldPrice, lang)}
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="mt-5 leading-relaxed text-muted">{product.shortDescription}</p>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted">
                {t("qty")}
              </span>
              <div className="flex items-center overflow-hidden rounded border border-line">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-ink transition-colors hover:bg-brand hover:text-black"
                  aria-label="-"
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center font-display text-lg font-bold text-ink">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(Math.max(1, product.stock), q + 1))}
                  className="px-3 py-2 text-ink transition-colors hover:bg-brand hover:text-black"
                  aria-label="+"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* Dual CTA */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => openCod(product)}
                disabled={outOfStock}
                className="flex items-center justify-center gap-2 rounded bg-brand px-6 py-4 font-display text-base font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart size={19} /> {t("cta.shop")}
              </button>
              <a
                href={buildWhatsAppLink(
                  state.settings.whatsapp,
                  productWhatsAppMessage(name, product.sku, price)
                )}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded border-2 border-brand px-6 py-4 font-display text-base font-bold uppercase tracking-wider text-brand transition-all hover:bg-brand hover:text-black"
              >
                <MessageCircle size={19} /> {t("cta.whatsapp")}
              </a>
            </div>

            {/* Quick trust row */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-center">
              {[
                { icon: PackageCheck, label: "COD 69 Wilayas" },
                { icon: CheckCircle2, label: "100% Genuine" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded border border-line bg-surface px-2 py-3"
                >
                  <Icon size={18} className="text-brand" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Problem / Solution (hidden when empty) */}
        {(product.problem || product.solution) && (
        <div className={`mt-14 grid gap-5 ${product.problem && product.solution ? "md:grid-cols-2" : ""}`}>
          {product.problem && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <AlertTriangle size={20} className="text-red-500" />
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wider text-red-500">
                {t("problem")}
              </h3>
            </div>
            <p className="leading-relaxed text-muted">{product.problem}</p>
          </div>
          )}
          {product.solution && (
          <div className="rounded-lg border border-brand/40 bg-brand-soft p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <Lightbulb size={20} className="text-brand" />
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wider text-brand">
                {t("solution")}
              </h3>
            </div>
            <p className="leading-relaxed text-ink">{product.solution}</p>
          </div>
          )}
        </div>
        )}

        {/* Features (hidden when empty) */}
        {product.features.length > 0 && (
        <div className="mt-10 rounded-lg border border-line bg-surface p-6">
          <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-ink">
            {t("features")}
          </h3>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        )}

        {/* Tabs: specs / fitment — rendered only when data exists */}
        {availableTabs.length > 0 && (
        <div className="mt-10 rounded-lg border border-line bg-surface">
          <div className="flex overflow-x-auto border-b border-line">
            {availableTabs.includes("specs") && (
              <button className={tabClass(activeTab === "specs")} onClick={() => setTab("specs")}>
                {t("specs")}
              </button>
            )}
            {availableTabs.includes("fitment") && (
              <button className={tabClass(activeTab === "fitment")} onClick={() => setTab("fitment")}>
                {t("fitment")}
              </button>
            )}
          </div>
          <div className="p-6">
            {activeTab === "specs" && (
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-bg-alt" : ""}>
                      <td className="w-1/3 px-4 py-3 font-bold uppercase tracking-wide text-ink">
                        {spec.label}
                      </td>
                      <td className="px-4 py-3 text-muted">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === "fitment" && (
              <div>
                <p className="mb-4 text-sm text-muted">
                  {t("shop.compatible")} — Ironman 4x4 :
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.fitment.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-brand/40 bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Trust badges */}
        <div className="mt-10">
          <TrustBadges />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display mb-6 text-2xl font-extrabold uppercase tracking-wide text-ink">
              {t("related")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onOrder={openCod} />
              ))}
            </div>
          </div>
        )}
      </div>

      {codModal}
    </div>
  );
}
