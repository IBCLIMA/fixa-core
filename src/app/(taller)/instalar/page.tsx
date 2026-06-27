import Link from "next/link";
import { ArrowLeft, Smartphone, Share, SquarePlus, Bell, Globe, MoreVertical, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Instalar FIXA en tu móvil" };

export default function InstalarPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Instala FIXA en tu móvil</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            30 segundos. Tendrás FIXA como una app: icono en la pantalla de inicio,
            pantalla completa y avisos al instante.
          </p>
        </div>
      </div>

      {/* iPhone */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold">iPhone / iPad</p>
              <p className="text-xs text-muted-foreground">Tiene que ser desde Safari</p>
            </div>
          </div>

          {/* Aviso Safari vs Chrome — la duda más común */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
            <TriangleAlert className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-900">
              <span className="font-bold">¿Estás en Chrome?</span> En el iPhone instalar apps así
              <span className="font-bold"> solo funciona en Safari</span> (lo impone Apple, no es cosa nuestra).
              Si abriste esto en Chrome: copia <span className="font-bold">fixataller.es</span>, ábrelo en
              <span className="font-bold"> Safari</span> y sigue los pasos.
            </p>
          </div>

          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">1</span>
              <p className="text-sm pt-1">
                Con <span className="font-bold">Safari</span>, entra en <span className="font-bold">fixataller.es</span> e inicia sesión.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">2</span>
              <p className="text-sm pt-1 flex items-center gap-1.5 flex-wrap">
                Pulsa el botón de compartir
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50"><Share className="h-3.5 w-3.5 text-blue-600" /></span>
                — el cuadrado con la flecha hacia arriba, abajo en el centro.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">3</span>
              <p className="text-sm pt-1 flex items-center gap-1.5 flex-wrap">
                Desliza hacia abajo en esa lista y toca
                <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold"><SquarePlus className="h-3.5 w-3.5" />Añadir a pantalla de inicio</span>
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">4</span>
              <p className="text-sm pt-1">
                Pulsa <span className="font-bold">Añadir</span> (arriba a la derecha). Ya tienes el icono de FIXA
                en tu pantalla de inicio — ábrela <span className="font-bold">desde ese icono</span>, no desde el navegador.
              </p>
            </li>
          </ol>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 flex items-start gap-2.5">
            <Bell className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800">
              <span className="font-bold">Después de instalarla</span>, abre FIXA desde el icono nuevo,
              pulsa la campana 🔔 y activa los avisos. En iPhone las notificaciones solo
              funcionan con la app instalada.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Android */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold">Android</p>
              <p className="text-xs text-muted-foreground">Desde Chrome — normalmente un solo toque</p>
            </div>
          </div>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">1</span>
              <p className="text-sm pt-1">
                Abre <span className="font-bold">fixataller.es</span> en <span className="font-bold">Chrome</span> e inicia sesión
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">2</span>
              <p className="text-sm pt-1">
                Si aparece el aviso <span className="font-bold">"Instalar FIXA"</span>, púlsalo y listo.
                Si no aparece, sigue al paso 3.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">3</span>
              <p className="text-sm pt-1 flex items-center gap-1.5 flex-wrap">
                Menú
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-stone-100"><MoreVertical className="h-3.5 w-3.5" /></span>
                (arriba a la derecha) →
                <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold">Añadir a pantalla de inicio</span>
              </p>
            </li>
          </ol>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 flex items-start gap-2.5">
            <Bell className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800">
              <span className="font-bold">Consejo:</span> tras instalar, abre FIXA, pulsa la campana 🔔
              y activa los avisos. Te vibrará el móvil cuando un cliente acepte un presupuesto.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        ¿Tu equipo también usa FIXA? Cada mecánico puede instalarla en su móvil y activar sus propios avisos.
      </p>
    </div>
  );
}
