"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, MessageSquare, Phone, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { formatWhatsAppUrl } from "@/lib/utils";

export function ClienteCard({
  cliente,
  matricula,
}: {
  cliente: { id: string; nombre: string; telefono: string | null; email: string | null } | null;
  matricula?: string | null;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  if (!cliente) return null;

  async function guardarTelefono() {
    if (!telefono.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/clientes/${cliente!.id}/telefono`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono: telefono.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success("Teléfono guardado");
      setEditando(false);
      router.refresh();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
            <User className="h-4 w-4 text-brand" />
          </div>
          <p className="font-bold">Cliente</p>
        </div>
        <div className="space-y-1 text-sm">
          <Link
            href={`/clientes/${cliente.id}`}
            className="font-bold text-brand hover:underline"
          >
            {cliente.nombre}
          </Link>
          {cliente.telefono && (
            <p className="text-muted-foreground">{cliente.telefono}</p>
          )}
          {cliente.email && (
            <p className="text-muted-foreground">{cliente.email}</p>
          )}
          <div className="flex gap-2 mt-2">
            {cliente.telefono ? (
              <>
                <a
                  href={formatWhatsAppUrl(cliente.telefono, `Hola ${cliente.nombre.split(" ")[0]}, te escribimos desde el taller sobre tu vehículo ${matricula || ""}.`)}
                  target="_blank"
                  className="flex h-11 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-white text-sm font-bold hover:bg-emerald-500 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />WhatsApp
                </a>
                <a
                  href={`tel:${cliente.telefono}`}
                  className="flex h-11 items-center gap-1.5 rounded-full bg-muted px-4 text-sm font-bold hover:bg-muted/80 transition-colors"
                >
                  <Phone className="h-4 w-4" />Llamar
                </a>
              </>
            ) : editando ? (
              <div className="flex gap-2 w-full">
                <Input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="612 345 678"
                  type="tel"
                  className="h-11 rounded-xl flex-1"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && guardarTelefono()}
                />
                <Button
                  onClick={guardarTelefono}
                  disabled={loading || !telefono.trim()}
                  className="h-11 rounded-xl"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditando(true)}
                className="rounded-full h-11 px-4 text-sm border-dashed"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Añadir teléfono
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
