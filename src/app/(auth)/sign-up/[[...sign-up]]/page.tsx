import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { CheckCircle2, ArrowLeft, AlertTriangle, MessageSquare } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen" style={{ background: "linear-gradient(135deg, #faf9f7 0%, #f5f3f0 50%, #fef3e2 100%)" }}>
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-stone-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(249,115,22,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_80%_80%,rgba(59,130,246,0.06),transparent)]" />

        <div className="relative z-10">
          <Link href="/inicio">
            <FixaLogo size="md" theme="dark" />
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            14 días gratis.
            <br />
            <span className="text-orange-400">Sin tarjeta de crédito.</span>
          </h1>
          <div className="space-y-4">
            {[
              "Setup gratuito — te lo dejamos montado",
              "Importamos tus clientes desde Excel",
              "Soporte por WhatsApp incluido",
              "Sin permanencia, cancela cuando quieras",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-sm text-stone-300">{text}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-4 mt-8">
            <p className="text-sm text-stone-400 italic">
              &ldquo;Antes perdía 2 horas al día con llamadas. Ahora los clientes miran el estado solos.&rdquo;
            </p>
            <p className="text-xs text-stone-500 mt-2">— Carlos M., Taller El Maño</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-stone-500">© 2026 FIXA by Ibañez Clima</p>
        </div>
      </div>

      {/* Right panel - auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="lg:hidden mb-8">
          <Link href="/inicio">
            <FixaLogo size="md" />
          </Link>
        </div>

        <div className="w-full max-w-md">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 bg-transparent p-0",
                headerTitle: "text-2xl font-extrabold text-stone-900",
                headerSubtitle: "text-sm text-stone-500",
                formButtonPrimary: "bg-orange-500 hover:bg-orange-600 rounded-xl h-12 font-bold text-sm shadow-lg shadow-orange-500/20",
                formFieldInput: "rounded-xl border-stone-200 h-12 text-sm focus:border-orange-300 focus:ring-orange-500/20",
                formFieldLabel: "text-sm font-medium text-stone-700",
                footerActionLink: "text-orange-600 font-semibold hover:text-orange-500",
                socialButtonsBlockButton: "rounded-xl border-stone-200 h-12 font-medium text-sm hover:bg-stone-50",
                dividerLine: "bg-stone-200",
                dividerText: "text-stone-400 text-xs",
                alert: "rounded-xl",
              },
            }}
          />

          {/* Adblock help */}
          <div className="mt-6 space-y-3">
            <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-3 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>¿Usas bloqueador de anuncios?</strong> Desactívalo para esta página o usa una ventana de incógnito si tienes problemas al registrarte.
              </p>
            </div>

            <a
              href="https://wa.me/34611433218?text=Hola%2C%20quiero%20registrarme%20en%20FIXA%20pero%20tengo%20problemas"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              ¿Problemas? Te ayudamos por WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/inicio" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a la web
          </Link>
        </div>
      </div>
    </div>
  );
}
