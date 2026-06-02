import { getDb } from "@/db";
import { vehiculos } from "@/db/schema";
import { eq, and, ilike } from "drizzle-orm";

interface VehicleData {
  matricula: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  combustible?: string;
  color?: string;
  source: "local" | "api";
}

/**
 * Look up vehicle data by license plate.
 * 1. First checks our local database (free, instant)
 * 2. If not found and API key is configured, queries external API
 * 3. Returns whatever data we have
 */
export async function lookupVehicleByPlate(
  matricula: string,
  tallerId: string
): Promise<VehicleData | null> {
  const plate = matricula.trim().toUpperCase().replace(/[\s-]/g, "");

  // Step 1: Check our local database (free)
  const db = getDb();
  const existing = await db
    .select({
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
      anio: vehiculos.anio,
      combustible: vehiculos.combustible,
      color: vehiculos.color,
    })
    .from(vehiculos)
    .where(and(ilike(vehiculos.matricula, plate), eq(vehiculos.tallerId, tallerId)))
    .limit(1);

  if (existing.length > 0) {
    return {
      matricula: existing[0].matricula,
      marca: existing[0].marca ?? undefined,
      modelo: existing[0].modelo ?? undefined,
      anio: existing[0].anio ?? undefined,
      combustible: existing[0].combustible ?? undefined,
      color: existing[0].color ?? undefined,
      source: "local",
    };
  }

  // Step 2: Query external API if configured
  const apiKey = process.env.MATRICULA_API_KEY;
  if (apiKey) {
    try {
      const result = await queryMatriculaAPI(plate, apiKey);
      if (result) return { ...result, source: "api" };
    } catch (e) {
      console.error("[VehicleLookup] API error:", e);
    }
  }

  return null;
}

/**
 * Query MatriculaAPI.com (or compatible service)
 * Cost: ~0.20€ per query
 * Only called when vehicle is NOT in our local DB
 */
async function queryMatriculaAPI(
  plate: string,
  apiKey: string
): Promise<Omit<VehicleData, "source"> | null> {
  const apiUrl = process.env.MATRICULA_API_URL || "https://api.matriculaapi.com/v1/lookup";

  const res = await fetch(`${apiUrl}?plate=${encodeURIComponent(plate)}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(5000), // 5s timeout
  });

  if (!res.ok) {
    if (res.status === 404) return null; // Plate not found
    throw new Error(`MatriculaAPI returned ${res.status}`);
  }

  const data = await res.json();

  // Map API response to our format
  // Adjust field names based on the actual API you choose
  return {
    matricula: plate,
    marca: data.make || data.marca || data.brand,
    modelo: data.model || data.modelo,
    anio: data.year || data.anio || data.registration_year,
    combustible: mapCombustible(data.fuel || data.combustible || data.fuel_type),
    color: data.color,
  };
}

function mapCombustible(fuel?: string): string | undefined {
  if (!fuel) return undefined;
  const f = fuel.toLowerCase();
  if (f.includes("diesel") || f.includes("gasoil")) return "diesel";
  if (f.includes("gasol") || f.includes("petrol")) return "gasolina";
  if (f.includes("electr")) return "electrico";
  if (f.includes("hibr") || f.includes("hybrid")) return "hibrido";
  if (f.includes("glp") || f.includes("gas")) return "glp";
  return fuel;
}
