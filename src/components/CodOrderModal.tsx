import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Wrench } from "lucide-react";
import type { Order, Product } from "../lib/types";
import { WILAYAS } from "../lib/data";
import { useCms } from "../lib/store";
import { sendOrderNotifications } from "../lib/notify";
import { formatPrice } from "../lib/i18n";

export default function CodOrderModal({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const { t, lang, addOrder, trackOrder } = useCms();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya: "16 - Alger",
    address: "",
    note: "",
    quantity: 1,
    install: false,
    installDate: "",
    installSlot: "09:00 - 11:00",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (!product) return null;
  const name = lang === "ar" && product.nameAr ? product.nameAr : product.name;

  const set = (key: keyof typeof form, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError(t("cod.required"));
      return;
    }
    if (form.install && !form.installDate) {
      setError(t("cod.required"));
      return;
    }
    setError("");
    const reference = `DM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const order: Order = {
      id: crypto.randomUUID(),
      reference,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      unitPrice: product.price,
      quantity: form.quantity,
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      wilaya: form.wilaya,
      address: form.address.trim(),
      note: form.note.trim(),
      channel: "COD",
      status: "pending",
      createdAt: Date.now(),
      installation:
        form.install && form.installDate
          ? { date: form.installDate, slot: form.installSlot }
          : null,
    };
    addOrder(order);
    trackOrder();
    // Server-side Email + SMS alerts fire (and are awaited) BEFORE the
    // success confirmation UI / redirect is shown to the customer.
    setSending(true);
    await sendOrderNotifications(order);
    setSending(false);
    setForm({
      name: "",
      phone: "",
      wilaya: "16 - Alger",
      address: "",
      note: "",
      quantity: 1,
      install: false,
      installDate: "",
      installSlot: "09:00 - 11:00",
    });
    onClose();
    // Post-checkout confirmation redirect
    navigate("/thank-you", { state: { order } });
  };

  const handleClose = () => {
    setForm({
      name: "",
      phone: "",
      wilaya: "16 - Alger",
      address: "",
      note: "",
      quantity: 1,
      install: false,
      installDate: "",
      installSlot: "09:00 - 11:00",
    });
    setError("");
    onClose();
  };

  const inputClass =
    "w-full rounded border border-line bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-surface sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-surface px-5 py-4">
              <div>
                <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-ink">
                  {t("cod.title")}
                </h3>
                <p className="mt-0.5 text-xs text-muted">{t("cod.subtitle")}</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded border border-line p-1.5 text-muted transition-colors hover:border-brand hover:text-brand"
                aria-label={t("cod.close")}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submit} className="px-5 py-5">
              {/* Product summary */}
              <div className="mb-5 flex items-center gap-3 rounded-lg border border-line bg-bg-alt p-3">
                <img src={product.image} alt={name} className="h-16 w-16 rounded object-cover" />
                <div className="min-w-0">
                  <p className="font-display truncate text-sm font-bold uppercase tracking-wide text-ink">
                    {name}
                  </p>
                  <p className="text-[11px] text-muted">{t("product.sku")} {product.sku}</p>
                  <p className="font-display text-lg font-extrabold text-brand">
                    {formatPrice(product.price, lang)}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("cod.name")}
                  </label>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Mohamed Benali"
                    autoComplete="name"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("cod.phone")}
                  </label>
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="0555 12 34 56"
                    dir="ltr"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("cod.wilaya")}
                  </label>
                  <select
                    className={inputClass}
                    value={form.wilaya}
                    onChange={(e) => set("wilaya", e.target.value)}
                  >
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("qty")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, product.stock)}
                    className={inputClass}
                    value={form.quantity}
                    onChange={(e) => set("quantity", Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("cod.address")}
                  </label>
                  <input
                    className={inputClass}
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Cité, rue, commune…"
                    autoComplete="street-address"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("cod.note")}
                  </label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={2}
                    value={form.note}
                    onChange={(e) => set("note", e.target.value)}
                  />
                </div>
              </div>

              {/* Workshop installation booking */}
              <div className="mt-4 rounded-lg border border-brand/40 bg-brand-soft p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.install}
                    onChange={(e) => set("install", e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
                  />
                  <span className="flex items-start gap-2 text-sm font-semibold text-ink">
                    <Wrench size={16} className="mt-0.5 shrink-0 text-brand" />
                    {t("cod.installCheck")}
                  </span>
                </label>
                {form.install && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                        {t("cod.installDate")}
                      </label>
                      <input
                        type="date"
                        className={inputClass}
                        value={form.installDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => set("installDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
                        {t("cod.installSlot")}
                      </label>
                      <select
                        className={inputClass}
                        value={form.installSlot}
                        onChange={(e) => set("installSlot", e.target.value)}
                      >
                        <option value="09:00 - 11:00">09:00 — 11:00</option>
                        <option value="11:00 - 13:00">11:00 — 13:00</option>
                        <option value="14:00 - 16:00">14:00 — 16:00</option>
                        <option value="16:00 - 18:00">16:00 — 18:00</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-brand/40 bg-brand-soft px-4 py-3">
                <span className="text-sm font-semibold text-ink">{t("cod.total")}</span>
                <span className="font-display text-xl font-extrabold text-brand">
                  {formatPrice(product.price * form.quantity, lang)}
                </span>
              </div>

              {error && (
                <p className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                  {error}
                </p>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded border border-line py-3 font-display text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  {t("cod.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded bg-brand py-3 font-display text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30 disabled:cursor-wait disabled:opacity-60"
                >
                  {sending ? "⏳ Notification en cours…" : t("cod.submit")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
