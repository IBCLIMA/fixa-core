"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Car, ArrowRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { buscarPorMatricula, crearOrdenRapida, crearTodoRapido } from "./actions/rapida";
import { buscarClientes } from "./actions/busqueda";
import { toast } from "sonner";

type Resultado = Awaited<ReturnType<typeof buscarPorMatricula>>[number];
type ClienteMatch = { id: string; nombre: string; telefono: string | null };

export function EntradaRapida() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [seleccionado, setSeleccionado] = useState<Resultado | null>(null);
  const [creandoNuevo, setCreandoNuevo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [clientesMatch, setClientesMatch] = useState<ClienteMatch[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteMatch | null>(null);

  useEffect(() => {
    if (nombreCliente.length < 2 || clienteSeleccionado) { setClientesMatch([]); return; }
    const t = setTimeout(async () => {
      const res = await buscarClientes(nombreCliente);
      setClientesMatch(res);
    }, 300);
    return () => clearTimeout(t);
  }, [nombreCliente, clienteSeleccionado]);

  useEffect(() => {
    if (matricula.length < 2) { setResultados([]); return; }
    setBuscando(true);
    const t = setTimeout(async () => {
      const res = await buscarPorMatricula(matricula);
      setResultados(res);
      setBuscando(false);
    }, 300);
    return () => clearTimeout(t);
  }, [matricula]);

  async function handleCrearNuevo(formData: FormData) {
    setLoading(true);
    try {
      const orden = await crearTodoRapido({
        nombreCliente: formData.get("nombreCliente") as string,
        telefonoCliente: (formData.get("telefonoCliente") as string) || undefined,
        matricula: formData.get("matriculaNueva") as string,
        marca: (formData.get("marca") as string) || undefined,
        modelo: (formData.get("modelo") as string) || undefined,
        descripcionCliente: (formData.get("descripcionNuevo") as string) || undefined,
      });
      toast.success(`Orden OR-${orden.numero} creada`);
      setOpen(false);
      setMatricula("");
      setCreandoNuevo(false);
      router.push(`/ordenes/${orden.id}`);
    } catch {
      toast.error("Error al crear cliente y orden");
    } finally {
      setLoading(false);
    }
  }

  async function handleCrear(formData: FormData) {
    if (!seleccionado) return;
    setLoading(true);
    try {
      const orden = await crearOrdenRapida({
        vehiculoId: seleccionado.vehiculoId,
        clienteId: seleccionado.clienteId!,
        kmEntrada: formData.get("km") ? Number(formData.get("km")) : undefined,
        descripcionCliente: (formData.get("descripcion") as string) || undefined,
      });
      toast.success(`Orden OR-${orden.numero} creada`);
      setOpen(false);
      setMatricula("");
      setSeleccionado(null);
      router.push(`/ordenes/${orden.id}`);
    } catch {
      toast.error("Error al crear orden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setMatricula(""); setSeleccionado(null); setCreandoNuevo(false); setResultados([]); } }}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/25 transition-all">
          <Car className="mr-1.5 h-4 w-4" />Entrada rápida
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Entrada rápida por matrícula</DialogTitle>
        </DialogHeader>

        {!seleccionado ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                placeholder="Escribe la matrícula..."
                value={matricula}
                onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                className="pl-9 h-12 rounded-xl text-lg font-bold tracking-wider uppercase"
                autoFocus
              />
            </div>

            {resultados.length > 0 && (
              <div className="space-y-1">
                {resultados.map((r) => (
                  <button
                    key={r.vehiculoId}
                    onClick={() => setSeleccionado(r)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-stone-50 active:bg-stone-100 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Car className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold tracking-wider">{r.matricula}</p>
                      <p className="text-xs text-stone-500">{r.marca} {r.modelo} · {r.clienteNombre}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-300" />
                  </button>
                ))}
              </div>
            )}

            {matricula.length >= 2 && resultados.length === 0 && !buscando && !creandoNuevo && (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-stone-500">No se encontró la matrícula</p>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setCreandoNuevo(true)}
                >
                  <Plus className="mr-1.5 h-4 w-4" />Crear nuevo cliente y vehículo
                </Button>
              </div>
            )}

            {creandoNuevo && (
              <form action={handleCrearNuevo} className="space-y-3 border-t border-stone-100 pt-4">
                <p className="text-sm font-bold text-stone-700">Nuevo cliente y vehículo</p>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Nombre del cliente *</Label>
                  <Input name="nombreCliente" placeholder="Antonio García" required className="h-11 rounded-xl" autoFocus />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Teléfono</Label>
                  <Input name="telefonoCliente" placeholder="612 345 678" type="tel" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Matrícula *</Label>
                  <Input name="matriculaNueva" defaultValue={matricula} required className="h-11 rounded-xl font-bold tracking-wider uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-stone-500">Marca</Label>
                    <Input name="marca" placeholder="Seat" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-stone-500">Modelo</Label>
                    <Input name="modelo" placeholder="León" className="h-11 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">¿Qué le pasa?</Label>
                  <Textarea name="descripcionNuevo" placeholder="Le hace ruido al frenar, pierde líquido..." rows={2} className="rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 h-11 rounded-xl font-bold" disabled={loading}>
                    {loading ? "Creando..." : "Crear cliente + orden"}
                  </Button>
                  <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setCreandoNuevo(false)}>
                    Atrás
                  </Button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form action={handleCrear} className="space-y-4">
            <div className="rounded-xl bg-stone-50 p-4 space-y-1">
              <p className="text-lg font-bold tracking-wider">{seleccionado.matricula}</p>
              <p className="text-sm text-stone-500">{seleccionado.marca} {seleccionado.modelo}{seleccionado.anio ? ` · ${seleccionado.anio}` : ""}</p>
              <p className="text-sm text-stone-500">Cliente: {seleccionado.clienteNombre}</p>
              {seleccionado.km && <p className="text-xs text-stone-400">Último km: {seleccionado.km.toLocaleString("es-ES")}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500">Km de entrada</Label>
              <Input name="km" type="number" placeholder={seleccionado.km ? String(seleccionado.km) : "87500"} className="h-11 rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500">¿Qué le pasa?</Label>
              <Textarea name="descripcion" placeholder="Le hace ruido al frenar, pierde líquido..." rows={2} className="rounded-xl" autoFocus />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 h-11 rounded-xl font-bold" disabled={loading}>
                {loading ? "Creando..." : "Crear orden de trabajo"}
              </Button>
              <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setSeleccionado(null)}>
                Atrás
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
