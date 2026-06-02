import { NextRequest, NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { ordenesTrabajo, lineasOrden, clientes, vehiculos } from "@/db/schema";
import { eq, and, gte, lt, desc } from "drizzle-orm";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const { tallerId, clerkUserId } = await getTallerIdFromAuth();
    const db = getDb();

    // Parse month param (YYYY-MM)
    const mes =
      request.nextUrl.searchParams.get("mes") ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

    const [year, month] = mes.split("-").map(Number);
    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json({ error: "Formato de mes inválido. Usa YYYY-MM" }, { status: 400 });
    }

    const desde = new Date(year, month - 1, 1);
    const hasta = new Date(year, month, 1);

    // Fetch delivered orders for the month
    const ordenes = await db
      .select({
        id: ordenesTrabajo.id,
        numero: ordenesTrabajo.numero,
        fechaEntrega: ordenesTrabajo.fechaEntrega,
        fechaEntrada: ordenesTrabajo.fechaEntrada,
        pagado: ordenesTrabajo.pagado,
        metodoPago: ordenesTrabajo.metodoPago,
        fechaPago: ordenesTrabajo.fechaPago,
        descripcionCliente: ordenesTrabajo.descripcionCliente,
        clienteNombre: clientes.nombre,
        clienteNif: clientes.nif,
        matricula: vehiculos.matricula,
      })
      .from(ordenesTrabajo)
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .where(
        and(
          eq(ordenesTrabajo.tallerId, tallerId),
          eq(ordenesTrabajo.estado, "entregado"),
          gte(ordenesTrabajo.fechaEntrega, desde),
          lt(ordenesTrabajo.fechaEntrega, hasta)
        )
      )
      .orderBy(desc(ordenesTrabajo.fechaEntrega));

    // Get line items for all orders
    const ordenIds = ordenes.map((o) => o.id);
    let lineasMap: Record<string, typeof lineasList> = {};
    let lineasList: Array<{
      ordenId: string;
      descripcion: string;
      cantidad: string;
      precioUnitario: string;
      ivaPct: string;
      descuentoPct: string | null;
    }> = [];

    if (ordenIds.length > 0) {
      const { inArray } = await import("drizzle-orm");
      lineasList = await db
        .select({
          ordenId: lineasOrden.ordenId,
          descripcion: lineasOrden.descripcion,
          cantidad: lineasOrden.cantidad,
          precioUnitario: lineasOrden.precioUnitario,
          ivaPct: lineasOrden.ivaPct,
          descuentoPct: lineasOrden.descuentoPct,
        })
        .from(lineasOrden)
        .where(inArray(lineasOrden.ordenId, ordenIds));

      for (const l of lineasList) {
        if (!lineasMap[l.ordenId]) lineasMap[l.ordenId] = [];
        lineasMap[l.ordenId].push(l);
      }
    }

    // Build CSV
    const header = [
      "Fecha",
      "Nº Orden",
      "Cliente",
      "NIF Cliente",
      "Matrícula",
      "Descripción",
      "Base Imponible",
      "IVA",
      "Total",
      "Estado Pago",
      "Método Pago",
      "Fecha Pago",
    ].join(";");

    const rows = ordenes.map((o) => {
      const lineas = lineasMap[o.id] || [];
      const descripcion = lineas[0]?.descripcion || o.descripcionCliente || "";

      // Calculate base imponible (without IVA)
      let baseImponible = 0;
      let totalIva = 0;
      for (const l of lineas) {
        const cant = Number(l.cantidad);
        const precio = Number(l.precioUnitario);
        const desc = Number(l.descuentoPct || 0);
        const lineBase = cant * precio * (1 - desc / 100);
        const iva = Number(l.ivaPct);
        baseImponible += lineBase;
        totalIva += lineBase * (iva / 100);
      }
      const total = baseImponible + totalIva;

      const fecha = o.fechaEntrega
        ? formatDateES(new Date(o.fechaEntrega))
        : formatDateES(new Date(o.fechaEntrada));

      const fechaPago = o.fechaPago ? formatDateES(new Date(o.fechaPago)) : "";

      const metodoPagoMap: Record<string, string> = {
        efectivo: "Efectivo",
        tarjeta: "Tarjeta",
        transferencia: "Transferencia",
        bizum: "Bizum",
        domiciliacion: "Domiciliación",
        otro: "Otro",
      };

      return [
        fecha,
        `OR-${o.numero}`,
        escapeCsv(o.clienteNombre || ""),
        escapeCsv(o.clienteNif || ""),
        escapeCsv(o.matricula || ""),
        escapeCsv(descripcion),
        formatDecimalES(baseImponible),
        formatDecimalES(totalIva),
        formatDecimalES(total),
        o.pagado ? "Pagado" : "Pendiente",
        o.metodoPago ? metodoPagoMap[o.metodoPago] || o.metodoPago : "",
        fechaPago,
      ].join(";");
    });

    const csv = "\uFEFF" + header + "\n" + rows.join("\n");

    logAudit({
      tallerId,
      userId: clerkUserId,
      action: "export",
      entityType: "gestoria",
      entityId: mes,
      details: { mes, ordenes: ordenes.length },
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="fixa-gestoria-${mes}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error al exportar" }, { status: 500 });
  }
}

function formatDateES(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDecimalES(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

function escapeCsv(s: string): string {
  if (s.includes(";") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
