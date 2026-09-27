import type { Order } from "./types";

/** Owner notification targets — alerted instantly on every new order. */
export const NOTIFY_PHONE = "+213556400830";
export const NOTIFY_EMAILS = ["dahramotors4x4@gmail.com", "diabissam05@gmail.com"];

export function orderAlertText(order: Order): string {
  const total = order.unitPrice * order.quantity;
  const lines = [
    `🛒 NOUVELLE COMMANDE — Dahra Motors 4x4`,
    `Référence : ${order.reference}`,
    `Client : ${order.customerName}`,
    `Téléphone : ${order.phone}`,
    `Produit : ${order.productName} (${order.sku})`,
    `Quantité : ${order.quantity}`,
    `Total : ${total.toLocaleString("fr-DZ")} DA`,
    `Wilaya : ${order.wilaya}`,
    `Adresse : ${order.address}`,
  ];
  if (order.note) lines.push(`Note : ${order.note}`);
  if (order.installation) {
    lines.push(
      `🔧 Installation atelier (Baraki) : ${order.installation.date} — ${order.installation.slot}`
    );
  }
  lines.push(`Canal : ${order.channel}`);
  return lines.join("\n");
}

/**
 * Instant order alerts, triggered through the serverless endpoint
 * POST /api/orders which dispatches Email (Resend / SendGrid / FormSubmit)
 * and SMS (Twilio) SERVER-SIDE and only answers after they fired.
 * If the API is unreachable (e.g. local dev), falls back to direct
 * client-side FormSubmit alerts. Never throws — checkout is never blocked.
 */
export async function sendOrderNotifications(order: Order): Promise<boolean> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ order }),
    });
    if (res.ok) return true;
  } catch {
    // fall through to the client-side backup channel
  }

  // Backup: direct FormSubmit email alerts from the browser
  const payload = {
    _subject: `🛒 Nouvelle commande ${order.reference} — ${order.customerName} (${order.wilaya})`,
    _template: "table",
    _captcha: "false",
    Référence: order.reference,
    Client: order.customerName,
    Téléphone: order.phone,
    Produit: `${order.productName} (${order.sku})`,
    Quantité: String(order.quantity),
    Total: `${(order.unitPrice * order.quantity).toLocaleString("fr-DZ")} DA`,
    Wilaya: order.wilaya,
    Adresse: order.address,
    Note: order.note || "—",
    "Installation atelier (Baraki)": order.installation
      ? `${order.installation.date} — ${order.installation.slot}`
      : "Non",
    Canal: order.channel,
    "Alerte SMS": NOTIFY_PHONE,
    Message: orderAlertText(order),
  };

  const results = await Promise.allSettled(
    NOTIFY_EMAILS.map((email) =>
      fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => undefined)
    )
  );
  return results.some((r) => r.status === "fulfilled");
}

/** SMS deep link pre-filled with the full order alert (owner phone). */
export function orderSmsLink(order: Order): string {
  return `sms:${NOTIFY_PHONE.replace(/\s/g, "")}?&body=${encodeURIComponent(orderAlertText(order))}`;
}
