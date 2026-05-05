"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, ArrowRight, CheckCircle2, Settings, Users, Car, ClipboardList, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const pasos = [
  { icon: Wrench, titulo: "Bienvenido a FIXA", desc: "Vamos a configurar tu taller en 2 minutos." },
  { icon: Settings, titulo: "Datos del taller", desc: "Introduce los datos básicos de tu taller." },
  { icon: CheckCircle2, titulo: "¡Todo listo!", desc: "Tu taller está configurado. Empieza a trabajar." },
];

export default function BienvenidaPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState({
    nombre: "",
    telefono: "",
    email: "",
    cif: "",
    direccion: "",
  });

  async function guardarDatos() {
    if (!datos.nombre.trim()) {
      toast.error("Pon el nombre de tu taller");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/taller", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error();
      setPaso(2);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  function irAlPanel() {
    localStorage.setItem("fixa-onboarding-completado", "true");
    router.push("/");
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Indicador de progreso */}
        <div className="flex items-center justify-center gap-2">
          {pasos.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === paso ? "w-8 bg-orange-500" : i < paso ? "w-2 bg-orange-500" : "w-2 bg-stone-200"}`} />
          ))}
        </div>

        {/* Paso 0: Bienvenida */}
        {paso === 0 && (
          <div className="text-center space-y-6">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/20">
              <Wrench className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Bienvenido a FIXA</h1>
              <p className="text-muted-foreground mt-2">Vamos a configurar tu taller en 2 minutos para que puedas empezar a trabajar.</p>
            </div>
            <div className="space-y-3 text-left">
              {[
                { icon: Settings, text: "Configura los datos de tu taller" },
                { icon: Users, text: "Añade tus clientes o importa desde CSV" },
                { icon: Car, text: "Registra los vehículos" },
                { icon: ClipboardList, text: "Crea tu primera orden de trabajo" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-xl bg-white border border-stone-200/60 p-3 shadow-sm">
                  <item.icon className="h-5 w-5 text-orange-500 shrink-0" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setPaso(1)} size="lg" className="rounded-full w-full h-12 font-bold text-base">
              Empezar<ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Paso 1: Datos del taller */}
        {paso === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight">Datos de tu taller</h2>
              <p className="text-muted-foreground mt-1">Esta información aparecerá en los documentos y el portal del cliente.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-stone-500">Nombre del taller *</Label>
                <Input value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} placeholder="Taller García" className="h-12 rounded-xl text-base" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Teléfono</Label>
                  <Input value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} placeholder="612 345 678" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Email</Label>
                  <Input value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} placeholder="info@taller.com" type="email" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">CIF / NIF</Label>
                  <Input value={datos.cif} onChange={(e) => setDatos({ ...datos, cif: e.target.value })} placeholder="B12345678" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Dirección</Label>
                  <Input value={datos.direccion} onChange={(e) => setDatos({ ...datos, direccion: e.target.value })} placeholder="Calle Mayor, 1" className="h-11 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaso(0)} className="rounded-full">Atrás</Button>
              <Button onClick={guardarDatos} disabled={loading} className="rounded-full flex-1 h-12 font-bold text-base">
                {loading ? "Guardando..." : "Guardar y continuar"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 2: Completado */}
        {paso === 2 && (
          <div className="text-center space-y-6">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">¡Tu taller está listo!</h2>
              <p className="text-muted-foreground mt-2">Ya puedes empezar a añadir clientes, vehículos y crear órdenes de trabajo.</p>
            </div>
            <div className="space-y-2">
              <Button onClick={irAlPanel} size="lg" className="rounded-full w-full h-12 font-bold text-base">
                Ir al panel<ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={() => router.push("/importar")} variant="outline" className="rounded-full w-full">
                <Upload className="mr-2 h-4 w-4" />Importar clientes desde CSV
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tienes 14 días de prueba gratuita. Si necesitas ayuda, pulsa el botón verde de WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
