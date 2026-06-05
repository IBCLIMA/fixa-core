import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Car, Clock, Hash, FileText, Printer, Send, AlertTriangle, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrden, enviarSolicitudResena, enviarInformeCliente, getMecanicos, getMaintenanceAlerts } from "../../actions/ordenes";
import { getDocumentoByOrden } from "../../actions/documentos";
import { AsignarMecanico } from "./asignar-mecanico";
import { CambiarEstadoButtons } from "./cambiar-estado";
import { AgregarLineaForm } from "./agregar-linea";
import { EditarDiagnostico } from "./editar-diagnostico";
import { CrearPresupuestoBtn } from "./crear-presupuesto-btn";
import { FotosOrden } from "./fotos-orden";
import { EliminarOrdenBtn } from "./eliminar-orden-btn";
import { PedirResenaBtn } from "./pedir-resena-btn";
import { EnviarInformeBtn } from "./enviar-informe-btn";
import { TemplateSelector } from "./template-selector";
import { InspeccionView } from "./inspeccion-view";
import { AveriasOcultas } from "./averias-ocultas";
import { DatosLegales } from "./datos-legales";
import { ClienteCard } from "./cliente-card";
import { SeguroChapa } from "./seguro-chapa";
import { LineasList } from "./lineas-list";
import { PrintButton } from "./print-button";
import { CobrarDialog } from "./cobrar-dialog";
import { estadoLabelsDetalle as estadoLabels, estadoColors } from "@/lib/constants";
import { formatWhatsAppUrl } from "@/lib/utils";
import { getUserRole } from "@/lib/auth";
import { getInspeccion } from "../../actions/inspecciones";

