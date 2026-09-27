import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CarFront } from "lucide-react";
import { VEHICLE_DATABASE } from "../lib/data";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";

export default function VehicleSelector({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { t, state, lang } = useCms();
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const models = useMemo(
    () => VEHICLE_DATABASE.find((b) => b.brand === brand)?.models ?? [],
    [brand]
  );
  const years = useMemo(
    () => models.find((m) => m.name === model)?.years ?? [],
    [models, model]
  );

  const selectClass =
    "w-full rounded border border-line bg-surface px-3.5 py-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors";

  const onSearch = () => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    navigate(`/shop?${params.toString()}`);
  };

  const reset = () => {
    setBrand("");
    setModel("");
    setYear("");
  };

  return (
    <div className={compact ? "" : "w-full"}>
      {!compact && (
        <div className="mb-6 flex items-center gap-3">
          <CarFront size={26} className="text-brand" />
          <div>
            <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white">
              {loc(state.content.selectorTitle, lang)}
            </h3>
            <p className="text-sm text-slate-300">
              {loc(state.content.selectorSubtitle, lang)}
            </p>
          </div>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setModel("");
            setYear("");
          }}
          className={selectClass}
          aria-label={t("selector.brand")}
        >
          <option value="">{t("selector.brand")} — {t("selector.allBrands")}</option>
          {VEHICLE_DATABASE.map((b) => (
            <option key={b.brand} value={b.brand}>
              {b.brand}
            </option>
          ))}
        </select>
        <select
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            setYear("");
          }}
          className={selectClass}
          disabled={!brand}
          aria-label={t("selector.model")}
        >
          <option value="">{t("selector.model")} — {t("selector.allModels")}</option>
          {models.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={selectClass}
          disabled={!model}
          aria-label={t("selector.year")}
        >
          <option value="">{t("selector.year")} — {t("selector.allYears")}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-brand px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/40"
          >
            <Search size={16} /> {t("selector.search")}
          </button>
          {(brand || model || year) && (
            <button
              onClick={reset}
              className="rounded border border-line px-4 py-3 text-sm text-ink transition-colors hover:border-brand hover:text-brand"
            >
              {t("selector.reset")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
