import { Bell, MessageSquare, Check, Plus, RefreshCw, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAvisos } from "../actions/avisos";
import { AvisosActions } from "./avisos-actions";

const tipoLabels: Record<string, string> = {
  itv: "ITV", revision_km: "Revisión km", aceite: "Aceite",
  neumaticos: "Neumáticos", frenos: "Frenos", personalizado: "Personalizado",
};

const tipoColors: Record<string, string> = {
  itv: "bg-red-100 text-red-700", revision_km: "bg-blue-100 text-blue-700",
  aceite: "bg-amber-100 text-amber-700", neumaticos: "bg-violet-100 text-violet-700",
  frenos: "bg-orange-100 text-orange-700", personalizado: "bg-zinc-100 text-zinc-700",
};

export default async function AvisosPage() {
  const avisosList = await getAvisos();
  const pendientes = avisosList.filter((a) => !a.enviado);
  const enviados = avisosList.filter((a) => a.enviado);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Avisos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""} de enviar
          </p>
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
                        href={`https://wa.me/34${a.clienteTelefono.replace(/\s/g, "")}?text=${encodeURIComponent(`Hola ${a.clienteNombre?.split(" ")[0]}, te recordamos que ${a.descripcion || `tu vehículo ${a.matricula} necesita atención`}. ¿Te reservamos cita? ¡Un saludo!`)}`}
                        target="_blank"
                        className="flex h-8 items-center gap-1.5 rounded-full bg-emerald-600 px-3 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shrink-0"
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

      {/* Estado vacío */}
      {avisosList.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-bold">Sin avisos</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Genera avisos automáticos de ITV o crea avisos personalizados para tus clientes
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
