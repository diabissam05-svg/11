import { Link } from "react-router-dom";
import { memo } from "react";
import { ShoppingCart, MessageCircle, PackageCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../lib/types";
import { useCms, buildWhatsAppLink, productWhatsAppMessage } from "../lib/store";
import { formatPrice } from "../lib/i18n";

function ProductCard({
  product,
  onOrder,
}: {
  product: Product;
  onOrder: (product: Product) => void;
}) {
  const { lang, state, t } = useCms();
  const name = lang === "ar" && product.nameAr ? product.nameAr : product.name;
  const price = formatPrice(product.price, lang);
  const outOfStock = product.stock <= 0;
  const showLowStock = product.stock <= 5 && product.showLowStockBadge !== false;
  const showDiscount =
    product.showDiscountBadge !== false &&
    !!product.oldPrice &&
    product.oldPrice > product.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl hover:shadow-brand/10"
    >
      {/* Badges */}
      <div className="absolute start-3 top-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="rounded bg-brand px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-black">
            {product.badge}
          </span>
        )}
        {showDiscount && (
          <span className="rounded bg-[#22c55e] px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-black shadow-sm hover:bg-[#16a34a]">
            -{Math.round((1 - product.price / (product.oldPrice ?? 1)) * 100)}%
          </span>
        )}
      </div>
      {outOfStock && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
          <span className="font-display rounded bg-black/80 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white">
            {t("product.outOfStock")}
          </span>
        </div>
      )}

      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-bg-alt">
          <img
            src={product.image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">
            {t("product.sku")} {product.sku}
          </span>
          <span
            className={`flex items-center gap-1 text-[11px] font-bold ${
              outOfStock ? "text-red-500" : showLowStock ? "text-amber-500" : "text-brand"
            }`}
          >
            <PackageCheck size={13} />
            {outOfStock
              ? t("product.outOfStock")
              : showLowStock
                ? t("product.lowStock")
                : t("product.inStock")}
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg font-bold uppercase leading-snug tracking-wide text-ink transition-colors group-hover:text-brand">
            {name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{product.shortDescription}</p>

        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-brand">{price}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.oldPrice, lang)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOrder(product)}
              disabled={outOfStock}
              className="flex items-center justify-center gap-1.5 rounded bg-brand px-3 py-2.5 font-display text-[13px] font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart size={15} /> {t("cta.shop")}
            </button>
            <a
              href={buildWhatsAppLink(
                state.settings.whatsapp,
                productWhatsAppMessage(name, product.sku, price)
              )}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 rounded border border-brand px-3 py-2.5 font-display text-[13px] font-bold uppercase tracking-wider text-brand transition-all hover:bg-brand hover:text-black"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);
