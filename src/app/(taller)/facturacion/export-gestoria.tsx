"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportGestoria() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [mes, setMes] = useState(currentMonth);
  const [loading, setLoading] = useState(false);

  // Generate last 12 months for selector
  const meses: { value: string; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    meses.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/export/gestoria?mes=${mes}`);
      if (!res.ok) throw new Error("Error al exportar");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fixa-gestoria-${mes}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={mes}
        onChange={(e) => setMes(e.target.value)}
        className="h-9 rounded-lg border border-stone-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
      >
        {meses.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg h-9 text-xs gap-1.5"
        onClick={handleDownload}
        disabled={loading}
      >
        <Download className="h-3.5 w-3.5" />
        {loading ? "Exportando..." : "Descargar CSV"}
      </Button>
    </div>
  );
}
