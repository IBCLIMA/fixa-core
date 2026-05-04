import { Megaphone } from "lucide-react";
import { getClientesConTelefono } from "../actions/ofertas";
import { OfertaForm } from "./oferta-form";

export default async function OfertasPage() {
  const clientesList = await getClientesConTelefono();

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Enviar oferta</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Envía una promoción a todos tus clientes por WhatsApp · {clientesList.length} cliente{clientesList.length !== 1 ? "s" : ""} con teléfono
        </p>
      </div>

      {clientesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-bold">Sin clientes con teléfono</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Añade teléfonos a tus clientes para poder enviar ofertas
          </p>
        </div>
      ) : (
        <OfertaForm totalClientes={clientesList.length} />
      )}
    </div>
  );
}
