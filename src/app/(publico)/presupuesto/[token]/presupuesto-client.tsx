"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LineaData {
  id: string; tipo: string; descripcion: string; cantidad: number;
  precioUnitario: number; descuentoPct: number; ivaPct: number; subtotal: number;
}

interface PresupuestoClientProps {
  token: string; estado: string; numero: number; notas: string | null;
  taller: { nombre: string; telefono: string | null; logoUrl: string | null } | null;
  cliente: { nombre: string; telefono: string | null } | null;
  vehiculo: { matricula: string; marca: string | null; modelo: string | null } | null;
  lineas: LineaData[]; totalBase: number; totalIva: number; totalFinal: number; validezFecha: string | null;
}

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: any = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PresupuestoClient(props: PresupuestoClientProps) {
  const { token, estado, taller, cliente, vehiculo, lineas, totalBase, totalIva, totalFinal, notas, validezFecha } = props;
  const [step, setStep] = useState<"view" | "confirm" | "reject">("view");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"aceptado" | "rechazado" | null>(
    estado === "aceptado" || estado === "rechazado" ? (estado as any) : null
  );

  const vehicleDesc = [vehiculo?.marca, vehiculo?.modelo].filter(Boolean).join(" ");
  const firstName = cliente?.nombre?.split(" ")[0] || "";

  async function handleAction(action: "aceptado" | "rechazado") {
    setLoading(true);
    try {
      const res = await fetch(`/api/presupuesto-publico/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: action }),
      });
      if (!res.ok) throw new Error();
      setResult(action);
    } catch {
      alert("Error al procesar. Intenta de nuevo o contacta al taller.");
    } finally { setLoading(false); }
  }

  // ═══ RESULT ═══
  if (result) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-stone-50 to-white flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-sm">
          <div className={`mx-auto w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl ${
            result === "aceptado" ? "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/20" : "bg-gradient-to-br from-red-400 to-red-500 shadow-red-500/20"
          }`}>
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {result === "aceptado" ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-3">{result === "aceptado" ? "¡Presupuesto aprobado!" : "Presupuesto rechazado"}</h1>
          <p className="text-stone-500 leading-relaxed mb-8">{result === "aceptado" ? `${taller?.nombre} ya ha sido notificado y procederá con la reparación de tu ${vehicleDesc}.` : "El taller ha sido notificado."}</p>
          {taller?.telefono && (
            <a href={`tel:${taller.telefono}`} className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-orange-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Llamar a {taller.nombre}
            </a>
          )}
        </motion.div>
      </div>
    );
  }

  // ═══ MAIN ═══
  return (
    <div className="min-h-[100dvh] relative overflow-hidden" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, #FFF7ED 0%, #FAFAF9 40%, #F5F5F4 100%)" }}>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-[120px]" />
        <div className="absolute -right-40 top-1/2 h-[400px] w-[400px] rounded-full bg-orange-100/20 blur-[100px]" />
      </div>

      <div className="relative max-w-lg mx-auto px-5 pt-10 pb-44">

        {/* ── HEADER ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-3 mb-14">
          {taller?.logoUrl ? (
            <div className="p-1.5 rounded-2xl bg-white/80 shadow-sm shadow-stone-200/50 ring-1 ring-stone-200/30">
              <img src={taller.logoUrl} alt="" className="h-9 w-auto max-w-[90px] rounded-xl" />
            </div>
          ) : (
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20 ring-1 ring-orange-600/20">
              {taller?.nombre?.[0] || "T"}
            </div>
          )}
          <div>
            <p className="font-bold text-stone-900 text-[15px]">{taller?.nombre}</p>
            <p className="text-[11px] text-stone-400">Presupuesto de reparación</p>
          </div>
        </motion.div>

        {/* ── GREETING ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10">
          <h1 className="text-[2.5rem] font-extrabold text-stone-900 tracking-tight leading-[1.1]">
            Hola {firstName},
          </h1>
          <p className="text-xl text-stone-400 mt-2">aquí tienes tu presupuesto.</p>
        </motion.div>

        {/* ── VEHICLE ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <div className="p-1.5 rounded-[1.25rem] bg-gradient-to-br from-stone-100/80 to-stone-200/40 ring-1 ring-stone-200/50">
            <div className="rounded-[calc(1.25rem-0.375rem)] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="h-5 w-5 rounded-md bg-orange-50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h4m-4 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                </div>
                <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-[0.15em]">Tu vehículo</span>
              </div>
              <p className="text-2xl font-extrabold text-stone-900 tracking-[0.12em] mb-0.5">{vehiculo?.matricula}</p>
              <p className="text-sm text-stone-400">{vehicleDesc}</p>
            </div>
          </div>
        </motion.div>

        {/* ── MOTIVO ── */}
        {notas && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
            <p className="text-[10px] font-semibold text-stone-300 uppercase tracking-[0.2em] mb-2">Motivo de la consulta</p>
            <p className="text-stone-600 leading-relaxed">{notas}</p>
          </motion.div>
        )}

        {/* ── LÍNEAS ── */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-8">
          <p className="text-[10px] font-semibold text-stone-300 uppercase tracking-[0.2em] mb-4">Detalle del presupuesto</p>
          <div className="space-y-2.5">
            {lineas.map((l) => (
              <motion.div key={l.id} variants={fadeUp}>
                <div className="p-1 rounded-2xl bg-white/60 ring-1 ring-stone-200/40">
                  <div className="rounded-[calc(1rem-0.25rem)] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          l.tipo === "mano_obra" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-500"
                        } shadow-sm`}>
                          {l.tipo === "mano_obra" ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-800">{l.descripcion}</p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {l.tipo === "mano_obra" ? "Mano de obra" : "Recambio"}
                            {l.cantidad !== 1 ? ` · ${l.cantidad} uds` : ""}
                            {l.descuentoPct > 0 ? ` · -${l.descuentoPct}%` : ""}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-stone-900 tabular-nums shrink-0 text-[15px]">{fmt(l.subtotal)} €</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── TOTAL ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10">
          <div className="p-1.5 rounded-[1.25rem] bg-gradient-to-br from-orange-100/60 to-orange-200/30 ring-1 ring-orange-200/40">
            <div className="rounded-[calc(1.25rem-0.375rem)] bg-gradient-to-br from-stone-900 to-stone-800 p-6 shadow-xl shadow-stone-900/10">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-white/40">Base: {fmt(totalBase)} €</p>
                  <p className="text-sm text-white/40">IVA: {fmt(totalIva)} €</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-orange-400 uppercase tracking-[0.2em] font-semibold mb-1">Total</p>
                  <p className="text-4xl font-extrabold text-white tabular-nums">{fmt(totalFinal)} €</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── TRUST ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-3 gap-3 mb-8">
          {[
            { path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Sin compromiso", bg: "bg-emerald-50", color: "text-emerald-500" },
            { path: "M5 13l4 4L19 7", label: "Garantía incluida", bg: "bg-blue-50", color: "text-blue-500" },
            { path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "Datos protegidos", bg: "bg-violet-50", color: "text-violet-500" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className={`mx-auto w-11 h-11 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-2 shadow-sm`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.path} /></svg>
              </div>
              <p className="text-[10px] text-stone-400 font-medium leading-tight">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {validezFecha && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-4">
            <p className="text-xs text-stone-300">Válido hasta el {new Date(validezFecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
          </motion.div>
        )}
        <p className="text-center text-[10px] text-stone-200">Generado con FIXA</p>
      </div>

      {/* ═══ FIXED CTA ═══ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-100 px-5 py-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {step === "confirm" ? (
              <motion.div key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-sm text-center text-stone-500">¿Confirmas que apruebas por <span className="font-bold text-stone-900">{fmt(totalFinal)} €</span>?</p>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleAction("aceptado")} disabled={loading}
                    className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >{loading ? "Procesando..." : "Sí, aprobar"}</motion.button>
                  <button onClick={() => setStep("view")} className="px-5 h-14 rounded-2xl border border-stone-200 text-stone-400 font-medium">Atrás</button>
                </div>
              </motion.div>
            ) : step === "reject" ? (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-sm text-center text-stone-500">¿Seguro que no deseas realizar esta reparación?</p>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleAction("rechazado")} disabled={loading}
                    className="flex-1 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-bold disabled:opacity-50"
                  >{loading ? "Procesando..." : "Sí, rechazar"}</motion.button>
                  <button onClick={() => setStep("view")} className="px-5 h-14 rounded-2xl border border-stone-200 text-stone-400 font-medium">Atrás</button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="v" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("confirm")}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30"
                >Aprobar presupuesto</motion.button>
                <div className="flex items-center justify-between px-1">
                  {taller?.telefono ? (
                    <a href={`https://wa.me/${taller.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, tengo una duda sobre el presupuesto para mi ${vehicleDesc}`)}`} target="_blank"
                      className="text-sm text-stone-400 hover:text-orange-500 transition-colors font-medium">Tengo dudas →</a>
                  ) : <span />}
                  <button onClick={() => setStep("reject")} className="text-sm text-stone-300 hover:text-red-400 transition-colors">No deseo reparar</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
