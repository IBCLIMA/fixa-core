import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  FileText,
  Car,
  Plus,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCliente } from "../../actions/clientes";
import { NuevoVehiculoDialog } from "./nuevo-vehiculo-dialog";

const estadoColors: Record<string, string> = {
  recibido: "bg-zinc-500",
  diagnostico: "bg-blue-500",
  presupuestado: "bg-amber-500",
  aprobado: "bg-emerald-500",
  en_reparacion: "bg-brand",
  esperando_recambio: "bg-red-500",
  listo: "bg-emerald-600",
  entregado: "bg-zinc-400",
  cancelado: "bg-zinc-300",
};

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getCliente(id);
  if (!cliente) return notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon" className="rounded-full mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {cliente.nombre}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
            {cliente.telefono && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {cliente.telefono}
              </span>
            )}
            {cliente.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {cliente.email}
              </span>
            )}
            {cliente.nif && (
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {cliente.nif}
              </span>
            )}
            {cliente.direccion && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {cliente.direccion}
              </span>
            )}
          </div>
        </div>
      </div>

      {cliente.notas && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{cliente.notas}</p>
          </CardContent>
        </Card>
      )}

      {/* Vehículos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" />
            Vehículos
          </h2>
          <NuevoVehiculoDialog clienteId={id} />
        </div>

        {!cliente.vehiculos || cliente.vehiculos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Car className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Sin vehículos registrados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {cliente.vehiculos.map((v) => (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg tracking-wider">
                        {v.matricula}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {[v.marca, v.modelo, v.anio].filter(Boolean).join(" · ")}
                      </p>
                      {v.km && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {v.km.toLocaleString("es-ES")} km
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {v.fechaItv && (
                        <Badge variant="outline" className="text-xs">
                          ITV: {new Date(v.fechaItv).toLocaleDateString("es-ES")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Órdenes del vehículo */}
                  {v.ordenes && v.ordenes.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                        <ClipboardList className="h-3 w-3" />
                        Últimas órdenes
                      </p>
                      <div className="space-y-1.5">
                        {v.ordenes.map((o) => (
                          <Link
                            key={o.id}
                            href={`/ordenes/${o.id}`}
                            className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${estadoColors[o.estado] || "bg-zinc-400"}`}
                              />
                              <span className="text-xs font-medium">
                                OR-{o.numero}
                              </span>
                              {o.descripcionCliente && (
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {o.descripcionCliente}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(o.fechaEntrada).toLocaleDateString("es-ES")}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
