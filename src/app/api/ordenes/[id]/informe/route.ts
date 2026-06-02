import { NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import {
  ordenesTrabajo,
  vehiculos,
  clientes,
  talleres,
  lineasOrden,
  fotosOrden,
  inspeccionesOrden,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

function esc(str: string | number | null | undefined): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const estadoInspeccionLabel: Record<string, string> = {
  bien: "Correcto",
  atencion: "Necesita atención",
  urgente: "Urgente",
  no_aplica: "No aplica",
};

const estadoInspeccionColor: Record<string, string> = {
  bien: "#059669",
  atencion: "#d97706",
  urgente: "#dc2626",
  no_aplica: "#6b7280",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { tallerId } = await getTallerIdFromAuth();
    const db = getDb();

    const [orden] = await db
      .select({
        id: ordenesTrabajo.id,
        numero: ordenesTrabajo.numero,
        estado: ordenesTrabajo.estado,
        descripcionCliente: ordenesTrabajo.descripcionCliente,
        diagnostico: ordenesTrabajo.diagnostico,
        kmEntrada: ordenesTrabajo.kmEntrada,
        fechaEntrada: ordenesTrabajo.fechaEntrada,
        fechaEntrega: ordenesTrabajo.fechaEntrega,
        matricula: vehiculos.matricula,
        marca: vehiculos.marca,
        modelo: vehiculos.modelo,
        anio: vehiculos.anio,
        km: vehiculos.km,
        clienteNombre: clientes.nombre,
        clienteTelefono: clientes.telefono,
        tallerNombre: talleres.nombre,
        tallerTelefono: talleres.telefono,
        tallerDireccion: talleres.direccion,
        tallerEmail: talleres.email,
        tallerCif: talleres.cif,
      })
      .from(ordenesTrabajo)
      .leftJoin(vehiculos, eq(ordenesTrabajo.vehiculoId, vehiculos.id))
      .leftJoin(clientes, eq(ordenesTrabajo.clienteId, clientes.id))
      .leftJoin(talleres, eq(ordenesTrabajo.tallerId, talleres.id))
      .where(
        and(eq(ordenesTrabajo.id, id), eq(ordenesTrabajo.tallerId, tallerId))
      );

    if (!orden)
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    const [lineas, fotos, inspecciones] = await Promise.all([
      db.select().from(lineasOrden).where(eq(lineasOrden.ordenId, id)),
      db.select().from(fotosOrden).where(eq(fotosOrden.ordenId, id)),
      db
        .select()
        .from(inspeccionesOrden)
        .where(eq(inspeccionesOrden.ordenId, id)),
    ]);

    // Build work lines HTML
    const lineasHtml = lineas
      .map(
        (l) =>
          `<div style="display:flex;justify-content:space-between;align-items:center;background:#fafaf9;border-radius:12px;padding:10px 14px;margin-bottom:6px">
        <div>
          <span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:bold;background:#e7e5e4;color:#57534e;margin-right:6px">${l.tipo === "mano_obra" ? "M.O." : l.tipo === "recambio" ? "Recambio" : "Otros"}</span>
          <span style="font-size:14px;font-weight:500">${esc(l.descripcion)}</span>
        </div>
      </div>`
      )
      .join("");

    // Build inspection HTML
    const inspeccionItems = inspecciones.filter((i) => i.estado !== "no_aplica");
    const inspeccionHtml = inspeccionItems
      .map(
        (i) =>
          `<div style="display:flex;justify-content:space-between;align-items:center;background:#fafaf9;border-radius:12px;padding:10px 14px;margin-bottom:6px">
        <div>
          <span style="font-size:14px;font-weight:500">${esc(i.item)}</span>
          <span style="font-size:12px;color:#78716c;margin-left:6px">(${esc(i.categoria)})</span>
        </div>
        <span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:10px;font-weight:bold;color:${estadoInspeccionColor[i.estado]};background:${i.estado === "bien" ? "#d1fae5" : i.estado === "atencion" ? "#fef3c7" : "#fee2e2"}">${estadoInspeccionLabel[i.estado]}</span>
      </div>`
      )
      .join("");

    // Items needing attention
    const itemsAtencion = inspecciones.filter(
      (i) => i.estado === "atencion" || i.estado === "urgente"
    );
    const atencionHtml = itemsAtencion
      .map(
        (i) =>
          `<div style="background:#fffbeb;border-radius:12px;padding:10px 14px;margin-bottom:6px">
        <span style="font-size:14px;font-weight:500">${esc(i.item)}</span>
        ${i.notas ? `<p style="font-size:12px;color:#78716c;margin:4px 0 0">${esc(i.notas)}</p>` : ""}
        <span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:10px;font-weight:bold;color:${estadoInspeccionColor[i.estado]};background:${i.estado === "atencion" ? "#fef3c7" : "#fee2e2"};margin-top:4px">${estadoInspeccionLabel[i.estado]}</span>
      </div>`
      )
      .join("");

    // Photos HTML
    const fotosHtml = fotos
      .map(
        (f) =>
          `<a href="${esc(f.url)}" target="_blank" style="display:inline-block;width:30%;margin:1%;border-radius:12px;overflow:hidden"><img src="${esc(f.url)}" alt="${esc(f.descripcion || "Foto")}" style="width:100%;height:auto;display:block;object-fit:cover" /></a>`
      )
      .join("");

    // Next recommended service
    const baseDate = orden.fechaEntrega
      ? new Date(orden.fechaEntrega)
      : new Date();
    const nextService = new Date(baseDate);
    nextService.setMonth(nextService.getMonth() + 6);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Informe — ${esc(orden.matricula)} — ${esc(orden.tallerNombre)}</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px 16px;color:#1c1917;background:#fff}
h1{font-size:24px;margin:0}
.section{margin:24px 0;padding:20px;border:1px solid #e7e5e4;border-radius:16px}
.section-title{font-size:10px;font-weight:bold;text-transform:uppercase;color:#78716c;letter-spacing:0.5px;margin-bottom:12px}
.vehicle-plate{font-size:22px;font-weight:800;letter-spacing:3px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.grid-item span{font-size:12px;color:#78716c}
.grid-item p{margin:2px 0 0;font-size:14px;font-weight:500}
.footer{text-align:center;color:#a8a29e;font-size:12px;margin-top:32px;padding-top:16px;border-top:1px solid #e7e5e4}
@media print{body{padding:0}.section{break-inside:avoid}}
</style></head><body>

<div style="text-align:center;margin-bottom:24px">
<h1>${esc(orden.tallerNombre)}</h1>
<div style="font-size:14px;color:#78716c">${[orden.tallerTelefono, orden.tallerEmail].filter(Boolean).map(esc).join(" · ")}</div>
${orden.tallerDireccion ? `<div style="font-size:12px;color:#a8a29e">${esc(orden.tallerDireccion)}</div>` : ""}
</div>

<div class="section">
<div class="section-title">Vehículo</div>
<p class="vehicle-plate">${esc(orden.matricula)}</p>
<div class="grid" style="margin-top:12px">
<div class="grid-item"><span>Marca / Modelo</span><p>${[orden.marca, orden.modelo].filter(Boolean).map(esc).join(" ") || "-"}</p></div>
<div class="grid-item"><span>Año</span><p>${esc(orden.anio) || "-"}</p></div>
<div class="grid-item"><span>Kilometraje</span><p>${orden.kmEntrada ? `${orden.kmEntrada.toLocaleString("es-ES")} km` : orden.km ? `${orden.km.toLocaleString("es-ES")} km` : "-"}</p></div>
<div class="grid-item"><span>Fecha entrada</span><p>${new Date(orden.fechaEntrada).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p></div>
</div>
</div>

${lineas.length > 0 ? `<div class="section"><div class="section-title">Trabajos realizados</div>${lineasHtml}</div>` : ""}

${orden.diagnostico ? `<div class="section"><div class="section-title">Diagnóstico</div><p style="font-size:14px;margin:0">${esc(orden.diagnostico)}</p></div>` : ""}

${inspeccionItems.length > 0 ? `<div class="section"><div class="section-title">Inspección del vehículo</div>${inspeccionHtml}</div>` : ""}

${itemsAtencion.length > 0 ? `<div class="section" style="border-color:#fbbf24"><div class="section-title" style="color:#d97706">⚠️ Requiere atención</div>${atencionHtml}</div>` : ""}

${fotos.length > 0 ? `<div class="section"><div class="section-title">Fotos</div><div style="display:flex;flex-wrap:wrap">${fotosHtml}</div></div>` : ""}

<div class="section" style="text-align:center">
<div class="section-title">Próxima revisión recomendada</div>
<p style="font-size:18px;font-weight:800;margin:4px 0">${nextService.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</p>
<p style="font-size:12px;color:#78716c;margin:4px 0">O cada 15.000 km, lo que ocurra primero</p>
</div>

<div class="footer">
<p>Informe generado por FIXA</p>
<p>${esc(orden.tallerNombre)}${orden.tallerTelefono ? ` · ${esc(orden.tallerTelefono)}` : ""}</p>
</div>

</body></html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
