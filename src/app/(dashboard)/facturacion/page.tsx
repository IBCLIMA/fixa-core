import { Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FacturacionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facturación</h1>
          <p className="text-muted-foreground">
            Gestión de facturas y cobros
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva factura
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12">
        <Receipt className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No hay facturas</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Emite tu primera factura
        </p>
      </div>
    </div>
  );
}
