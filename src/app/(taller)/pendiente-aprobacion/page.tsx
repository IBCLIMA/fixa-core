import { Clock, MessageSquare, Phone, Wrench, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function PendienteAprobacionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-amber-50">
          <Clock className="h-10 w-10 text-amber-500" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Estamos preparando tu cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Tu registro se ha recibido correctamente. Nuestro equipo revisará tu solicitud y activará tu cuenta en las próximas horas.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-stone-200/60 p-5 space-y-3 text-left shadow-sm">
          <p className="text-sm font-bold">¿Qué pasa ahora?</p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-sm text-stone-600">Tu registro se ha completado correctamente</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-stone-600">Estamos revisando tu solicitud</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-stone-200 mt-0.5 shrink-0" />
              <p className="text-sm text-stone-400">Recibirás acceso a los 14 días de prueba gratuita</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-stone-700">¿Quieres acelerar la activación?</p>
          <a href="https://wa.me/34611433218?text=Hola%2C%20acabo%20de%20registrarme%20en%20FIXA%20y%20quiero%20activar%20mi%20cuenta" target="_blank" className="block">
            <Button size="lg" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-500 font-bold h-12">
              <MessageSquare className="mr-2 h-4 w-4" />Escríbenos por WhatsApp
            </Button>
          </a>
          <a href="tel:+34611433218" className="block">
            <Button size="lg" variant="outline" className="w-full rounded-full h-12 font-bold">
              <Phone className="mr-2 h-4 w-4" />Llamar al 611 433 218
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
          <Wrench className="h-3 w-3" />
          <span>FIXA by Ibañez Clima</span>
          <span>·</span>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
