"use client";

import { useState, useRef } from "react";
import { Camera, Plus, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface Foto {
  id: string;
  url: string;
  descripcion: string | null;
  tipo: string | null;
}

export function FotosOrden({ ordenId, fotos: initialFotos }: { ordenId: string; fotos: Foto[] }) {
  const [fotos, setFotos] = useState<Foto[]>(initialFotos);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ordenId", ordenId);
        formData.append("tipo", "entrada");

        const res = await fetch("/api/fotos", { method: "POST", body: formData });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Error al subir foto");
          continue;
        }

        const data = await res.json();
        setFotos((prev) => [...prev, data.foto]);
      }
      toast.success("Foto(s) subida(s)");
    } catch {
      toast.error("Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5" />
          Fotos ({fotos.length})
        </p>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-xs"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Plus className="mr-1 h-3 w-3" />
          {uploading ? "Subiendo..." : "Añadir foto"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {fotos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {fotos.map((foto) => (
            <a
              key={foto.id}
              href={foto.url}
              target="_blank"
              className="relative aspect-square rounded-xl overflow-hidden bg-muted hover:opacity-90 transition-opacity"
            >
              <img
                src={foto.url}
                alt={foto.descripcion || "Foto del vehículo"}
                className="h-full w-full object-cover"
              />
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <ImageIcon className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Sin fotos. Usa el botón para añadir.</p>
        </div>
      )}
    </div>
  );
}