export default async function OrdenDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orden = await getOrden(id);
  if (!orden) return notFound();

  let rol: "admin" | "mecanico" | "recepcion" = "mecanico";
  let inspecciones: any[] = [];
  let mecanicos: any[] = [];
  let maintenanceAlerts: any[] = [];
  let documentoCobro: any = null;

  try {
    [rol, inspecciones, mecanicos, maintenanceAlerts, documentoCobro] = await Promise.all([
      getUserRole(),
      getInspeccion(id).catch(() => []),
      getMecanicos().catch(() => []),
      getMaintenanceAlerts(orden.vehiculoId, orden.kmEntrada).catch(() => []),
      getDocumentoByOrden(id).catch(() => null),
    ]);
  } catch (e) {
    console.error("Error loading order details:", e);
  }
  const isAdmin = rol === "admin";
  const canAssign = rol === "admin" || rol === "recepcion";

  const lineas = orden.lineas || [];
  const totalBase = lineas.reduce((sum, l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    return sum + qty * price * (1 - disc / 100);
  }, 0);
  const totalIva = lineas.reduce((sum, l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    const iva = Number(l.ivaPct || 21);
    const base = qty * price * (1 - disc / 100);
    return sum + base * (iva / 100);
  }, 0);
  const totalFinal = totalBase + totalIva;

  return (
    <div id="orden-detail-container" className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/ordenes">
          <Button variant="ghost" size="icon" className="rounded-full mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight">
              OR-{orden.numero}
            </h1>
            <Badge className={estadoColors[orden.estado]}>
              {estadoLabels[orden.estado]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Entrada:{" "}
            {new Date(orden.fechaEntrada).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Maintenance Alerts */}
      {maintenanceAlerts.length > 0 && (
        <div className="space-y-2">
          {maintenanceAlerts.map((alert) => (
            <div
              key={alert.tipo}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                alert.urgente
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              {alert.urgente ? (
                <CircleAlert className="h-4 w-4 shrink-0 text-red-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              )}
              <span>
                {alert.tipo}: {alert.kmDesdeUltimo.toLocaleString("es-ES")} km desde el ultimo (recomendado: {alert.kmRecomendado.toLocaleString("es-ES")} km)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Asignar mecánico */}
      {canAssign && (
        <Card className="no-print">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Asignar mecánico</CardTitle>
          </CardHeader>
          <CardContent>
            <AsignarMecanico
              ordenId={orden.id}
              asignadoActual={orden.asignadoA}
              mecanicos={mecanicos}
            />
            {orden.asignado && (
              <p className="text-xs text-muted-foreground mt-2">
                Asignado a: <span className="font-bold">{orden.asignado.nombre}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info del vehículo y cliente */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Car className="h-4 w-4 text-blue-600" />
              </div>
              <p className="font-bold">Vehículo</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-lg tracking-wider">
                {orden.vehiculo?.matricula}
              </p>
              <p className="text-muted-foreground">
                {[orden.vehiculo?.marca, orden.vehiculo?.modelo, orden.vehiculo?.anio]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {orden.kmEntrada && (
                <p className="text-muted-foreground">
                  Entrada: {orden.kmEntrada.toLocaleString("es-ES")} km
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <ClienteCard
          cliente={orden.cliente}
          matricula={orden.vehiculo?.matricula}
        />
      </div>

      {/* Descripción y diagnóstico */}
      <EditarDiagnostico
        ordenId={orden.id}
        diagnosticoActual={orden.diagnostico}
        descripcionActual={orden.descripcionCliente}
      />

      {/* Datos legales (RD 1457/1986) */}
      <DatosLegales
        ordenId={orden.id}
        fechaEstimada={orden.fechaEstimada}
        observacionesEntrada={orden.observacionesEntrada}
        renunciaPresupuesto={orden.renunciaPresupuesto}
        renunciaPiezas={orden.renunciaPiezas}
      />

      {/* Datos del seguro (chapa/pintura) */}
      <SeguroChapa
        ordenId={orden.id}
        tipoIntervencion={orden.tipoIntervencion}
        aseguradora={orden.aseguradora}
        numPoliza={orden.numPoliza}
        numSiniestro={orden.numSiniestro}
        numPeritaje={orden.numPeritaje}
        nombrePerito={orden.nombrePerito}
      />

      {/* Fotos */}
      <Card>
        <CardContent className="p-4">
          <FotosOrden ordenId={orden.id} fotos={orden.fotos || []} />
        </CardContent>
      </Card>

      {/* Inspección — solo mostrar si ya tiene datos */}
      {inspecciones.length > 0 && (
        <InspeccionView ordenId={orden.id} inspecciones={inspecciones} />
      )}

      {/* Averías ocultas */}
      {orden.estado !== "entregado" && orden.estado !== "cancelado" && (
        <AveriasOcultas
          ordenId={orden.id}
          averias={orden.averias || []}
          clienteTelefono={orden.cliente?.telefono}
        />
      )}

      {/* Cobro */}
      {(orden.estado === "listo" || orden.estado === "entregado") && lineas.length > 0 && (
        <Card className="no-print border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">
                  {documentoCobro ? "Cobro registrado" : "Cobrar al cliente"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {documentoCobro
                    ? `DOC-${String(documentoCobro.numero).padStart(4, "0")} - ${new Date(documentoCobro.createdAt).toLocaleDateString("es-ES")}`
                    : `Total: ${totalFinal.toFixed(2)}EUR`}
                </p>
              </div>
              <CobrarDialog
                ordenId={orden.id}
                totalFinal={totalFinal}
                clienteTelefono={orden.cliente?.telefono}
                clienteNombre={orden.cliente?.nombre}
                matricula={orden.vehiculo?.matricula}
                yaGenerado={!!documentoCobro}
                documentoId={documentoCobro?.id}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones */}
      <Card className="no-print">
        <CardContent className="p-4 space-y-3">
          {/* Primary actions */}
          <div className="flex flex-wrap gap-2">
            <a href={`/api/ordenes/${orden.id}/pdf`} target="_blank">
              <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white">
                <Printer className="mr-1.5 h-4 w-4" />Descargar OR (PDF)
              </Button>
            </a>
            <PrintButton />
          </div>

          {/* Secondary actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <a href={`/informe/${orden.tokenPublico || orden.id}`} target="_blank">
              <Button variant="outline" size="sm" className="rounded-full">
                <FileText className="mr-1.5 h-4 w-4" />Ver informe
              </Button>
            </a>
            <CrearPresupuestoBtn ordenId={orden.id} />
            {orden.cliente?.telefono && (
              <EnviarInformeBtn ordenId={orden.id} />
            )}
            {orden.estado === "entregado" && orden.cliente?.telefono && (
              <PedirResenaBtn ordenId={orden.id} />
            )}
            {isAdmin && (
              <div className="ml-auto">
                <EliminarOrdenBtn ordenId={orden.id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Líneas de trabajo */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Líneas de trabajo
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {lineas.length > 0 && (
            <div className="mb-4">
              <LineasList ordenId={orden.id} lineas={lineas} />

              <Separator className="my-3" />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base imponible</span>
                  <span>{totalBase.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA</span>
                  <span>{totalIva.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1">
                  <span>Total</span>
                  <span>{totalFinal.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <AgregarLineaForm ordenId={orden.id} />
            </div>
            <TemplateSelector ordenId={orden.id} />
          </div>
        </CardContent>
      </Card>

      {/* Cambiar estado */}
      <div className="no-print rounded-xl bg-muted/50 border border-border px-4 py-3 space-y-3">
        <CambiarEstadoButtons ordenId={orden.id} estadoActual={orden.estado} />
        {orden.cliente?.telefono && orden.tokenPublico && (
          <a
            href={formatWhatsAppUrl(
              orden.cliente.telefono,
              `Hola ${orden.cliente.nombre?.split(" ")[0] || ""},\n\nTe informamos del estado de tu ${orden.vehiculo?.marca || ""} ${orden.vehiculo?.modelo || ""} (${orden.vehiculo?.matricula || ""}).\n\nPuedes ver los detalles aquí:\n${process.env.NEXT_PUBLIC_APP_URL || "https://fixa.ibclima.com"}/estado/${orden.tokenPublico}\n\nSi tienes alguna duda, no dudes en contactarnos.\n\n¡Un saludo!`
            )}
            target="_blank"
            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-colors"
          >
            <Send className="h-4 w-4" />
            Enviar estado al cliente por WhatsApp
          </a>
        )}
      </div>

      {/* Historial */}
      {orden.historial && orden.historial.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Historial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orden.historial.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {h.estadoAnterior && (
                      <>
                        <Badge variant="outline" className="text-[10px]">
                          {estadoLabels[h.estadoAnterior]}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                      </>
                    )}
                    <Badge className={`text-[10px] ${estadoColors[h.estadoNuevo]}`}>
                      {estadoLabels[h.estadoNuevo]}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
