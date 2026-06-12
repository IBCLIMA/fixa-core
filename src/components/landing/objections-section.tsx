"use client";

import { ShieldCheck, MessageSquare, Clock, Wrench } from "lucide-react";
import { AnimatedSection } from "./animated-section";

const objeciones = [
  {
    icon: Wrench,
    objecion: "\u201CYo no soy de ordenadores\u201D",
    respuesta:
      "Si sabes usar WhatsApp, sabes usar FIXA. Está pensada para manejarse con los dedos llenos de grasa: botones grandes, dos toques para todo y un tour que te lo enseña la primera vez.",
  },
  {
    icon: ShieldCheck,
    objecion: "\u201C¿Y si me cobran sorpresas?\u201D",
    respuesta:
      "Empiezas gratis sin meter tarjeta, así que es imposible que te cobremos nada. Después, precio fijo y cancelas el mes que quieras desde la propia app. Sin llamadas, sin permanencia, sin letra pequeña.",
  },
  {
    icon: Clock,
    objecion: "\u201CNo tengo tiempo para cambiar de sistema\u201D",
    respuesta:
      "No hay que montar nada: te registras y creas tu primera orden en el mismo minuto. Tus clientes se importan desde un Excel y, si te atascas, te lo dejamos montado nosotros.",
  },
  {
    icon: MessageSquare,
    objecion: "\u201C¿Quién hay detrás de esto?\u201D",
    respuesta:
      "FIXA nació dentro de un taller real, no en una oficina. La construimos resolviendo nuestros propios marrones del día a día, y el soporte te lo damos por WhatsApp personas que saben lo que es un taller.",
  },
];

export function ObjectionsSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            Hablemos claro
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Sabemos lo que estás pensando
          </h2>
          <p className="text-stone-500 mt-4 text-lg max-w-xl mx-auto">
            Son las mismas dudas que tendríamos nosotros. Por eso las respondemos sin rodeos.
          </p>
        </AnimatedSection>

        <div className="grid gap-5 md:grid-cols-2">
          {objeciones.map((o, i) => (
            <AnimatedSection key={o.objecion} delay={i * 0.1}>
              <div className="h-full rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    <o.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="font-bold text-stone-900">{o.objecion}</p>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{o.respuesta}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
