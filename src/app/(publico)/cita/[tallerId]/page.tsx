import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { BookingForm } from "./booking-form";

export default async function CitaPublicaPage({ params }: { params: Promise<{ tallerId: string }> }) {
  const { tallerId } = await params;
  const db = getDb();

  const taller = await db
    .select({ id: talleres.id, nombre: talleres.nombre })
    .from(talleres)
    .where(eq(talleres.id, tallerId))
    .limit(1);

  if (!taller[0]) return notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-lg flex items-center gap-2">
          <FixaLogo size="sm" />
          <span className="text-xs text-muted-foreground ml-1">Solicitar cita</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">{taller[0].nombre}</h1>
          <p className="text-sm text-muted-foreground">Solicita tu cita online y te confirmaremos lo antes posible</p>
        </div>

        <BookingForm tallerId={taller[0].id} />
      </main>
    </div>
  );
}
