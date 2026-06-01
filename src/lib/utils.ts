import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera una URL de WhatsApp con el número formateado correctamente.
 * Si el teléfono ya empieza con "+", se usa tal cual.
 * Si empieza con un dígito (sin +), se antepone "+34".
 */
export function formatWhatsAppUrl(telefono: string, text?: string): string {
  const cleaned = telefono.replace(/\s/g, "");
  const number = cleaned.startsWith("+") ? cleaned.slice(1) : `34${cleaned}`;
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
