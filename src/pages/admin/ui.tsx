import { useRef, useState, type ReactNode } from "react";
import { Upload, Image as ImageIcon, Check } from "lucide-react";
import { fileToDataUrl } from "../../lib/store";
import type { Localized } from "../../lib/types";

/** Downscale + compress an uploaded image to keep localStorage healthy. */
export async function compressImage(file: File, maxDim = 1400): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  if (!dataUrl.startsWith("data:image")) return dataUrl;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // JPEG flattens alpha and puts a solid square behind transparent logos.
      resolve(file.type === "image/png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-colors";

export function LocalizedFields({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
}: {
  label: string;
  value: Localized;
  onChange: (v: Localized) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={`${label} (FR)`}>
        {textarea ? (
          <textarea
            rows={rows}
            className={`${inputCls} resize-none`}
            value={value.fr}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
          />
        ) : (
          <input
            className={inputCls}
            value={value.fr}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
          />
        )}
      </Field>
      <Field label={`${label} (AR)`}>
        {textarea ? (
          <textarea
            rows={rows}
            dir="rtl"
            className={`${inputCls} resize-none`}
            value={value.ar}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
          />
        ) : (
          <input
            dir="rtl"
            className={inputCls}
            value={value.ar}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
          />
        )}
      </Field>
    </div>
  );
}

export function ImagePicker({
  label,
  value,
  onChange,
  aspect = "aspect-video",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  aspect?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setUploadError("");
    try {
      const compressed = await compressImage(file);
      const [metadata, fileBase64] = compressed.split(",", 2);
      const contentType = metadata.match(/^data:(image\/(?:jpeg|png|webp));base64$/)?.[1];
      if (!contentType || !fileBase64) throw new Error("Format d'image non pris en charge.");
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, contentType }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossible de téléverser l'image.");
      onChange(result.url);
    } catch (error) {
      setUploadError((error as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Field label={label}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div
          className={`${aspect} w-full overflow-hidden rounded border border-slate-700 bg-slate-900 sm:w-48 sm:shrink-0`}
        >
          {value ? (
            <img src={value} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-600">
              <ImageIcon size={28} />
            </div>
          )}
        </div>
        <div className="grid w-full gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-600 hover:text-black disabled:opacity-50"
          >
            <Upload size={15} /> {busy ? "…" : "Téléverser une image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            className={inputCls}
            placeholder="…ou coller une URL (/images/… ou https://…)"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
          />
          {uploadError && <span className="text-xs text-red-400" role="alert">{uploadError}</span>}
          {value.startsWith("data:") && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Check size={12} /> Image téléversée
            </span>
          )}
        </div>
      </div>
    </Field>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles = {
    primary:
      "bg-emerald-600 text-black hover:bg-emerald-500 shadow-lg shadow-emerald-900/40",
    ghost:
      "border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400",
    danger: "border border-red-800 text-red-400 hover:bg-red-900/40 hover:text-red-300",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-40 ${styles}`}
    >
      {children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-emerald-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? "start-[22px]" : "start-0.5"
          }`}
        />
      </span>
      <span className="text-sm font-semibold text-slate-300">{label}</span>
    </button>
  );
}

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`my-8 w-full rounded-xl border border-slate-700 bg-slate-900 shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
          <h3 className="font-display text-lg font-extrabold uppercase tracking-wider text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded border border-slate-700 p-1.5 text-slate-400 transition-colors hover:border-emerald-500 hover:text-emerald-400"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
