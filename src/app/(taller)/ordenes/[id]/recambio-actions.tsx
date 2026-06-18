"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Check, Package, Loader2 } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";
import { toast } from "sonner";

type Recambista = { id: string; nombre: string; telefono: string; notas: string | null };

const estadoConfig = {
  sin_pedir: { label: "Sin pedir", color: "bg-stone-200 text-stone-600" },
  consultado: { label: "Consultado", color: "bg-amber-100 text-amber-700" },
  pedido: { label: "Pedido", color: "bg-blue-100 text-blue-700" },
  recibido: { label: "Recibido", color: "bg-emerald-100 text-emerald-700" },
} as const;

/**
 * Botón inline de gestión de recambios en cada línea de tipo "recambio".
 * - Si sin_pedir: botón WhatsApp multi-proveedor → pasa a consultado
 * - Si consultado: botón "Marcar pedido" (pide proveedor + precio)
 * - Si pedido: botón "Recibido"
 * - Si recibido: badge verde
 */
export function RecambioActions({
  lineaId,
  ordenId,
  descripcion,
  estadoRecambio,
  recambistaId,
  recambistas,
  matricula,
  marca,
  modelo,
  anio,
  vin,
  tallerNombre,
}: {
  lineaId: string;
  ordenId: string;
  descripcion: string;
  estadoRecambio: string;
  recambistaId: string | null;
  recambistas: Recambista[];
  matricula?: string;
  marca?: string;
  modelo?: string;
  anio?: number | null;
  vin?: string | null;
  tallerNombre?: string;
}) {
  const router = useRouter();
  const [showProveedores, setShowProveedores] = useState(false);
  const [showPedido, setShowPedido] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [loading, setLoading] = useState(false);

  const estado = (estadoRecambio || "sin_pedir") as keyof typeof estadoConfig;
  const config = estadoConfig[estado] || estadoConfig.sin_pedir;

  async function updateEstado(nuevoEstado: string, extra?: Record<string, string>) {
    setLoading(true);
    try {
      const res = await fetch(`/api/ordenes/${ordenId}/lineas/${lineaId}/recambio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estadoRecambio: nuevoEstado, ...extra }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setLoading(false);
      setShowProveedores(false);
      setShowPedido(false);
    }
  }

  function buildWhatsAppMsg(recambista: Recambista) {
    const vehiculo = [matricula, marca, modelo, anio].filter(Boolean).join(" · ");
    const msg = [
      `Hola, soy ${tallerNombre || "el taller"}. Necesito para ${vehiculo}:`,
      `— ${descripcion}`,
      vin ? `VIN: ${vin}` : "",
      `¿Precio y disponibilidad? Gracias`,
    ].filter(Boolean).join("\n");
    return formatWhatsAppUrl(recambista.telefono, msg);
  }

  // Sin recambistas → explicación inline + enlace a configuración
  if (recambistas.length === 0) {
    if (showProveedores) {
      return (
        <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3 text-xs space-y-2">
          <p className="font-bold text-orange-900">Primero añade tus proveedores de recambios</p>
          <p className="text-orange-700">
            Ve a Configuración → Recambistas y añade el nombre y WhatsApp de tus
            recambistas habituales. Solo tienes que hacerlo una vez — después podrás
            pedirles piezas desde aquí con un toque.
          </p>
          <a
            href="/configuracion"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-orange-500 text-white hover:bg-orange-400 transition-colors cursor-pointer"
          >
            Ir a Configuración
          </a>
        </div>
      );
    }
    return (
      <button
        onClick={() => setShowProveedores(true)}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-[#25D366] text-white hover:bg-[#1fb959] transition-colors cursor-pointer shadow-sm"
      >
        <MessageSquare className="h-3.5 w-3.5" />Pedir recambio
      </button>
    );
  }

  // ── RECIBIDO: badge verde ──
  if (estado === "recibido") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${config.color}`}>
        <Check className="h-3 w-3" />{config.label}
      </span>
    );
  }

  // ── PEDIDO: botón recibido ──
  if (estado === "pedido") {
    return (
      <button
        onClick={() => updateEstado("recibido")}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold bg-blue-100 text-blue-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors cursor-pointer"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Package className="h-3 w-3" />}
        Marcar recibido
      </button>
    );
  }

  // ── CONSULTADO: botón marcar pedido ──
  if (estado === "consultado") {
    if (showPedido) {
      return (
        <div className="flex items-center gap-2">
          <select
            value={selectedProveedor}
            onChange={(e) => setSelectedProveedor(e.target.value)}
            className="h-7 text-[11px] rounded-lg border border-stone-200 bg-white px-2"
          >
            <option value="">¿A quién?</option>
            {recambistas.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={precioCompra}
            onChange={(e) => setPrecioCompra(e.target.value)}
            className="h-7 w-20 text-[11px] rounded-lg border border-stone-200 bg-white px-2"
          />
          <button
            onClick={() => updateEstado("pedido", { recambistaId: selectedProveedor, precioCompra })}
            disabled={loading}
            className="h-7 px-2.5 text-[11px] font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer"
          >
            {loading ? "..." : "OK"}
          </button>
        </div>
      );
    }
    return (
      <button
        onClick={() => setShowPedido(true)}
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold bg-amber-100 text-amber-700 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
      >
        <Check className="h-3 w-3" />Marcar pedido
      </button>
    );
  }

  // ── SIN PEDIR: botón WhatsApp multi-proveedor ──
  if (showProveedores) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {recambistas.map((r) => (
          <a
            key={r.id}
            href={buildWhatsAppMsg(r)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => updateEstado("consultado")}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold bg-[#25D366] text-white hover:bg-[#1fb959] transition-colors cursor-pointer"
          >
            <MessageSquare className="h-3 w-3" />{r.nombre}
          </a>
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowProveedores(true)}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-[#25D366] text-white hover:bg-[#1fb959] transition-colors cursor-pointer shadow-sm"
      title="Consultar precio a tus recambistas"
    >
      <MessageSquare className="h-3.5 w-3.5" />Pedir recambio
    </button>
  );
}
