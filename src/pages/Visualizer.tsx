import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, RotateCcw, MessageCircle, Move } from "lucide-react";
import { useCms, buildWhatsAppLink } from "../lib/store";
import { formatPrice, loc } from "../lib/i18n";
import Reveal from "../components/Reveal";

interface Base {
  id: string;
  name: string;
  image: string;
  isSuv?: boolean;
}

const BASES: Base[] = [
  { id: "hilux", name: "Toyota Hilux", image: "/images/viz-base-hilux.png" },
  { id: "ranger", name: "Ford Ranger", image: "/images/viz-base-ranger.png" },
  { id: "patrol", name: "Nissan Patrol", image: "/images/viz-base-patrol.png", isSuv: true },
];

interface OverlayPos {
  x: number; // % of stage width (left)
  y: number; // % of stage height (top)
  w: number; // % of stage width
}

interface Accessory {
  id: "bullbar" | "tent" | "led";
  image: string;
  productId: string;
  presets: Record<string, OverlayPos>;
}

const ACCESSORIES: Accessory[] = [
  {
    id: "bullbar",
    image: "/images/viz-acc-bullbar.png",
    productId: "p-bullbar-hilux",
    presets: {
      hilux: { x: 7, y: 42, w: 15 },
      ranger: { x: 7, y: 42, w: 15 },
      patrol: { x: 6, y: 44, w: 15 },
    },
  },
  {
    id: "tent",
    image: "/images/viz-acc-tent.png",
    productId: "p-rooftop-tent",
    presets: {
      hilux: { x: 42, y: 15, w: 32 },
      ranger: { x: 42, y: 15, w: 32 },
      patrol: { x: 32, y: 15, w: 36 },
    },
  },
  {
    id: "led",
    image: "/images/viz-acc-ledbar.png",
    productId: "p-led-bar",
    presets: {
      hilux: { x: 9, y: 34, w: 12 },
      ranger: { x: 9, y: 34, w: 12 },
      patrol: { x: 8, y: 36, w: 12 },
    },
  },
];

