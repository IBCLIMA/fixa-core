"use client";

import { useState, useRef } from "react";
import { Plus, X, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MediaGallery } from "@/components/media-lightbox";

interface Foto {
  id: string;
  url: string;
  descripcion: string | null;
  tipo: string | null;
  esVideo?: boolean;
}

export function FotosOrden({ ordenId, fotos: initialFotos }: { ordenId: string; fotos: Foto[] }) {
  const [fotos, setFotos] = useState<Foto[]>(initialFotos);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
          toast.error(data.error || "Error al subir archivo");
          continue;
        }

        const data = await res.json();
        setFotos((prev) => [...prev, data.foto]);
        if (data.hint) {
          toast.info(data.hint);
        }
      }
      const isVideo = files[0]?.type?.startsWith("video/");
      toast.success(isVideo ? "Video(s) subido(s)" : "Foto(s) subida(s)");
    } catch {
      toast.error("Error al subir");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-xs"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
          >
            <Plus className="mr-1 h-3 w-3" />
            {uploading ? "Subiendo..." : "Foto"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-xs"
            onClick={() => videoInputRef.current?.click()}
            disabled={uploading}
          >
            <Video className="mr-1 h-3 w-3" />
            {uploading ? "Subiendo..." : "Video"}
          </Button>
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          capture="environment"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {fotos.length > 0 ? (
        <MediaGallery items={fotos} />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <ImageIcon className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Sin fotos ni videos. Usa los botones para subir.</p>
        </div>
      )}
    </div>
  );
}
