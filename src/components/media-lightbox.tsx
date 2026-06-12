"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play, Video } from "lucide-react";

export interface MediaItem {
  id: string;
  url: string;
  descripcion?: string | null;
  esVideo?: boolean;
}

/**
 * Lightbox a pantalla completa: flechas, teclado, swipe táctil y contador.
 * Pensado para fotos de taller vistas desde el móvil.
 */
export function MediaLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const item = items[index];

  const prev = useCallback(
    () => onNavigate((index - 1 + items.length) % items.length),
    [index, items.length, onNavigate]
  );
  const next = useCallback(
    () => onNavigate((index + 1) % items.length),
    [index, items.length, onNavigate]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) (delta > 0 ? prev : next)();
        touchStartX.current = null;
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de fotos"
    >
      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Contador */}
      {items.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          {index + 1} / {items.length}
        </div>
      )}

      {/* Media */}
      <div
        className="relative max-h-[85vh] max-w-[92vw] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.esVideo ? (
          <video
            key={item.id}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] max-w-[92vw] rounded-xl"
          />
        ) : (
          <Image
            key={item.id}
            src={item.url}
            alt={item.descripcion || "Foto del vehículo"}
            fill
            sizes="92vw"
            className="object-contain"
            priority
          />
        )}
      </div>

      {/* Descripción */}
      {item.descripcion && (
        <p className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-[85vw] truncate rounded-full bg-black/60 px-4 py-1.5 text-xs text-white">
          {item.descripcion}
        </p>
      )}

      {/* Flechas (escritorio) */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Galería en grid con lightbox integrado (fotos y vídeos).
 * Reutilizable: orden del taller e informe público del cliente.
 */
export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer group focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            aria-label={m.esVideo ? "Ver vídeo" : "Ver foto"}
          >
            {m.esVideo ? (
              <>
                <video src={m.url} className="h-full w-full object-cover" muted preload="metadata" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <Play className="h-5 w-5 text-zinc-800 ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-1.5 left-1.5">
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    <Video className="h-2.5 w-2.5" />VIDEO
                  </span>
                </div>
              </>
            ) : (
              <Image
                src={m.url}
                alt={m.descripcion || "Foto del vehículo"}
                fill
                sizes="(max-width: 640px) 33vw, 150px"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <MediaLightbox
          items={items}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
