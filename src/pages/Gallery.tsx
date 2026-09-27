import { useRef, useState } from "react";
import { Camera, Star, Quote, PlayCircle, User } from "lucide-react";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";
import Reveal from "../components/Reveal";
import type { GalleryItem } from "../lib/types";

function BeforeAfter({ item, beforeLabel, afterLabel }: { item: GalleryItem; beforeLabel: string; afterLabel: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, pct)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-lg"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      {/* After (base layer) */}
      <img src={item.afterImage} alt={item.title.fr + " — après"} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {/* Before (clipped layer) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={item.beforeImage} alt={item.title.fr + " — avant"} loading="lazy" decoding="async" className="h-full w-full object-cover" draggable={false} />
      </div>
      {/* Divider */}
      <div className="absolute inset-y-0 z-10 w-0.5 bg-brand" style={{ left: `${pos}%` }}>
        <div className="absolute start-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand bg-black/80 text-brand shadow-lg">
          ⇔
        </div>
      </div>
      {/* Labels */}
      <span className="absolute start-3 top-3 rounded bg-black/70 px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute end-3 top-3 rounded bg-brand px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-black">
        {afterLabel}
      </span>
    </div>
  );
}

export default function Gallery() {
  const { state, lang, t } = useCms();
  const items = state.gallery.filter((g) => g.active);

  return (
    <div className="bg-bg">
      {/* Hero */}
      <div className="relative overflow-hidden bg-onyx py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/images/cat-camping.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/15">
            <Camera size={28} className="text-brand" />
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide text-white sm:text-5xl">
            {t("gal.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">{t("gal.subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14">
        {items.length === 0 && (
          <p className="py-20 text-center text-muted">{t("shop.noResults")}</p>
        )}
        <div className="grid gap-8">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <div className="grid overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-[1.4fr_1fr]">
                {/* Before / After */}
                <div className="p-4">
                  <BeforeAfter item={item} beforeLabel={t("gal.before")} afterLabel={t("gal.after")} />
                  {item.videoSrc && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                        <PlayCircle size={15} className="text-brand" /> {t("gal.videoReview")}
                      </div>
                      <video
                        src={item.videoSrc}
                        controls
                        loop
                        muted
                        playsInline
                        className="aspect-video w-full rounded-lg border border-line bg-black object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Testimonial */}
                <div className="flex flex-col justify-center border-t border-line p-6 lg:border-s lg:border-t-0 lg:p-8">
                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        size={17}
                        className={s < item.rating ? "fill-brand text-brand" : "text-line"}
                      />
                    ))}
                  </div>
                  <Quote size={26} className="mb-3 text-brand/50" />
                  <h3 className="font-display text-2xl font-extrabold uppercase tracking-wide text-ink">
                    {loc(item.title, lang)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">“{loc(item.testimonial, lang)}”</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-display text-base font-bold uppercase tracking-wide text-ink">
                        {item.customerName}
                      </div>
                      <div className="text-xs text-muted">
                        {item.vehicle} · {item.wilaya}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
