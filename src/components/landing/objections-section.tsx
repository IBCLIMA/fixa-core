import { ShieldCheck, MessageSquare, Clock, Wrench } from "lucide-react";
import { LandingBadge } from "./landing-badge";

const objeciones = [
  {
    icon: Wrench,
    objecion: "\u201CYo de tecnología no entiendo\u201D",
    respuesta:
      "Un mecánico de 58 años nos dijo eso. A los 5 minutos había creado su primera orden. FIXA tiene botones grandes, letras claras y dos toques para todo. Si mandas un WhatsApp, la usas.",
  },
  {
    icon: ShieldCheck,
    objecion: "\u201CSeguro que luego hay truco\u201D",
    respuesta:
      "Ni tarjeta pedimos para probar. Si en 14 días no te convence, no pagas porque no hay nada que cobrar. Y si un mes no la usas, cancelas tú solo desde la app. Sin llamar, sin pedir permiso, sin penalización.",
  },
  {
    icon: Clock,
    objecion: "\u201CNo tengo tiempo ni para comer\u201D",
    respuesta:
      "No tienes tiempo para un ERP que necesita un curso. Pero la primera orden en FIXA tarda 10 segundos — menos que contestar la próxima llamada de '¿está listo mi coche?'. Esos 10 segundos te devuelven horas.",
  },
  {
    icon: MessageSquare,
    objecion: "\u201CYa probé otro programa y no lo usaba nadie\u201D",
    respuesta:
      "Normal: aquello era una pantalla más para rellenar. FIXA es lo contrario: es quien te avisa de lo que necesita atención, no una libreta digital que mantienes tú. Funciona desde el PC y desde el móvil, con las manos manchadas. Y si en 14 días no le sacas partido, la borras y no pagas nada.",
  },
];

export function ObjectionsSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16 relative z-10">
        <div className="text-center mb-12">
          <LandingBadge>Hablemos claro</LandingBadge>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-5xl">
            Ya. Pero...
          </h2>
          <p className="text-stone-500 mt-4 text-lg max-w-xl mx-auto">
            Estas son las 4 cosas que te están frenando. Las sabemos porque son las mismas que nos frenaban a nosotros.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {objeciones.map((o, i) => (
            <div className="text-center mb-12">
              <div className="h-full rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/50 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <o.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <p className="font-bold text-stone-900">{o.objecion}</p>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{o.respuesta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
