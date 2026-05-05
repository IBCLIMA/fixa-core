import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Sin firma" }, { status: 400 });
    }

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
    }

    const db = getDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const tallerId = session.metadata?.tallerId;
        const plan = session.metadata?.plan;

        if (tallerId && plan) {
          await db
            .update(talleres)
            .set({
              plan: plan as "basico" | "taller" | "pro",
              suscripcionActiva: true,
              stripeSubscriptionId: session.subscription as string,
            })
            .where(eq(talleres.id, tallerId));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const tallerId = subscription.metadata?.tallerId;

        if (tallerId) {
          await db
            .update(talleres)
            .set({
              plan: "cancelado",
              suscripcionActiva: false,
            })
            .where(eq(talleres.id, tallerId));
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          // Marcar como inactivo
          const [taller] = await db
            .select()
            .from(talleres)
            .where(eq(talleres.stripeSubscriptionId, subscriptionId));

          if (taller) {
            await db
              .update(talleres)
              .set({ suscripcionActiva: false })
              .where(eq(talleres.id, taller.id));
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
