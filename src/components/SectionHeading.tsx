import { loc } from "../lib/i18n";
import { useCms } from "../lib/store";
import type { Localized } from "../lib/types";

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  title: Localized;
  subtitle?: Localized;
  align?: "center" | "start";
  light?: boolean;
}) {
  const { lang } = useCms();
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : "text-start"}`}>
      <div
        className={`mb-3 flex items-center gap-3 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-[3px] w-10 bg-brand" />
        <span
          className={`font-display text-sm font-700 tracking-[0.3em] uppercase ${
            light ? "text-brand-strong" : "text-brand"
          }`}
          style={{ fontWeight: 700 }}
        >
          Ironman 4x4 — Algérie
        </span>
        <span className="h-[3px] w-10 bg-brand" />
      </div>
      <h2
        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wide ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {loc(title, lang)}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 max-w-2xl text-base ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-slate-300" : "text-muted"}`}
        >
          {loc(subtitle, lang)}
        </p>
      )}
    </div>
  );
}
