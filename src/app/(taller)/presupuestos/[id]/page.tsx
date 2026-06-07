import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Car, User, FileText, MessageSquare, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPresupuesto } from "../../actions/presupuestos";
import { getPrecioHora } from "../../actions/ordenes";
import { PrintButton } from "../../ordenes/[id]/print-button";
import { CambiarEstadoPresupuesto } from "./cambiar-estado-presupuesto";
import { LineasPresupuesto } from "./lineas-presupuesto";
import { AgregarLineaPresupuesto } from "./agregar-linea-presupuesto";
import { TemplateSelectorPresupuesto } from "./template-selector-presupuesto";
import { formatWhatsAppUrl } from "@/lib/utils";

const estadoLabels: Record<string, string> = {
  borrador: "Borrador",
  enviado: "Enviado",
  aceptado: "Aceptado",
  rechazado: "Rechazado",
  expirado: "Expirado",
};

const estadoColors: Record<string, string> = {
  borrador: "bg-zinc-100 text-zinc-700",
  enviado: "bg-blue-100 text-blue-700",
  aceptado: "bg-emerald-100 text-emerald-700",
  rechazado: "bg-red-100 text-red-700",
  expirado: "bg-zinc-100 text-zinc-400",
};

export default async function PresupuestoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presupuesto = await getPresupuesto(id);
  if (!presupuesto) return notFound();

  const lineas = presupuesto.lineas || [];
  const precioHora = await getPrecioHora().catch(() => 0);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const publicUrl = `${appUrl}/presupuesto/${presupuesto.tokenPublico}`;

  return (
    <div id="presupuesto-detail-container" className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/presupuestos">
          <Button variant="ghost" size="icon" className="rounded-full mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight">
              PT-{presupuesto.numero}
            </h1>
            <Badge className={estadoColors[presupuesto.estado]}>
              {estadoLabels[presupuesto.estado]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Creado:{" "}
            {new Date(presupuesto.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {presupuesto.validezDias && (
              <> &middot; Validez: {presupuesto.validezDias} dias</>
            )}
          </p>
        </div>
      </div>

      {/* Taller info (for print) */}
      {presupuesto.taller && (
        <div className="print-only hidden print:block text-center mb-6">
          <h2 className="text-xl font-extrabold">{presupuesto.taller.nombre}</h2>
          {presupuesto.taller.cif && (
            <p className="text-sm text-muted-foreground">CIF: {presupuesto.taller.cif}</p>
          )}
          {presupuesto.taller.direccion && (
            <p className="text-sm text-muted-foreground">{presupuesto.taller.direccion}</p>
          )}
          {presupuesto.taller.telefono && (
            <p className="text-sm text-muted-foreground">{presupuesto.taller.telefono}</p>
          )}
        </div>
      )}

      {/* Estado */}
      <Card className="no-print">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cambiar estado</CardTitle>
        </CardHeader>
        <CardContent>
          <CambiarEstadoPresupuesto
            presupuestoId={presupuesto.id}
            estadoActual={presupuesto.estado}
          />
        </CardContent>
      </Card>

      {/* Info del vehiculo y cliente */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Car className="h-4 w-4 text-blue-600" />
              </div>
              <p className="font-bold">Vehiculo</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-lg tracking-wider">
                {presupuesto.vehiculo?.matricula}
              </p>
              <p className="text-muted-foreground">
                {[
                  presupuesto.vehiculo?.marca,
                  presupuesto.vehiculo?.modelo,
                  presupuesto.vehiculo?.anio,
                ]
                  .filter(Boolean)
                  .join(" - ")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
                <User className="h-4 w-4 text-brand" />
              </div>
              <p className="font-bold">Cliente</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-bold">{presupuesto.cliente?.nombre}</p>
              {presupuesto.cliente?.telefono && (
                <p className="text-muted-foreground">
                  {presupuesto.cliente.telefono}
                </p>
              )}
              {presupuesto.cliente?.email && (
                <p className="text-muted-foreground">
                  {presupuesto.cliente.email}
                </p>
              )}
              {presupuesto.cliente?.nif && (
                <p className="text-muted-foreground">
                  NIF: {presupuesto.cliente.nif}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 no-print">
        <a href={`/api/presupuestos/${presupuesto.id}/pdf`} target="_blank">
          <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white">
            <Printer className="mr-1.5 h-4 w-4" />Descargar PDF
          </Button>
        </a>
        <PrintButton />
        {presupuesto.cliente?.telefono && (
          <a
            href={formatWhatsAppUrl(
              presupuesto.cliente.telefono,
              `Hola ${presupuesto.cliente.nombre.split(" ")[0]}, te enviamos el presupuesto PT-${presupuesto.numero} para tu vehiculo ${presupuesto.vehiculo?.matricula || ""}. Puedes verlo aqui: ${publicUrl}`
            )}
            target="_blank"
          >
            <Button variant="outline" className="rounded-full">
              <MessageSquare className="mr-1.5 h-4 w-4" />
              Enviar por WhatsApp
            </Button>
          </a>
        )}
        {presupuesto.ordenId && (
          <Link href={`/ordenes/${presupuesto.ordenId}`}>
            <Button variant="outline" className="rounded-full">
              <FileText className="mr-1.5 h-4 w-4" />
              Ver orden
            </Button>
          </Link>
        )}
      </div>

      {/* Lineas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Lineas del presupuesto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineasPresupuesto presupuestoId={presupuesto.id} lineas={lineas} />

          <div className="flex gap-2 mt-4 no-print">
            <div className="flex-1">
              <AgregarLineaPresupuesto presupuestoId={presupuesto.id} precioHora={precioHora} />
            </div>
            <TemplateSelectorPresupuesto presupuestoId={presupuesto.id} />
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      {presupuesto.notas && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Notas
            </p>
            <p className="text-sm">{presupuesto.notas}</p>
          </CardContent>
        </Card>
      )}

      {/* Public link */}
      <div className="no-print">
        <p className="text-xs text-muted-foreground">
          Enlace publico del presupuesto: {publicUrl}
        </p>
      </div>
    </div>
  );
}
