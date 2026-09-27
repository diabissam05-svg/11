import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, CarFront } from "lucide-react";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";
import ProductCard from "../components/ProductCard";
import VehicleSelector from "../components/VehicleSelector";
import { useCodModal } from "../components/useCodModal";
import Reveal from "../components/Reveal";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export default function Shop() {
  const { state, lang, t, trackSearch } = useCms();
  const [params, setParams] = useSearchParams();
  const { openCod, codModal } = useCodModal();

  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const model = params.get("model") ?? "";
  const year = params.get("year") ?? "";

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search-query analytics (skip consecutive duplicates)
  const lastTrackedQuery = useRef("");
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q || q === lastTrackedQuery.current) return;
    const id = setTimeout(() => {
      lastTrackedQuery.current = q;
      trackSearch(q);
    }, 800);
    return () => clearTimeout(id);
  }, [search, trackSearch]);

  const categories = state.categories.filter((c) => c.active);

  const vehicleFiltered = useMemo(() => {
    if (!brand && !model) return state.products;
    return state.products.filter((p) =>
      p.fitment.some((f) => {
        const fl = f.toLowerCase();
        if (fl.includes("univers")) return false;
        if (model) return fl.includes(model.toLowerCase());
        return fl.includes(brand.toLowerCase());
      })
    );
  }, [state.products, brand, model]);

  const filtered = useMemo(() => {
    let list = vehicleFiltered.filter((p) => p.active);
    if (category) list = list.filter((p) => p.categorySlug === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameAr.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
    }
    return list;
  }, [vehicleFiltered, category, search, sort]);

  const clearVehicle = () => {
    const next = new URLSearchParams(params);
    next.delete("brand");
    next.delete("model");
    next.delete("year");
    setParams(next, { replace: true });
  };

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setParams(next, { replace: true });
  };

  const catLinks = (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setCategory("")}
        className={`rounded px-3 py-2 text-start text-sm font-semibold transition-colors ${
          !category ? "bg-brand text-black" : "text-ink hover:bg-brand-soft hover:text-brand"
        }`}
      >
        {t("shop.allCategories")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.slug)}
          className={`rounded px-3 py-2 text-start text-sm font-semibold transition-colors ${
            category === cat.slug
              ? "bg-brand text-black"
              : "text-ink hover:bg-brand-soft hover:text-brand"
          }`}
        >
          {loc(cat.name, lang)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-bg">
      {/* Page hero */}
      <div className="relative overflow-hidden bg-onyx py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/images/hero-dual-4x4.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide text-white sm:text-6xl">
            {t("shop.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">{t("shop.subtitle")}</p>
        </div>
      </div>

      {/* Vehicle selector band */}
      <div className="border-b border-line bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4">
          <VehicleSelector compact />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Active vehicle filter chip */}
        {(brand || model) && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-brand/50 bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand">
              <CarFront size={15} />
              {t("shop.vehicleFilter")} : {[brand, model, year].filter(Boolean).join(" · ")}
              <button onClick={clearVehicle} className="ms-1 hover:text-ink" aria-label="Clear">
                <X size={14} />
              </button>
            </span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <h3 className="font-display mb-3 text-base font-extrabold uppercase tracking-widest text-ink">
                {t("footer.categories")}
              </h3>
              {catLinks}
            </div>
          </aside>

          <div>
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters((s) => !s)}
                className="flex items-center gap-2 rounded border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand lg:hidden"
              >
                <SlidersHorizontal size={16} /> {t("footer.categories")}
              </button>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("shop.search")}
                className="min-w-0 flex-1 rounded border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none"
                aria-label={t("shop.sort")}
              >
                <option value="featured">{t("shop.sortFeatured")}</option>
                <option value="price-asc">{t("shop.sortPriceAsc")}</option>
                <option value="price-desc">{t("shop.sortPriceDesc")}</option>
                <option value="name">{t("shop.sortName")}</option>
              </select>
              <span className="text-sm text-muted">
                {filtered.length} {t("shop.results")}
              </span>
            </div>

            {showFilters && (
              <div className="mb-6 rounded-lg border border-line bg-surface p-4 lg:hidden">
                {catLinks}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-line bg-surface py-24 text-center">
                <p className="text-muted">{t("shop.noResults")}</p>
                <button
                  onClick={() => {
                    setSearch("");
                    clearVehicle();
                    setCategory("");
                  }}
                  className="mt-4 rounded bg-brand px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-brand-strong"
                >
                  {t("selector.reset")}
                </button>
              </div>
            ) : (
              <Reveal>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onOrder={openCod} />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {codModal}
    </div>
  );
}
