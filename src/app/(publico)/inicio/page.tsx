import Link from "next/link";
import {
  Wrench, ArrowRight, CheckCircle2, Car, CalendarDays, MessageSquare,
  Users, ClipboardList, Shield, Smartphone, Zap, Bell, FileText,
  Megaphone, Search, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: ClipboardList, title: "Órdenes de trabajo", desc: "Control completo del estado de cada coche en el taller. De la entrada a la entrega." },
  { icon: Users, title: "Clientes y vehículos", desc: "Fichas con historial completo. Busca por matrícula y ve todo." },
  { icon: CalendarDays, title: "Agenda de citas", desc: "Calendario semanal. Organiza las entradas sin llamadas." },
  { icon: MessageSquare, title: "WhatsApp integrado", desc: "Avisa al cliente con un toque. 13 plantillas listas." },
  { icon: Car, title: "Portal del cliente", desc: "El cliente ve el estado de su coche sin llamar. Como el tracking de Glovo." },
  { icon: Bell, title: "Avisos de ITV", desc: "Detecta automáticamente ITVs próximas. Genera trabajo recurrente." },
  { icon: Search, title: "Entrada rápida", desc: "Escribe la matrícula → orden creada en 10 segundos." },
  { icon: FileText, title: "Presupuestos", desc: "Crea presupuestos desde la orden. Con líneas de trabajo y precios." },
  { icon: Megaphone, title: "Ofertas masivas", desc: "Envía promociones a todos tus clientes por WhatsApp." },
  { icon: Camera, title: "Fotos del vehículo", desc: "Fotografía el coche al entrar. Protección ante reclamaciones." },
  { icon: Shield, title: "Seguridad y RGPD", desc: "Datos cifrados, backups automáticos, cumplimiento legal." },
  { icon: Smartphone, title: "Desde el móvil", desc: "PWA instalable. Funciona como una app nativa." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      {/* Nav */}
      <header className="border-b border-stone-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20">
              <Wrench className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">FIXA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">
              Acceder
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-semibold shadow-md">
                Probar gratis<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 mb-8">
          <Zap className="h-3.5 w-3.5 text-orange-600" />
          <span className="text-xs font-semibold text-orange-700">Creado por un mecánico para mecánicos</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-6xl lg:text-7xl leading-[1.05]">
          Gestión de taller
          <br />
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            sin complicaciones
          </span>
        </h1>

        <p className="mx-auto max-w-xl text-lg text-stone-500 mt-6 leading-relaxed">
          Órdenes de trabajo, clientes, citas, presupuestos, avisos y WhatsApp integrado.
          Todo desde el móvil. Todo en un solo sitio.
        </p>

        <div className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-bold h-14 px-10 text-base shadow-xl shadow-stone-900/10">
              Empezar gratis<ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-stone-200">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-stone-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Sin permanencia</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Listo en 7 días</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Importa tus datos</span>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-orange-600 mb-2">Todo lo que necesita tu taller</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">12 herramientas en una sola app</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white border border-stone-200/60 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-orange-200 transition-all duration-300">
              <f.icon className="h-6 w-6 text-orange-500 mb-3" />
              <h3 className="font-bold text-sm text-stone-900 mb-1">{f.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Deja de perder tiempo.
            <br />
            <span className="text-orange-400">Empieza a usar FIXA.</span>
          </h2>
          <p className="mx-auto max-w-md text-stone-400 mt-4">
            Te lo dejamos montado en menos de una semana. Importa tus clientes desde Excel y empieza a trabajar.
          </p>
          <Link href="/sign-up" className="inline-block mt-8">
            <Button size="lg" className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-14 px-10 text-base shadow-xl shadow-orange-500/20">
              Probar gratis<ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-xs text-stone-500 mt-4">Sin permanencia · Sin complicaciones · Creado por un mecánico para mecánicos</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Wrench className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">FIXA</span>
            <span className="text-xs text-stone-400">Soluciones digitales para talleres</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <Link href="/privacidad" className="hover:text-stone-700 transition-colors">Privacidad</Link>
            <span>FIXA by Ibañez Clima</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
