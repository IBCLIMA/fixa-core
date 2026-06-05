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
  placeholder = "Seat",
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
    if (value.length < 1) { setFiltered([]); return; }
    const term = value.toLowerCase();
    setFiltered(brands.filter((b) => b.toLowerCase().includes(term)).slice(0, 8));
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

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value.length >= 1 && setOpen(true)}
        name={name}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border bg-white shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((brand) => (
            <button
              key={brand}
              type="button"
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
  placeholder = "León",
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
    if (value.length < 1 || modelos.length === 0) { setFiltered([]); return; }
    const term = value.toLowerCase();
    setFiltered(modelos.filter((m) => m.toLowerCase().includes(term)).slice(0, 8));
  }, [value, modelos]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => { if (value.length >= 1 && modelos.length > 0) setOpen(true); }}
        name={name}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border bg-white shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((modelo) => (
            <button
              key={modelo}
              type="button"
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
