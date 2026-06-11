// Client-side OCR processing for vehicle registration cards (ficha técnica)
// Extracts: matrícula, VIN, marca, modelo, fecha matriculación, combustible
//
// Spanish ficha técnica has standardized fields:
// - Field (A): Matrícula
// - Field (D.1): Marca
// - Field (D.2): Tipo/Variante/Versión
// - Field (D.3): Nombre comercial (modelo)
// - Field (E): VIN (número de bastidor)
// - Field (B): Fecha primera matriculación
// - Field (P.3): Combustible
// - Field (J): Categoría del vehículo
// - Field (R): Color

import Tesseract from "tesseract.js";

export interface VehicleOCRResult {
  matricula: string | null;
  vin: string | null;
  marca: string | null;
  modelo: string | null;
  fechaMatriculacion: string | null;
  combustible: string | null;
  color: string | null;
  rawText: string;
}

export async function extractVehicleData(
  file: File | Blob,
  onProgress?: (progress: number) => void
): Promise<VehicleOCRResult> {
  const result = await Tesseract.recognize(file, "spa", {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const rawText = result.data.text;
  return parseVehicleText(rawText);
}

/**
 * OCR ligero: solo busca una matrícula española en la foto
 * (para apuntar con la cámara a la placa del coche).
 */
export async function extractMatriculaFromImage(
  file: File | Blob,
  onProgress?: (progress: number) => void
): Promise<string | null> {
  const result = await Tesseract.recognize(file, "spa", {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });
  const plate = extractMatricula(result.data.text.replace(/[ \t]+/g, " "));
  return plate ? plate.replace(/[\s\-]/g, "").toUpperCase() : null;
}

function parseVehicleText(text: string): VehicleOCRResult {
  // Normalize text: remove extra spaces, normalize line endings
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  const lines = normalized.split("\n").map((l) => l.trim());
  const fullText = lines.join(" ");

  return {
    matricula: extractMatricula(fullText),
    vin: extractVIN(fullText),
    marca: extractMarca(lines, fullText),
    modelo: extractModelo(lines, fullText),
    fechaMatriculacion: extractFecha(lines, fullText),
    combustible: extractCombustible(fullText),
    color: extractColor(lines, fullText),
    rawText: normalized,
  };
}

function extractMatricula(text: string): string | null {
  // Spanish plate format: 4 digits + 3 letters (e.g., "1234 BCD" or "1234BCD")
  const match = text.match(/\b(\d{4})\s*([B-DF-HJ-NP-TV-Z]{3})\b/i);
  if (match) {
    return `${match[1]} ${match[2].toUpperCase()}`;
  }
  // Old format with province letters (e.g., "M 1234 AB")
  const oldMatch = text.match(
    /\b([A-Z]{1,2})\s*[-]?\s*(\d{4})\s*[-]?\s*([A-Z]{2})\b/i
  );
  if (oldMatch) {
    return `${oldMatch[1].toUpperCase()}-${oldMatch[2]}-${oldMatch[3].toUpperCase()}`;
  }
  return null;
}

function extractVIN(text: string): string | null {
  // VIN is 17 alphanumeric characters (no I, O, Q)
  const match = text.match(
    /\b([A-HJ-NPR-Z0-9]{17})\b/i
  );
  if (match) {
    return match[1].toUpperCase();
  }
  // Try after "VIN" or "E" field label
  const vinMatch = text.match(
    /(?:VIN|bastidor|[(\[]?\s*E\s*[)\]]?)\s*[:\-.]?\s*([A-HJ-NPR-Z0-9]{17})/i
  );
  if (vinMatch) {
    return vinMatch[1].toUpperCase();
  }
  return null;
}

function extractMarca(lines: string[], fullText: string): string | null {
  // Look for field D.1 or "MARCA"
  for (const line of lines) {
    const match = line.match(
      /(?:D\.?\s*1|MARCA)\s*[:\-.]?\s*([A-ZÀ-Ú][A-ZÀ-Ú\s]{1,30})/i
    );
    if (match) {
      return match[1].trim();
    }
  }
  // Known brands in text
  const brands = [
    "SEAT", "RENAULT", "PEUGEOT", "CITROEN", "CITROËN", "FORD", "OPEL",
    "VOLKSWAGEN", "BMW", "MERCEDES", "AUDI", "TOYOTA", "HYUNDAI", "KIA",
    "NISSAN", "FIAT", "DACIA", "SKODA", "MAZDA", "VOLVO", "HONDA",
    "SUZUKI", "MITSUBISHI", "JEEP", "LAND ROVER", "MINI", "CUPRA",
    "TESLA", "MG", "BYD",
  ];
  for (const brand of brands) {
    if (fullText.toUpperCase().includes(brand)) {
      return brand;
    }
  }
  return null;
}

function extractModelo(lines: string[], fullText: string): string | null {
  // Look for field D.3 or "DENOMINACIÓN COMERCIAL"
  for (const line of lines) {
    const match = line.match(
      /(?:D\.?\s*3|DENOMINACI[OÓ]N\s+COMERCIAL|NOMBRE\s+COMERCIAL)\s*[:\-.]?\s*(.{2,40})/i
    );
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function extractFecha(lines: string[], fullText: string): string | null {
  // Look for date after "B" field or "PRIMERA MATRICULACIÓN"
  for (const line of lines) {
    const match = line.match(
      /(?:[(\[]?\s*B\s*[)\]]?|PRIMERA\s+MATRICULACI[OÓ]N|FECHA)\s*[:\-.]?\s*(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})/i
    );
    if (match) {
      const day = match[1].padStart(2, "0");
      const month = match[2].padStart(2, "0");
      const year =
        match[3].length === 2 ? `20${match[3]}` : match[3];
      return `${year}-${month}-${day}`;
    }
  }
  // Generic date pattern DD/MM/YYYY
  const dateMatch = fullText.match(
    /(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})/
  );
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, "0");
    const month = dateMatch[2].padStart(2, "0");
    return `${dateMatch[3]}-${month}-${day}`;
  }
  return null;
}

