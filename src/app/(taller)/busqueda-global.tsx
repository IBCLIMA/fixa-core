"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Car, ClipboardList, X, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { busquedaGlobal, type ResultadoBusqueda } from "./actions/busqueda";

const RECENT_SEARCHES_KEY = "fixa-recent-searches";
const MAX_RECENT = 5;

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

const labelByTipo = {
  cliente: "Clientes",
  vehiculo: "Vehículos",
  orden: "Órdenes",
};

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  if (typeof window === "undefined" || !term.trim()) return;
  try {
    const recent = getRecentSearches().filter((s) => s !== term.trim());
    recent.unshift(term.trim());
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT))
    );
  } catch {
    // ignore storage errors
  }
}

const placeholders = [
  "Buscar matrícula...",
  "Buscar cliente...",
  "Buscar orden...",
];

export function BusquedaGlobal() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMac, setIsMac] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reqId = useRef(0);

  // Detect platform for the keyboard hint
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent));
  }, []);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search with stale-request guard
  useEffect(() => {
    if (query.length < 2) {
      setResultados([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      const id = ++reqId.current;
      const res = await busquedaGlobal(query);
      // Ignore responses from outdated queries (out-of-order resolution)
      if (id !== reqId.current) return;
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

  const handleResultClick = useCallback(
    (term?: string) => {
      if (term || query) {
        saveRecentSearch(term || query);
        setRecentSearches(getRecentSearches());
      }
      setOpen(false);
      setQuery("");
      setActiveIndex(-1);
    },
    [query]
  );

  const handleRecentClick = useCallback((term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  // Group results by tipo
  const grouped = resultados.reduce(
    (acc, r) => {
      if (!acc[r.tipo]) acc[r.tipo] = [];
      acc[r.tipo].push(r);
      return acc;
    },
    {} as Record<string, ResultadoBusqueda[]>
  );

  const groupOrder: Array<"cliente" | "vehiculo" | "orden"> = ["cliente", "vehiculo", "orden"];

  // Flat list in display order — drives keyboard navigation
  const flatResults = groupOrder.flatMap((tipo) => grouped[tipo] ?? []);

  const showRecent = open && query.length < 2 && recentSearches.length > 0;
  const showResults = open && resultados.length > 0 && query.length >= 2;
  const showEmpty =
    open && query.length >= 2 && resultados.length === 0 && !loading;
  const showLoading =
    open && query.length >= 2 && loading && resultados.length === 0;

  // Reset highlight whenever the result set changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [resultados]);

  // Keep the highlighted result scrolled into view
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = listRef.current?.querySelector(
      `[data-result-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults || flatResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? flatResults.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      const target = flatResults[activeIndex >= 0 ? activeIndex : 0];
      if (target) {
        e.preventDefault();
        handleResultClick(query);
        router.push(target.href);
      }
    }
  }

  return (
    <div ref={ref} className="relative flex-1 max-w-xs sm:max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder={placeholders[placeholderIdx]}
        className="pl-9 pr-14 h-9 w-full rounded-full bg-muted border-0 text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onFocus={() => {
          setOpen(true);
          setRecentSearches(getRecentSearches());
        }}
        role="combobox"
        aria-expanded={showResults || showRecent}
        aria-controls="busqueda-global-resultados"
        aria-autocomplete="list"
        aria-label="Buscar matrícula, cliente u orden"
      />
      {query ? (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => {
            setQuery("");
            setResultados([]);
            setOpen(false);
            setActiveIndex(-1);
            inputRef.current?.focus();
          }}
          className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-background/60 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground pointer-events-none select-none">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      )}

      {/* Recent searches */}
      {showRecent && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-lg z-50 overflow-hidden">
          <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Búsquedas recientes
          </p>
          {recentSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleRecentClick(term)}
              className="flex min-h-11 items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors w-full text-left"
            >
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm truncate">{term}</span>
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {showLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-lg z-50 flex items-center justify-center gap-2 p-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Buscando...</span>
        </div>
      )}

      {/* Grouped results */}
      {showResults && (
        <div
          ref={listRef}
          id="busqueda-global-resultados"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-lg z-50 overflow-hidden max-h-[400px] overflow-y-auto"
        >
          {(() => {
            let idx = -1;
            return groupOrder.map((tipo) => {
              const items = grouped[tipo];
              if (!items || items.length === 0) return null;
              const label = labelByTipo[tipo];
              return (
                <div key={tipo}>
                  <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {label}
                  </p>
                  {items.map((r) => {
                    idx++;
                    const globalIdx = idx;
                    const active = globalIdx === activeIndex;
                    const Icon = iconByTipo[r.tipo];
                    const color = colorByTipo[r.tipo];
                    return (
                      <Link
                        key={`${r.tipo}-${r.id}`}
                        href={r.href}
                        role="option"
                        aria-selected={active}
                        data-result-index={globalIdx}
                        onClick={() => handleResultClick(query)}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        className={`flex min-h-11 items-center gap-3 px-3 py-2.5 transition-colors ${
                          active ? "bg-muted" : "hover:bg-muted"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{r.titulo}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {r.subtitulo}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>
      )}

      {showEmpty && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Sin resultados para &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
