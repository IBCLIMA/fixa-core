import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { ArrowLeft, ArrowRight, Wrench, Clock, Smartphone, Shield, CheckCircle2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] flex-col relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(249,115,22,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_80%_100%,rgba(249,115,22,0.06),transparent)]" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Link href="/inicio"><FixaLogo size="md" theme="dark" /></Link>

          <div className="space-y-8 -mt-8">
            <div>
              <h1 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                Bienvenido
                <br />
                <span className="text-orange-400">de vuelta.</span>
              </h1>
              <p className="text-stone-400 mt-4 text-lg">Tu taller te está esperando.</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Clock, text: "Mira qué coches tienes hoy en el taller" },
                { icon: Wrench, text: "Actualiza estados y avisa a tus clientes" },
                { icon: Smartphone, text: "Todo desde tu móvil, en cualquier momento" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <span className="text-sm text-stone-300">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 p-5">
              <p className="text-white font-bold text-sm mb-1">¿Aún no tienes cuenta?</p>
              <p className="text-stone-400 text-xs mb-3">14 días gratis. Sin tarjeta. Sin compromiso.</p>
              <Link href="/sign-up" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 transition-colors">
                Crear cuenta gratis <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-stone-600">© 2026 FIXA by Ibañez Clima</p>
        </div>
      </div>

      {/* Right panel - warm, premium */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #fff7ed 0%, #faf9f7 40%, #f5f3f0 100%)" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-10">
          {/* Mobile header */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/inicio"><FixaLogo size="lg" /></Link>
            <h2 className="text-xl font-extrabold text-stone-900 mt-4">Accede a tu taller</h2>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block w-full max-w-md mb-8">
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Accede a tu taller</h2>
            <p className="text-stone-500 mt-2">Introduce tu email para continuar.</p>
          </div>

          {/* Form card */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/50 shadow-xl shadow-black/[0.03] p-6 sm:p-8">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 bg-transparent p-0",
                    headerTitle: "text-xl font-extrabold text-stone-900 lg:hidden",
                    headerSubtitle: "text-sm text-stone-500 lg:hidden",
                    formButtonPrimary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl h-13 font-bold text-base shadow-lg shadow-orange-500/25 transition-all",
                    formFieldInput: "rounded-xl border-stone-200/80 bg-white h-12 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all",
                    formFieldLabel: "text-sm font-semibold text-stone-700",
                    footerActionLink: "text-orange-600 font-bold hover:text-orange-500 text-sm",
                    socialButtonsBlockButton: "rounded-xl border-stone-200/80 bg-white h-12 font-semibold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm",
                    dividerLine: "bg-stone-200/60",
                    dividerText: "text-stone-400 text-xs",
                    identityPreviewEditButton: "text-orange-600",
                    alert: "rounded-xl",
                  },
                }}
              />
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-500" />Datos cifrados</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />RGPD</span>
            </div>

            {/* Register CTA mobile */}
            <div className="mt-6 lg:hidden rounded-xl bg-stone-900 p-5 text-center">
              <p className="text-white font-bold">¿No tienes cuenta?</p>
              <p className="text-stone-400 text-xs mt-1 mb-3">14 días gratis. Sin compromiso.</p>
              <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white text-sm font-bold">
                Crear cuenta gratis <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/inicio" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />Volver a la web
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
