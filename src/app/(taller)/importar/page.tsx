"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, Users, Car, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ImportarPage() {
  const [tipo, setTipo] = useState<"clientes" | "vehiculos">("clientes");
  const [uploading, setUploading] = useState(false);
  const [resultado, setResultado] = useState<{
    importados: number;
    errores: number;
    total: number;
    mensajes: string[];
  } | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Solo se aceptan archivos CSV");
      return;
    }

    setUploading(true);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipo", tipo);

      const res = await fetch("/api/importar", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al importar");
        return;
      }

      setResultado(data);
      toast.success(`${data.importados} registros importados`);
    } catch {
      toast.error("Error al subir el archivo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function descargarPlantilla() {
    let csv = "";
    if (tipo === "clientes") {
      csv = "nombre,telefono,email,nif,direccion\nAntonio García,612345678,antonio@email.com,12345678A,Calle Mayor 1\nMaría López,623456789,,87654321B,";
    } else {
      csv = "matricula,marca,modelo,anio,km,combustible,color,fecha_itv,cliente_nombre,cliente_telefono\n4532HBK,Seat,León,2019,87500,gasolina,Negro,2026-06-15,Antonio García,612345678\n7891JNM,Renault,Clio,2020,52000,diesel,Blanco,,María López,623456789";
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plantilla-${tipo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Importar datos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sube un archivo CSV con tus clientes o vehículos desde tu sistema anterior
        </p>
      </div>

      {/* Selector de tipo */}
      <div className="flex gap-2">
        <button
          onClick={() => { setTipo("clientes"); setResultado(null); }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl p-4 border-2 transition-all ${
            tipo === "clientes" ? "border-orange-500 bg-orange-50" : "border-stone-200 hover:border-stone-300"
          }`}
        >
          <Users className={`h-5 w-5 ${tipo === "clientes" ? "text-orange-600" : "text-stone-400"}`} />
          <span className={`font-bold text-sm ${tipo === "clientes" ? "text-orange-700" : "text-stone-600"}`}>Clientes</span>
        </button>
        <button
          onClick={() => { setTipo("vehiculos"); setResultado(null); }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl p-4 border-2 transition-all ${
            tipo === "vehiculos" ? "border-blue-500 bg-blue-50" : "border-stone-200 hover:border-stone-300"
          }`}
        >
          <Car className={`h-5 w-5 ${tipo === "vehiculos" ? "text-blue-600" : "text-stone-400"}`} />
          <span className={`font-bold text-sm ${tipo === "vehiculos" ? "text-blue-700" : "text-stone-600"}`}>Vehículos</span>
        </button>
      </div>

      {/* Formato esperado */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            Formato del CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3 overflow-x-auto">
            <code className="text-xs">
              {tipo === "clientes" ? (
                "nombre, telefono, email, nif, direccion"
              ) : (
                "matricula, marca, modelo, anio, km, combustible, color, fecha_itv, cliente_nombre, cliente_telefono"
              )}
            </code>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            {tipo === "clientes" ? (
              <>
                <p>• <strong>nombre</strong> — obligatorio</p>
                <p>• <strong>telefono</strong> — para enviar WhatsApp</p>
                <p>• También acepta columnas: name, cliente, razonsocial, phone, tlf, correo, dni, cif, domicilio</p>
              </>
            ) : (
              <>
                <p>• <strong>matricula</strong> — obligatorio</p>
                <p>• <strong>cliente_nombre</strong> — obligatorio (se vincula o crea automáticamente)</p>
                <p>• <strong>combustible</strong> — gasolina, diesel, electrico, hibrido, glp</p>
                <p>• <strong>fecha_itv</strong> — formato YYYY-MM-DD</p>
              </>
            )}
          </div>

          <Button variant="outline" size="sm" className="rounded-full" onClick={descargarPlantilla}>
            <Download className="mr-1.5 h-3 w-3" />Descargar plantilla de ejemplo
          </Button>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardContent className="p-6">
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 p-8 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all">
            <Upload className="h-8 w-8 text-stone-300 mb-3" />
            <p className="text-sm font-bold text-stone-700">
              {uploading ? "Importando..." : "Haz clic o arrastra tu archivo CSV"}
            </p>
            <p className="text-xs text-stone-400 mt-1">Solo archivos .csv</p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </CardContent>
      </Card>

      {/* Resultado */}
      {resultado && (
        <Card className={resultado.errores > 0 ? "border-amber-200" : "border-emerald-200"}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              {resultado.errores === 0 ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-amber-600" />
              )}
              <div>
                <p className="font-bold">
                  {resultado.importados} de {resultado.total} importados correctamente
                </p>
                {resultado.errores > 0 && (
                  <p className="text-xs text-amber-600">{resultado.errores} registros con errores (ignorados)</p>
                )}
              </div>
            </div>
            {resultado.mensajes.length > 0 && (
              <div className="space-y-1">
                {resultado.mensajes.map((m, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {m}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
