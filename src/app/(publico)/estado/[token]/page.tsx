import { notFound } from "next/navigation";
import { Wrench, Car, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes, talleres, historialEstados } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const estadoLabels: Record<string, string> = {
  recibido: "Tu vehículo ha sido recibido en el taller",
  diagnostico: "Estamos diagnosticando tu vehículo",
  presupuestado: "Presupuesto preparado",
  aprobado: "Reparación aprobada",
  en_reparacion: "Tu vehículo está siendo reparado",
  esperando_recambio: "Esperando recambio para continuar",
  listo: "¡Tu vehículo está listo para recoger!",
  entregado: "Vehículo entregado",
  cancelado: "Orden cancelada",
};

const estadoColors: Record<string, string> = {
  recibido: "bg-zinc-100 text-zinc-700",
  diagnostico: "bg-blue-100 text-blue-700",
  presupuestado: "bg-amber-100 text-amber-700",
  aprobado: "bg-emerald-100 text-emerald-700",
  en_reparacion: "bg-orange-100 text-orange-700",
  esperando_recambio: "bg-red-100 text-red-700",
  listo: "bg-emerald-200 text-emerald-800",
  entregado: "bg-zinc-100 text-zinc-400",
  cancelado: "bg-zinc-100 text-zinc-300",
};

const estadoSteps = ["recibido", "diagnostico", "presupuestado", "aprobado", "en_reparacion", "listo", "entregado"];

export default async function PortalClientePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = getDb();

  // Buscar orden por ID (en producción usaríamos un token público)
  const orden = await db
    .select({
      id: ordenesTrabajo.id,
      numero: ordenesTrabajo.numero,
      estado: ordenesTrabajo.estado,
      descripcionCliente: ordenesTrabajo.descripcionCliente,
      fechaEntrada: ordenesTrabajo.fechaEntrada,
      fechaEstimada: ordenesTrabajo.fechaEstimada,
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      clienteNombre: clientes.nombre,
      tallerNombre: talleres.nombre,
      tallerTelefono: talleres.telefono,
    })
    .from(ordenesTrabajo)
    .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
    .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
    .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
    .where(eq(ordenesTrabajo.id, token))
    .limit(1);

  if (!orden[0]) return notFound();
  const o = orden[0];

  const currentStepIndex = estadoSteps.indexOf(o.estado);

  // Historial
  const historial = await db
    .select()
    .from(historialEstados)
    .where(eq(historialEstados.ordenId, o.id))
    .orderBy(desc(historialEstados.createdAt));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-lg flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand shadow-sm">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold">FIXA</span>
          <span className="text-xs text-muted-foreground ml-1">Estado de tu vehículo</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Estado actual */}
        <div className="text-center space-y-3">
          <Badge className={`text-sm px-4 py-1.5 ${estadoColors[o.estado]}`}>
            OR-{o.numero}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {estadoLabels[o.estado]}
          </h1>
          {o.estado === "listo" && (
            <p className="text-emerald-600 font-semibold">
              Puedes pasar a recogerlo cuando quieras
            </p>
          )}
        </div>

        {/* Progreso */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {estadoSteps.slice(0, -1).map((step, i) => {
                const isActive = i <= currentStepIndex;
                const isCurrent = step === o.estado;
                return (
                  <div key={step} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`h-3 w-3 rounded-full ${isActive ? (isCurrent ? "bg-brand ring-4 ring-brand/20" : "bg-brand") : "bg-muted"}`} />
                    {i < estadoSteps.length - 2 && (
                      <div className={`h-0.5 w-full ${i < currentStepIndex ? "bg-brand" : "bg-muted"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info vehículo */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-bold text-lg tracking-wider">{o.matricula}</p>
                <p className="text-sm text-muted-foreground">{o.marca} {o.modelo}</p>
              </div>
            </div>
            {o.descripcionCliente && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-bold text-muted-foreground mb-1">Motivo</p>
                <p className="text-sm">{o.descripcionCliente}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Entrada: {new Date(o.fechaEntrada).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </CardContent>
        </Card>

        {/* Historial */}
        {historial.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground mb-3">Historial</p>
              <div className="space-y-2">
                {historial.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                      <span>{estadoLabels[h.estadoNuevo] || h.estadoNuevo}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(h.createdAt).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacto taller */}
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <p className="text-sm font-bold">{o.tallerNombre}</p>
            {o.tallerTelefono && (
              <a href={`tel:${o.tallerTelefono}`} className="text-sm text-brand font-semibold hover:underline">
                {o.tallerTelefono}
              </a>
            )}
            <p className="text-xs text-muted-foreground">Powered by FIXA</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
