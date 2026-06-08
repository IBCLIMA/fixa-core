"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Package,
  Shield,
  Check,
  Lock,
  Car,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " \u20AC";
}

function LineaIcon({ tipo }: { tipo: string }) {
  if (tipo === "mano_obra") {
    return <Wrench className="h-4 w-4 text-slate-500 shrink-0" />;
  }
  return <Package className="h-4 w-4 text-slate-500 shrink-0" />;
}

export function PresupuestoClient({
  token,
  estado,
  numero,
  notas,
  taller,
  cliente,
  vehiculo,
  lineas,
  totalBase,
  totalIva,
  totalFinal,
  validezFecha,
}: PresupuestoClientProps) {
  const [loading, setLoading] = useState(false);
  const [respondido, setRespondido] = useState<"aceptado" | "rechazado" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const canRespond = estado === "enviado" && !respondido;
  const currentEstado = respondido || estado;

  async function handleAction(nuevoEstado: "aceptado" | "rechazado") {
    setLoading(true);
    try {
      const res = await fetch(`/api/presupuesto-publico/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error();
      setRespondido(nuevoEstado);
      setShowConfirm(false);
      setShowRejectConfirm(false);
    } catch {
      alert("Error al procesar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const whatsappUrl = taller?.telefono
    ? `https://wa.me/${taller.telefono.replace(/\s+/g, "").replace(/^\+/, "")}?text=${encodeURIComponent(`Hola, tengo dudas sobre el presupuesto PT-${numero}`)}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Header: taller logo + name + badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {taller?.logoUrl ? (
              <img
                src={taller.logoUrl}
                alt={taller.nombre}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {taller?.nombre?.charAt(0) || "T"}
                </span>
              </div>
            )}
            <div>
              <p className="text-base font-bold text-slate-900">
                {taller?.nombre || "Taller"}
              </p>
              <p className="text-xs text-slate-500">Presupuesto PT-{numero}</p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Presupuesto
          </span>
        </motion.div>

        {/* Vehicle card */}
        {vehiculo && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Car className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold tracking-wider text-slate-900 uppercase">
                  {vehiculo.matricula}
                </p>
                <p className="text-sm text-slate-500">
                  {[vehiculo.marca, vehiculo.modelo].filter(Boolean).join(" ")}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Description / notes */}
        {notas && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Motivo de la consulta
            </p>
            <p className="text-[15px] text-slate-700 leading-relaxed">{notas}</p>
          </motion.div>
        )}

        {/* Work items */}
        {lineas.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-2"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Detalle de trabajos
            </p>
            {lineas.map((linea) => (
              <motion.div
                key={linea.id}
                variants={fadeInUp}
                transition={{ duration: 0.35 }}
                className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">
                      <LineaIcon tipo={linea.tipo} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-slate-900 leading-snug">
                        {linea.descripcion}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {linea.cantidad} x {formatCurrency(linea.precioUnitario)}
                        {linea.descuentoPct > 0 && (
                          <span className="text-green-600 ml-1">
                            (-{linea.descuentoPct}%)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-[15px] font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(linea.subtotal)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Total dark card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl bg-slate-800 p-5 shadow-lg"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-400">Base: {formatCurrency(totalBase)}</p>
              <p className="text-sm text-slate-400">IVA: {formatCurrency(totalIva)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Total</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(totalFinal)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Already responded: status card */}
        <AnimatePresence>
          {(currentEstado === "aceptado" || currentEstado === "rechazado") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className={`rounded-2xl p-5 text-center ${
                currentEstado === "aceptado"
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-red-50 border-2 border-red-200"
              }`}
            >
              {currentEstado === "aceptado" ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-800">
                    Presupuesto aprobado
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    El taller ya tiene tu autorización para comenzar los trabajos.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-red-800">
                    Presupuesto rechazado
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Has declinado este presupuesto.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust signals */}
        {canRespond && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-200">
              <Shield className="h-5 w-5 text-blue-500 mb-1.5" />
              <p className="text-[11px] font-medium text-slate-600 leading-tight">
                Sin compromiso
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-200">
              <Check className="h-5 w-5 text-blue-500 mb-1.5" />
              <p className="text-[11px] font-medium text-slate-600 leading-tight">
                Garantía 3 meses
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-200">
              <Lock className="h-5 w-5 text-blue-500 mb-1.5" />
              <p className="text-[11px] font-medium text-slate-600 leading-tight">
                Datos protegidos
              </p>
            </div>
          </motion.div>
        )}

        {/* Accept button + confirm flow */}
        {canRespond && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-3"
          >
            <AnimatePresence mode="wait">
              {showConfirm ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-center text-slate-600 font-medium">
                    Vas a aprobar este presupuesto por{" "}
                    <span className="font-bold text-slate-900">
                      {formatCurrency(totalFinal)}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction("aceptado")}
                      disabled={loading}
                      className="flex-1 h-14 rounded-2xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-base font-bold transition-colors disabled:opacity-50"
                    >
                      {loading ? "Procesando..." : "Confirmar aprobación"}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowConfirm(false)}
                      disabled={loading}
                      className="h-14 px-5 rounded-2xl border border-slate-300 text-slate-600 font-medium transition-colors hover:bg-slate-100"
                    >
                      Volver
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="accept"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirm(true)}
                  className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-base font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <Check className="h-5 w-5" />
                  Aprobar presupuesto
                </motion.button>
              )}
            </AnimatePresence>

            {/* "Tengo dudas" WhatsApp link */}
            {whatsappUrl && (
              <motion.a
                whileTap={{ scale: 0.97 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 text-[15px] font-semibold transition-colors hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5 text-green-600" />
                Tengo dudas
              </motion.a>
            )}

            {/* Reject link */}
            <AnimatePresence mode="wait">
              {showRejectConfirm ? (
                <motion.div
                  key="reject-confirm"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center justify-center gap-3 py-2"
                >
                  <button
                    onClick={() => handleAction("rechazado")}
                    disabled={loading}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 min-h-11 px-4"
                  >
                    {loading ? "Procesando..." : "Sí, rechazar"}
                  </button>
                  <button
                    onClick={() => setShowRejectConfirm(false)}
                    disabled={loading}
                    className="text-sm text-slate-400 hover:text-slate-600 min-h-11 px-4"
                  >
                    Cancelar
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="reject"
                  onClick={() => setShowRejectConfirm(true)}
                  className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors min-h-11 flex items-center justify-center"
                >
                  No deseo realizar la reparación
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Already responded: WhatsApp contact */}
        {!canRespond && whatsappUrl && (
          <motion.a
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            whileTap={{ scale: 0.97 }}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 text-[15px] font-semibold transition-colors hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5 text-green-600" />
            Contactar con el taller
          </motion.a>
        )}

        {/* Validity */}
        {validezFecha && canRespond && (
          <p className="text-center text-xs text-slate-400">
            Válido hasta {validezFecha}
          </p>
        )}

        {/* Footer */}
        <div className="text-center pt-4 pb-6">
          <p className="text-[11px] text-slate-300 font-medium">
            Generado con FIXA
          </p>
        </div>
      </div>
    </div>
  );
}
