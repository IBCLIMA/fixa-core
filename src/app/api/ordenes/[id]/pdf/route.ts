import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import {
  ordenesTrabajo,
  vehiculos,
  clientes,
  talleres,
  lineasOrden,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { OrdenReparacionPDF, type OrdenPDFData } from "@/lib/pdf/templates/orden-reparacion";
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

    // Fetch all data
    const [orden] = await db
      .select()
      .from(ordenesTrabajo)
      .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

    if (!orden) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    const [vehiculo] = await db
      .select()
      .from(vehiculos)
      .where(eq(vehiculos.id, orden.vehiculoId));
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, orden.clienteId));
    const [taller] = await db
      .select()
      .from(talleres)
      .where(eq(talleres.id, tallerId));
    const lineas = await db
      .select()
      .from(lineasOrden)
      .where(eq(lineasOrden.ordenId, id));

    // Generate QR code
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fixa.ibclima.com";
    const trackingUrl = orden.tokenPublico
      ? `${appUrl}/estado/${orden.tokenPublico}`
      : null;

    let qrDataUrl: string | null = null;
    if (trackingUrl) {
      qrDataUrl = await QRCode.toDataURL(trackingUrl, {
        width: 200,
        margin: 1,
        color: { dark: "#1C1917", light: "#FFFFFF" },
      });
    }

    // Build PDF data
    const pdfData: OrdenPDFData = {
      tallerNombre: taller.nombre,
      tallerCif: taller.cif,
      tallerDireccion: taller.direccion,
      tallerTelefono: taller.telefono,
      tallerEmail: taller.email,
      tallerRegistro: taller.registroIndustrial,
      tallerRama: taller.ramaActividad,
      numero: orden.numero,
      estado: orden.estado,
      fechaEntrada: orden.fechaEntrada,
      fechaEstimada: orden.fechaEstimada,
      descripcionCliente: orden.descripcionCliente,
      diagnostico: orden.diagnostico,
      observacionesEntrada: orden.observacionesEntrada,
      kmEntrada: orden.kmEntrada,
      clienteNombre: cliente?.nombre || "—",
      clienteNif: cliente?.nif,
      clienteTelefono: cliente?.telefono,
      clienteDireccion: cliente?.direccion,
      matricula: vehiculo?.matricula || "—",
      marca: vehiculo?.marca,
      modelo: vehiculo?.modelo,
      anio: vehiculo?.anio,
      vin: vehiculo?.vin,
      color: vehiculo?.color,
      combustible: vehiculo?.combustible,
      lineas: lineas.map((l) => ({
        tipo: l.tipo,
        descripcion: l.descripcion,
        cantidad: l.cantidad,
        precioUnitario: l.precioUnitario,
        descuentoPct: l.descuentoPct,
        ivaPct: l.ivaPct,
        tipoPieza: l.tipoPieza,
      })),
      qrDataUrl,
      trackingUrl,
      firmaCliente: orden.firmaCliente,
    };

    // Render PDF
    const buffer = await renderToBuffer(
      React.createElement(OrdenReparacionPDF, { data: pdfData }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="OR-${orden.numero}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Error generating OR PDF:", e);
    return NextResponse.json(
      { error: "Error al generar PDF" },
      { status: 500 }
    );
  }
}
