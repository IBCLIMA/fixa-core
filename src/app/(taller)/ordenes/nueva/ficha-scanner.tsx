"use client";

import { useState, useRef } from "react";
import { Camera, Check, RotateCcw, Loader2, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractVehicleData, type VehicleOCRResult } from "@/lib/ocr-vehicle";

interface FichaScannerProps {
  onApply: (data: VehicleOCRResult) => void;
}

export function FichaScanner({ onApply }: FichaScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VehicleOCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setScanning(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const data = await extractVehicleData(file, setProgress);
      const hasAnyField =
        data.matricula || data.vin || data.marca || data.modelo || data.combustible;
      if (!hasAnyField) {
        setError("No se han podido extraer datos. Intenta con otra foto con mejor iluminación.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Error al procesar la imagen. Inténtalo de nuevo.");
    } finally {
      setScanning(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be selected again
    e.target.value = "";
  }

  function reset() {
    setResult(null);
    setError(null);
    setProgress(0);
  }

  // Not scanning, no result
  if (!scanning && !result && !error) {
    return (
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-xl h-11 w-full border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-brand"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="mr-2 h-4 w-4" />
          Escanear ficha técnica
        </Button>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">
          Haz una foto a la ficha técnica del vehículo para rellenar los datos automáticamente
        </p>
      </div>
    );
  }

  // Scanning
  if (scanning) {
    return (
      <div className="rounded-xl border-2 border-dashed border-brand/30 bg-brand/5 p-6 text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand mx-auto" />
        <div>
          <p className="text-sm font-bold">Escaneando ficha técnica...</p>
          <p className="text-xs text-muted-foreground mt-1">{progress}% completado</p>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-brand h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">{error}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => {
            reset();
            inputRef.current?.click();
          }}
        >
          <RotateCcw className="mr-1.5 h-3 w-3" />
          Reintentar
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  // Result
  if (result) {
    const fields = [
      { label: "Matrícula", value: result.matricula },
      { label: "VIN", value: result.vin },
      { label: "Marca", value: result.marca },
      { label: "Modelo", value: result.modelo },
      { label: "Combustible", value: result.combustible },
      { label: "Color", value: result.color },
      { label: "Fecha matric.", value: result.fechaMatriculacion },
    ];

    return (
      <div className="rounded-xl border-2 border-brand/30 bg-brand/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-brand" />
          <p className="text-sm font-bold">Datos extraídos de la ficha</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-1.5 text-sm">
              {f.value ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              ) : (
                <span className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="text-muted-foreground">{f.label}:</span>
              <span className="font-medium truncate">
                {f.value || <span className="text-muted-foreground/50 italic">no detectado</span>}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            className="rounded-full flex-1"
            onClick={() => {
              onApply(result);
              reset();
            }}
          >
            <Check className="mr-1.5 h-3 w-3" />
            Aplicar datos
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => {
              reset();
              inputRef.current?.click();
            }}
          >
            <RotateCcw className="mr-1.5 h-3 w-3" />
            Reintentar
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return null;
}
