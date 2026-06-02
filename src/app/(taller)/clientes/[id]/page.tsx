import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, FileText, Car, Plus, ClipboardList, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { clientes, vehiculos, ordenesTrabajo } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NuevoVehiculoDialog } from "./nuevo-vehiculo-dialog";
import { EditarClienteDialog } from "./editar-cliente-dialog";
import { EditarVehiculoDialog } from "./editar-vehiculo-dialog";
import { VehicleTimeline } from "./vehicle-timeline";
import { PrintButton } from "./print-button";
import { estadoLabels, estadoColors } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";

export default async function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const cliente = await db.query.clientes.findFirst({
    where: and(eq(clientes.id, id), eq(clientes.tallerId, tallerId)),
  });
  if (!cliente) return notFound();

  const vehiculosList = await db
    .select()
    .from(vehiculos)
    .where(and(eq(vehiculos.clienteId, id), eq(vehiculos.tallerId, tallerId)));

  // Historial de órdenes por vehículo
  const ordenes = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      estado: ordenesTrabajo.estado,
      descripcionCliente: ordenesTrabajo.descripcionCliente,
      fechaEntrada: ordenesTrabajo.fechaEntrada,
      vehiculoId: ordenesTrabajo.vehiculoId,
      kmEntrada: ordenesTrabajo.kmEntrada,
      importeTotal: ordenesTrabajo.importeTotal,
      matricula: vehiculos.matricula,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .where(eq(ordenesTrabajo.clienteId, id))
    .orderBy(desc(ordenesTrabajo.createdAt));

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/clientes">
          <Button variant="ghost" size="icon" className="rounded-full mt-1"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight">{cliente.nombre}</h1>
            <EditarClienteDialog cliente={cliente} />
            <PrintButton />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
            {cliente.telefono && (
              <a href={`tel:${cliente.telefono}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Phone className="h-3.5 w-3.5" />{cliente.telefono}
              </a>
            )}
            {cliente.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{cliente.email}</span>}
            {cliente.nif && <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{cliente.nif}</span>}
            {cliente.direccion && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{cliente.direccion}</span>}
          </div>
          {/* WhatsApp */}
          {cliente.telefono && (
            <div className="mt-2 no-print">
              <a
                href={formatWhatsAppUrl(cliente.telefono, `Hola ${cliente.nombre.split(" ")[0]}, te escribimos desde el taller.`)}
                target="_blank"
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-emerald-600 px-3 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
              >
                <MessageSquare className="h-3 w-3" />WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {cliente.notas && (
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">{cliente.notas}</p></CardContent></Card>
      )}

      {/* Vehículos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2"><Car className="h-5 w-5 text-muted-foreground" />Vehículos ({vehiculosList.length})</h2>
          <span className="no-print"><NuevoVehiculoDialog clienteId={id} /></span>
        </div>

        {vehiculosList.length === 0 ? (
          <Card><CardContent className="p-6 text-center"><Car className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Sin vehículos registrados</p></CardContent></Card>
        ) : (
          <div className="space-y-3">
            {vehiculosList.map((v) => {
              const vehiculoOrdenes = ordenes.filter((o) => o.vehiculoId === v.id);
              return (
                <Card key={v.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="font-bold text-lg tracking-wider truncate">{v.matricula}</p>
                        <EditarVehiculoDialog vehiculo={v} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground truncate">
                          {[v.marca, v.modelo, v.anio].filter(Boolean).join(" · ")}
                          {v.color ? ` · ${v.color}` : ""}
                          {v.combustible ? ` · ${v.combustible}` : ""}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-2 shrink-0">
                        {v.km && <p className="text-xs text-muted-foreground">{v.km.toLocaleString("es-ES")} km</p>}
                        {v.fechaItv && (
                          <Badge variant="outline" className="text-xs">
                            ITV: {new Date(v.fechaItv).toLocaleDateString("es-ES")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Historial de órdenes - Timeline */}
                    {vehiculoOrdenes.length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <p className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                          <ClipboardList className="h-3 w-3" />Historial ({vehiculoOrdenes.length} orden{vehiculoOrdenes.length !== 1 ? "es" : ""})
                        </p>
                        <VehicleTimeline ordenes={vehiculoOrdenes} />
                      </>
                    )}

                    {/* Crear orden para este vehículo */}
                    <div className="mt-3">
                      <Link href={`/ordenes/nueva?clienteId=${id}&vehiculoId=${v.id}`}>
                        <Button size="sm" variant="outline" className="rounded-full text-xs">
                          <Plus className="mr-1 h-3 w-3" />Nueva orden para {v.matricula}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Resumen de órdenes totales */}
      {ordenes.length > 0 && (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {ordenes.length} orden{ordenes.length !== 1 ? "es" : ""} en total · {ordenes.filter((o) => !["entregado", "cancelado"].includes(o.estado)).length} activa{ordenes.filter((o) => !["entregado", "cancelado"].includes(o.estado)).length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
