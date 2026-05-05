import Link from "next/link";
import {
  Wrench, ArrowRight, CheckCircle2, Car, CalendarDays, MessageSquare,
  Users, ClipboardList, Shield, Smartphone, Zap, Bell, FileText,
  Megaphone, Search, Camera, PhoneOff, Clock, Timer, Send,
  ChevronDown, Phone, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: ClipboardList, color: "from-blue-500 to-blue-600", title: "Órdenes de trabajo", desc: "Control completo del estado de cada coche. De la entrada a la entrega en un vistazo." },
  { icon: Search, color: "from-orange-500 to-orange-600", title: "Entrada rápida", desc: "Escribe la matrícula → orden creada en 10 segundos. Sin formularios interminables." },
  { icon: MessageSquare, color: "from-emerald-500 to-emerald-600", title: "WhatsApp integrado", desc: "Avisa al cliente con un toque. 13 plantillas listas para cada situación." },
  { icon: Car, color: "from-cyan-500 to-cyan-600", title: "Portal del cliente", desc: "El cliente ve el estado sin llamar. Como el tracking de un pedido online." },
  { icon: CalendarDays, color: "from-violet-500 to-violet-600", title: "Agenda de citas", desc: "Calendario semanal. Organiza entradas y controla disponibilidad." },
  { icon: Bell, color: "from-red-500 to-red-600", title: "Avisos automáticos", desc: "Detecta ITVs próximas automáticamente. Genera trabajo que no tendrías." },
  { icon: Users, color: "from-indigo-500 to-indigo-600", title: "Clientes y vehículos", desc: "Fichas con historial completo. Busca matrícula y ve todo lo que se ha hecho." },
  { icon: FileText, color: "from-amber-500 to-amber-600", title: "Presupuestos", desc: "Crea presupuesto desde la orden. Líneas de M.O. y recambios con IVA automático." },
  { icon: Megaphone, color: "from-pink-500 to-pink-600", title: "Ofertas masivas", desc: "Envía promociones a todos tus clientes por WhatsApp con un clic." },
  { icon: Camera, color: "from-teal-500 to-teal-600", title: "Fotos del vehículo", desc: "Fotografía el coche desde el móvil. Protección ante reclamaciones." },
  { icon: Shield, color: "from-stone-500 to-stone-600", title: "Seguridad y RGPD", desc: "Datos cifrados, backups automáticos, cumplimiento legal." },
  { icon: Smartphone, color: "from-rose-500 to-rose-600", title: "Instalable en el móvil", desc: "Se instala como app nativa. Funciona offline. Sin tiendas de apps." },
];

const precios = [
  { nombre: "Básico", precio: "29", desc: "Para talleres pequeños", features: ["1 usuario", "Clientes ilimitados", "Órdenes de trabajo", "Calendario", "WhatsApp básico", "Portal del cliente"], popular: false },
  { nombre: "Taller", precio: "49", desc: "Todo lo que necesitas", features: ["Hasta 5 usuarios", "Todo lo del plan Básico", "Avisos ITV automáticos", "Ofertas masivas", "Presupuestos", "Importar datos CSV", "Soporte prioritario"], popular: true },
  { nombre: "Pro", precio: "79", desc: "Para talleres grandes", features: ["Usuarios ilimitados", "Todo lo del plan Taller", "Multi-taller", "Informes avanzados", "Personalización", "Soporte dedicado"], popular: false },
];

