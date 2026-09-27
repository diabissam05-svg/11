import {
  ShieldCheck,
  Wrench,
  Truck,
  BadgeCheck,
  Phone,
  MessageCircle,
  Star,
  Zap,
  Clock,
  Medal,
} from "lucide-react";
import { useCms } from "../lib/store";
import { loc } from "../lib/i18n";
import type { TrustBadge, TrustBadgeIcon } from "../lib/types";

const ICONS: Record<TrustBadgeIcon, typeof ShieldCheck> = {
  warranty: ShieldCheck,
  install: Wrench,
  shipping: Truck,
  genuine: BadgeCheck,
  phone: Phone,
  chat: MessageCircle,
  star: Star,
  zap: Zap,
  clock: Clock,
  medal: Medal,
};

export default function TrustBadges({ dark = false }: { dark?: boolean }) {
  const { state, lang } = useCms();
  const badges = state.content.trustBadges.filter((b) => b.enabled !== false);
  if (badges.length === 0) return null;

  const cols =
    badges.length === 1
      ? "grid-cols-1"
      : badges.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : badges.length === 3
          ? "grid-cols-1 sm:grid-cols-3"
          : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid gap-4 ${cols}`}>
      {badges.map((badge: TrustBadge, i) => {
        const Icon = ICONS[badge.icon] ?? ShieldCheck;
        return (
          <div
            key={`${badge.icon}-${i}`}
            className={`group flex items-start gap-3 rounded-lg border p-4 transition-all duration-300 hover:-translate-y-0.5 ${
              dark
                ? "border-white/10 bg-white/5 hover:border-brand/60"
                : "border-line bg-surface hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-black">
              <Icon size={22} />
            </div>
            <div>
              <h4 className={`font-display text-sm font-extrabold uppercase tracking-wider ${dark ? "text-white" : "text-ink"}`}>
                {loc(badge.title, lang)}
              </h4>
              <p className={`mt-1 text-xs leading-relaxed ${dark ? "text-slate-400" : "text-muted"}`}>
                {loc(badge.text, lang)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