function extractCombustible(text: string): string | null {
  const upper = text.toUpperCase();
  if (upper.includes("GASOLINA")) return "gasolina";
  if (upper.includes("DIESEL") || upper.includes("DIÉSEL") || upper.includes("GASÓLEO") || upper.includes("GASOLEO"))
    return "diesel";
  if (upper.includes("ELÉCTRICO") || upper.includes("ELECTRICO") || upper.includes("BEV"))
    return "electrico";
  if (upper.includes("HÍBRIDO") || upper.includes("HIBRIDO") || upper.includes("HEV") || upper.includes("PHEV"))
    return "hibrido";
  if (upper.includes("GLP") || upper.includes("AUTOGAS")) return "glp";
  return null;
}

function extractColor(lines: string[], fullText: string): string | null {
  // Look for field R or "COLOR"
  for (const line of lines) {
    const match = line.match(
      /(?:[(\[]?\s*R\s*[)\]]?|COLOR)\s*[:\-.]?\s*([A-ZÀ-Ú][a-zà-ú]{2,15})/i
    );
    if (match) {
      return match[1].trim().toLowerCase();
    }
  }
  // Common colors
  const colors: Record<string, string> = {
    BLANCO: "blanco", NEGRO: "negro", GRIS: "gris", PLATA: "plata",
    ROJO: "rojo", AZUL: "azul", VERDE: "verde", AMARILLO: "amarillo",
    NARANJA: "naranja", MARRÓN: "marrón", MARRON: "marrón", BEIGE: "beige",
  };
  const upper = fullText.toUpperCase();
  for (const [key, value] of Object.entries(colors)) {
    if (upper.includes(key)) return value;
  }
  return null;
}
