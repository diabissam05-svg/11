import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useCms } from "../../lib/store";

export default function AdminLogin() {
  const { login, state, t } = useCms();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/admin");
    } else {
      setError(t("admin.invalid"));
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-onyx px-4 py-16">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url(/images/hero-dual-4x4.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      <div className="relative z-10 w-full max-w-md">
        {/* Back to website */}
        <Link
          to="/"
          className="group mb-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-slate-200 backdrop-blur-sm transition-all hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-lg hover:shadow-emerald-900/30"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
          />
          {t("admin.backToSite")}
        </Link>
        <div className="rounded-xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <img
              src={state.settings.headerLogo}
              alt="Dahra Motors"
              className="logo-on-dark mx-auto mb-4 h-20 w-20 object-contain"
            />
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600/15">
              <Lock size={20} className="text-emerald-500" />
            </div>
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-wider text-white">
              {t("admin.login")}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-emerald-500">
              CMS — Dahra Motors 4x4
            </p>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("admin.username")}
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="dahramotors"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("admin.password")}
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 pe-10 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400"
                  aria-label="Show password"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded border border-red-800 bg-red-950/50 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded bg-emerald-600 py-3 font-display text-sm font-extrabold uppercase tracking-widest text-black transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-900/50"
            >
              <ShieldCheck size={17} /> {t("admin.signIn")}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-500">
            Accès réservé à l'équipe Dahra Motors. Toute tentative non autorisée est
            journalisée.
          </p>
        </div>
      </div>
    </div>
  );
}
