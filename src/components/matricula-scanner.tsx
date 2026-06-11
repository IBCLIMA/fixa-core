"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * Botón de cámara: foto a la matrícula del coche → OCR → devuelve la placa.
 * El OCR (tesseract.js) se carga bajo demanda para no engordar el bundle.
 */
export function MatriculaScanner({ onDetect }: { onDetect: (matricula: string) => void }) {
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setScanning(true);
    try {
      const { extractMatriculaFromImage } = await import("@/lib/ocr-vehicle");
      const plate = await extractMatriculaFromImage(file);
      if (plate) {
        onDetect(plate);
        toast.success(`Matrícula detectada: ${plate}`);
      } else {
        toast.error("No se ha podido leer la matrícula. Acércate más y evita reflejos.");
      }
    } catch {
      toast.error("Error al procesar la foto");
    } finally {
      setScanning(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={scanning}
        onClick={() => inputRef.current?.click()}
        className="h-14 w-14 shrink-0 rounded-xl border-dashed border-2 hover:border-brand"
        aria-label="Escanear matrícula con la cámara"
        title="Foto a la matrícula"
      >
        {scanning ? (
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
        ) : (
          <Camera className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </>
  );
}
