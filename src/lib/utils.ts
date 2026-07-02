import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * URL absoluta de la app, robusta. Lee la URL base de la env, le quita espacios
 * y saltos de línea (una env con "\n" al final rompía los enlaces que se
 * mandaban al cliente: el enlace quedaba partido en dos) y normaliza la barra.
 * Úsalo SIEMPRE para construir enlaces públicos (estado, informe, presupuesto…).
 */
export function appUrl(path = ""): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fixataller.es");
  const base = raw.trim().replace(/\s+/g, "").replace(/\/+$/, "");
  if (!path) return base;
  return `${base}/${String(path).replace(/^\/+/, "")}`;
}

/**
 * Escapa texto para interpolarlo en HTML (emails construidos con template
 * strings). Sin esto, un nombre de taller como "<img onerror=...>" se
 * ejecutaría en el cliente de correo del admin.
 */
export function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Genera una URL de WhatsApp con el número formateado correctamente.
 * Si el teléfono ya empieza con "+", se usa tal cual.
 * Si empieza con un dígito (sin +), se antepone "+34".
 */
export function formatWhatsAppUrl(telefono: string, text?: string): string {
  const cleaned = telefono.replace(/\s/g, "");
  let number: string;
  if (cleaned.startsWith("+")) {
    number = cleaned.slice(1);
  } else if (cleaned.startsWith("0034")) {
    number = cleaned.slice(2); // strip leading "00", keeps "34..."
  } else if (cleaned.startsWith("34") && cleaned.length >= 11) {
    number = cleaned; // already has country code
  } else {
    number = `34${cleaned}`;
  }
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Detecta si un teléfono español parece un FIJO (no apto para WhatsApp).
 * Móviles empiezan por 6 o 7; fijos por 8 o 9. Solo avisa cuando el número
 * está ya completo (9 dígitos) para no molestar mientras se teclea.
 */
export function esTelefonoFijoES(telefono: string | null | undefined): boolean {
  if (!telefono) return false;
  let n = telefono.replace(/\D/g, "");
  if (n.startsWith("0034")) n = n.slice(4);
  else if (n.startsWith("34") && n.length > 9) n = n.slice(2);
  if (n.length < 9) return false; // aún incompleto: no avisamos
  return /^[89]/.test(n);
}
