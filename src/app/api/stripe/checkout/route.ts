import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStripe, STRIPE_PRICES, PLAN_PRICES } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const { plan } = await request.json();

    if (!["basico", "taller", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Plan no válido" }, { status: 400 });
    }

    const priceId = STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES];
    if (!priceId) {
      return NextResponse.json({ error: "Stripe no configurado para este plan. Contacta con soporte." }, { status: 400 });
    }

    const db = getDb();
    const [taller] = await db.select().from(talleres).where(eq(talleres.id, tallerId));

    if (!taller) {
      return NextResponse.json({ error: "Taller no encontrado" }, { status: 404 });
    }

    const stripe = getStripe();

    // Crear o reutilizar customer de Stripe
    let customerId = taller.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        name: taller.nombre,
        email: taller.email || undefined,
        phone: taller.telefono || undefined,
        metadata: { tallerId: taller.id },
      });
      customerId = customer.id;
      await db.update(talleres).set({ stripeCustomerId: customerId }).where(eq(talleres.id, tallerId));
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get("origin")}/configuracion?pago=ok`,
      cancel_url: `${request.headers.get("origin")}/configuracion?pago=cancelado`,
      metadata: { tallerId: taller.id, plan },
      subscription_data: {
        metadata: { tallerId: taller.id, plan },
      },
      locale: "es",
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