export default function Visualizer() {
  const { state, lang, t } = useCms();
  const [baseId, setBaseId] = useState("hilux");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [offsets, setOffsets] = useState<Record<string, OverlayPos>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const base = BASEES_SAFE(baseId);

  const posOf = (acc: Accessory): OverlayPos =>
    offsets[`${baseId}-${acc.id}`] ?? acc.presets[baseId] ?? acc.presets.hilux;

  const toggle = (id: string) =>
    setEnabled((e) => ({ ...e, [id]: !e[id] }));

  const reset = () => {
    setEnabled({});
    setOffsets({});
  };

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    const acc = ACCESSORIES.find((a) => a.id === id);
    if (!acc) return;
    const pos = posOf(acc);
    dragging.current = { id, dx: e.clientX, dy: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setOffsets((o) => ({ ...o, [`${baseId}-${id}`]: { ...pos } }));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const { id, dx, dy } = dragging.current;
    setOffsets((o) => {
      const key = `${baseId}-${id}`;
      const current = o[key];
      if (!current) return o;
      const nx = current.x + ((e.clientX - dx) / rect.width) * 100;
      const ny = current.y + ((e.clientY - dy) / rect.height) * 100;
      return {
        ...o,
        [key]: {
          ...current,
          x: Math.max(-15, Math.min(85, nx)),
          y: Math.max(-15, Math.min(85, ny)),
        },
      };
    });
    dragging.current = { id, dx: e.clientX, dy: e.clientY };
  };

  const onPointerUp = () => {
    dragging.current = null;
  };

  const activeAccessories = ACCESSORIES.filter((a) => enabled[a.id]);
  const quoteLines = activeAccessories
    .map((a) => {
      const p = state.products.find((pr) => pr.id === a.productId);
      return p ? `• ${p.name} (${p.sku}) — ${formatPrice(p.price, lang)}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const quoteMessage = `Bonjour Dahra Motors 4x4 👋\n\n🛠️ Build Visualizer — ${base.name}\n${quoteLines || "• Configuration d'origine"}\n\nMerci de me confirmer disponibilité, prix total et installation à l'atelier.`;

  const accLabels: Record<string, string> = {
    bullbar: t("viz.bullbar"),
    tent: t("viz.tent"),
    led: t("viz.led"),
  };

  return (
    <div className="bg-bg">
      {/* Hero */}
      <div className="relative overflow-hidden bg-onyx py-16">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(/images/cat-roofrack.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/15">
            <Palette size={28} className="text-brand" />
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide text-white sm:text-5xl">
            {t("viz.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">{t("viz.subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_340px]">
        {/* Stage */}
        <Reveal>
          <div className="overflow-hidden rounded-lg border border-line">
            <div
              ref={stageRef}
              className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden"
              style={{
                background:
                  "linear-gradient(to bottom, #1a2540 0%, #243352 55%, #3d3524 55.2%, #241f14 100%)",
              }}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {/* Sun glow */}
              <div className="pointer-events-none absolute end-[12%] top-[10%] h-24 w-24 rounded-full bg-brand/20 blur-2xl" />
              {/* Ground line */}
              <div className="pointer-events-none absolute inset-x-0 top-[55%] h-px bg-white/10" />

              {/* Vehicle base */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={base.id}
                  src={base.image}
                  alt={base.name}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Accessory overlays */}
              {ACCESSORIES.map((acc) => {
                if (!enabled[acc.id]) return null;
                const pos = posOf(acc);
                return (
                  <motion.img
                    key={acc.id}
                    src={acc.image}
                    alt={accLabels[acc.id]}
                    drag={false}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onPointerDown={(e) => onPointerDown(e, acc.id)}
                    className="absolute cursor-grab drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] active:cursor-grabbing"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: `${pos.w}%`,
                    }}
                    draggable={false}
                  />
                );
              })}

              {/* Drag hint */}
              <div className="pointer-events-none absolute bottom-3 start-3 flex items-center gap-1.5 rounded bg-black/50 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                <Move size={12} className="text-brand" />
                {loc({ fr: "Glissez les accessoires pour ajuster", ar: "اسحب الإكسسوارات للتعديل" }, lang)}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Controls */}
        <Reveal delay={0.1}>
          <div className="grid gap-5">
            <div className="rounded-lg border border-line bg-surface p-5">
              <h3 className="font-display mb-3 text-base font-extrabold uppercase tracking-widest text-ink">
                {t("viz.chooseBase")}
              </h3>
              <div className="grid gap-2">
                {BASES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBaseId(b.id);
                      setOffsets({});
                    }}
                    className={`flex items-center gap-3 rounded border px-3 py-2.5 text-start transition-all ${
                      baseId === b.id
                        ? "border-brand bg-brand-soft"
                        : "border-line bg-bg hover:border-brand/50"
                    }`}
                  >
                    <img src={b.image} alt={b.name} loading="lazy" decoding="async" className="h-10 w-14 object-contain" />
                    <span className={`font-display text-sm font-bold uppercase tracking-wide ${baseId === b.id ? "text-brand" : "text-ink"}`}>
                      {b.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-line bg-surface p-5">
              <h3 className="font-display mb-3 text-base font-extrabold uppercase tracking-widest text-ink">
                {t("viz.accessories")}
              </h3>
              <div className="grid gap-2">
                {ACCESSORIES.map((acc) => {
                  const product = state.products.find((p) => p.id === acc.productId);
                  const on = !!enabled[acc.id];
                  return (
                    <button
                      key={acc.id}
                      onClick={() => toggle(acc.id)}
                      className={`flex items-center justify-between gap-3 rounded border px-3 py-2.5 text-start transition-all ${
                        on ? "border-brand bg-brand-soft" : "border-line bg-bg hover:border-brand/50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <img src={acc.image} alt="" loading="lazy" decoding="async" className={`h-9 w-9 rounded object-contain ${on ? "" : "opacity-60"}`} />
                        <span>
                          <span className={`block font-display text-sm font-bold uppercase tracking-wide ${on ? "text-brand" : "text-ink"}`}>
                            {accLabels[acc.id]}
                          </span>
                          {product && (
                            <span className="block text-xs text-muted">
                              {formatPrice(product.price, lang)}
                            </span>
                          )}
                        </span>
                      </span>
                      <span
                        className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-brand" : "bg-line"}`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "start-[18px]" : "start-0.5"}`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={reset}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-line py-2.5 font-display text-sm font-bold uppercase tracking-wider text-muted transition-colors hover:border-brand hover:text-brand"
              >
                <RotateCcw size={14} /> {t("viz.reset")}
              </button>
            </div>

            <a
              href={buildWhatsAppLink(state.settings.whatsapp, quoteMessage)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 font-display text-base font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-xl hover:shadow-brand/30"
            >
              <MessageCircle size={18} /> {t("viz.quote")}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function BASEES_SAFE(id: string): Base {
  return BASES.find((b) => b.id === id) ?? BASES[0];
}
