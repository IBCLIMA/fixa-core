import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { AlertTriangle, MessageSquare } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-6">
        <Link href="/inicio">
          <FixaLogo size="md" />
        </Link>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-xl border border-stone-200/60 rounded-2xl",
            headerTitle: "text-xl font-extrabold",
            headerSubtitle: "text-sm text-stone-500",
            formButtonPrimary: "bg-orange-500 hover:bg-orange-600 rounded-full h-11 font-bold",
            footerActionLink: "text-orange-600 font-semibold",
            alert: "rounded-xl text-sm",
          },
        }}
      />

      {/* Help section - always visible */}
      <div className="mt-6 max-w-md w-full space-y-3">
        <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-amber-800 font-medium mb-1">¿Tienes un bloqueador de anuncios?</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Extensiones como AdBlock o uBlock pueden interferir con el registro.
              Si ves un error, desactívalas temporalmente para esta página o usa una ventana de incógnito.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/34611433218?text=Hola%2C%20tengo%20problemas%20para%20registrarme%20en%20FIXA"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          ¿Problemas? Escríbenos por WhatsApp y te ayudamos
        </a>
      </div>
    </div>
  );
}
