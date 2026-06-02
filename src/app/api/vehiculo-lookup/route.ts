import { NextRequest, NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { lookupVehicleByPlate } from "@/lib/vehicle-lookup";

export async function GET(request: NextRequest) {
  try {
    const { tallerId } = await getTallerIdFromAuth();

    const matricula = request.nextUrl.searchParams.get("matricula");
    if (!matricula || matricula.length < 4) {
      return NextResponse.json({ error: "Matrícula inválida" }, { status: 400 });
    }

    const result = await lookupVehicleByPlate(matricula, tallerId);

    if (!result) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      source: result.source,
      data: {
        matricula: result.matricula,
        marca: result.marca,
        modelo: result.modelo,
        anio: result.anio,
        combustible: result.combustible,
        color: result.color,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
