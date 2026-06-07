import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import {
  presupuestos,
  lineasPresupuesto,
  vehiculos,
  clientes,
  talleres,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { PresupuestoPDF, type PresupuestoPDFData } from "@/lib/pdf/templates/presupuesto";
import QRCode from "qrcode";
import React from "react";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    // Fetch presupuesto (filtered by tallerId)
    const [presupuesto] = await db
      .select()
      .from(presupuestos)
      .where(and(eq(presupuestos.id, id), eq(presupuestos.tallerId, tallerId)));

    if (!presupuesto) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const [vehiculo] = await db
      .select()
      .from(vehiculos)
      .where(eq(vehiculos.id, presupuesto.vehiculoId));
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, presupuesto.clienteId));
    const [taller] = await db
      .select()
      .from(talleres)
      .where(eq(talleres.id, tallerId));
    const lineas = await db
      .select()
      .from(lineasPresupuesto)
      .where(eq(lineasPresupuesto.presupuestoId, id));

    // Generate QR code for public presupuesto page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fixa.ibclima.com";
    const publicUrl = presupuesto.tokenPublico
      ? `${appUrl}/presupuesto/${presupuesto.tokenPublico}`
      : null;

    let qrDataUrl: string | null = null;
    if (publicUrl) {
      qrDataUrl = await QRCode.toDataURL(publicUrl, {
        width: 200,
        margin: 1,
        color: { dark: "#1C1917", light: "#FFFFFF" },
      });
    }

    // Build PDF data
    const pdfData: PresupuestoPDFData = {
      tallerNombre: taller.nombre,
      tallerCif: taller.cif,
      tallerDireccion: taller.direccion,
      tallerTelefono: taller.telefono,
      tallerEmail: taller.email,
      tallerLogo: taller.logoUrl,
      fechaCreacion: presupuesto.createdAt,
      validezDias: presupuesto.validezDias ?? 30,
      notas: presupuesto.notas,
      clienteNombre: cliente?.nombre || "—",
      clienteNif: cliente?.nif,
      clienteTelefono: cliente?.telefono,
      clienteDireccion: cliente?.direccion,
      matricula: vehiculo?.matricula || "—",
      marca: vehiculo?.marca,
      modelo: vehiculo?.modelo,
      anio: vehiculo?.anio,
      vin: vehiculo?.vin,
      lineas: lineas.map((l) => ({
        tipo: l.tipo,
        descripcion: l.descripcion,
        cantidad: l.cantidad,
        precioUnitario: l.precioUnitario,
        descuentoPct: l.descuentoPct,
        ivaPct: l.ivaPct,
      })),
      qrDataUrl,
      publicUrl,
    };

    // Render PDF
    const buffer = await renderToBuffer(
      React.createElement(PresupuestoPDF, { data: pdfData }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="PT-${presupuesto.numero}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Error generating presupuesto PDF:", e);
    return NextResponse.json(
      { error: "Error al generar PDF" },
      { status: 500 }
    );
  }
}
