import { NextResponse } from "next/server";
import { getSuperAdmin } from "@/lib/auth";
import { getDb } from "@/db";
import { talleres } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const isAdmin = await getSuperAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const db = getDb();

    const subscribers = await db
      .select({
        nombre: talleres.nombre,
        email: talleres.email,
        telefono: talleres.telefono,
        ciudad: talleres.ciudad,
        provincia: talleres.provincia,
        consentAt: talleres.newsletterConsentAt,
      })
      .from(talleres)
      .where(eq(talleres.newsletterConsent, true));

    // Build CSV
    const header = "nombre,email,telefono,ciudad,provincia,consent_date";
    const rows = subscribers.map((s) => {
      const escape = (v: string | null) => {
        if (!v) return "";
        // Escape quotes and wrap in quotes if contains comma/quote/newline
        if (v.includes(",") || v.includes('"') || v.includes("\n")) {
          return `"${v.replace(/"/g, '""')}"`;
        }
        return v;
      };
      return [
        escape(s.nombre),
        escape(s.email),
        escape(s.telefono),
        escape(s.ciudad),
        escape(s.provincia),
        s.consentAt ? new Date(s.consentAt).toISOString() : "",
      ].join(",");
    });

    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e: any) {
    console.error("Error exporting newsletter subscribers:", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
