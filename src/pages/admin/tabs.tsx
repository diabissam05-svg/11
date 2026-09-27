import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Layers,
  ImageIcon,
  Trash2,
  Pencil,
  Plus,
  Eye,
  EyeOff,
  Star,
  RotateCcw,
  Banknote,
  FolderTree,
} from "lucide-react";
import { useCms } from "../../lib/store";
import { formatPrice } from "../../lib/i18n";
import type {
  Category,
  GalleryItem,
  HeroSlide,
  OrderStatus,
  Product,
  SiteContent,
  TrustBadge,
} from "../../lib/types";
import { DEFAULT_STATE } from "../../lib/data";
import {
  Btn,
  Field,
  ImagePicker,
  LocalizedFields,
  Modal,
  Toggle,
  compressImage,
  inputCls,
} from "./ui";

const uid = () => Math.random().toString(36).slice(2, 10);

function SavedToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 end-6 z-[120] rounded border border-emerald-600 bg-emerald-950 px-4 py-2.5 text-sm font-bold text-emerald-400 shadow-xl">
      Modifications enregistrées ✓
    </div>
  );
}

function useSavedToast() {
  const [show, setShow] = useState(false);
  const flash = () => {
    setShow(true);
    setTimeout(() => setShow(false), 1800);
  };
  return { flash, toast: <SavedToast show={show} /> };
}

/* ============================== OVERVIEW ============================== */

