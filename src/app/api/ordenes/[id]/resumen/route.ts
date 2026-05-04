import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, vehiculos, clientes, talleres, lineasOrden } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    const [orden] = await db
      .select({
        numero: ordenesTrabajo.numero,
        estado: ordenesTrabajo.estado,
        descripcionCliente: ordenesTrabajo.descripcionCliente,
        diagnostico: ordenesTrabajo.diagnostico,
        kmEntrada: ordenesTrabajo.kmEntrada,
        fechaEntrada: ordenesTrabajo.fechaEntrada,
        matricula: vehiculos.matricula,
        marca: vehiculos.marca,
        modelo: vehiculos.modelo,
        clienteNombre: clientes.nombre,
        clienteTelefono: clientes.telefono,
        tallerNombre: talleres.nombre,
        tallerTelefono: talleres.telefono,
        tallerDireccion: talleres.direccion,
        tallerCif: talleres.cif,
      })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
      .where(and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId)));

    if (!orden) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    const lineas = await db.select().from(lineasOrden).where(eq(lineasOrden.ordenId, id));

    let totalBase = 0;
    let totalIva = 0;
    const lineasHtml = lineas.map((l) => {
      const qty = Number(l.cantidad);
      const price = Number(l.precioUnitario);
      const disc = Number(l.descuentoPct || 0);
      const iva = Number(l.ivaPct || 21);
      const base = qty * price * (1 - disc / 100);
      totalBase += base;
      totalIva += base * (iva / 100);
      return `<tr><td style="padding:8px;border-bottom:1px solid #eee">${l.tipo === "mano_obra" ? "M.O." : l.tipo === "recambio" ? "Recambio" : "Otros"}</td><td style="padding:8px;border-bottom:1px solid #eee">${l.descripcion}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${price.toFixed(2)}€</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${base.toFixed(2)}€</td></tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>OR-${orden.numero} — ${orden.tallerNombre}</title><style>body{font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1c1917}h1{font-size:24px;margin:0}table{width:100%;border-collapse:collapse;margin:16px 0}th{text-align:left;padding:8px;border-bottom:2px solid #e7e5e4;font-size:12px;text-transform:uppercase;color:#78716c}td{font-size:14px}.total{font-size:18px;font-weight:bold}.header{display:flex;justify-content:space-between;margin-bottom:24px}.badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:bold;background:#f5f5f4;color:#57534e}</style></head><body>
    <div class="header"><div><h1>OR-${orden.numero}</h1><p style="color:#78716c;margin:4px 0">${orden.tallerNombre || "FIXA"}</p>${orden.tallerTelefono ? `<p style="color:#78716c;margin:0;font-size:14px">${orden.tallerTelefono}</p>` : ""}${orden.tallerDireccion ? `<p style="color:#78716c;margin:0;font-size:14px">${orden.tallerDireccion}</p>` : ""}</div><div style="text-align:right"><span class="badge">${orden.estado}</span><p style="margin:8px 0 0;font-size:14px;color:#78716c">${new Date(orden.fechaEntrada).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p></div></div>
    <hr style="border:none;border-top:1px solid #e7e5e4">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0"><div><p style="font-size:12px;color:#78716c;margin:0">VEHÍCULO</p><p style="font-size:18px;font-weight:bold;margin:4px 0;letter-spacing:2px">${orden.matricula}</p><p style="color:#78716c;margin:0">${orden.marca || ""} ${orden.modelo || ""}</p>${orden.kmEntrada ? `<p style="color:#78716c;margin:0;font-size:14px">${orden.kmEntrada.toLocaleString("es-ES")} km</p>` : ""}</div><div><p style="font-size:12px;color:#78716c;margin:0">CLIENTE</p><p style="font-weight:bold;margin:4px 0">${orden.clienteNombre}</p>${orden.clienteTelefono ? `<p style="color:#78716c;margin:0;font-size:14px">${orden.clienteTelefono}</p>` : ""}</div></div>
    ${orden.descripcionCliente ? `<div style="background:#fafaf9;border-radius:8px;padding:12px;margin:16px 0"><p style="font-size:12px;color:#78716c;margin:0 0 4px">DESCRIPCIÓN</p><p style="margin:0;font-size:14px">${orden.descripcionCliente}</p></div>` : ""}
    ${orden.diagnostico ? `<div style="background:#fafaf9;border-radius:8px;padding:12px;margin:16px 0"><p style="font-size:12px;color:#78716c;margin:0 0 4px">DIAGNÓSTICO</p><p style="margin:0;font-size:14px">${orden.diagnostico}</p></div>` : ""}
    ${lineas.length > 0 ? `<table><thead><tr><th>Tipo</th><th>Descripción</th><th style="text-align:right">Cant.</th><th style="text-align:right">Precio</th><th style="text-align:right">Importe</th></tr></thead><tbody>${lineasHtml}</tbody></table><div style="text-align:right;margin:16px 0"><p style="margin:4px 0;color:#78716c">Base: ${totalBase.toFixed(2)}€</p><p style="margin:4px 0;color:#78716c">IVA: ${totalIva.toFixed(2)}€</p><p class="total">Total: ${(totalBase + totalIva).toFixed(2)}€</p></div>` : ""}
    <hr style="border:none;border-top:1px solid #e7e5e4;margin-top:24px"><p style="text-align:center;color:#a8a29e;font-size:12px;margin-top:16px">Generado con FIXA — fixa.es</p></body></html>`;

    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
