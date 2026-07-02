import { CONTACT_PHONE } from "@/lib/constants";
import { AlertTriangle, Phone, MessageSquare } from "lucide-react";
import { FixaLogo } from "@/components/ui/fixa-logo";
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
            <p className="text-sm font-bold">Tu plan</p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex justify-between rounded-lg bg-brand-50 border border-brand-200 p-3">
                <span className="font-medium">FIXA · todo incluido</span>
                <span className="font-bold">49€/mes + IVA</span>
              </div>
              <div className="flex justify-between rounded-lg bg-stone-50 p-3">
                <span className="font-medium">Anual <span className="text-xs text-emerald-600">(2 meses gratis)</span></span>
                <span className="font-bold">490€/año + IVA</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Sin permanencia. Un solo plan, sin recortes.</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <a href={`https://wa.me/${CONTACT_PHONE}?text=Hola%2C%20quiero%20activar%20mi%20plan%20de%20FIXA`} target="_blank" className="block">
            <Button size="lg" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-500 font-bold h-12">
              <MessageSquare className="mr-2 h-4 w-4" />Activar por WhatsApp
            </Button>
          </a>
          <a href={`tel:+${CONTACT_PHONE}`} className="block">
            <Button size="lg" variant="outline" className="w-full rounded-full h-12 font-bold">
              <Phone className="mr-2 h-4 w-4" />Llamar al 611 433 218
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FixaLogo size="xs" variant="icon" />
          <span>FIXA by Ibañez Clima</span>
          <span>·</span>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
