import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Datos del taller y ajustes generales
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del taller</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del taller</Label>
              <Input id="nombre" placeholder="Mi Taller S.L." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cif">CIF / NIF</Label>
              <Input id="cif" placeholder="B12345678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" placeholder="Calle Principal, 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" placeholder="Valencia" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" placeholder="960 000 000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="taller@ejemplo.com" />
            </div>
          </div>
          <Separator />
          <Button>Guardar cambios</Button>
        </CardContent>
      </Card>
    </div>
  );
}
