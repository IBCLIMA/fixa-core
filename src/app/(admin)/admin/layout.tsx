import { redirect } from "next/navigation";
import { getSuperAdmin } from "@/lib/auth";
import { getDb } from "@/db";
import { feedback } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { AdminNav, AdminBrand } from "./admin-nav";

export const metadata = {
  title: "FIXA · Admin",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Guard a nivel de layout: protege TODAS las rutas /admin/*
  if (!(await getSuperAdmin())) redirect("/");

  const db = getDb();
  const [nuevos] = await db
    .select({ count: sql<number>`count(*)` })
    .from(feedback)
    .where(eq(feedback.estado, "nuevo"));
  const soporteNuevos = Number(nuevos?.count ?? 0);

  return (
    <div className="flex min-h-[100dvh] bg-zinc-950 text-zinc-100 antialiased">
      {/* Sidebar (centro de mando) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/60 px-4 py-5">
        <AdminBrand />
        <div className="mt-7 flex-1">
          <AdminNav soporteNuevos={soporteNuevos} />
        </div>
        <p className="mt-4 px-3 text-[10px] leading-relaxed text-zinc-600">
          Panel de plataforma. Acceso restringido al fundador.
        </p>
      </aside>

      {/* Columna principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header móvil */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur lg:hidden">
          <AdminBrand />
        </header>

        {/* Nav móvil horizontal */}
        <div className="border-b border-zinc-800 bg-zinc-900/40 px-2 py-2 lg:hidden">
          <AdminNav soporteNuevos={soporteNuevos} />
        </div>

        <main className="flex-1 bg-zinc-100 text-zinc-900 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
