"use client";

import ScrollVelocity from "@/components/ui/scroll-velocity";

export function ScrollBanner() {
  return (
    <section className="py-8 overflow-hidden border-y border-stone-200/30 bg-stone-50/30">
      <ScrollVelocity
        texts={[
          "Órdenes de trabajo · WhatsApp integrado · Avisos ITV · Presupuestos · Calendario · Portal del cliente",
          "Entrada en 10 segundos · Fotos del vehículo · Ofertas masivas · RGPD · App móvil · Multi-usuario",
        ]}
        velocity={60}
        className="text-2xl md:text-4xl font-extrabold text-stone-200 tracking-tight"
        numCopies={4}
      />
    </section>
  );
}
