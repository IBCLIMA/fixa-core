import { notFound } from "next/navigation";
import Image from "next/image";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import {
  ordenesTrabajo,
  vehiculos,
  clientes,
  talleres,
  lineasOrden,
  fotosOrden,
  inspeccionesOrden,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { Car, Wrench, Camera, AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react";

const estadoInspeccionLabel: Record<string, string> = {
  bien: "Correcto",
  atencion: "Necesita atención",
  urgente: "Urgente",
  no_aplica: "No aplica",
};

const estadoInspeccionColor: Record<string, string> = {
  bien: "bg-emerald-100 text-emerald-800",
  atencion: "bg-amber-100 text-amber-800",
  urgente: "bg-red-100 text-red-800",
  no_aplica: "bg-gray-100 text-gray-600",
};

const estadoInspeccionIcon: Record<string, typeof CheckCircle2> = {
  bien: CheckCircle2,
  atencion: AlertCircle,
  urgente: AlertTriangle,
  no_aplica: Info,
};

export default async function InformePublicoPage({
  params,
}: {
  params: Promise<{ ordenId: string }>;
}) {
  const { ordenId } = await params;
  const db = getDb();

  // Fetch order with related data
  const [orden] = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      estado: ordenesTrabajo.estado,
      descripcionCliente: ordenesTrabajo.descripcionCliente,
      diagnostico: ordenesTrabajo.diagnostico,
      kmEntrada: ordenesTrabajo.kmEntrada,
      fechaEntrada: ordenesTrabajo.fechaEntrada,
      fechaEntrega: ordenesTrabajo.fechaEntrega,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      anio: vehiculos.anio,
      km: vehiculos.km,
      clienteNombre: clientes.nombre,
      tallerNombre: talleres.nombre,
      tallerTelefono: talleres.telefono,
      tallerEmail: talleres.email,
      tallerDireccion: talleres.direccion,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
    .where(eq(ordenesTrabajo.tokenPublico, ordenId))
    .limit(1);

  if (!orden) return notFound();

  // Use the real order ID (not the public token) for sub-queries
  const realOrdenId = orden.id;

  // Fetch lines, photos, inspections in parallel
  const [lineas, fotos, inspecciones] = await Promise.all([
    db.select().from(lineasOrden).where(eq(lineasOrden.ordenId, realOrdenId)),
    db.select().from(fotosOrden).where(eq(fotosOrden.ordenId, realOrdenId)),
    db.select().from(inspeccionesOrden).where(eq(inspeccionesOrden.ordenId, realOrdenId)),
  ]);

  // Separate inspection items by status
  const itemsAtencion = inspecciones.filter(
    (i) => i.estado === "atencion" || i.estado === "urgente"
  );
  const itemsBien = inspecciones.filter((i) => i.estado === "bien");

  // Calculate next recommended service (6 months from delivery or now)
  const baseDate = orden.fechaEntrega ? new Date(orden.fechaEntrega) : new Date();
  const nextService = new Date(baseDate);
  nextService.setMonth(nextService.getMonth() + 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 print:border-none">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FixaLogo size="sm" />
            <span className="text-xs text-muted-foreground ml-1">
              Informe del vehículo
            </span>
          </div>
          <span className="text-xs text-muted-foreground print:hidden">
            OR-{orden.numero}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6 print:px-0 print:py-4">
        {/* Workshop header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {orden.tallerNombre}
          </h1>
          <div className="text-sm text-muted-foreground space-x-2">
            {orden.tallerTelefono && <span>{orden.tallerTelefono}</span>}
            {orden.tallerEmail && <span>· {orden.tallerEmail}</span>}
          </div>
          {orden.tallerDireccion && (
            <p className="text-xs text-muted-foreground">
              {orden.tallerDireccion}
            </p>
          )}
        </div>

        {/* Vehicle info */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  Vehículo
                </p>
                <p className="text-xl font-extrabold tracking-wider">
                  {orden.matricula}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Marca / Modelo</span>
                <p className="font-medium">
                  {[orden.marca, orden.modelo].filter(Boolean).join(" ") ||
                    "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Año</span>
                <p className="font-medium">{orden.anio || "-"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Kilometraje</span>
                <p className="font-medium">
                  {orden.kmEntrada
                    ? `${orden.kmEntrada.toLocaleString("es-ES")} km`
                    : orden.km
                      ? `${orden.km.toLocaleString("es-ES")} km`
                      : "-"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha entrada</span>
                <p className="font-medium">
                  {new Date(orden.fechaEntrada).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What was done */}
        {lineas.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <Wrench className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  Trabajos realizados
                </p>
              </div>
              <div className="space-y-2">
                {lineas.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {l.tipo === "mano_obra"
                            ? "M.O."
                            : l.tipo === "recambio"
                              ? "Recambio"
                              : "Otros"}
                        </Badge>
                        <span className="text-sm font-medium">
                          {l.descripcion}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis */}
        {orden.diagnostico && (
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                Diagnóstico
              </p>
              <p className="text-sm">{orden.diagnostico}</p>
            </CardContent>
          </Card>
        )}

        {/* Inspection results */}
        {inspecciones.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-4">
                Inspección del vehículo
              </p>
              <div className="space-y-2">
                {inspecciones
                  .filter((i) => i.estado !== "no_aplica")
                  .map((i) => {
                    const Icon = estadoInspeccionIcon[i.estado] || Info;
                    return (
                      <div
                        key={i.id}
                        className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0" />
                          <div>
                            <span className="text-sm font-medium">
                              {i.item}
                            </span>
                            {i.categoria && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({i.categoria})
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={`text-[10px] ${estadoInspeccionColor[i.estado]}`}
                        >
                          {estadoInspeccionLabel[i.estado]}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items needing attention */}
        {itemsAtencion.length > 0 && (
          <Card className="border-amber-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">
                    Requiere atención
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Estos elementos necesitan revisión o reparación
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {itemsAtencion.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between rounded-xl bg-amber-50/50 px-3 py-2.5"
                  >
                    <div>
                      <span className="text-sm font-medium">{i.item}</span>
                      {i.notas && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {i.notas}
                        </p>
                      )}
                    </div>
                    <Badge
                      className={`text-[10px] ${estadoInspeccionColor[i.estado]}`}
                    >
                      {estadoInspeccionLabel[i.estado]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photos */}
        {fotos.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                  <Camera className="h-5 w-5 text-violet-600" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  Fotos
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fotos.map((f) => (
                  <a
                    key={f.id}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-square rounded-xl overflow-hidden bg-muted"
                  >
                    <Image
                      src={f.url}
                      alt={f.descripcion || "Foto del vehículo"}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next recommended service */}
        <Card>
          <CardContent className="p-5 text-center space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Próxima revisión recomendada
            </p>
            <p className="text-lg font-extrabold">
              {nextService.toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              O cada 15.000 km, lo que ocurra primero
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2 pt-4 print:pt-2">
          <p className="text-xs text-muted-foreground">
            Informe generado por FIXA
          </p>
          <p className="text-xs text-muted-foreground">
            {orden.tallerNombre}
            {orden.tallerTelefono ? ` · ${orden.tallerTelefono}` : ""}
          </p>
        </div>
      </main>
    </div>
  );
}
