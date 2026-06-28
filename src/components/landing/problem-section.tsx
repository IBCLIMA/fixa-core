import { PhoneOff, Clock, Timer } from "lucide-react";
import { LandingBadge } from "./landing-badge";

const problems = [
  {
    icon: PhoneOff,
    color: "text-red-500",
    bg: "bg-red-500/10",
    accent: "border-red-200/50",
    title: "Un coche parado es una plaza muerta",
    desc: "Lleva tres días esperando una pieza y se te ha ido de la cabeza. Mientras ocupa el elevador, no entra otro trabajo. Menos rotación, menos dinero — y ni te habías enterado.",
  },
  {
    icon: Timer,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    accent: "border-amber-200/50",
    title: "Un presupuesto que no persigues es una venta perdida",
    desc: "Lo mandaste la semana pasada. ¿Lo aceptó? ¿Lo llamaste? No te acuerdas. Y mientras dudas, el cliente ya está reparando en otro taller.",
  },
  {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    accent: "border-blue-200/50",
    title: "Una revisión olvidada es un cliente que se va",
    desc: "Le tocaba la ITV en marzo. Nadie le avisó. Se la hizo en otro sitio y de paso le hicieron la revisión. Trabajo que era tuyo y se fue, sin que lo vieras venir.",
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
            Un taller no se descontrola por falta de trabajo
          </h2>
          <p className="text-stone-500 mt-4 text-lg max-w-2xl mx-auto">
            Se descontrola porque todo depende de tu memoria. ¿A quién tenías que llamar? ¿Qué presupuesto quedó pendiente? ¿Qué coche espera pieza? ¿A quién le caduca la ITV? ¿Qué cliente lleva dos días sin noticias? Cada olvido cuesta dinero.
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
