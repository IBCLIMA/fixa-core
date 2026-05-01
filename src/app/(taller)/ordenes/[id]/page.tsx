import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Car, User, Clock, Hash, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrden } from "../../actions/ordenes";
import { CambiarEstadoButtons } from "./cambiar-estado";
import { AgregarLineaForm } from "./agregar-linea";

const estadoLabels: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "En diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esperando recambio",
  listo: "Listo para entregar",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const estadoColors: Record<string, string> = {
  recibido: "bg-zinc-100 text-zinc-700",
  diagnostico: "bg-blue-100 text-blue-700",
  presupuestado: "bg-amber-100 text-amber-700",
  aprobado: "bg-emerald-100 text-emerald-700",
  en_reparacion: "bg-orange-100 text-orange-700",
  esperando_recambio: "bg-red-100 text-red-700",
  listo: "bg-emerald-100 text-emerald-800",
  entregado: "bg-zinc-100 text-zinc-500",
  cancelado: "bg-zinc-100 text-zinc-400",
};

export default async function OrdenDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orden = await getOrden(id);
  if (!orden) return notFound();

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
    <div className="space-y-6 max-w-3xl">
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

      {/* Estado */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cambiar estado</CardTitle>
        </CardHeader>
        <CardContent>
          <CambiarEstadoButtons ordenId={orden.id} estadoActual={orden.estado} />
        </CardContent>
      </Card>

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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
                <User className="h-4 w-4 text-brand" />
              </div>
              <p className="font-bold">Cliente</p>
            </div>
            <div className="space-y-1 text-sm">
              <Link
                href={`/clientes/${orden.cliente?.id}`}
                className="font-bold text-brand hover:underline"
              >
                {orden.cliente?.nombre}
              </Link>
              {orden.cliente?.telefono && (
                <p className="text-muted-foreground">{orden.cliente.telefono}</p>
              )}
              {orden.cliente?.email && (
                <p className="text-muted-foreground">{orden.cliente.email}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descripción */}
      {(orden.descripcionCliente || orden.diagnostico) && (
        <Card>
          <CardContent className="p-4 space-y-3">
            {orden.descripcionCliente && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Descripción del cliente
                </p>
                <p className="text-sm">{orden.descripcionCliente}</p>
              </div>
            )}
            {orden.diagnostico && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Diagnóstico
                </p>
                <p className="text-sm">{orden.diagnostico}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
            <div className="space-y-2 mb-4">
              {lineas.map((linea) => {
                const base =
                  Number(linea.cantidad) *
                  Number(linea.precioUnitario) *
                  (1 - Number(linea.descuentoPct || 0) / 100);
                return (
                  <div
                    key={linea.id}
                    className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {linea.tipo === "mano_obra"
                            ? "M.O."
                            : linea.tipo === "recambio"
                              ? "Recambio"
                              : "Otros"}
                        </Badge>
                        <span className="text-sm font-medium">
                          {linea.descripcion}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {Number(linea.cantidad)} × {Number(linea.precioUnitario).toFixed(2)}€
                        {Number(linea.descuentoPct || 0) > 0 &&
                          ` (-${linea.descuentoPct}%)`}
                        {" · IVA "}
                        {linea.ivaPct}%
                      </p>
                    </div>
                    <span className="text-sm font-bold">
                      {base.toFixed(2)}€
                    </span>
                  </div>
                );
              })}

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

          <AgregarLineaForm ordenId={orden.id} />
        </CardContent>
      </Card>

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
