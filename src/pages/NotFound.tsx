import { Link } from "react-router-dom";
import { useCms } from "../lib/store";

export default function NotFound() {
  const { t } = useCms();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 bg-bg px-4 text-center">
      <div className="font-display text-8xl font-extrabold text-brand">404</div>
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-ink">
        {t("common.notFound")}
      </h1>
      <Link
        to="/"
        className="rounded bg-brand px-7 py-3 font-display font-bold uppercase tracking-wider text-black transition-colors hover:bg-brand-strong"
      >
        {t("common.backHome")}
      </Link>
    </div>
  );
}
