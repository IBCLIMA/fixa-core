import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { CheckCircle2, ArrowLeft, MessageSquare, Zap, Smartphone, Star, Shield, Clock } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - dark, persuasive */}
      <div className="hidden lg:flex lg:w-[52%] flex-col relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(249,115,22,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_80%_100%,rgba(249,115,22,0.08),transparent)]" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Link href="/"><FixaLogo size="md" theme="dark" /></Link>

          <div className="space-y-10 -mt-8">
            <div>
              <p className="text-brand-400 font-bold text-sm tracking-wider uppercase mb-4">Empieza gratis hoy</p>
              <h1 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                Deja de perder
                <br />
                <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-brand-500 bg-clip-text text-transparent">2 horas al día</span>
                <br />
                al teléfono.
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { number: "10s", label: "Crear orden", icon: Zap },
                { number: "0", label: "Llamadas", icon: Smartphone },
                { number: "29€", label: "Al mes", icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                  <stat.icon className="h-5 w-5 text-brand-400 mb-2" />
                  <p className="text-2xl font-extrabold text-white">{stat.number}</p>
                  <p className="text-xs text-stone-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-6">
              <p className="text-stone-300 text-sm leading-relaxed">
                &ldquo;Construimos FIXA porque la necesitábamos en nuestro propio taller.
                Cada función se prueba aquí, con las manos manchadas, antes de llegar a la tuya.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center text-white font-bold text-sm">IC</div>
                <div>
                  <p className="text-sm font-bold text-white">Ibañez Clima</p>
                  <p className="text-xs text-stone-500">El taller donde nació FIXA · desde 2010</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600">© 2026 FIXA by Ibañez Clima</p>
        </div>
      </div>

      {/* Right panel - warm, premium, inviting */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #fff7ed 0%, #faf9f7 40%, #f5f3f0 100%)" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-10">
          {/* Mobile header */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/"><FixaLogo size="lg" /></Link>
            <h2 className="text-xl font-extrabold text-stone-900 mt-4">Prueba FIXA gratis</h2>
            <p className="text-stone-500 text-sm mt-1">Tu taller organizado en 2 minutos</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              {["14 días gratis", "Sin tarjeta"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs text-stone-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{t}
                </span>
              ))}
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block w-full max-w-md mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Registro gratuito</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Crea tu cuenta</h2>
            <p className="text-stone-500 mt-2">En 30 segundos. Sin tarjeta. Sin compromiso.</p>
          </div>

          {/* Form card */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/50 shadow-xl shadow-black/[0.03] p-6 sm:p-8">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 bg-transparent p-0",
                    headerTitle: "text-xl font-extrabold text-stone-900 lg:hidden",
                    headerSubtitle: "text-sm text-stone-500 lg:hidden",
                    formButtonPrimary: "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-xl h-13 font-bold text-base shadow-lg shadow-brand transition-all hover:shadow-brand",
                    formFieldInput: "rounded-xl border-stone-200/80 bg-white h-12 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all",
                    formFieldLabel: "text-sm font-semibold text-stone-700",
                    footerActionLink: "text-brand-600 font-bold hover:text-brand-500 text-sm",
                    socialButtonsBlockButton: "rounded-xl border-stone-200/80 bg-white h-12 font-semibold text-sm hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm",
                    dividerLine: "bg-stone-200/60",
                    dividerText: "text-stone-400 text-xs",
                    alert: "rounded-xl",
                    footer: "mt-2",
                  },
                }}
              />
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-500" />Datos cifrados</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-500" />Setup 2 min</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />RGPD</span>
            </div>

            {/* WhatsApp help */}
            <div className="mt-5">
              <a
                href="https://wa.me/34611433218?text=Hola%2C%20quiero%20registrarme%20en%20FIXA"
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-50/80 border border-emerald-200/40 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                ¿Necesitas ayuda? Escríbenos
              </a>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />Volver a la web
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
