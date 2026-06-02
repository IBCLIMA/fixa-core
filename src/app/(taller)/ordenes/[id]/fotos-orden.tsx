"use client";

import { useState, useRef } from "react";
import { Camera, Plus, X, Image as ImageIcon, Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

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

  const mediaCount = fotos.length;
  const videoCount = fotos.filter((f) => f.esVideo).length;
  const photoCount = mediaCount - videoCount;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5" />
          Media ({mediaCount})
          {videoCount > 0 && (
            <span className="text-muted-foreground font-normal normal-case">
              {photoCount} foto{photoCount !== 1 ? "s" : ""}, {videoCount} video{videoCount !== 1 ? "s" : ""}
            </span>
          )}
        </p>
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
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {fotos.map((foto) =>
            foto.esVideo ? (
              <a
                key={foto.id}
                href={foto.url}
                target="_blank"
                className="relative aspect-square rounded-xl overflow-hidden bg-muted hover:opacity-90 transition-opacity group"
              >
                <video
                  src={foto.url}
                  className="h-full w-full object-cover"
                  muted
                  preload="metadata"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <Play className="h-5 w-5 text-zinc-800 ml-0.5" />
                  </div>
                </div>
                {/* Video badge */}
                <div className="absolute top-1.5 left-1.5">
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    <Video className="h-2.5 w-2.5" />VIDEO
                  </span>
                </div>
              </a>
            ) : (
              <a
                key={foto.id}
                href={foto.url}
                target="_blank"
                className="relative aspect-square rounded-xl overflow-hidden bg-muted hover:opacity-90 transition-opacity"
              >
                <img
                  src={foto.url}
                  alt={foto.descripcion || "Foto del vehiculo"}
                  className="h-full w-full object-cover"
                />
              </a>
            )
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <ImageIcon className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Sin fotos ni videos. Usa los botones para subir.</p>
        </div>
      )}
    </div>
  );
}
