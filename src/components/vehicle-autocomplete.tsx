"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { vehicleDatabase } from "@/lib/vehicle-database";

const brands = Object.keys(vehicleDatabase).sort();

export function MarcaAutocomplete({
  value,
  onChange,
  onModeloChange,
  name,
  placeholder = "Ej: Seat, BMW, BYD...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onModeloChange?: (models: string[]) => void;
  name?: string;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length < 1) { setFiltered([]); setOpen(false); return; }
    const term = value.toLowerCase();
    const matches = brands.filter((b) => b.toLowerCase().includes(term)).slice(0, 6);
    setFiltered(matches);
    // Auto-close if no matches (user is typing a custom brand)
    if (matches.length === 0) setOpen(false);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(brand: string) {
    onChange(brand);
    setOpen(false);
    if (onModeloChange) {
      onModeloChange(vehicleDatabase[brand] || []);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === "Tab" || e.key === "Escape") {
      setOpen(false);
      // If exact match exists, load its models
      if (onModeloChange && e.key !== "Escape") {
        const exact = brands.find((b) => b.toLowerCase() === value.toLowerCase());
        if (exact) onModeloChange(vehicleDatabase[exact] || []);
      }
    }
  }

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value.length >= 1 && filtered.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        name={name}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border bg-white shadow-lg max-h-40 overflow-y-auto">
          {filtered.map((brand) => (
            <button
              key={brand}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(brand)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {brand}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ModeloAutocomplete({
  value,
  onChange,
  modelos,
  name,
  placeholder = "Ej: Golf, León, 208...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  modelos: string[];
  name?: string;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length < 1 || modelos.length === 0) { setFiltered([]); setOpen(false); return; }
    const term = value.toLowerCase();
    const matches = modelos.filter((m) => m.toLowerCase().includes(term)).slice(0, 6);
    setFiltered(matches);
    if (matches.length === 0) setOpen(false);
  }, [value, modelos]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === "Tab" || e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value.length >= 1 && modelos.length > 0 && filtered.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        name={name}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border bg-white shadow-lg max-h-40 overflow-y-auto">
          {filtered.map((modelo) => (
            <button
              key={modelo}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(modelo); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {modelo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
