"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { vehicleDatabase } from "@/lib/vehicle-database";

const brands = Object.keys(vehicleDatabase).sort();

function useAutocomplete(items: string[], value: string) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [filtered, setFiltered] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length < 1) { setFiltered([]); setOpen(false); return; }
    const term = value.toLowerCase();
    const matches = items.filter((b) => b.toLowerCase().includes(term)).slice(0, 6);
    setFiltered(matches);
    setHighlighted(-1);
    if (matches.length === 0) setOpen(false);
  }, [value, items]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent, onSelect: (val: string) => void) {
    if (!open || filtered.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      onSelect(filtered[highlighted]);
      setOpen(false);
      setHighlighted(-1);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      setHighlighted(-1);
    }
  }

  return { open, setOpen, filtered, highlighted, ref, handleKeyDown };
}

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
  const { open, setOpen, filtered, highlighted, ref, handleKeyDown } = useAutocomplete(brands, value);

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
        onFocus={() => value.length >= 1 && filtered.length > 0 && setOpen(true)}
        onKeyDown={(e) => handleKeyDown(e, select)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        name={name}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border bg-popover text-popover-foreground shadow-lg max-h-[min(18rem,55vh)] overflow-y-auto overscroll-contain" role="listbox">
          {filtered.map((brand, i) => (
            <button
              key={brand}
              type="button"
              role="option"
              aria-selected={i === highlighted}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(brand)}
              className={`flex w-full min-h-11 items-center text-left px-3.5 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                i === highlighted
                  ? "bg-brand-50 text-brand-700"
                  : "hover:bg-muted active:bg-brand-50 active:text-brand-700"
              }`}
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
  const { open, setOpen, filtered, highlighted, ref, handleKeyDown } = useAutocomplete(modelos, value);

  function select(modelo: string) {
    onChange(modelo);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <Input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value.length >= 1 && modelos.length > 0 && filtered.length > 0 && setOpen(true)}
        onKeyDown={(e) => handleKeyDown(e, select)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        name={name}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border bg-popover text-popover-foreground shadow-lg max-h-[min(18rem,55vh)] overflow-y-auto overscroll-contain" role="listbox">
          {filtered.map((modelo, i) => (
            <button
              key={modelo}
              type="button"
              role="option"
              aria-selected={i === highlighted}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(modelo)}
              className={`flex w-full min-h-11 items-center text-left px-3.5 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                i === highlighted
                  ? "bg-brand-50 text-brand-700"
                  : "hover:bg-muted active:bg-brand-50 active:text-brand-700"
              }`}
            >
              {modelo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
