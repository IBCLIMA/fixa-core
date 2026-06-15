import { Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HexPattern } from "@/components/ui/brand-texture";

/**
 * Prueba social HONESTA: aún no tenemos clientes de pago, así que no inventamos
 * testimonios. Contamos lo que es verdad y nadie puede copiar: FIXA se usa cada
 * día en nuestro propio taller. Cuando haya testimonios reales, irán aquí.
 */

const usosDiarios = [
  "Cada orden de trabajo de nuestro taller se crea con FIXA",
  "Nuestros clientes reciben su presupuesto por WhatsApp y lo aceptan online",
  "Los avisos de ITV salen de aquí — primero los sufrimos, luego los automatizamos",
  "Cada función nueva se prueba en nuestro mostrador antes de llegar a tu taller",
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden">
      <HexPattern />
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 text-xs font-semibold text-orange-700 mb-4">
            Sin testimonios de pago
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Nuestro primer cliente somos nosotros
          </h2>
          <p className="text-stone-500 mt-4 text-lg max-w-2xl mx-auto">
            Aquí no verás reseñas infladas ni talleres que no existen. FIXA nació dentro
            de Ibañez Clima, un taller real abierto desde 2010 — y lo usamos cada día para
            trabajar, no para hacer capturas bonitas.
          </p>
        </div>

        <div className="text-center mb-12">
          <div className="rounded-2xl bg-stone-950 text-white p-8 lg:p-10 shadow-2xl shadow-stone-900/20 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold">Ibañez Clima</p>
                <p className="text-xs text-stone-400">El taller donde nació FIXA · desde 2010</p>
              </div>
            </div>
            <div className="space-y-3">
              {usosDiarios.map((u) => (
                <div key={u} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                  <span className="text-stone-300">{u}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-stone-400 mt-6 italic">
              &ldquo;Construimos FIXA porque la necesitábamos nosotros. Si algo no funciona
              en un taller de verdad, no llega a la app.&rdquo;
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-stone-500 text-sm max-w-md mx-auto mb-5">
            ¿Quieres ser de los primeros talleres en usar FIXA? Los primeros nos ayudan a
            mejorarla — y nosotros les cuidamos como se cuida al primer cliente.
          </p>
          <Link href="/sign-up">
            <Button className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-12 px-8 shadow-lg shadow-orange-500/20 cursor-pointer group">
              Ser de los primeros
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
