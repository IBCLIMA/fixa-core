import { Receipt } from "lucide-react";

export default function FacturacionPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Facturación</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Facturas y cobros</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold">Próximamente</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Facturación compatible con VeriFactu. Convierte órdenes en facturas con un clic.
        </p>
      </div>
    </div>
  );
}
