import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { PlantillaOrPDF } from "@/lib/pdf/templates/plantilla-or";

// Lead magnet público: PDF de plantilla de orden de reparación (RD 1457/1986)
export async function GET() {
  try {
    const buffer = await renderToBuffer(React.createElement(PlantillaOrPDF) as any);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="plantilla-orden-de-reparacion-FIXA.pdf"',
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Error generando el PDF" }, { status: 500 });
  }
}
