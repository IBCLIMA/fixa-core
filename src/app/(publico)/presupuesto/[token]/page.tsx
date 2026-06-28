import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getDb } from "@/db";
import {
  presupuestos,
  lineasPresupuesto,
  vehiculos,
  clientes,
  talleres,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { PresupuestoClient } from "./presupuesto-client";
import { registrarApertura } from "@/lib/portal-views";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const db = getDb();

  const [presupuesto] = await db
    .select()
    .from(presupuestos)
    .where(eq(presupuestos.tokenPublico, token))
    .limit(1);

  if (!presupuesto) return {};

  const [vehiculo] = await db
    .select()
    .from(vehiculos)
    .where(eq(vehiculos.id, presupuesto.vehiculoId));

  const marca = vehiculo?.marca || "tu vehículo";
  const modelo = vehiculo?.modelo || "";
  const title = `Presupuesto para tu ${marca} ${modelo}`.trim();

  return {
    title,
    description: "Revisa y aprueba el presupuesto de reparación de tu vehículo.",
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: "Revisa y aprueba el presupuesto de reparación de tu vehículo.",
      type: "website",
    },
  };
}

export default async function PresupuestoPublicoPage({ params }: PageProps) {
  const { token } = await params;
  const db = getDb();

  const [presupuesto] = await db
    .select()
    .from(presupuestos)
    .where(eq(presupuestos.tokenPublico, token))
    .limit(1);

  if (!presupuesto) return notFound();

  // Tracking de apertura del portal (no bloquea el render; ver portal-views.ts)
  registrarApertura({
    tallerId: presupuesto.tallerId,
    tipo: "presupuesto",
    entidadId: presupuesto.id,
    token,
    clienteId: presupuesto.clienteId,
    userAgent: (await headers()).get("user-agent"),
  });

  // Traceability: first time the client opens the link, the quote moves borrador → enviado
  // (the workshop sees it left "draft" without having to flip the state manually)
  if (presupuesto.estado === "borrador") {
    await db
      .update(presupuestos)
      .set({ estado: "enviado" })
      .where(and(eq(presupuestos.id, presupuesto.id), eq(presupuestos.estado, "borrador")));
    presupuesto.estado = "enviado";
  }

  const [taller] = await db
    .select({
      nombre: talleres.nombre,
      telefono: talleres.telefono,
      logoUrl: talleres.logoUrl,
    })
    .from(talleres)
    .where(eq(talleres.id, presupuesto.tallerId));

  const [cliente] = await db
    .select({
      nombre: clientes.nombre,
      telefono: clientes.telefono,
    })
    .from(clientes)
    .where(eq(clientes.id, presupuesto.clienteId));

  const [vehiculo] = await db
    .select({
      matricula: vehiculos.matricula,
      marca: vehiculos.marca,
      modelo: vehiculos.modelo,
    })
    .from(vehiculos)
    .where(eq(vehiculos.id, presupuesto.vehiculoId));

  const lineas = await db
    .select()
    .from(lineasPresupuesto)
    .where(eq(lineasPresupuesto.presupuestoId, presupuesto.id));

  // Calculate totals server-side
  const totalBase = lineas.reduce((sum, l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    return sum + qty * price * (1 - disc / 100);
  }, 0);

  const totalIva = lineas.reduce((sum, l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    const iva = Number(l.ivaPct || 21);
    const base = qty * price * (1 - disc / 100);
    return sum + base * (iva / 100);
  }, 0);

  const totalFinal = totalBase + totalIva;

  // Calculate validity date
  let validezFecha: string | null = null;
  if (presupuesto.validezDias) {
    const created = new Date(presupuesto.createdAt);
    created.setDate(created.getDate() + presupuesto.validezDias);
    validezFecha = created.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Serialize lines for client
  const lineasData = lineas.map((l) => ({
    id: l.id,
    tipo: l.tipo,
    descripcion: l.descripcion,
    cantidad: Number(l.cantidad),
    precioUnitario: Number(l.precioUnitario),
    descuentoPct: Number(l.descuentoPct || 0),
    ivaPct: Number(l.ivaPct || 21),
    subtotal:
      Number(l.cantidad) *
      Number(l.precioUnitario) *
      (1 - Number(l.descuentoPct || 0) / 100),
  }));

  return (
    <PresupuestoClient
      token={token}
      estado={presupuesto.estado}
      numero={presupuesto.numero}
      notas={presupuesto.notas}
      taller={taller ? { nombre: taller.nombre, telefono: taller.telefono, logoUrl: taller.logoUrl } : null}
      cliente={cliente ? { nombre: cliente.nombre, telefono: cliente.telefono } : null}
      vehiculo={vehiculo ? { matricula: vehiculo.matricula, marca: vehiculo.marca, modelo: vehiculo.modelo } : null}
      lineas={lineasData}
      totalBase={totalBase}
      totalIva={totalIva}
      totalFinal={totalFinal}
      validezFecha={validezFecha}
    />
  );
}
