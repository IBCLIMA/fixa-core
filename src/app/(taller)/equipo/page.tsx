import { Users, Plus, Shield, Wrench, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTallerIdFromAuth } from "@/lib/auth";
import { getDb } from "@/db";
import { usuarios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InvitarUsuarioDialog } from "./invitar-dialog";

const rolLabels: Record<string, string> = {
  admin: "Administrador",
  mecanico: "Mecánico",
  recepcion: "Recepción",
};

const rolColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  mecanico: "bg-blue-100 text-blue-700",
  recepcion: "bg-emerald-100 text-emerald-700",
};

const rolIcons: Record<string, typeof Shield> = {
  admin: Shield,
  mecanico: Wrench,
  recepcion: Phone,
};

export default async function EquipoPage() {
  const { tallerId } = await getTallerIdFromAuth();
  const db = getDb();

  const equipo = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.tallerId, tallerId));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Equipo</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{equipo.length} usuario{equipo.length !== 1 ? "s" : ""}</p>
        </div>
        <InvitarUsuarioDialog />
      </div>

      <div className="space-y-3">
        {equipo.map((u) => {
          const RolIcon = rolIcons[u.rol] || Shield;
          return (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                    <RolIcon className="h-5 w-5 text-stone-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{u.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Registrado: {new Date(u.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
                <Badge className={rolColors[u.rol]}>{rolLabels[u.rol]}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-stone-200 bg-stone-50">
        <CardContent className="p-4">
          <h3 className="font-bold text-sm mb-2">Roles disponibles</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p><strong className="text-stone-700">Administrador:</strong> Acceso total. Puede gestionar equipo, configuración, facturación y admin.</p>
            <p><strong className="text-stone-700">Mecánico:</strong> Ve órdenes, clientes y calendario. Puede cambiar estados y añadir líneas de trabajo.</p>
            <p><strong className="text-stone-700">Recepción:</strong> Gestiona clientes, citas y presupuestos. No ve facturación ni configuración.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