export function OverviewTab() {
  const { state, lang } = useCms();
  const revenue = state.orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.unitPrice * o.quantity, 0);

  const stats = [
    { icon: Package, label: "admin.statsProducts", value: state.products.length },
    { icon: ShoppingBag, label: "admin.statsOrders", value: state.orders.length },
    { icon: FolderTree, label: "admin.statsCategories", value: state.categories.length },
    { icon: Banknote, label: "admin.statsRevenue", value: formatPrice(revenue, lang) },
  ] as const;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {s.label.replace("admin.stats", "")}
              </span>
              <s.icon size={18} className="text-emerald-500" />
            </div>
            <div className="font-display mt-2 text-3xl font-extrabold text-white">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-white">
          Commandes Récentes
        </h3>
        {state.orders.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune commande pour le moment.</p>
        ) : (
          <div className="space-y-2">
            {state.orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm"
              >
                <span className="font-bold text-emerald-400">{o.reference}</span>
                <span className="text-slate-300">{o.productName}</span>
                <span className="text-slate-400">{o.customerName}</span>
                <span className="text-white">
                  {formatPrice(o.unitPrice * o.quantity, lang)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================== ORDERS =============================== */

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-700",
  confirmed: "bg-sky-500/15 text-sky-400 border-sky-700",
  shipped: "bg-violet-500/15 text-violet-400 border-violet-700",
  delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-700",
  cancelled: "bg-red-500/15 text-red-400 border-red-800",
};

export function OrdersTab() {
  const { state, lang, t, updateOrderStatus, deleteOrder } = useCms();

  return (
    <div className="grid gap-3">
      {state.orders.length === 0 && (
        <p className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-500">
          {t("admin.noOrders")}
        </p>
      )}
      {state.orders.map((o) => (
        <div
          key={o.id}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-extrabold tracking-wider text-emerald-400">
                {o.reference}
              </span>
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase ${STATUS_COLORS[o.status]}`}
              >
                {t(`admin.status.${o.status}` as never)}
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">
                {o.channel}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {new Date(o.createdAt).toLocaleString(lang === "ar" ? "ar-DZ" : "fr-FR")}
            </span>
          </div>
          <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-slate-300 sm:grid-cols-2">
            <p><span className="text-slate-500">Produit :</span> {o.productName} <span className="text-slate-500">({o.sku})</span></p>
            <p><span className="text-slate-500">Quantité :</span> {o.quantity} — <span className="font-bold text-white">{formatPrice(o.unitPrice * o.quantity, lang)}</span></p>
            <p><span className="text-slate-500">Client :</span> {o.customerName} — <span dir="ltr">{o.phone}</span></p>
            <p><span className="text-slate-500">Livraison :</span> {o.address}, {o.wilaya}</p>
            {o.note && <p className="sm:col-span-2"><span className="text-slate-500">Note :</span> {o.note}</p>}
            {o.installation && (
              <p className="sm:col-span-2">
                <span className="text-slate-500">🔧 Installation atelier (Baraki) :</span>{" "}
                <span className="font-bold text-emerald-400">{o.installation.date} — {o.installation.slot}</span>
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <select
              value={o.status}
              onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
              className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="pending">{t("admin.status.pending")}</option>
              <option value="confirmed">{t("admin.status.confirmed")}</option>
              <option value="shipped">{t("admin.status.shipped")}</option>
              <option value="delivered">{t("admin.status.delivered")}</option>
              <option value="cancelled">{t("admin.status.cancelled")}</option>
            </select>
            <Btn variant="danger" onClick={() => { if (confirm("Supprimer cette commande ?")) deleteOrder(o.id); }}>
              <span className="flex items-center gap-1.5"><Trash2 size={14} /> {t("admin.delete")}</span>
            </Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================== PRODUCTS ============================== */

function emptyProduct(categories: Category[]): Product {
  return {
    id: `p-${uid()}`,
    sku: `IM4-${uid().toUpperCase().slice(0, 6)}`,
    name: "",
    nameAr: "",
    categorySlug: categories[0]?.slug ?? "suspension",
    price: 0,
    oldPrice: null,
    stock: 0,
    badge: "",
    image: "/images/cat-suspension.jpg",
    shortDescription: "",
    problem: "",
    solution: "",
    features: [],
    specs: [],
    fitment: [],
    warranty: "Garantie officielle Ironman 4x4 — 2 ans.",
    active: true,
    featured: false,
    showLowStockBadge: true,
    showDiscountBadge: true,
  };
}

export function ProductsTab() {
  const { state, saveProduct, deleteProduct } = useCms();
  const [editing, setEditing] = useState<Product | null>(null);
  const { flash, toast } = useSavedToast();

  const save = () => {
    if (!editing) return;
    saveProduct(editing);
    setEditing(null);
    flash();
  };

  return (
    <div>
      {toast}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">{state.products.length} produit(s)</p>
        <Btn onClick={() => setEditing(emptyProduct(state.categories))}>
          <span className="flex items-center gap-1.5"><Plus size={15} /> Ajouter un produit</span>
        </Btn>
      </div>

      <div className="grid gap-3">
        {state.products.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-3"
          >
            <img src={p.image} alt={p.name} className="h-16 w-20 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-white">{p.name || "(sans nom)"}</span>
                {p.featured && <Star size={13} className="fill-emerald-500 text-emerald-500" />}
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${p.active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700 text-slate-300"}`}>
                  {p.active ? "Visible" : "Masqué"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {p.sku} · {p.categorySlug} · Stock : {p.stock} · {formatPrice(p.price, "fr")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => saveProduct({ ...p, active: !p.active })}
                className="rounded border border-slate-700 p-2 text-slate-300 transition-colors hover:border-emerald-500 hover:text-emerald-400"
                title={p.active ? "Masquer" : "Afficher"}
              >
                {p.active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <Link
                to={`/product/${p.id}`}
                target="_blank"
                className="rounded border border-slate-700 p-2 text-slate-300 transition-colors hover:border-emerald-500 hover:text-emerald-400"
                title="Voir la fiche"
              >
                <ShoppingBag size={15} />
              </Link>
              <button
                onClick={() => setEditing({ ...p })}
                className="rounded border border-slate-700 p-2 text-slate-300 transition-colors hover:border-emerald-500 hover:text-emerald-400"
                title="Modifier"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => { if (confirm(`Supprimer « ${p.name} » ?`)) deleteProduct(p.id); }}
                className="rounded border border-red-900 p-2 text-red-400 transition-colors hover:bg-red-950"
                title="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProductForm
          product={editing}
          onChange={setEditing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  onChange,
  onSave,
  onCancel,
}: {
  product: Product;
  onChange: (p: Product) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { state } = useCms();
  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    onChange({ ...product, [key]: value });

  const featuresText = product.features.join("\n");
  const fitmentText = product.fitment.join("\n");

  return (
    <Modal title="Produit — édition complète" onClose={onCancel} wide>
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nom (FR)">
            <input className={inputCls} value={product.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Nom (AR)">
            <input dir="rtl" className={inputCls} value={product.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
          </Field>
          <Field label="SKU / Référence">
            <input className={inputCls} value={product.sku} onChange={(e) => set("sku", e.target.value)} />
          </Field>
          <Field label="Catégorie">
            <select className={inputCls} value={product.categorySlug} onChange={(e) => set("categorySlug", e.target.value)}>
              {state.categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name.fr}</option>
              ))}
            </select>
          </Field>
          <Field label="Prix (DA)">
            <input type="number" min={0} className={inputCls} value={product.price} onChange={(e) => set("price", Number(e.target.value))} />
          </Field>
          <Field label="Ancien prix (DA, optionnel)">
            <input
              type="number"
              min={0}
              className={inputCls}
              value={product.oldPrice ?? ""}
              onChange={(e) => set("oldPrice", e.target.value ? Number(e.target.value) : null)}
            />
          </Field>
          <Field label="Stock">
            <input type="number" min={0} className={inputCls} value={product.stock} onChange={(e) => set("stock", Number(e.target.value))} />
          </Field>
          <Field label="Badge (ex: PROMO, BEST-SELLER)">
            <input className={inputCls} value={product.badge} onChange={(e) => set("badge", e.target.value)} />
          </Field>
        </div>

        <ImagePicker label="Image principale" value={product.image} onChange={(v) => set("image", v)} />

        <Field label="Description courte">
          <textarea rows={2} className={`${inputCls} resize-none`} value={product.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
        </Field>
        <Field label="Le Problème">
          <textarea rows={2} className={`${inputCls} resize-none`} value={product.problem} onChange={(e) => set("problem", e.target.value)} />
        </Field>
        <Field label="La Solution">
          <textarea rows={3} className={`${inputCls} resize-none`} value={product.solution} onChange={(e) => set("solution", e.target.value)} />
        </Field>
        <Field label="Caractéristiques (une par ligne)">
          <textarea
            rows={4}
            className={`${inputCls} resize-none`}
            value={featuresText}
            onChange={(e) => set("features", e.target.value.split("\n").filter((l) => l.trim()))}
          />
        </Field>
        <Field label="Compatibilité véhicules (une par ligne, ex: Toyota Hilux 2015-2026)">
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={fitmentText}
            onChange={(e) => set("fitment", e.target.value.split("\n").filter((l) => l.trim()))}
          />
        </Field>

        <Field label="Spécifications techniques">
          <div className="grid gap-2">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="Label"
                  value={spec.label}
                  onChange={(e) => {
                    const specs = [...product.specs];
                    specs[i] = { ...specs[i], label: e.target.value };
                    set("specs", specs);
                  }}
                />
                <input
                  className={inputCls}
                  placeholder="Valeur"
                  value={spec.value}
                  onChange={(e) => {
                    const specs = [...product.specs];
                    specs[i] = { ...specs[i], value: e.target.value };
                    set("specs", specs);
                  }}
                />
                <button
                  onClick={() => set("specs", product.specs.filter((_, j) => j !== i))}
                  className="rounded border border-red-900 px-2.5 text-red-400 hover:bg-red-950"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <Btn variant="ghost" onClick={() => set("specs", [...product.specs, { label: "", value: "" }])}>
              + Ajouter une spec
            </Btn>
          </div>
        </Field>

        <Field label="Garantie">
          <textarea rows={2} className={`${inputCls} resize-none`} value={product.warranty} onChange={(e) => set("warranty", e.target.value)} />
        </Field>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Toggle checked={product.active} onChange={(v) => set("active", v)} label="Visible sur le site" />
          <Toggle checked={product.featured} onChange={(v) => set("featured", v)} label="Produit phare (accueil)" />
          <Toggle
            checked={product.showLowStockBadge !== false}
            onChange={(v) => set("showLowStockBadge", v)}
            label="Afficher le badge « Stock Limité »"
          />
          <Toggle
            checked={product.showDiscountBadge !== false}
            onChange={(v) => set("showDiscountBadge", v)}
            label="Afficher le badge de réduction (-X%)"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
          <Btn variant="ghost" onClick={onCancel}>Annuler</Btn>
          <Btn onClick={onSave}>Enregistrer</Btn>
        </div>
      </div>
    </Modal>
  );
}

/* ============================= CATEGORIES ============================= */

export function CategoriesTab() {
  const { state, saveCategory, deleteCategory } = useCms();
  const [editing, setEditing] = useState<Category | null>(null);
  const { flash, toast } = useSavedToast();

  return (
    <div>
      {toast}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">{state.categories.length} catégorie(s)</p>
        <Btn
          onClick={() =>
            setEditing({
              id: `cat-${uid()}`,
              slug: uid(),
              name: { fr: "", ar: "" },
              image: "/images/cat-suspension.jpg",
              description: { fr: "", ar: "" },
              active: true,
            })
          }
        >
          <span className="flex items-center gap-1.5"><Plus size={15} /> Ajouter</span>
        </Btn>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {state.categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <img src={c.image} alt={c.name.fr} className="h-14 w-18 rounded object-cover" style={{ width: 72 }} />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">{c.name.fr}</p>
              <p className="text-xs text-slate-500">/{c.slug} · {c.active ? "Visible" : "Masquée"}</p>
            </div>
            <button onClick={() => setEditing({ ...c })} className="rounded border border-slate-700 p-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-400">
              <Pencil size={14} />
            </button>
            <button
              onClick={() => { if (confirm(`Supprimer « ${c.name.fr} » ?`)) deleteCategory(c.id); }}
              className="rounded border border-red-900 p-2 text-red-400 hover:bg-red-950"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title="Catégorie" onClose={() => setEditing(null)}>
          <div className="grid gap-4">
            <LocalizedFields label="Nom" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Slug (URL)">
              <input className={inputCls} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase() })} />
            </Field>
            <LocalizedFields label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea rows={2} />
            <ImagePicker label="Image" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
            <Toggle checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} label="Visible" />
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
              <Btn
                onClick={() => {
                  saveCategory(editing);
                  setEditing(null);
                  flash();
                }}
              >
                Enregistrer
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================================ HERO ================================ */

export function HeroTab() {
  const { state, saveHeroSlide, deleteHeroSlide } = useCms();
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const { flash, toast } = useSavedToast();

  return (
    <div>
      {toast}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">{state.hero.length} slide(s)</p>
        <Btn
          onClick={() =>
            setEditing({
              id: `slide-${uid()}`,
              mediaType: "image",
              image: "/images/hero-desert.jpg",
              videoUrl: "",
              videoPoster: "",
              autoplay: true,
              muted: true,
              badge: { fr: "", ar: "" },
              title: { fr: "", ar: "" },
              subtitle: { fr: "", ar: "" },
              ctaLabel: { fr: "Découvrir", ar: "اكتشف" },
              ctaLink: "/shop",
              active: true,
            })
          }
        >
          <span className="flex items-center gap-1.5"><Plus size={15} /> Ajouter un slide</span>
        </Btn>
      </div>

      <div className="grid gap-3">
        {state.hero.map((s, i) => (
          <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <img src={(s.mediaType === "video" ? s.videoPoster : "") || s.image} alt={s.title.fr} className="h-16 w-28 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">
                #{i + 1} — {s.title.fr || "(sans titre)"}
                {s.mediaType === "video" && (
                  <span className="ms-2 rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">🎬 Vidéo</span>
                )}
              </p>
              <p className="truncate text-xs text-slate-500">{s.subtitle.fr}</p>
              <p className="mt-1 text-[10px] font-bold uppercase text-slate-600">CTA → {s.ctaLink}</p>
            </div>
            <button
              onClick={() => saveHeroSlide({ ...s, active: !s.active })}
              className="rounded border border-slate-700 p-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
              title={s.active ? "Désactiver" : "Activer"}
            >
              {s.active ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
            <button onClick={() => setEditing({ ...s })} className="rounded border border-slate-700 p-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-400">
              <Pencil size={15} />
            </button>
            <button
              onClick={() => { if (confirm("Supprimer ce slide ?")) deleteHeroSlide(s.id); }}
              className="rounded border border-red-900 p-2 text-red-400 hover:bg-red-950"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title="Slide Hero" onClose={() => setEditing(null)} wide>
          <div className="grid gap-4">
            {/* Media type selector */}
            <Field label="Type de média">
              <div className="grid grid-cols-2 gap-2">
                {(["image", "video"] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setEditing({ ...editing, mediaType: kind })}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${
                      (editing.mediaType ?? "image") === kind
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {kind === "image" ? "🖼 Image" : "🎬 Vidéo"}
                  </button>
                ))}
              </div>
            </Field>

            {editing.mediaType === "video" ? (
              <>
                <Field label="URL Vidéo (lien MP4, YouTube ou Vimeo)">
                  <input
                    dir="ltr"
                    className={inputCls}
                    value={editing.videoUrl}
                    onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })}
                    placeholder="https://….mp4 — https://youtube.com/watch?v=… — https://vimeo.com/…"
                  />
                </Field>
                <div className="flex flex-wrap items-center gap-6">
                  <Toggle
                    checked={editing.autoplay !== false}
                    onChange={(v) => setEditing({ ...editing, autoplay: v })}
                    label="Lecture automatique (autoplay)"
                  />
                  <Toggle
                    checked={editing.muted !== false}
                    onChange={(v) => setEditing({ ...editing, muted: v })}
                    label="Muet (mute)"
                  />
                </div>
                <ImagePicker
                  label="Poster / Miniature vidéo (avant lecture)"
                  value={editing.videoPoster}
                  onChange={(v) => setEditing({ ...editing, videoPoster: v })}
                />
              </>
            ) : (
              <ImagePicker label="Image de fond" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
            )}
            <LocalizedFields label="Badge" value={editing.badge} onChange={(v) => setEditing({ ...editing, badge: v })} />
            <LocalizedFields label="Titre" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <LocalizedFields label="Sous-titre" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} textarea />
            <div className="grid gap-3 sm:grid-cols-2">
              <LocalizedFields label="Texte du bouton" value={editing.ctaLabel} onChange={(v) => setEditing({ ...editing, ctaLabel: v })} />
              <Field label="Lien du bouton">
                <input className={inputCls} value={editing.ctaLink} onChange={(e) => setEditing({ ...editing, ctaLink: e.target.value })} placeholder="/shop" />
              </Field>
            </div>
            <Toggle checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} label="Slide actif" />
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
              <Btn
                onClick={() => {
                  saveHeroSlide(editing);
                  setEditing(null);
                  flash();
                }}
              >
                Enregistrer
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== BRANDING ============================== */

export function BrandingTab() {
  const { state, updateSettings } = useCms();
  const [draft, setDraft] = useState(state.settings);
  const { flash, toast } = useSavedToast();

  return (
    <div className="max-w-2xl">
      {toast}
      <div className="grid gap-5 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <ImagePicker
          label="Logo header (emblème)"
          value={draft.headerLogo}
          onChange={(v) => setDraft({ ...draft, headerLogo: v })}
          aspect="aspect-square"
        />
        <ImagePicker
          label="Logo footer"
          value={draft.footerLogo}
          onChange={(v) => setDraft({ ...draft, footerLogo: v })}
          aspect="aspect-square"
        />
        <Field label="Nom de la boutique">
          <input className={inputCls} value={draft.storeName} onChange={(e) => setDraft({ ...draft, storeName: e.target.value })} />
        </Field>
        <LocalizedFields label="Slogan / Tagline" value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} />
        <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
          <Btn variant="ghost" onClick={() => setDraft(state.settings)}>
            <span className="flex items-center gap-1.5"><RotateCcw size={14} /> Réinitialiser</span>
          </Btn>
          <Btn
            onClick={() => {
              updateSettings(draft);
              flash();
            }}
          >
            Enregistrer
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================== CONTENT =============================== */

export function ContentTab() {
  const { state, updateContent, resetContent } = useCms();
  const [draft, setDraft] = useState<SiteContent>(state.content);
  const { flash, toast } = useSavedToast();

  const setBadge = (i: number, patch: Partial<TrustBadge>) => {
    const badges = [...draft.trustBadges];
    badges[i] = { ...badges[i], ...patch };
    setDraft({ ...draft, trustBadges: badges });
  };

  const sections = useMemo(
    () =>
      [
        { key: "aboutTitle", label: "Titre section À propos" },
        { key: "aboutText", label: "Bio Dahra Motors (paragraphe 1)", area: true },
        { key: "aboutText2", label: "Bio Dahra Motors (paragraphe 2)", area: true },
        { key: "selectorTitle", label: "Titre sélecteur véhicule" },
        { key: "selectorSubtitle", label: "Sous-titre sélecteur véhicule", area: true },
        { key: "categoriesTitle", label: "Titre section catégories" },
        { key: "categoriesSubtitle", label: "Sous-titre catégories" },
        { key: "featuredTitle", label: "Titre produits phares" },
        { key: "featuredSubtitle", label: "Sous-titre produits phares" },
        { key: "bannerTitle", label: "Titre bannière Ironman" },
        { key: "bannerText", label: "Texte bannière Ironman", area: true },
        { key: "bannerCta", label: "Bouton bannière" },
      ] as const,
    []
  );

  return (
    <div>
      {toast}
      <div className="grid gap-5">
        {sections.map((sec) => {
          const key = sec.key as keyof SiteContent;
          const value = draft[key];
          if (typeof value !== "object" || value === null || !("fr" in (value as object))) return null;
          return (
            <div key={sec.key} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-500">
                {sec.label}
              </h4>
              <LocalizedFields
                label={sec.label}
                value={value as { fr: string; ar: string }}
                onChange={(v) => setDraft({ ...draft, [key]: v })}
                textarea={"area" in sec}
                rows={3}
              />
            </div>
          );
        })}

        {/* Stats */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-500">
            Statistiques (bandeau À propos)
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {draft.stats.map((stat, i) => (
              <div key={i} className="rounded border border-slate-800 bg-slate-950 p-3">
                <Field label={`Valeur #${i + 1}`}>
                  <input
                    className={inputCls}
                    value={stat.value}
                    onChange={(e) => {
                      const stats = [...draft.stats];
                      stats[i] = { ...stats[i], value: e.target.value };
                      setDraft({ ...draft, stats });
                    }}
                  />
                </Field>
                <div className="mt-2">
                  <LocalizedFields
                    label="Label"
                    value={stat.label}
                    onChange={(v) => {
                      const stats = [...draft.stats];
                      stats[i] = { ...stats[i], label: v };
                      setDraft({ ...draft, stats });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-500">
            Badges de confiance
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {draft.trustBadges.map((badge, i) => (
              <div key={i} className="rounded border border-slate-800 bg-slate-950 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Badge #{i + 1}
                  </span>
                  <Toggle
                    checked={badge.enabled !== false}
                    onChange={(v) => setBadge(i, { enabled: v })}
                    label={badge.enabled !== false ? "Affiché" : "Désactivé"}
                  />
                </div>
                <Field label="Icône">
                  <select
                    className={inputCls}
                    value={badge.icon}
                    onChange={(e) => setBadge(i, { icon: e.target.value as TrustBadge["icon"] })}
                  >
                    <option value="install">🔧 Installation</option>
                    <option value="shipping">🚚 Livraison</option>
                    <option value="genuine">✅ Authenticité</option>
                    <option value="phone">📞 Téléphone</option>
                    <option value="chat">💬 WhatsApp / Chat</option>
                    <option value="star">⭐ Étoile / Avis</option>
                    <option value="zap">⚡ Performance</option>
                    <option value="clock">⏰ Horaires</option>
                    <option value="medal">🏅 Médaille / Expertise</option>
                  </select>
                </Field>
                <div className="mt-2">
                  <LocalizedFields label="Titre" value={badge.title} onChange={(v) => setBadge(i, { title: v })} />
                </div>
                <div className="mt-2">
                  <LocalizedFields label="Texte" value={badge.text} onChange={(v) => setBadge(i, { text: v })} textarea rows={2} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About image */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <ImagePicker
            label="Image section À propos (accueil)"
            value={draft.aboutImage}
            onChange={(v) => setDraft({ ...draft, aboutImage: v })}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Btn
            variant="danger"
            onClick={() => {
              if (confirm("Réinitialiser tout le contenu aux valeurs d'usine ?")) {
                resetContent();
                setDraft(DEFAULT_STATE.content);
                flash();
              }
            }}
          >
            <span className="flex items-center gap-1.5"><RotateCcw size={14} /> Valeurs d'usine</span>
          </Btn>
          <Btn variant="ghost" onClick={() => setDraft(state.content)}>Annuler</Btn>
          <Btn
            onClick={() => {
              updateContent(draft);
              flash();
            }}
          >
            Enregistrer
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ========================= CONTACT & SOCIAL =========================== */

export function ContactTab() {
  const { state, updateSettings } = useCms();
  const [draft, setDraft] = useState(state.settings);
  const { flash, toast } = useSavedToast();

  return (
    <div className="max-w-2xl">
      {toast}
      <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <Field label="Numéros de téléphone (plusieurs possibles)">
          <div className="grid gap-2">
            {(draft.phones?.length ? draft.phones : [draft.phone]).map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  dir="ltr"
                  className={inputCls}
                  value={p}
                  onChange={(e) => {
                    const phones = [...(draft.phones?.length ? draft.phones : [draft.phone])];
                    phones[i] = e.target.value;
                    setDraft({ ...draft, phones, phone: phones[0] });
                  }}
                  placeholder="+213 556 40 08 30"
                />
                {(draft.phones?.length ?? 1) > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const phones = (draft.phones?.length ? draft.phones : [draft.phone]).filter((_, j) => j !== i);
                      setDraft({ ...draft, phones, phone: phones[0] ?? "" });
                    }}
                    className="rounded border border-red-900 px-3 text-red-400 transition-colors hover:bg-red-950"
                    title="Supprimer ce numéro"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <Btn
              variant="ghost"
              onClick={() =>
                setDraft({
                  ...draft,
                  phones: [...(draft.phones?.length ? draft.phones : [draft.phone]), ""],
                })
              }
            >
              + Ajouter un numéro
            </Btn>
          </div>
        </Field>
        <Field label="WhatsApp (format international)">
          <input dir="ltr" className={inputCls} value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} placeholder="+213555123456" />
        </Field>
        <Field label="Email">
          <input dir="ltr" className={inputCls} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        </Field>
        <LocalizedFields label="Adresse boutique" value={draft.address} onChange={(v) => setDraft({ ...draft, address: v })} />
        <Field label="Lien Google Maps (adresse boutique)">
          <input
            dir="ltr"
            className={inputCls}
            value={draft.mapLink}
            onChange={(e) => setDraft({ ...draft, mapLink: e.target.value })}
            placeholder="https://maps.app.goo.gl/…"
          />
        </Field>
        <LocalizedFields label="Horaires" value={draft.hours} onChange={(v) => setDraft({ ...draft, hours: v })} />

        <div className="border-t border-slate-800 pt-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-500">
            Réseaux sociaux
          </h4>
          <div className="grid gap-3">
            {(["facebook", "instagram", "tiktok", "youtube"] as const).map((key) => (
              <Field key={key} label={key}>
                <input
                  dir="ltr"
                  className={inputCls}
                  value={draft.social[key]}
                  onChange={(e) =>
                    setDraft({ ...draft, social: { ...draft.social, [key]: e.target.value } })
                  }
                  placeholder={`https://${key}.com/dahramotors4x4`}
                />
              </Field>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
          <Btn variant="ghost" onClick={() => setDraft(state.settings)}>Annuler</Btn>
          <Btn
            onClick={() => {
              const phones = (draft.phones ?? []).map((p) => p.trim()).filter(Boolean);
              updateSettings({
                ...draft,
                phones: phones.length ? phones : [draft.phone],
                phone: phones[0] ?? draft.phone,
              });
              flash();
            }}
          >
            Enregistrer
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================== SECURITY ============================== */

export function SecurityTab() {
  const { state, updateCredentials } = useCms();
  const [current, setCurrent] = useState("");
  const [username, setUsername] = useState(state.credentials.username);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { flash, toast } = useSavedToast();

  const save = () => {
    if (current !== state.credentials.password) {
      setError("Mot de passe actuel incorrect.");
      return;
    }
    if (!username.trim() || password.length < 4) {
      setError("Nom d'utilisateur requis et mot de passe de 4 caractères minimum.");
      return;
    }
    setError("");
    updateCredentials({ username: username.trim(), password });
    setCurrent("");
    setPassword("");
    flash();
  };

  return (
    <div className="max-w-md">
      {toast}
      <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">
          Mettez à jour vos identifiants administrateur. Le mot de passe actuel est requis.
        </p>
        <Field label="Mot de passe actuel">
          <input type="password" className={inputCls} value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Nouveau nom d'utilisateur">
          <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} />
        </Field>
        <Field label="Nouveau mot de passe">
          <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        {error && (
          <p className="rounded border border-red-800 bg-red-950/50 px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <Btn onClick={save}>Enregistrer</Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================== ANALYTICS ============================= */

export function AnalyticsTab() {
  const { analytics } = useCms();

  const today = new Date().toISOString().slice(0, 10);
  const conversion =
    analytics.visits > 0 ? (analytics.orders / analytics.visits) * 100 : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const maxDaily = Math.max(1, ...last7.map((d) => analytics.daily[d] ?? 0));
  const topQueries = Object.entries(analytics.queries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const cards = [
    {
      label: "Total Site Visitors",
      ar: "عدد زوار الموقع",
      value: analytics.visits.toLocaleString("fr-FR"),
    },
    {
      label: "Daily Traffic (aujourd'hui)",
      ar: "حركة الزوار اليوم",
      value: (analytics.daily[today] ?? 0).toLocaleString("fr-FR"),
    },
    {
      label: "Search Queries",
      ar: "عدد عمليات البحث",
      value: analytics.searches.toLocaleString("fr-FR"),
    },
    {
      label: "Orders",
      ar: "عدد الطلبات",
      value: analytics.orders.toLocaleString("fr-FR"),
    },
    {
      label: "Order Conversion Rate",
      ar: "معدل التحويل",
      value: `${conversion.toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid gap-5">
      {/* Real-time counters */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {c.label}
            </span>
            <div className="font-display mt-1.5 text-3xl font-extrabold text-white">
              {c.value}
            </div>
            <div className="mt-1 text-xs text-emerald-500" dir="rtl">{c.ar}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Daily traffic chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-white">
            Trafic — 7 derniers jours
          </h3>
          <div className="flex h-40 items-end gap-2">
            {last7.map((d) => {
              const v = analytics.daily[d] ?? 0;
              const h = Math.max(4, (v / maxDaily) * 100);
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-400">{v}</span>
                  <div
                    className="w-full rounded-t bg-emerald-600/80 transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-slate-500">{d.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search queries */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="font-display mb-4 text-lg font-extrabold uppercase tracking-wider text-white">
            Mots-clés recherchés <span className="text-slate-500" dir="rtl">(الكلمات المبحوث عنها)</span>
          </h3>
          {topQueries.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune recherche enregistrée pour le moment.</p>
          ) : (
            <ul className="grid gap-2">
              {topQueries.map(([q, count]) => (
                <li
                  key={q}
                  className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 px-4 py-2 text-sm"
                >
                  <span className="font-semibold text-white">“{q}”</span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    {count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600">
        Compteurs mis à jour en temps réel (rafraîchissement automatique toutes les 5 s et
        synchronisation inter-onglets).
      </p>
    </div>
  );
}

/* ============================ BUILD GALLERY =========================== */

export function GalleryTab() {
  const { state, saveGalleryItem, deleteGalleryItem } = useCms();
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const { flash, toast } = useSavedToast();

  return (
    <div>
      {toast}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">{state.gallery.length} build(s)</p>
        <Btn
          onClick={() =>
            setEditing({
              id: `gal-${uid()}`,
              title: { fr: "", ar: "" },
              customerName: "",
              vehicle: "",
              wilaya: "16 - Alger",
              testimonial: { fr: "", ar: "" },
              rating: 5,
              beforeImage: "/images/about-workshop.jpg",
              afterImage: "/images/hero-dual-4x4.jpg",
              videoSrc: "",
              active: true,
            })
          }
        >
          <span className="flex items-center gap-1.5"><Plus size={15} /> Ajouter un build</span>
        </Btn>
      </div>

      <div className="grid gap-3">
        {state.gallery.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <div className="flex gap-1">
              <img src={g.beforeImage} alt="avant" className="h-14 w-20 rounded object-cover opacity-70" />
              <img src={g.afterImage} alt="après" className="h-14 w-20 rounded object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">{g.title.fr || "(sans titre)"}</p>
              <p className="text-xs text-slate-500">
                {g.customerName} · {g.vehicle} · {"★".repeat(g.rating)} · {g.active ? "Visible" : "Masqué"}
                {g.videoSrc ? " · 🎬 vidéo" : ""}
              </p>
            </div>
            <button onClick={() => setEditing({ ...g })} className="rounded border border-slate-700 p-2 text-slate-300 hover:border-emerald-500 hover:text-emerald-400">
              <Pencil size={15} />
            </button>
            <button
              onClick={() => { if (confirm(`Supprimer le build « ${g.title.fr} » ?`)) deleteGalleryItem(g.id); }}
              className="rounded border border-red-900 p-2 text-red-400 hover:bg-red-950"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title="Build — Galerie / Témoignage" onClose={() => setEditing(null)} wide>
          <div className="grid gap-4">
            <LocalizedFields label="Titre du build" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Nom du client">
                <input className={inputCls} value={editing.customerName} onChange={(e) => setEditing({ ...editing, customerName: e.target.value })} />
              </Field>
              <Field label="Véhicule">
                <input className={inputCls} value={editing.vehicle} onChange={(e) => setEditing({ ...editing, vehicle: e.target.value })} placeholder="Toyota Hilux 2019" />
              </Field>
              <Field label="Wilaya">
                <input className={inputCls} value={editing.wilaya} onChange={(e) => setEditing({ ...editing, wilaya: e.target.value })} />
              </Field>
            </div>
            <LocalizedFields
              label="Témoignage"
              value={editing.testimonial}
              onChange={(v) => setEditing({ ...editing, testimonial: v })}
              textarea
              rows={3}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Note (étoiles)">
                <select className={inputCls} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{"★".repeat(r)} ({r})</option>
                  ))}
                </select>
              </Field>
              <Field label="Vidéo review (URL directe .mp4)">
                <input dir="ltr" className={inputCls} value={editing.videoSrc} onChange={(e) => setEditing({ ...editing, videoSrc: e.target.value })} placeholder="https://exemple.com/review.mp4" />
              </Field>
            </div>
            <ImagePicker label="Image AVANT" value={editing.beforeImage} onChange={(v) => setEditing({ ...editing, beforeImage: v })} />
            <ImagePicker label="Image APRÈS" value={editing.afterImage} onChange={(v) => setEditing({ ...editing, afterImage: v })} />
            <Toggle checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} label="Visible sur le site" />
            <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
              <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
              <Btn
                onClick={() => {
                  saveGalleryItem(editing);
                  setEditing(null);
                  flash();
                }}
              >
                Enregistrer
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* =========================== SECTION VIDÉO =========================== */

export function VideoSectionTab() {
  const { state, updateVideoSection } = useCms();
  const [draft, setDraft] = useState(state.videoSection);
  const { flash, toast } = useSavedToast();

  return (
    <div className="max-w-2xl">
      {toast}
      <div className="grid gap-5 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">
              Visibilité de la section
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Afficher ou masquer la bannière vidéo sur la page d'accueil.
            </p>
          </div>
          <Toggle
            checked={draft.enabled}
            onChange={(v) => setDraft({ ...draft, enabled: v })}
            label={draft.enabled ? "Visible" : "Masquée"}
          />
        </div>

        <Field label="Source vidéo — lien MP4, YouTube ou Vimeo">
          <input
            dir="ltr"
            className={inputCls}
            value={draft.videoUrl}
            onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })}
            placeholder="https://….mp4 — https://youtube.com/watch?v=… — https://vimeo.com/…"
          />
        </Field>
        <p className="-mt-3 text-[11px] text-slate-500">
          Formats supportés : URL directe .mp4/.webm, lien YouTube (watch/embed/shorts) ou lien/ID Vimeo.
        </p>

        <ImagePicker
          label="Miniature / Poster (image de couverture avant lecture)"
          value={draft.poster}
          onChange={(v) => setDraft({ ...draft, poster: v })}
        />

        <LocalizedFields label="Texte du badge supérieur" value={draft.badge} onChange={(v) => setDraft({ ...draft, badge: v })} />
        <LocalizedFields label="Titre de la section" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        <LocalizedFields
          label="Sous-titre / description courte"
          value={draft.subtitle}
          onChange={(v) => setDraft({ ...draft, subtitle: v })}
          textarea
          rows={3}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <LocalizedFields label="Texte du bouton (CTA)" value={draft.ctaLabel} onChange={(v) => setDraft({ ...draft, ctaLabel: v })} />
          <Field label="Lien du bouton CTA">
            <input
              dir="ltr"
              className={inputCls}
              value={draft.ctaLink}
              onChange={(e) => setDraft({ ...draft, ctaLink: e.target.value })}
              placeholder="/shop?category=suspension"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
          <Btn variant="ghost" onClick={() => setDraft(state.videoSection)}>Annuler</Btn>
          <Btn
            onClick={() => {
              updateVideoSection(draft);
              flash();
            }}
          >
            Enregistrer
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ============================ ACTIVITY LOG ============================ */

export function ActivityTab() {
  const { activity } = useCms();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-5 py-4">
        <h3 className="font-display text-lg font-extrabold uppercase tracking-wider text-white">
          Historique d'activité
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Journal d'audit : chaque opération CRUD est horodatée et attribuée à son auteur.
        </p>
      </div>
      {activity.length === 0 ? (
        <p className="p-8 text-center text-sm text-slate-500">
          Aucune activité enregistrée pour le moment.
        </p>
      ) : (
        <div className="max-h-[65vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 text-start">Horodatage</th>
                <th className="px-5 py-3 text-start">Utilisateur</th>
                <th className="px-5 py-3 text-start">Action</th>
                <th className="px-5 py-3 text-start">Élément concerné</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-800/70 hover:bg-slate-950/50">
                  <td className="whitespace-nowrap px-5 py-2.5 text-xs text-slate-500" dir="ltr">
                    {new Date(entry.ts).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold uppercase text-emerald-400">
                      {entry.user}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 font-semibold text-white">{entry.action}</td>
                  <td className="px-5 py-2.5 text-slate-400">{entry.item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* Re-export for dashboard shell */
export { ImageIcon, Layers };
