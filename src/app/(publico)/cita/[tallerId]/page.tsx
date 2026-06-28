import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { talleres, citas, diasBloqueados } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { PortalClienteHeader } from "@/components/portal-cliente-header";
import { BookingForm } from "./booking-form";
import { registrarApertura } from "@/lib/portal-views";

// Página privada de cliente (acceso por token): no indexable
export const metadata = { robots: { index: false, follow: false } };


export default async function CitaPublicaPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  const db = getDb();

  const taller = await db
    .select({
      id: talleres.id,
      nombre: talleres.nombre,
      logoUrl: talleres.logoUrl,
      telefono: talleres.telefono,
      trabajaSabados: talleres.trabajaSabados,
      horarioApertura: talleres.horarioApertura,
      horarioCierre: talleres.horarioCierre,
      horarioSabadoApertura: talleres.horarioSabadoApertura,
      horarioSabadoCierre: talleres.horarioSabadoCierre,
      capacidadDiaria: talleres.capacidadDiaria,
    })
    .from(talleres)
    .where(eq(talleres.id, tallerId))
    .limit(1);

  if (!taller[0]) return notFound();

  const t = taller[0];

  // Tracking de apertura del portal (no bloquea el render; ver portal-views.ts).
  // En cita no hay entidad específica: entidadId = tallerId.
  registrarApertura({
    tallerId: t.id,
    tipo: "cita",
    entidadId: t.id,
    userAgent: (await headers()).get("user-agent"),
  });

  // Next 30 days range
  const today = new Date();
  const in30Days = new Date();
  in30Days.setDate(today.getDate() + 30);
  const todayStr = today.toISOString().split("T")[0];
  const in30Str = in30Days.toISOString().split("T")[0];

  // Count citas per day for next 30 days
  const citasPorDia = await db
    .select({
      fecha: citas.fecha,
      total: sql<number>`count(*)::int`,
    })
    .from(citas)
    .where(
      and(
        eq(citas.tallerId, tallerId),
        gte(citas.fecha, todayStr),
        lte(citas.fecha, in30Str)
      )
    )
    .groupBy(citas.fecha);

  // Get blocked days
  const bloqueados = await db
    .select({ fecha: diasBloqueados.fecha })
    .from(diasBloqueados)
    .where(
      and(
        eq(diasBloqueados.tallerId, tallerId),
        gte(diasBloqueados.fecha, todayStr),
        lte(diasBloqueados.fecha, in30Str)
      )
    );

  // Build list of full days (capacity reached)
  const capacidad = t.capacidadDiaria ?? 4;
  const diasLlenos = citasPorDia
    .filter((c) => c.total >= capacidad)
    .map((c) => c.fecha);

  // Blocked dates = manually blocked + full days
  const fechasBloqueadas = [
    ...bloqueados.map((b) => b.fecha),
    ...diasLlenos,
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header — identidad del taller (white-label) */}
      <PortalClienteHeader
        nombre={t.nombre}
        logoUrl={t.logoUrl}
        subtitle="Solicitar cita"
      />

      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">{t.nombre}</h1>
          <p className="text-sm text-muted-foreground">Solicita tu cita online y te confirmaremos lo antes posible</p>
        </div>

        <BookingForm
          tallerId={t.id}
          tallerNombre={t.nombre}
          tallerTelefono={t.telefono}
          trabajaSabados={t.trabajaSabados ?? false}
          horarioApertura={t.horarioApertura ?? "08:00"}
          horarioCierre={t.horarioCierre ?? "18:00"}
          horarioSabadoApertura={t.horarioSabadoApertura ?? "09:00"}
          horarioSabadoCierre={t.horarioSabadoCierre ?? "13:00"}
          fechasBloqueadas={fechasBloqueadas}
        />

        <p className="text-center text-xs text-muted-foreground">Powered by FIXA</p>
      </main>
    </div>
  );
}
