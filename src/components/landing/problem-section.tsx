import { PhoneOff, Clock, Timer } from "lucide-react";
import { LandingBadge } from "./landing-badge";

const problems = [
  {
    icon: PhoneOff,
    color: "text-red-500",
    bg: "bg-red-500/10",
    accent: "border-red-200/50",
    title: "20 llamadas al día para nada",
    desc: '"¿Está listo mi coche?" — la misma pregunta 20 veces. Te saca de debajo del coche, pierdes el hilo y son 2 horas diarias que no cobras a nadie.',
  },
  {
    icon: Timer,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    accent: "border-amber-200/50",
    title: "Presupuestos a las 9 de la noche",
    desc: "El presupuesto lo haces en casa con la calculadora. Si tardas un día más, el cliente ya se fue a otro. Cada hora de retraso es dinero perdido.",
  },
  {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    accent: "border-blue-200/50",
    title: "ITVs que se te escapan",
    desc: "Tienes 200 clientes con ITV. ¿Cuántos te han avisado de que les toca? Ninguno — y se la hacen en otro sitio. Son 5-10 pre-ITVs al mes que pierdes.",
  },
];

export function ProblemSection() {
  
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-100/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16 relative z-10">
        <div className="text-center mb-12">
          <LandingBadge>El problema</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            ¿Te suena alguno?
          </h2>
          <p className="text-stone-500 mt-4 text-lg max-w-xl mx-auto">
            Si tu taller pierde dinero, no es por los coches — es por la gestión.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          {problems.map((p, i) => (
            <div className={`rounded-2xl bg-white/70 backdrop-blur-sm border ${p.accent} p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.bg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <p.icon className={`h-6 w-6 ${p.color}`} />
              </div>
              <h3 className="font-bold text-stone-900 text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
