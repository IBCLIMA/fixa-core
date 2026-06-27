"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronsUpDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import { getClientes } from "../../actions/clientes";
import { crearOrden } from "../../actions/ordenes";
import { toast } from "sonner";
import { FichaScanner } from "./ficha-scanner";
import { VoiceRecorder } from "@/components/voice-recorder";
import { cn } from "@/lib/utils";

type ClienteConVehiculos = Awaited<ReturnType<typeof getClientes>>[number];

export default function NuevaOrdenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientes, setClientes] = useState<ClienteConVehiculos[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [descripcion, setDescripcion] = useState("");
  const [tipoIntervencion, setTipoIntervencion] = useState<string[]>([]);
  const [clienteOpen, setClienteOpen] = useState(false);
  const [vehiculoOpen, setVehiculoOpen] = useState(false);

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId);
  const vehiculos = clienteSeleccionado?.vehiculos || [];

  useEffect(() => {
    getClientes().then((data) => {
      setClientes(data);
      setLoadingClientes(false);

      // Pre-select client and vehicle from query params
      const qClienteId = searchParams.get("clienteId");
      const qVehiculoId = searchParams.get("vehiculoId");
      if (qClienteId) {
        setClienteId(qClienteId);
        if (qVehiculoId) {
          setVehiculoId(qVehiculoId);
        }
      }
    });
  }, [searchParams]);

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
        motivoDeposito:
          (formData.get("motivoDeposito") as string) || "reparacion",
        tipoIntervencion: tipoIntervencion.length > 0 ? tipoIntervencion : undefined,
        observacionesEntrada:
          (formData.get("observacionesEntrada") as string) || undefined,
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

      <p className="text-sm text-muted-foreground flex items-start gap-1.5">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        Selecciona un cliente y su vehiculo, describe la averia y crea la orden. Tambien puedes escanear la ficha tecnica para rellenar datos automaticamente.
      </p>

      {/* Ficha scanner */}
      <FichaScanner
        onApply={(data) => {
          // Try to auto-match vehicle by matrícula
          if (data.matricula) {
            const normalizedScan = data.matricula.replace(/[\s-]/g, "").toUpperCase();
            for (const c of clientes) {
              const match = c.vehiculos?.find(
                (v) => v.matricula.replace(/[\s-]/g, "").toUpperCase() === normalizedScan
              );
              if (match) {
                setClienteId(c.id);
                setVehiculoId(match.id);
                toast.success(`Vehículo ${data.matricula} encontrado — ${c.nombre}`);
                return;
              }
            }
            toast.info(`Matrícula ${data.matricula} escaneada. No se encontró en la base de datos — selecciona el cliente y vehículo manualmente.`);
          }
        }}
      />

      <form action={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cliente y vehículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Cliente *</Label>
              <Popover open={clienteOpen} onOpenChange={setClienteOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clienteOpen}
                    className="w-full h-11 rounded-xl justify-between font-normal"
                  >
                    {loadingClientes
                      ? "Cargando..."
                      : clienteSeleccionado
                        ? `${clienteSeleccionado.nombre}${clienteSeleccionado.telefono ? ` — ${clienteSeleccionado.telefono}` : ""}`
                        : "Buscar cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar por nombre o teléfono..." />
                    <CommandList>
                      <CommandEmpty>No encontrado</CommandEmpty>
                      <CommandGroup>
                        {clientes.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={`${c.nombre} ${c.telefono || ""}`}
                            onSelect={() => {
                              setClienteId(c.id);
                              setVehiculoId("");
                              setClienteOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                clienteId === c.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {c.nombre}
                            {c.telefono ? ` — ${c.telefono}` : ""}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                <Popover open={vehiculoOpen} onOpenChange={setVehiculoOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={vehiculoOpen}
                      className="w-full h-11 rounded-xl justify-between font-normal"
                    >
                      {vehiculoId
                        ? (() => {
                            const v = vehiculos.find((v) => v.id === vehiculoId);
                            return v
                              ? `${v.matricula}${v.marca ? ` — ${v.marca}` : ""}${v.modelo ? ` ${v.modelo}` : ""}`
                              : "Seleccionar vehículo";
                          })()
                        : "Buscar vehículo..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar por matrícula, marca..." />
                      <CommandList>
                        <CommandEmpty>No encontrado</CommandEmpty>
                        <CommandGroup>
                          {vehiculos.map((v) => (
                            <CommandItem
                              key={v.id}
                              value={`${v.matricula} ${v.marca || ""} ${v.modelo || ""}`}
                              onSelect={() => {
                                setVehiculoId(v.id);
                                setVehiculoOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  vehiculoId === v.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {v.matricula}
                              {v.marca ? ` — ${v.marca}` : ""}
                              {v.modelo ? ` ${v.modelo}` : ""}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="descripcion">
                  ¿Qué dice el cliente?
                </Label>
                <VoiceRecorder
                  onTranscription={(text) => {
                    setDescripcion((prev) => (prev ? prev + " " + text : text));
                  }}
                />
              </div>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Le hace ruido al frenar, pierde líquido..."
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fechaEstimada" className="text-xs font-bold text-stone-500">Fecha estimada de entrega *</Label>
              <Input
                id="fechaEstimada"
                name="fechaEstimada"
                type="date"
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500">Motivo del depósito</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="motivoDeposito" value="reparacion" defaultChecked className="accent-brand-500" />
                  Reparación
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="motivoDeposito" value="presupuesto" className="accent-brand-500" />
                  Presupuesto
                </label>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500">Tipo de intervención</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "mecanica", label: "Mecánica" },
                  { value: "chapa", label: "Chapa" },
                  { value: "pintura", label: "Pintura" },
                  { value: "electricidad", label: "Electricidad" },
                  { value: "diagnostico", label: "Diagnóstico" },
                  { value: "mantenimiento", label: "Mantenimiento" },
                  { value: "pre_itv", label: "Pre-ITV" },
                  { value: "otro", label: "Otro" },
                ].map((tipo) => (
                  <label key={tipo.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tipoIntervencion.includes(tipo.value)}
                      onChange={(e) => {
                        setTipoIntervencion((prev) =>
                          e.target.checked
                            ? [...prev, tipo.value]
                            : prev.filter((t) => t !== tipo.value)
                        );
                      }}
                      className="accent-brand-500"
                    />
                    {tipo.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="observacionesEntrada" className="text-xs font-bold text-stone-500">Observaciones de entrada</Label>
              <Textarea
                id="observacionesEntrada"
                name="observacionesEntrada"
                placeholder="Golpe en puerta trasera derecha, arañazo en paragolpes..."
                rows={2}
                className="rounded-xl"
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
