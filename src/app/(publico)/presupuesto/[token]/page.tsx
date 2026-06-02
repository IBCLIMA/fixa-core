import { notFound } from "next/navigation";
import { Car, FileText } from "lucide-react";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDb } from "@/db";
import {
  presupuestos,
  lineasPresupuesto,
  vehiculos,
  clientes,
  talleres,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { AccionesPresupuestoPublico } from "./acciones";

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

export default async function PresupuestoPublicoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const db = getDb();

  const [presupuesto] = await db
    .select()
    .from(presupuestos)
    .where(eq(presupuestos.tokenPublico, token))
    .limit(1);

  if (!presupuesto) return notFound();

  const lineas = await db
    .select()
    .from(lineasPresupuesto)
    .where(eq(lineasPresupuesto.presupuestoId, presupuesto.id));

  const [vehiculo] = await db
    .select()
    .from(vehiculos)
    .where(eq(vehiculos.id, presupuesto.vehiculoId));

  const [cliente] = await db
    .select()
    .from(clientes)
    .where(eq(clientes.id, presupuesto.clienteId));

  const [taller] = await db
    .select()
    .from(talleres)
    .where(eq(talleres.id, presupuesto.tallerId));

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

  const canRespond = presupuesto.estado === "enviado";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 no-print">
        <div className="mx-auto max-w-lg flex items-center gap-2">
          <FixaLogo size="sm" />
          <span className="text-xs text-muted-foreground ml-1">
            Presupuesto
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Taller + numero */}
        <div className="text-center space-y-3">
          <Badge
            className={`text-sm px-4 py-1.5 ${estadoColors[presupuesto.estado]}`}
          >
            {estadoLabels[presupuesto.estado]}
          </Badge>
          {taller && (
            <h2 className="text-lg font-bold">{taller.nombre}</h2>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight">
            Presupuesto PT-{presupuesto.numero}
          </h1>
          <p className="text-sm text-muted-foreground">
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

        {/* Cliente + vehiculo */}
        <Card>
          <CardContent className="p-4 space-y-3">
            {cliente && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Cliente
                </p>
                <p className="text-sm font-bold">{cliente.nombre}</p>
              </div>
            )}
            {vehiculo && (
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-bold text-lg tracking-wider">
                    {vehiculo.matricula}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehiculo.marca} {vehiculo.modelo}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lineas */}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              Detalle
            </p>
            {lineas.length > 0 ? (
              <div className="space-y-2">
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
                          {Number(linea.cantidad)} x{" "}
                          {Number(linea.precioUnitario).toFixed(2)}EUR
                          {Number(linea.descuentoPct || 0) > 0 &&
                            ` (-${linea.descuentoPct}%)`}
                          {" - IVA "}
                          {linea.ivaPct}%
                        </p>
                      </div>
                      <span className="text-sm font-bold">
                        {base.toFixed(2)}EUR
                      </span>
                    </div>
                  );
                })}

                <Separator className="my-3" />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Base imponible
                    </span>
                    <span>{totalBase.toFixed(2)}EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA</span>
                    <span>{totalIva.toFixed(2)}EUR</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-1">
                    <span>Total</span>
                    <span>{totalFinal.toFixed(2)}EUR</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Sin lineas
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notas */}
        {presupuesto.notas && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Notas
              </p>
              <p className="text-sm">{presupuesto.notas}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {canRespond && (
          <AccionesPresupuestoPublico
            presupuestoId={presupuesto.id}
            token={token}
          />
        )}

        {presupuesto.estado === "aceptado" && (
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-bold text-emerald-800">
                Presupuesto aceptado
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                El taller procedera con la reparacion.
              </p>
            </CardContent>
          </Card>
        )}

        {presupuesto.estado === "rechazado" && (
          <Card className="border-red-200 bg-red-50/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-bold text-red-800">
                Presupuesto rechazado
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center no-print">
          <p className="text-xs text-muted-foreground">Powered by FIXA</p>
        </div>
      </main>
    </div>
  );
}
