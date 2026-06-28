import { Settings, Shield, Download, FileText, Database, CalendarCheck, Star, Copy, Info, MessageSquare, Package } from "lucide-react";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConfigForm } from "./config-form";
import { CopyLinkBox } from "./copy-link-box";
import { PlantillasForm } from "./plantillas-form";
import { MensajesWhatsapp } from "./mensajes-whatsapp";
import { getPlantillas, type LineaPlantilla } from "../actions/plantillas";
import { getRecambistas } from "../actions/recambistas";
import { RecambistasForm } from "./recambistas-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";

export default async function ConfiguracionPage() {
  let tallerId: string;
  try {
    const auth = await requireRole(["admin"]);
    tallerId = auth.tallerId;
  } catch {
    redirect("/");
  }
  const db = getDb();

  const [taller] = await db.select().from(talleres).where(eq(talleres.id, tallerId));

  if (!taller) return <p>Error cargando configuración</p>;

  const plantillas = await getPlantillas().catch(() => []);
  const recambistasList = await getRecambistas().catch(() => []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Configuracion</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Datos del taller, seguridad y privacidad.</p>
      </div>

      <Tabs defaultValue="taller" className="gap-4">
        {/* Navegación de secciones — scroll horizontal en móvil */}
        <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList variant="line" className="w-max">
            <TabsTrigger value="taller">
              <Settings />
              Taller
            </TabsTrigger>
            <TabsTrigger value="plantillas">
              <FileText />
              Plantillas
            </TabsTrigger>
            <TabsTrigger value="recambistas">
              <Package />
              Recambistas
            </TabsTrigger>
            <TabsTrigger value="mensajes">
              <MessageSquare />
              Mensajes
            </TabsTrigger>
            <TabsTrigger value="seguridad">
              <Shield />
              Seguridad
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TALLER: datos del taller + cita online */}
        <TabsContent value="taller" className="space-y-6">
      <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-200 p-3">
        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Empieza rellenando el nombre de tu taller y el telefono. Estos datos apareceran en los presupuestos y comunicaciones con clientes.
        </p>
      </div>

      <ConfigForm taller={taller} />

      {/* Enlace de cita online */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-brand-600" />
            Cita online
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Comparte este enlace con tus clientes para que puedan solicitar cita desde el móvil.
          </p>
          <CopyLinkBox url={`${process.env.NEXT_PUBLIC_APP_URL || "https://fixataller.es"}/cita/${taller.id}`} />
          <div className="flex items-center gap-2">
            <Link href={`/cita/${taller.id}`} target="_blank">
              <Button variant="outline" size="sm" className="rounded-full text-xs shrink-0">
                Abrir
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Puedes añadir este enlace a tu web, WhatsApp Business, Google Maps o redes sociales.
          </p>
        </CardContent>
      </Card>
        </TabsContent>

        {/* PLANTILLAS: plantillas de servicio */}
        <TabsContent value="plantillas">
      <PlantillasForm
        plantillasIniciales={plantillas.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          lineas: p.lineas as LineaPlantilla[],
        }))}
      />
        </TabsContent>

        {/* RECAMBISTAS: proveedores de recambios guardados */}
        <TabsContent value="recambistas">
      <RecambistasForm recambistas={recambistasList} />
        </TabsContent>

        {/* MENSAJES: plantillas de WhatsApp */}
        <TabsContent value="mensajes">
      <MensajesWhatsapp mensajesActuales={(taller.mensajesWhatsapp as Record<string, string>) || {}} />
        </TabsContent>

        {/* SEGURIDAD: backups, privacidad y zona peligrosa */}
        <TabsContent value="seguridad" className="space-y-6">
      {/* Seguridad y datos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Seguridad y datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Backup */}
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Copia de seguridad</p>
                <p className="text-xs text-muted-foreground">Descarga todos tus datos en formato JSON</p>
              </div>
            </div>
            <a href="/api/export" download>
              <Button variant="outline" size="sm" className="rounded-full">
                <Download className="mr-1.5 h-3 w-3" />Descargar
              </Button>
            </a>
          </div>

          {/* Backups automáticos */}
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium">Backups automáticos</p>
                <p className="text-xs text-muted-foreground">Neon realiza backups automáticos diarios con 7 días de retención</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Activo</span>
          </div>

          {/* Cifrado */}
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium">Cifrado de datos</p>
                <p className="text-xs text-muted-foreground">TLS en tránsito + cifrado en reposo</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Activo</span>
          </div>

          {/* RGPD */}
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-violet-600" />
              <div>
                <p className="text-sm font-medium">Política de privacidad</p>
                <p className="text-xs text-muted-foreground">RGPD y LOPDGDD</p>
              </div>
            </div>
            <Link href="/privacidad" target="_blank">
              <Button variant="outline" size="sm" className="rounded-full">Ver</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Zona peligrosa */}
      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-red-700">Zona peligrosa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Eliminar todos los datos</p>
              <p className="text-xs text-muted-foreground">Esta acción es irreversible. Se eliminarán todos los clientes, vehículos, órdenes y citas.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full text-red-600 border-red-200 hover:bg-red-50" disabled>
              Eliminar datos
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