const faqs = [
  { q: "¿Es difícil de usar?", a: "Si sabes usar WhatsApp, sabes usar FIXA. Incluye tour guiado y guía de primeros pasos. Lo dejamos todo montado." },
  { q: "¿Necesito ordenador?", a: "No. FIXA funciona 100% desde el móvil. Se instala como una app y funciona incluso sin conexión." },
  { q: "¿Puedo importar mis datos actuales?", a: "Sí. Sube un CSV con tus clientes y vehículos. Si tienes los datos en Excel, guárdalo como CSV y súbelo." },
  { q: "¿Hay permanencia?", a: "No. Cancela cuando quieras. Sin contratos, sin penalizaciones." },
  { q: "¿Mis datos están seguros?", a: "Datos cifrados, backups automáticos diarios, cumplimiento RGPD. Descarga tus datos en cualquier momento." },
  { q: "¿El WhatsApp se envía solo?", a: "FIXA prepara el mensaje y abre WhatsApp listo para enviar. Tú pulsas enviar. Sin API ni costes extra." },
  { q: "¿Cuánto tiempo tardo en empezar?", a: "Menos de una semana. Creamos tu cuenta, importamos tus clientes, y lo tienes funcionando." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen antialiased" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>

      {/* NAV */}
      <header className="border-b border-stone-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20"><Wrench className="h-[18px] w-[18px] text-white" /></div>
            <span className="text-xl font-extrabold tracking-tight text-stone-900">FIXA</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#precios" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">Precios</a>
            <a href="#faq" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">FAQ</a>
            <Link href="/sign-in" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">Acceder</Link>
            <Link href="/sign-up"><Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-semibold shadow-md text-sm">Probar gratis<ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 mb-6">
              <Zap className="h-3.5 w-3.5 text-orange-600" /><span className="text-xs font-semibold text-orange-700">Creado por un mecánico para mecánicos</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl lg:text-6xl leading-[1.05]">
              Tu taller,<br /><span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">bajo control total</span>
            </h1>
            <p className="text-lg text-stone-500 mt-6 leading-relaxed max-w-md">Órdenes, clientes, citas, presupuestos y WhatsApp integrado. Todo desde el móvil.</p>
            <div className="flex flex-col gap-3 mt-8 sm:flex-row">
              <Link href="/sign-up"><Button size="lg" className="rounded-full bg-stone-900 text-white hover:bg-stone-800 font-bold h-14 px-8 text-base shadow-xl shadow-stone-900/10">Empezar gratis<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <a href="#precios"><Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-stone-200">Ver precios</Button></a>
            </div>
            <div className="flex items-center gap-5 mt-6 text-sm text-stone-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Sin permanencia</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Listo en 7 días</span>
            </div>
          </div>

          {/* Mockup */}
          <div className="hidden lg:block">
            <div className="rounded-2xl bg-stone-200/40 p-2">
              <div className="rounded-xl bg-white shadow-2xl shadow-black/[0.06] border border-stone-200/60 overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                  <div className="h-2.5 w-2.5 rounded-full bg-stone-200" /><div className="h-2.5 w-2.5 rounded-full bg-stone-200" /><div className="h-2.5 w-2.5 rounded-full bg-stone-200" />
                  <div className="flex-1 mx-8"><div className="h-5 bg-stone-100 rounded-full max-w-xs mx-auto flex items-center justify-center"><span className="text-[9px] text-stone-400 font-medium">fixa.es</span></div></div>
                </div>
                <div className="p-6" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600"><Wrench className="h-3.5 w-3.5 text-white" /></div>
                    <span className="text-xs font-extrabold">FIXA</span><span className="ml-auto text-[9px] text-stone-400">Panel del día</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mb-4">
                    {[{ n: "6", l: "En taller", c: "from-blue-500 to-blue-600" }, { n: "3", l: "Citas", c: "from-orange-500 to-orange-600" }, { n: "12", l: "Clientes", c: "from-violet-500 to-violet-600" }, { n: "1", l: "Listo", c: "from-emerald-500 to-emerald-600" }].map((k) => (
                      <div key={k.l} className="rounded-lg bg-white p-2 text-center border border-stone-100 shadow-sm">
                        <div className={`flex h-5 w-5 mx-auto items-center justify-center rounded bg-gradient-to-br ${k.c} mb-1`}><span className="text-[7px] text-white font-bold">{k.n}</span></div>
                        <p className="text-[7px] text-stone-400 font-medium">{k.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><span className="text-[8px] font-bold">5678 DRS</span><span className="text-[7px] text-stone-400">Peugeot 308</span></div>
                    <div className="flex h-4 items-center gap-0.5 rounded-full bg-emerald-500 px-1.5"><Send className="h-2 w-2 text-white" /><span className="text-[6px] text-white font-bold">Avisar</span></div>
                  </div>
                  <div className="space-y-1.5">
                    {[{ m: "7891 JNM", c: "Renault Clio", e: "Presupuestado" }, { m: "6789 KMN", c: "BMW Serie 3", e: "Recibido" }].map((o) => (
                      <div key={o.m} className="flex items-center justify-between rounded-lg bg-white border border-stone-100 p-2">
                        <div><span className="text-[8px] font-bold">{o.m}</span><span className="text-[7px] text-stone-400 ml-1">{o.c}</span></div>
                        <span className="text-[6px] font-bold bg-stone-100 px-1.5 py-0.5 rounded-full text-stone-500">{o.e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="bg-white border-y border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-red-600 mb-2">El problema</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">¿Tu día a día te suena así?</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: PhoneOff, color: "text-red-500 bg-red-50", title: "El teléfono no para", desc: '"¿Está listo mi coche?" — la misma pregunta 20 veces al día.' },
              { icon: Timer, color: "text-amber-600 bg-amber-50", title: "Pierdes horas en admin", desc: "Presupuestos en Excel, citas en papel. Tiempo que no facturas." },
              { icon: Clock, color: "text-blue-500 bg-blue-50", title: "Clientes que no vuelven", desc: "No les avisas de la ITV ni la revisión. Pierdes trabajo recurrente." },
            ].map((p) => (
              <Card key={p.title} className="border-0 shadow-none bg-stone-50"><CardContent className="p-6"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.color} mb-4`}><p.icon className="h-6 w-6" /></div><h3 className="font-bold text-stone-900 mb-2">{p.title}</h3><p className="text-sm text-stone-500 leading-relaxed">{p.desc}</p></CardContent></Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-orange-600 mb-2">La solución</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">12 herramientas en una sola app</h2>
          <p className="text-stone-500 mt-3 max-w-lg mx-auto">Todo lo que necesita tu taller para trabajar mejor y no perder clientes.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white border border-stone-200/60 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-orange-200 transition-all duration-300 group">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300`}><f.icon className="h-5 w-5 text-white" /></div>
              <h3 className="font-bold text-sm text-stone-900 mb-1">{f.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-orange-400 mb-2">Así de fácil</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Funcionando en 3 pasos</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Importa tus clientes", desc: "Sube un CSV con tu base de datos. O créalos uno a uno. En 30 minutos todo migrado." },
              { step: "02", title: "Entra un coche → matrícula", desc: "Escribe la matrícula, describe qué le pasa, crea la orden. 10 segundos." },
              { step: "03", title: "Trabaja sin interrupciones", desc: "El cliente ve el estado online. Tú solo cambias el estado y avisas con un toque." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 mb-5"><span className="text-sm font-extrabold">{s.step}</span></div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-stone-400 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-orange-600 mb-2">Precios</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">Sin sorpresas. Sin permanencia.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {precios.map((p) => (
            <Card key={p.nombre} className={`relative overflow-hidden ${p.popular ? "border-orange-300 shadow-lg shadow-orange-500/10 md:scale-105" : "border-stone-200"}`}>
              {p.popular && <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center text-xs font-bold py-1.5">Más popular</div>}
              <CardContent className={`p-6 ${p.popular ? "pt-10" : ""}`}>
                <h3 className="font-bold text-stone-900">{p.nombre}</h3>
                <p className="text-xs text-stone-500 mb-4">{p.desc}</p>
                <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-extrabold text-stone-900">{p.precio}€</span><span className="text-sm text-stone-400">/mes</span></div>
                <div className="space-y-2 mb-6">
                  {p.features.map((f) => (<div key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500 shrink-0" /><span className="text-stone-600">{f}</span></div>))}
                </div>
                <Link href="/sign-up"><Button className={`w-full rounded-full font-bold ${p.popular ? "bg-stone-900 text-white hover:bg-stone-800" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}>Empezar gratis</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-xs text-stone-400 mt-6">IVA no incluido. Facturación mensual. Cancela cuando quieras.</p>
      </section>

      {/* QUIÉN */}
      <section className="bg-white border-y border-stone-200/60">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-bold text-orange-600 mb-2">Quién está detrás</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl mb-6">Creado desde dentro de un taller</h2>
            <div className="rounded-2xl bg-stone-50 p-8 text-left">
              <p className="text-stone-600 leading-relaxed">FIXA no lo ha creado una empresa de informáticos. Lo ha creado alguien que lleva años gestionando un taller real, con clientes reales, y que estaba harto del teléfono, el papel y el Excel.</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100"><Wrench className="h-5 w-5 text-orange-600" /></div>
                <div><p className="font-bold text-stone-900">Ibañez Clima</p><p className="text-sm text-stone-500">Taller mecánico · Automoción</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-orange-600 mb-2">Preguntas frecuentes</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">¿Tienes dudas?</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-2xl bg-white border border-stone-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none"><span className="font-bold text-sm text-stone-900 pr-4">{faq.q}</span><ChevronDown className="h-4 w-4 text-stone-400 shrink-0 group-open:rotate-180 transition-transform" /></summary>
              <div className="px-5 pb-5 -mt-1"><p className="text-sm text-stone-500 leading-relaxed">{faq.a}</p></div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl leading-tight">Deja de perder tiempo.<br /><span className="text-orange-400">Empieza a usar FIXA.</span></h2>
          <p className="text-stone-400 mt-4 max-w-md mx-auto">Te lo dejamos montado en menos de una semana. Importa tus clientes y empieza a trabajar.</p>
          <div className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center">
            <Link href="/sign-up"><Button size="lg" className="rounded-full bg-orange-500 text-white hover:bg-orange-400 font-bold h-14 px-10 text-base shadow-xl shadow-orange-500/20">Probar gratis<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <a href="https://wa.me/34612345678?text=Hola%2C%20quiero%20información%20sobre%20FIXA" target="_blank">
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base font-semibold border-white/20 text-white hover:bg-white/10"><Phone className="mr-2 h-4 w-4" />Contactar por WhatsApp</Button>
            </a>
          </div>
          <p className="text-xs text-stone-500 mt-6">Sin permanencia · Creado por un mecánico para mecánicos</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600"><Wrench className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-sm">FIXA</span><span className="text-xs text-stone-400">Soluciones digitales para talleres</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <Link href="/privacidad" className="hover:text-stone-700 transition-colors">Privacidad</Link>
            <span>© 2026 FIXA by Ibañez Clima</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
