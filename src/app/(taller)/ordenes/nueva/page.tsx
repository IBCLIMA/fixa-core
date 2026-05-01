"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getClientes } from "../../actions/clientes";
import { crearOrden } from "../../actions/ordenes";
import { toast } from "sonner";

type ClienteConVehiculos = Awaited<ReturnType<typeof getClientes>>[number];

export default function NuevaOrdenPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<ClienteConVehiculos[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId);
  const vehiculos = clienteSeleccionado?.vehiculos || [];

  useEffect(() => {
    getClientes().then((data) => {
      setClientes(data);
      setLoadingClientes(false);
    });
  }, []);

  async function handleSubmit(formData: FormData) {
    if (!clienteId || !vehiculoId) {
      toast.error("Selecciona un cliente y un vehículo");
      return;
    }
    setLoading(true);
    try {
      const orden = await crearOrden({
        vehiculoId,
        clienteId,
        kmEntrada: formData.get("km")
          ? Number(formData.get("km"))
          : undefined,
        descripcionCliente:
          (formData.get("descripcion") as string) || undefined,
        fechaEstimada:
          (formData.get("fechaEstimada") as string) || undefined,
      });
      toast.success(`Orden OR-${orden.numero} creada`);
      router.push(`/ordenes/${orden.id}`);
    } catch {
      toast.error("Error al crear la orden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/ordenes">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Nueva orden de trabajo
        </h1>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cliente y vehículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <Select value={clienteId} onValueChange={(v) => { setClienteId(v); setVehiculoId(""); }}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder={loadingClientes ? "Cargando..." : "Seleccionar cliente"} />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                      {c.telefono ? ` — ${c.telefono}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clientes.length === 0 && !loadingClientes && (
                <p className="text-xs text-muted-foreground">
                  No hay clientes.{" "}
                  <Link href="/clientes" className="text-brand font-semibold hover:underline">
                    Crea uno primero
                  </Link>
                </p>
              )}
            </div>

            {clienteId && (
              <div className="space-y-1.5">
                <Label>Vehículo *</Label>
                <Select value={vehiculoId} onValueChange={setVehiculoId}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehiculos.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.matricula}
                        {v.marca ? ` — ${v.marca}` : ""}
                        {v.modelo ? ` ${v.modelo}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {vehiculos.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Este cliente no tiene vehículos registrados.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalles */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Detalles de la entrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="km">Km de entrada</Label>
              <Input
                id="km"
                name="km"
                type="number"
                placeholder="87.500"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descripcion">
                ¿Qué dice el cliente?
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Le hace ruido al frenar, pierde líquido..."
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fechaEstimada">Fecha estimada de entrega</Label>
              <Input
                id="fechaEstimada"
                name="fechaEstimada"
                type="date"
                className="h-11 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-base font-bold"
          disabled={loading || !clienteId || !vehiculoId}
        >
          {loading ? "Creando orden..." : "Crear orden de trabajo"}
        </Button>
      </form>
    </div>
  );
}
