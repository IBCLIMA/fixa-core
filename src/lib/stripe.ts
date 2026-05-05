import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY no configurada");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

// IDs de los productos/precios en Stripe (se crean manualmente en el dashboard)
export const STRIPE_PRICES = {
  basico: process.env.STRIPE_PRICE_BASICO || "",
  taller: process.env.STRIPE_PRICE_TALLER || "",
  pro: process.env.STRIPE_PRICE_PRO || "",
};

export const PLAN_PRICES = {
  basico: 29,
  taller: 49,
  pro: 79,
} as const;
