"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Settings, Users, Car, ClipboardList,
  Upload, Zap, Smartphone, MessageSquare, Bell, Star, Shield, Sparkles,
  Plus, Wrench, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { crearOperariosEnLote } from "../actions/operarios";

export default function BienvenidaPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dpaAceptado, setDpaAceptado] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [operarios, setOperarios] = useState<string[]>([""]);
  const [datos, setDatos] = useState({
    nombre: "",
    telefono: "",
    email: "",
    cif: "",
    direccion: "",
    codigoPostal: "",
    ciudad: "",
    provincia: "",
  });

  async function guardarDatos() {
    if (!datos.nombre.trim()) {
      toast.error("Pon el nombre de tu taller");
      return;
    }
    if (!dpaAceptado) {
      toast.error("Debes aceptar el contrato de tratamiento de datos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/taller", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, dpaAceptado: true, newsletterConsent }),
      });
      if (!res.ok) throw new Error();

      // Create operarios if any names were entered
      const nombresValidos = operarios.map((n) => n.trim()).filter(Boolean);
      if (nombresValidos.length > 0) {
        try {
          await crearOperariosEnLote(nombresValidos);
        } catch {
          // Non-blocking: taller data is saved, operarios can be added later
          console.error("Error creating operarios during onboarding");
        }
      }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12 overflow-y-auto" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #fff7ed 0%, #faf9f7 40%, #f5f3f0 100%)" }}>
      <div className="max-w-lg w-full my-auto">

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${
              i === paso ? "w-10 bg-gradient-to-r from-orange-500 to-orange-600" :
              i < paso ? "w-3 bg-orange-500" : "w-3 bg-stone-200"
            }`} />
          ))}
        </div>

        {/* ═══ PASO 0: Bienvenida emocional ═══ */}
        {paso === 0 && (
          <div className="text-center space-y-8 animate-in fade-in duration-500">
            {/* Logo with glow */}
            <div className="relative inline-block">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-orange-300/20 to-orange-500/10 blur-2xl" />
              <div className="relative">
                <FixaLogo size="xl" variant="icon" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">
                Se acabó el caos.
                <br />
                <span className="text-orange-600">Tu taller, organizado.</span>
              </h1>
              <p className="text-lg text-stone-500 mt-3 max-w-md mx-auto leading-relaxed">
                No más llamadas de "¿está listo mi coche?".
                No más presupuestos a las 9 de la noche.
                <strong className="text-stone-700"> FIXA se encarga.</strong>
              </p>
            </div>

            {/* What you'll get */}
            <div className="space-y-3 text-left">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider text-center mb-4">A partir de hoy</p>
              {[
                { icon: Zap, text: "Matrícula y listo. Orden creada en 10 segundos.", color: "text-orange-500 bg-orange-50" },
                { icon: MessageSquare, text: "Un toque y tu cliente recibe el WhatsApp.", color: "text-emerald-500 bg-emerald-50" },
                { icon: Smartphone, text: "Tu cliente ve el estado online. Cero llamadas.", color: "text-blue-500 bg-blue-50" },
                { icon: Bell, text: "FIXA detecta ITVs y te avisa. Trabajo que no pierdes.", color: "text-violet-500 bg-violet-50" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/40 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-stone-700">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="space-y-3 pt-2">
              <Button onClick={() => setPaso(1)} size="lg" className="rounded-full w-full h-14 font-bold text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25">
                Configurar mi taller
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-stone-400 text-center">Solo 2 minutos. Luego ya puedes empezar.</p>
            </div>
          </div>
        )}

        {/* ═══ PASO 1: Datos del taller ═══ */}
        {paso === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">Datos de tu taller</h2>
              <p className="text-stone-500 mt-1 text-sm">Esta información aparecerá en presupuestos, documentos y el portal del cliente.</p>
            </div>

            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/40 shadow-sm p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-stone-500">Nombre del taller *</Label>
                <Input value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} placeholder="Ej: Taller García Automoción" className="h-12 rounded-xl text-base" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Teléfono</Label>
                  <Input value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} placeholder="612 345 678" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Correo electrónico</Label>
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
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Código postal</Label>
                  <Input value={datos.codigoPostal} onChange={(e) => setDatos({ ...datos, codigoPostal: e.target.value })} placeholder="25001" className="h-11 rounded-xl" maxLength={5} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Ciudad</Label>
                  <Input value={datos.ciudad} onChange={(e) => setDatos({ ...datos, ciudad: e.target.value })} placeholder="Lleida" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-stone-500">Provincia</Label>
                  <Input value={datos.provincia} onChange={(e) => setDatos({ ...datos, provincia: e.target.value })} placeholder="Lleida" className="h-11 rounded-xl" />
                </div>
              </div>
            </div>

            {/* DPA */}
            <div className="flex items-start gap-3 rounded-2xl bg-white/80 border border-stone-200/40 p-4 shadow-sm">
              <input
                type="checkbox"
                id="dpa-check"
                checked={dpaAceptado}
                onChange={(e) => setDpaAceptado(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-stone-300 text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500"
              />
              <label htmlFor="dpa-check" className="text-sm text-stone-600 cursor-pointer leading-snug">
                Acepto que FIXA guarde los datos de mi taller de forma segura para poder usar el servicio.{" "}
                <Link href="/dpa" target="_blank" className="text-orange-600 underline underline-offset-2 font-medium text-xs">
                  Ver condiciones
                </Link>
              </label>
            </div>

            {/* Newsletter consent - visible and inviting */}
            <div
              onClick={() => setNewsletterConsent(!newsletterConsent)}
              className={`flex items-start gap-4 rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                newsletterConsent
                  ? "bg-orange-50 border-2 border-orange-300 shadow-sm"
                  : "bg-white/80 border-2 border-stone-200/60 hover:border-orange-200 hover:bg-orange-50/50"
              }`}
            >
              <input
                type="checkbox"
                id="newsletter-check"
                checked={newsletterConsent}
                onChange={(e) => setNewsletterConsent(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-stone-300 text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500"
              />
              <div>
                <label htmlFor="newsletter-check" className="text-sm font-semibold text-stone-800 cursor-pointer block">
                  Recibe trucos gratis para llenar tu taller de clientes
                </label>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Te enviamos ideas prácticas para captar más coches, fidelizar clientes y ahorrar tiempo. Sin spam. Te das de baja cuando quieras.
                </p>
              </div>
            </div>

            {/* Operarios */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/40 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Wrench className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">¿Cuántos mecánicos trabajan contigo?</h3>
                  <p className="text-xs text-stone-500">Opcional. Puedes añadir más después.</p>
                </div>
              </div>

              <div className="space-y-2">
                {operarios.map((nombre, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={nombre}
                      onChange={(e) => {
                        const next = [...operarios];
                        next[i] = e.target.value;
                        setOperarios(next);
                      }}
                      placeholder={`Nombre del mecánico ${i + 1}`}
                      className="h-11 rounded-xl"
                    />
                    {operarios.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 shrink-0 rounded-xl text-stone-400 hover:text-red-500"
                        onClick={() => setOperarios(operarios.filter((_, j) => j !== i))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setOperarios([...operarios, ""])}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />Añadir otro
              </Button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaso(0)} className="rounded-full h-12">Atrás</Button>
              <Button onClick={guardarDatos} disabled={loading || !dpaAceptado} className="rounded-full flex-1 h-12 font-bold text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20">
                {loading ? "Guardando..." : "Guardar y continuar"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ PASO 2: Todo listo ═══ */}
        {paso === 2 && (
          <div className="text-center space-y-8 animate-in fade-in duration-500">
            {/* Success animation */}
            <div className="relative inline-block">
              <div className="absolute -inset-4 rounded-full bg-emerald-200/30 blur-2xl animate-pulse" />
              <div className="relative flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
                Ya está. Así de fácil. <Sparkles className="inline h-7 w-7 text-amber-400" />
              </h2>
              <p className="text-stone-500 mt-3 text-lg max-w-sm mx-auto">
                Tu taller está configurado. Ahora el siguiente paso: meter tu primer coche.
              </p>
            </div>

            {/* Next steps */}
            <div className="space-y-3 text-left">
              {[
                { icon: Users, text: "Añade tu primer cliente", href: "/clientes", color: "text-blue-500 bg-blue-50" },
                { icon: Car, text: "Registra el primer vehículo", href: "/clientes", color: "text-violet-500 bg-violet-50" },
                { icon: ClipboardList, text: "Crea tu primera orden de trabajo", href: "/", color: "text-orange-500 bg-orange-50" },
                { icon: Upload, text: "O importa clientes desde un Excel/CSV", href: "/importar", color: "text-emerald-500 bg-emerald-50" },
              ].map((item) => (
                <Link key={item.text} href={item.href} onClick={() => localStorage.setItem("fixa-onboarding-completado", "true")} className="flex items-center gap-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/40 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-stone-700 flex-1">{item.text}</span>
                  <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            {/* Main CTA */}
            <div className="space-y-3 pt-2">
              <Button onClick={irAlPanel} size="lg" className="rounded-full w-full h-14 font-bold text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25">
                Ir al panel del taller
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-500" />14 días gratis</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-orange-500" />Soporte por WhatsApp</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
