import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Wrench,
  Package,
  Truck,
} from "lucide-react";
import type { Order } from "../lib/types";
import { useCms, buildWhatsAppLink, productWhatsAppMessage } from "../lib/store";
import { formatPrice } from "../lib/i18n";
import { orderSmsLink } from "../lib/notify";

export default function ThankYou() {
  const { t, lang, state } = useCms();
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  return (
    <div className="bg-bg">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand/15">
            <CheckCircle2 size={44} className="text-brand" />
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide text-ink sm:text-5xl">
            {t("ty.title")}
          </h1>
          <p className="mt-3 text-lg text-muted">{t("ty.confirm")}</p>
          {order && (
            <p className="font-display mt-2 text-xl font-extrabold tracking-widest text-brand">
              {t("ty.reference")} : {order.reference}
            </p>
          )}
        </motion.div>

        {/* Call verification notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex items-start gap-4 rounded-lg border border-brand/40 bg-brand-soft p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-black">
            <PhoneCall size={22} />
          </div>
          <p className="text-sm leading-relaxed text-ink sm:text-base">
            {order
              ? `${t("ty.callNote")} ${order.phone}`
              : t("ty.callNote")}
          </p>
        </motion.div>

        {/* Order summary */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 overflow-hidden rounded-lg border border-line bg-surface"
          >
            <div className="border-b border-line bg-bg-alt px-5 py-3">
              <h2 className="font-display text-base font-extrabold uppercase tracking-widest text-ink">
                {t("ty.summary")}
              </h2>
            </div>
            <div className="grid gap-x-6 gap-y-3 p-5 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <Package size={16} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <span className="font-bold text-ink">{order.productName}</span>
                  <span className="ms-2 text-xs text-muted">({order.sku})</span>
                  <span className="ms-2 text-muted">× {order.quantity}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck size={16} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">
                    {t("ty.delivery")}
                  </div>
                  <div className="text-ink">{order.address}</div>
                  <div className="text-ink">{order.wilaya}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <PhoneCall size={16} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">
                    {t("ty.customer")}
                  </div>
                  <div className="text-ink">{order.customerName}</div>
                  <div className="text-ink" dir="ltr">{order.phone}</div>
                </div>
              </div>
              {order.installation && (
                <div className="flex items-start gap-2.5 sm:col-span-2">
                  <Wrench size={16} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted">
                      {t("cod.installBooked")} — Baraki
                    </div>
                    <div className="font-semibold text-ink">
                      {order.installation.date} · {order.installation.slot}
                    </div>
                  </div>
                </div>
              )}
              {order.note && (
                <p className="text-muted sm:col-span-2">
                  <span className="font-bold text-ink">{t("cod.note")} :</span> {order.note}
                </p>
              )}
              <div className="flex items-center justify-between rounded border border-brand/40 bg-brand-soft px-4 py-3 sm:col-span-2">
                <span className="text-sm font-bold uppercase tracking-wider text-ink">
                  {t("cod.total")}
                </span>
                <span className="font-display text-2xl font-extrabold text-brand">
                  {formatPrice(order.unitPrice * order.quantity, lang)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {!order && (
          <p className="mt-8 text-center text-sm text-muted">{t("ty.noOrder")}</p>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row"
        >
          {order && (
            <a
              href={buildWhatsAppLink(
                state.settings.whatsapp,
                `${productWhatsAppMessage(order.productName, order.sku, formatPrice(order.unitPrice, lang))}\n\n📝 ${t("ty.reference")} : ${order.reference}\n👤 ${order.customerName} — 📞 ${order.phone}\n📍 ${order.address}, ${order.wilaya}`
              )}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/30"
            >
              <MessageCircle size={17} /> {t("ty.whatsappHelp")}
            </a>
          )}
          <Link
            to="/shop"
            className="group flex items-center justify-center gap-2 rounded border-2 border-brand px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-brand transition-all hover:bg-brand hover:text-black"
          >
            {t("ty.backShop")}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </motion.div>

        {/* SMS alert shortcut (owner notification channel) */}
        {order && (
          <p className="mt-6 text-center text-xs text-muted">
            <a
              href={orderSmsLink(order)}
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              📱 {t("ty.smsAlert")}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
