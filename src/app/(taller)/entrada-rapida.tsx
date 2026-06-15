"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Car, ArrowRight, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { buscarPorMatricula, crearOrdenRapida, crearTodoRapido } from "./actions/rapida";
import { MarcaAutocomplete, ModeloAutocomplete } from "@/components/vehicle-autocomplete";
import { MatriculaScanner } from "@/components/matricula-scanner";
import { FichaScanner } from "./ordenes/nueva/ficha-scanner";
import type { VehicleOCRResult } from "@/lib/ocr-vehicle";
import { toast } from "sonner";

type Resultado = Awaited<ReturnType<typeof buscarPorMatricula>>[number];

export function EntradaRapida() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [seleccionado, setSeleccionado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busquedaHecha, setBusquedaHecha] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [marcaValue, setMarcaValue] = useState("");
  const [modeloValue, setModeloValue] = useState("");
  const [modelosSugeridos, setModelosSugeridos] = useState<string[]>([]);

  // Search when plate changes
  useEffect(() => {
    const cleanPlate = matricula.replace(/[\s\-]/g, "");
    if (cleanPlate.length < 3) { setResultados([]); setBusquedaHecha(false); return; }
    setBuscando(true);
    setBusquedaHecha(false);
    const t = setTimeout(async () => {
      const res = await buscarPorMatricula(cleanPlate);
      setResultados(res);
      setBuscando(false);
      setBusquedaHecha(true);
    }, 1000);
    return () => clearTimeout(t);
  }, [matricula]);

  function resetAll() {
    setMatricula(""); setSeleccionado(null); setResultados([]);
    setBusquedaHecha(false); setShowNewForm(false);
    setMarcaValue(""); setModeloValue(""); setModelosSugeridos([]);
  }

  // Ficha técnica escaneada → rellenar todos los campos del vehículo
  function handleFichaData(data: VehicleOCRResult) {
    if (data.matricula) setMatricula(data.matricula.replace(/[\s\-]/g, ""));
    if (data.marca) setMarcaValue(data.marca);
    if (data.modelo) setModeloValue(data.modelo);
  }

  // Vehicle NOT found → create everything
  async function handleCrearNuevo(formData: FormData) {
    setLoading(true);
    try {
      const orden = await crearTodoRapido({
        nombreCliente: formData.get("nombreCliente") as string,
        telefonoCliente: (formData.get("telefonoCliente") as string) || undefined,
        matricula: formData.get("matriculaNueva") as string,
        marca: (formData.get("marca") as string) || undefined,
        modelo: (formData.get("modelo") as string) || undefined,
        descripcionCliente: (formData.get("descripcion") as string) || undefined,
        fechaItv: (formData.get("fechaItv") as string) || undefined,
      });
      toast.success(`OR-${orden.numero} creada`);
      setOpen(false);
      resetAll();
      router.push(`/ordenes/${orden.id}`);
    } catch {
      toast.error("Error al crear");
    } finally {
      setLoading(false);
    }
  }

  // Vehicle found → just create order
  async function handleCrear(formData: FormData) {
    if (!seleccionado) return;
    setLoading(true);
    try {
      const orden = await crearOrdenRapida({
        vehiculoId: seleccionado.vehiculoId,
        clienteId: seleccionado.clienteId!,
        kmEntrada: formData.get("km") ? Number(formData.get("km")) : undefined,
        descripcionCliente: (formData.get("descripcion") as string) || undefined,
        fechaItv: (formData.get("fechaItv") as string) || undefined,
      });
      toast.success(`OR-${orden.numero} creada`);
      setOpen(false);
      resetAll();
      router.push(`/ordenes/${orden.id}`);
    } catch {
      toast.error("Error al crear orden");
    } finally {
      setLoading(false);
    }
  }

  const noResults = busquedaHecha && resultados.length === 0 && matricula.length >= 3;
  const vehiculoNoEncontrado = showNewForm;

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetAll(); }}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/25 transition-all">
          <Car className="mr-1.5 h-4 w-4" />Entrada rápida
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {seleccionado
              ? `Nuevo trabajo — ${seleccionado.matricula}`
              : vehiculoNoEncontrado
                ? "Nuevo vehículo y cliente"
                : "Entrada rápida"}
          </DialogTitle>
        </DialogHeader>

        {/* ═══ STEP 1: Search plate ═══ */}
        {!seleccionado && !vehiculoNoEncontrado && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  placeholder="Ej: 1234ABC"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value.toUpperCase().replace(/[\s\-]/g, ""))}
                  className="pl-9 h-14 rounded-xl text-xl font-bold tracking-widest uppercase text-center"
                  autoFocus
                />
              </div>
              <MatriculaScanner onDetect={setMatricula} />
            </div>

            {buscando && (
              <p className="text-xs text-stone-400 text-center animate-pulse">Buscando...</p>
            )}

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

            {/* Not found: show register button */}
            {noResults && !buscando && (
              <div className="text-center py-3 space-y-2">
                <p className="text-sm text-stone-500">No se ha encontrado <span className="font-bold tracking-wider">{matricula}</span></p>
                <Button
                  onClick={() => setShowNewForm(true)}
                  className="rounded-xl h-11 font-bold"
                >
                  <UserPlus className="mr-1.5 h-4 w-4" />Registrar nuevo vehículo
                </Button>
              </div>
            )}

            {matricula.length < 3 && !buscando && (
              <p className="text-xs text-stone-400 text-center">
                Sin espacios ni guiones · Ej: 1234ABC o BA1234CD
              </p>
            )}
          </div>
        )}

        {/* ═══ STEP 2a: Vehicle NOT found → Create everything ═══ */}
        {!seleccionado && vehiculoNoEncontrado && (
          <form action={handleCrearNuevo} className="space-y-3">
            {/* Plate (already filled, editable) */}
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-orange-900">
                  <span className="tracking-wider">{matricula}</span> no está registrado
                </p>
                <p className="text-xs text-orange-700">Rellena los datos para dar de alta cliente y vehículo</p>
              </div>
            </div>
            {/* Escanear ficha técnica → rellena matrícula + marca + modelo */}
            <FichaScanner onApply={(data) => {
              handleFichaData(data);
              toast.success("Datos extraídos de la ficha técnica");
            }} />

            {/* Matrícula editable */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-stone-500">Matrícula *</Label>
              <Input
                name="matriculaNueva"
                defaultValue={matricula}
                required
                className="h-12 rounded-xl font-bold tracking-widest uppercase text-center text-lg"
              />
            </div>

            {/* Client */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-stone-500">Nombre del cliente *</Label>
                <Input name="nombreCliente" placeholder="Antonio García" required className="h-11 rounded-xl" autoFocus />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-stone-500">Teléfono</Label>
                <Input name="telefonoCliente" placeholder="612 345 678" type="tel" className="h-11 rounded-xl" />
              </div>
            </div>

            {/* Vehicle */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-stone-500">Marca</Label>
                <MarcaAutocomplete
                  value={marcaValue}
                  onChange={setMarcaValue}
                  onModeloChange={setModelosSugeridos}
                  name="marca"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-stone-500">Modelo</Label>
                <ModeloAutocomplete
                  value={modeloValue}
                  onChange={setModeloValue}
                  modelos={modelosSugeridos}
                  name="modelo"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Work description */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-stone-500">¿Qué le pasa?</Label>
              <Textarea name="descripcion" placeholder="Le hace ruido al frenar, pierde líquido..." rows={2} className="rounded-xl" />
            </div>

            {/* ITV (opcional, de la pegatina del parabrisas) */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-stone-500">Fecha caducidad ITV (pegatina del parabrisas) · opcional</Label>
              <Input name="fechaItv" type="date" className="h-11 rounded-xl" />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button type="submit" className="flex-1 h-12 rounded-xl font-bold text-sm" disabled={loading}>
                {loading ? "Creando..." : "Dar de alta + crear OR"}
              </Button>
              <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => setShowNewForm(false)}>
                Atrás
              </Button>
            </div>
          </form>
        )}

        {/* ═══ STEP 2b: Vehicle found → Create order only ═══ */}
        {seleccionado && (
          <form action={handleCrear} className="space-y-4">
            <div className="rounded-xl bg-stone-50 p-4 space-y-1">
              <p className="text-lg font-bold tracking-wider">{seleccionado.matricula}</p>
              <p className="text-sm text-stone-500">
                {seleccionado.marca} {seleccionado.modelo}
                {seleccionado.anio ? ` · ${seleccionado.anio}` : ""}
              </p>
              <p className="text-sm text-stone-500">Cliente: {seleccionado.clienteNombre}</p>
              {seleccionado.km && (
                <p className="text-xs text-stone-400">
                  Último km: {seleccionado.km.toLocaleString("es-ES")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-stone-500">Km de entrada</Label>
                <Input
                  name="km"
                  type="number"
                  placeholder={seleccionado.km ? String(seleccionado.km) : "87500"}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-stone-500">Fecha caducidad ITV · opcional</Label>
                <Input name="fechaItv" type="date" className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500">¿Qué le pasa?</Label>
              <Textarea
                name="descripcion"
                placeholder="Le hace ruido al frenar, pierde líquido..."
                rows={2}
                className="rounded-xl"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 h-12 rounded-xl font-bold text-sm" disabled={loading}>
                {loading ? "Creando..." : "Crear orden de trabajo"}
              </Button>
              <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => setSeleccionado(null)}>
                Atrás
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
