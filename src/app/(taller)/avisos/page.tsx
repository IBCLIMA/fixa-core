import { Bell, MessageSquare, Check, Plus, RefreshCw, Car, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAvisos, getClientesInactivos } from "../actions/avisos";
import { AvisosActions } from "./avisos-actions";
import { formatWhatsAppUrl } from "@/lib/utils";

const tipoLabels: Record<string, string> = {
  itv: "ITV", revision_km: "Revisión km", aceite: "Aceite",
  neumaticos: "Neumáticos", frenos: "Frenos", personalizado: "Personalizado",
};

const tipoColors: Record<string, string> = {
  itv: "bg-red-100 text-red-700", revision_km: "bg-blue-100 text-blue-700",
  aceite: "bg-amber-100 text-amber-700", neumaticos: "bg-violet-100 text-violet-700",
  frenos: "bg-brand-100 text-brand-700", personalizado: "bg-zinc-100 text-zinc-700",
};

export default async function AvisosPage() {
  const [avisosList, clientesInactivos] = await Promise.all([
    getAvisos(),
    getClientesInactivos().catch(() => []),
  ]);
  const pendientes = avisosList.filter((a) => !a.enviado);
  const enviados = avisosList.filter((a) => a.enviado);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight">Avisos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">ITVs proximas y mantenimientos pendientes.</p>
        </div>
        <AvisosActions />
      </div>

      {/* Pendientes */}
      {pendientes.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Pendientes de envío</p>
          <div className="space-y-2">
            {pendientes.map((a) => (
              <Card key={a.id} className="border-amber-200 bg-amber-50/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                        <Bell className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-[10px] ${tipoColors[a.tipo] || ""}`}>{tipoLabels[a.tipo]}</Badge>
                          <span className="text-sm font-bold">{a.matricula}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.clienteNombre}{a.descripcion ? ` · ${a.descripcion}` : ""}
                        </p>
                      </div>
                    </div>
                    {a.clienteTelefono && (
                      <a
                        href={formatWhatsAppUrl(a.clienteTelefono, `Hola ${a.clienteNombre?.split(" ")[0]}, te recordamos que ${a.descripcion || `tu vehículo ${a.matricula} necesita atención`}. ¿Te reservamos cita? ¡Un saludo!`)}
                        target="_blank"
                        className="flex h-11 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shrink-0"
                      >
                        <MessageSquare className="h-3 w-3" />Enviar
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Clientes inactivos — oportunidad de reactivación */}
      {clientesInactivos.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Clientes que no vienen hace más de un año ({clientesInactivos.length})
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Un mensaje amable recupera clientes: revisión, cambio de aceite o pre-ITV.
          </p>
          <div className="space-y-2">
            {clientesInactivos.map((c) => {
              const meses = Math.floor((Date.now() - new Date(c.ultimaVisita).getTime()) / (30 * 86400000));
              return (
                <Card key={c.clienteId} className="border-violet-200 bg-violet-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/clientes/${c.clienteId}`} className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                          <UserX className="h-4 w-4 text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{c.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            Última visita hace {meses} meses · {c.numOrdenes} {Number(c.numOrdenes) === 1 ? "orden" : "órdenes"}
                          </p>
                        </div>
                      </Link>
                      {c.telefono && (
                        <a
                          href={formatWhatsAppUrl(
                            c.telefono,
                            `Hola ${c.nombre?.split(" ")[0]}, ¡cuánto tiempo! Te escribimos del taller. ¿Cómo va el coche? Si le toca revisión, cambio de aceite o la ITV, dínoslo y te buscamos hueco esta semana. ¡Un saludo!`
                          )}
                          target="_blank"
                          className="flex h-11 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-white text-xs font-bold hover:bg-violet-500 transition-colors shrink-0"
                        >
                          <MessageSquare className="h-3 w-3" />Contactar
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {avisosList.length === 0 && clientesInactivos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-bold">Sin avisos pendientes</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            FIXA detecta automaticamente las ITVs proximas a vencer de tus vehiculos registrados. Tambien puedes crear avisos personalizados de mantenimiento (aceite, neumaticos, frenos).
          </p>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5 justify-center">
            <Car className="h-3.5 w-3.5" />
            Registra vehiculos con fecha de ITV para activar los avisos automaticos.
          </p>
        </div>
      )}

      {/* Enviados */}
      {enviados.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Enviados</p>
          <div className="space-y-2">
            {enviados.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{tipoLabels[a.tipo]}</Badge>
                    <span className="text-sm font-medium">{a.matricula}</span>
                    <span className="text-xs text-muted-foreground">{a.clienteNombre}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-auto">
                  {a.fechaEnvio ? new Date(a.fechaEnvio).toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
