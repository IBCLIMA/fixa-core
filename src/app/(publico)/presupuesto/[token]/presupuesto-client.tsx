"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LineaData {
  id: string;
  tipo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuentoPct: number;
  ivaPct: number;
  subtotal: number;
}

interface PresupuestoClientProps {
  token: string;
  estado: string;
  numero: number;
  notas: string | null;
  taller: { nombre: string; telefono: string | null; logoUrl: string | null } | null;
  cliente: { nombre: string; telefono: string | null } | null;
  vehiculo: { matricula: string; marca: string | null; modelo: string | null } | null;
  lineas: LineaData[];
  totalBase: number;
  totalIva: number;
  totalFinal: number;
  validezFecha: string | null;
}

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PresupuestoClient(props: PresupuestoClientProps) {
  const { token, estado, taller, cliente, vehiculo, lineas, totalBase, totalIva, totalFinal, notas, validezFecha } = props;
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"aceptado" | "rechazado" | null>(
    estado === "aceptado" || estado === "rechazado" ? estado as any : null
  );

  const vehicleDesc = [vehiculo?.marca, vehiculo?.modelo].filter(Boolean).join(" ");
  const clientFirstName = cliente?.nombre?.split(" ")[0] || "";

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
    } finally {
      setLoading(false);
      setConfirming(false);
      setRejecting(false);
    }
  }

  // Already responded
  if (result) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="text-center max-w-sm"
        >
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            result === "aceptado" ? "bg-emerald-100" : "bg-red-100"
          }`}>
            <svg className={`w-10 h-10 ${result === "aceptado" ? "text-emerald-600" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {result === "aceptado" ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {result === "aceptado" ? "Presupuesto aprobado" : "Presupuesto rechazado"}
          </h1>
          <p className="text-slate-500 mb-6">
            {result === "aceptado"
              ? `${taller?.nombre} ya ha sido notificado y procederá con la reparación de tu ${vehicleDesc}.`
              : "El taller ha sido notificado de tu decisión."}
          </p>
          {taller?.telefono && (
            <a
              href={`tel:${taller.telefono}`}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Llamar a {taller.nombre}
            </a>
          )}
          <p className="text-xs text-slate-300 mt-8">Generado con FIXA</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-lg mx-auto px-5 py-8 pb-32">

        {/* ── HEADER ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            {taller?.logoUrl ? (
              <img src={taller.logoUrl} alt="" className="h-10 w-auto max-w-[80px] rounded-lg" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {taller?.nombre?.[0] || "T"}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900 text-sm">{taller?.nombre}</p>
              <p className="text-xs text-slate-400">Presupuesto de reparación</p>
            </div>
          </div>
        </motion.div>

        {/* ── GREETING ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            Hola {clientFirstName},<br />
            <span className="text-slate-400 font-normal text-xl">aquí tienes tu presupuesto.</span>
          </h1>
        </motion.div>

        {/* ── VEHICLE ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h4m-4 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                <span className="text-[11px] text-white/70 font-medium">Tu vehículo</span>
              </div>
              <p className="text-2xl font-bold text-white tracking-widest mb-1">{vehiculo?.matricula}</p>
              <p className="text-sm text-white/60">{vehicleDesc}</p>
            </div>
          </div>
        </motion.div>

        {/* ── MOTIVO ── */}
        {notas && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Motivo de la consulta</p>
            <p className="text-slate-700 leading-relaxed">{notas}</p>
          </motion.div>
        )}

        {/* ── LÍNEAS ── */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-6">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Detalle del presupuesto</p>
          <div className="space-y-2">
            {lineas.map((l) => (
              <motion.div
                key={l.id}
                variants={fadeUp}
                className="group rounded-xl bg-white border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      l.tipo === "mano_obra" ? "bg-orange-50 text-orange-500" : l.tipo === "recambio" ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400"
                    }`}>
                      {l.tipo === "mano_obra" ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-[15px]">{l.descripcion}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {l.tipo === "mano_obra" ? "Mano de obra" : l.tipo === "recambio" ? "Recambio" : "Otros"}
                        {l.cantidad !== 1 ? ` · ${l.cantidad} uds` : ""}
                        {l.descuentoPct > 0 ? ` · -${l.descuentoPct}% dto` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-900 text-[15px] tabular-nums shrink-0">{fmt(l.subtotal)} €</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── TOTAL ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-8 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative flex items-end justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Base: {fmt(totalBase)} €</p>
                <p className="text-slate-400 text-sm">IVA: {fmt(totalIva)} €</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Total</p>
                <p className="text-3xl font-bold text-white tabular-nums">{fmt(totalFinal)} €</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── TRUST SIGNALS ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Sin compromiso" },
            { icon: "M5 13l4 4L19 7", label: "Garantía 3 meses" },
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "Datos protegidos" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="mx-auto w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── VALIDITY ── */}
        {validezFecha && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-6">
            <p className="text-xs text-slate-400">Válido hasta el {new Date(validezFecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
          </motion.div>
        )}
      </div>

      {/* ── FIXED BOTTOM CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-5 py-4 z-40">
        <div className="max-w-lg mx-auto space-y-2">
          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <p className="text-sm text-center text-slate-600 font-medium">¿Confirmas que apruebas este presupuesto por {fmt(totalFinal)} €?</p>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAction("aceptado")}
                    disabled={loading}
                    className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base transition-colors disabled:opacity-50"
                  >
                    {loading ? "Procesando..." : "Sí, aprobar"}
                  </motion.button>
                  <button onClick={() => setConfirming(false)} className="px-5 h-14 rounded-2xl border border-slate-200 text-slate-500 font-medium">
                    Atrás
                  </button>
                </div>
              </motion.div>
            ) : rejecting ? (
              <motion.div key="reject" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <p className="text-sm text-center text-slate-600 font-medium">¿Seguro que no deseas realizar esta reparación?</p>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAction("rechazado")}
                    disabled={loading}
                    className="flex-1 h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-base transition-colors disabled:opacity-50"
                  >
                    {loading ? "Procesando..." : "Sí, rechazar"}
                  </motion.button>
                  <button onClick={() => setRejecting(false)} className="px-5 h-14 rounded-2xl border border-slate-200 text-slate-500 font-medium">
                    Atrás
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setConfirming(true)}
                  className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  Aprobar presupuesto
                </motion.button>
                <div className="flex items-center justify-between">
                  {taller?.telefono ? (
                    <a
                      href={`https://wa.me/${taller.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, tengo una duda sobre el presupuesto para mi ${vehicleDesc} (${vehiculo?.matricula})`)}`}
                      target="_blank"
                      className="text-sm text-slate-400 hover:text-emerald-600 transition-colors font-medium"
                    >
                      Tengo dudas →
                    </a>
                  ) : <span />}
                  <button
                    onClick={() => setRejecting(true)}
                    className="text-sm text-slate-300 hover:text-red-400 transition-colors"
                  >
                    No deseo reparar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-36">
        <p className="text-[10px] text-slate-300">Generado con FIXA</p>
      </div>
    </div>
  );
}
