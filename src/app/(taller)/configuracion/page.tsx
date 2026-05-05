import { Settings, Shield, Download, FileText, Database } from "lucide-react";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTallerIdFromAuth } from "@/lib/auth";
import { ConfigForm } from "./config-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ConfiguracionPage() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const taller = await db.query.talleres.findFirst({
    where: eq(talleres.id, tallerId),
  });

  if (!taller) return <p>Error cargando configuración</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Datos del taller, seguridad y privacidad</p>
      </div>

      <ConfigForm taller={taller} />

      {/* Seguridad y datos */}
      <Card>
        <CardHeader>
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
        <CardHeader>
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
    </div>
  );
}
