"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, Car, ClipboardList, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { busquedaGlobal, type ResultadoBusqueda } from "./actions/busqueda";

const iconByTipo = {
  cliente: User,
  vehiculo: Car,
  orden: ClipboardList,
};

const colorByTipo = {
  cliente: "bg-brand/10 text-brand",
  vehiculo: "bg-blue-50 text-blue-600",
  orden: "bg-emerald-50 text-emerald-600",
};

export function BusquedaGlobal() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      const res = await busquedaGlobal(query);
      setResultados(res);
      setLoading(false);
      setOpen(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar matrícula, cliente, nº orden..."
        className="pl-9 pr-8 h-9 w-64 rounded-full bg-muted border-0 text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => resultados.length > 0 && setOpen(true)}
      />
      {query && (
        <button onClick={() => { setQuery(""); setResultados([]); setOpen(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}

      {open && resultados.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-lg z-50 overflow-hidden">
          {resultados.map((r) => {
            const Icon = iconByTipo[r.tipo];
            const color = colorByTipo[r.tipo];
            return (
              <Link
                key={`${r.tipo}-${r.id}`}
                href={r.href}
                onClick={() => { setOpen(false); setQuery(""); }}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.titulo}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.subtitulo}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {open && query.length >= 2 && resultados.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Sin resultados para &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
