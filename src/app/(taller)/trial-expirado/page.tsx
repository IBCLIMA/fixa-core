import { AlertTriangle, Phone, MessageSquare, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";

export default function TrialExpiradoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)" }}>
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Tu período de prueba ha terminado</h1>
          <p className="text-muted-foreground mt-2">
            Los 14 días de prueba gratuita de FIXA han expirado. Para seguir usando la app, contacta con nosotros para activar tu plan.
          </p>
        </div>

        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm font-bold">Planes disponibles</p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex justify-between rounded-lg bg-stone-50 p-3">
                <span className="font-medium">Básico</span>
                <span className="font-bold">29€/mes</span>
              </div>
              <div className="flex justify-between rounded-lg bg-orange-50 border border-orange-200 p-3">
                <span className="font-medium">Taller <span className="text-xs text-orange-600">(recomendado)</span></span>
                <span className="font-bold">49€/mes</span>
              </div>
              <div className="flex justify-between rounded-lg bg-stone-50 p-3">
                <span className="font-medium">Pro</span>
                <span className="font-bold">79€/mes</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Sin permanencia. IVA no incluido.</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <a href="https://wa.me/34611433218?text=Hola%2C%20quiero%20activar%20mi%20plan%20de%20FIXA" target="_blank" className="block">
            <Button size="lg" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-500 font-bold h-12">
              <MessageSquare className="mr-2 h-4 w-4" />Activar por WhatsApp
            </Button>
          </a>
          <a href="tel:+34611433218" className="block">
            <Button size="lg" variant="outline" className="w-full rounded-full h-12 font-bold">
              <Phone className="mr-2 h-4 w-4" />Llamar al 611 433 218
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Wrench className="h-3 w-3" />
          <span>FIXA by Ibañez Clima</span>
          <span>·</span>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
