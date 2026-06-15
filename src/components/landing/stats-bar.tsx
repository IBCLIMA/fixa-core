import { Wrench, Calendar, Shield, CreditCard } from "lucide-react";

/**
 * Barra de stats VERIFICABLES — solo datos reales.
 * No "2.400+ talleres" inventados. Nuestros números son honestos
 * y hasta que tengamos clientes de pago, lo que decimos se puede comprobar.
 */
const stats = [
  { icon: Wrench, valor: "10 seg", label: "Orden de trabajo creada", color: "text-orange-600" },
  { icon: Calendar, valor: "0 llamadas", label: "El cliente mira su coche solo", color: "text-blue-600" },
  { icon: Shield, valor: "Automático", label: "Avisos de ITV cada mes", color: "text-emerald-600" },
  { icon: CreditCard, valor: "29€/mes", label: "Menos que media hora tuya", color: "text-violet-600" },
];

export function StatsBar() {
  return (
    <section className="border-y border-stone-200/60 bg-white/50 backdrop-blur-sm">
      <div className="text-center mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-50 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-stone-900 leading-tight">{s.valor}</p>
                <p className="text-xs text-stone-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
