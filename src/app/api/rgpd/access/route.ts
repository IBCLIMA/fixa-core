import { NextRequest, NextResponse } from "next/server";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import {
  clientes,
  vehiculos,
  ordenesTrabajo,
  presupuestos,
  citas,
  fotosOrden,
  lineasOrden,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { tallerId } = await getTallerIdFromAuth();
    const clienteId = request.nextUrl.searchParams.get("clienteId");

    if (!clienteId) {
      return NextResponse.json({ error: "clienteId requerido" }, { status: 400 });
    }

    const db = getDb();

    // Verificar que el cliente pertenece al taller
    const [cliente] = await db.select().from(clientes).where(and(eq(clientes.id, clienteId), eq(clientes.tallerId, tallerId)));

    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    // Obtener datos relacionados
    const vehiculosCliente = await db
      .select()
      .from(vehiculos)
      .where(and(eq(vehiculos.clienteId, clienteId), eq(vehiculos.tallerId, tallerId)));

    const ordenesCliente = await db
      .select()
      .from(ordenesTrabajo)
      .where(and(eq(ordenesTrabajo.clienteId, clienteId), eq(ordenesTrabajo.tallerId, tallerId)));

    const presupuestosCliente = await db
      .select()
      .from(presupuestos)
      .where(and(eq(presupuestos.clienteId, clienteId), eq(presupuestos.tallerId, tallerId)));

    const citasCliente = await db
      .select()
      .from(citas)
      .where(and(eq(citas.clienteId, clienteId), eq(citas.tallerId, tallerId)));

    const ordenIds = ordenesCliente.map((o) => o.id);
    let totalFotos = 0;
    for (const oid of ordenIds) {
      const fotos = await db.select({ id: fotosOrden.id }).from(fotosOrden).where(eq(fotosOrden.ordenId, oid));
      totalFotos += fotos.length;
    }

    const fechaRegistro = cliente.createdAt ? new Date(cliente.createdAt).toLocaleDateString("es-ES") : "No disponible";

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe de Acceso a Datos - RGPD Art. 15</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1c1917; line-height: 1.6; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    h2 { font-size: 18px; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e7e5e4; }
    h3 { font-size: 15px; margin: 16px 0 8px; color: #57534e; }
    .subtitle { color: #78716c; margin-bottom: 24px; }
    .legal-notice { background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e7e5e4; font-size: 14px; }
    th { background: #f5f5f4; font-weight: 600; color: #57534e; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: #e7e5e4; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e7e5e4; font-size: 12px; color: #a8a29e; }
  </style>
</head>
<body>
  <h1>Informe de Acceso a Datos Personales</h1>
  <p class="subtitle">Conforme al Art. 15 del Reglamento General de Proteccion de Datos (RGPD)</p>

  <div class="legal-notice">
    <strong>Base legal:</strong> Este informe se genera en ejercicio del derecho de acceso del interesado (Art. 15 RGPD).
    Contiene todos los datos personales que el responsable del tratamiento tiene almacenados sobre el cliente identificado.
  </div>

  <h2>1. Datos de identificacion del cliente</h2>
  <table>
    <tr><th>Campo</th><th>Valor</th><th>Finalidad</th></tr>
    <tr><td>Nombre</td><td>${escapeHtml(cliente.nombre)}</td><td>Identificacion, facturacion</td></tr>
    <tr><td>Telefono</td><td>${escapeHtml(cliente.telefono || "No proporcionado")}</td><td>Comunicacion sobre reparaciones</td></tr>
    <tr><td>Email</td><td>${escapeHtml(cliente.email || "No proporcionado")}</td><td>Envio de presupuestos y notificaciones</td></tr>
    <tr><td>NIF</td><td>${escapeHtml(cliente.nif || "No proporcionado")}</td><td>Facturacion, obligaciones fiscales</td></tr>
    <tr><td>Direccion</td><td>${escapeHtml(cliente.direccion || "No proporcionado")}</td><td>Facturacion</td></tr>
    <tr><td>Notas</td><td>${escapeHtml(cliente.notas || "Ninguna")}</td><td>Gestion interna del taller</td></tr>
  </table>
  <p><strong>Fecha de recogida:</strong> ${fechaRegistro}</p>
  <p><strong>Periodo de conservacion:</strong> Mientras dure la relacion comercial + 4 anios (obligaciones fiscales)</p>

  <h2>2. Vehiculos registrados (${vehiculosCliente.length})</h2>
  ${vehiculosCliente.length > 0 ? `
  <table>
    <tr><th>Matricula</th><th>Marca</th><th>Modelo</th><th>Anio</th><th>VIN</th></tr>
    ${vehiculosCliente.map((v) => `
    <tr>
      <td>${escapeHtml(v.matricula)}</td>
      <td>${escapeHtml(v.marca || "-")}</td>
      <td>${escapeHtml(v.modelo || "-")}</td>
      <td>${v.anio || "-"}</td>
      <td>${escapeHtml(v.vin || "-")}</td>
    </tr>`).join("")}
  </table>
  <p><strong>Finalidad:</strong> Gestion de reparaciones, avisos ITV y mantenimiento</p>
  ` : "<p>No hay vehiculos registrados.</p>"}

  <h2>3. Ordenes de trabajo (${ordenesCliente.length})</h2>
  ${ordenesCliente.length > 0 ? `
  <table>
    <tr><th>Numero</th><th>Estado</th><th>Fecha entrada</th><th>Descripcion</th></tr>
    ${ordenesCliente.map((o) => `
    <tr>
      <td>#${o.numero}</td>
      <td><span class="badge">${o.estado}</span></td>
      <td>${new Date(o.fechaEntrada).toLocaleDateString("es-ES")}</td>
      <td>${escapeHtml(o.descripcionCliente || "-")}</td>
    </tr>`).join("")}
  </table>
  <p><strong>Finalidad:</strong> Prestacion del servicio de reparacion</p>
  <p><strong>Periodo de conservacion:</strong> 4 anios minimo (obligaciones fiscales)</p>
  ` : "<p>No hay ordenes registradas.</p>"}

  <h2>4. Presupuestos (${presupuestosCliente.length})</h2>
  ${presupuestosCliente.length > 0 ? `
  <table>
    <tr><th>Numero</th><th>Estado</th><th>Fecha</th></tr>
    ${presupuestosCliente.map((p) => `
    <tr>
      <td>#${p.numero}</td>
      <td><span class="badge">${p.estado}</span></td>
      <td>${new Date(p.createdAt).toLocaleDateString("es-ES")}</td>
    </tr>`).join("")}
  </table>
  ` : "<p>No hay presupuestos registrados.</p>"}

  <h2>5. Citas (${citasCliente.length})</h2>
  ${citasCliente.length > 0 ? `
  <table>
    <tr><th>Fecha</th><th>Motivo</th><th>Estado</th></tr>
    ${citasCliente.map((c) => `
    <tr>
      <td>${c.fecha}</td>
      <td>${escapeHtml(c.motivo || "-")}</td>
      <td><span class="badge">${c.estado}</span></td>
    </tr>`).join("")}
  </table>
  ` : "<p>No hay citas registradas.</p>"}

  <h2>6. Fotografias almacenadas</h2>
  <p>Se almacenan <strong>${totalFotos}</strong> fotografias asociadas a las ordenes de trabajo de este cliente.</p>
  <p><strong>Almacenamiento:</strong> Vercel Blob (servidores en la UE/EE.UU. con clausulas contractuales tipo)</p>

  <h2>7. Informacion sobre el tratamiento</h2>
  <h3>Responsable del tratamiento</h3>
  <p>El taller que gestiona sus datos a traves de la plataforma FIXA.</p>

  <h3>Encargado del tratamiento</h3>
  <p>FIXA (producto de Ibanez Clima) actua como encargado del tratamiento conforme al Art. 28 RGPD.</p>

  <h3>Derechos del interesado</h3>
  <p>Puede ejercer sus derechos de acceso, rectificacion, supresion, portabilidad, limitacion y oposicion contactando al taller o a traves de la plataforma FIXA.</p>

  <h3>Subencargados del tratamiento</h3>
  <ul style="margin: 8px 0 0 20px; font-size: 14px;">
    <li><strong>Neon (base de datos):</strong> Almacenamiento de datos estructurados</li>
    <li><strong>Vercel (hosting y blob storage):</strong> Alojamiento de la aplicacion y fotografias</li>
    <li><strong>Clerk (autenticacion):</strong> Gestion de identidades de usuarios del taller</li>
  </ul>

  <div class="footer">
    <p>Informe generado el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")} | FIXA - Gestion de Taller</p>
    <p>Este documento se genera automaticamente en cumplimiento del Art. 15 del RGPD.</p>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e: any) {
    console.error("Error al acceder a datos RGPD:", e);
    return NextResponse.json({ error: "Error al acceder a datos" }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
