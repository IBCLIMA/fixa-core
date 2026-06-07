"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, MessageSquare, Phone, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { formatWhatsAppUrl } from "@/lib/utils";

export function ClienteCard({
  cliente,
  matricula,
}: {
  cliente: { id: string; nombre: string; telefono: string | null; email: string | null; nif?: string | null } | null;
  matricula?: string | null;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState(cliente?.nombre || "");
  const [telefono, setTelefono] = useState(cliente?.telefono || "");
  const [email, setEmail] = useState(cliente?.email || "");
  const [nif, setNif] = useState(cliente?.nif || "");

  if (!cliente) return null;

  async function guardar() {
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/clientes/${cliente!.id}/telefono`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim() || null,
          email: email.trim() || null,
          nif: nif.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Cliente actualizado");
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
              <User className="h-4 w-4 text-brand" />
            </div>
            <p className="font-bold">Cliente</p>
          </div>
          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>

        {editando ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 space-y-1">
                <Label className="text-[10px] text-stone-400">Nombre *</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Antonio García"
                  className="h-9 rounded-lg text-sm"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-stone-400">Teléfono</Label>
                <Input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="612 345 678"
                  type="tel"
                  className="h-9 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-stone-400">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  type="email"
                  className="h-9 rounded-lg text-sm"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-[10px] text-stone-400">NIF / CIF</Label>
                <Input
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  placeholder="12345678A"
                  className="h-9 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={guardar}
                disabled={loading}
                className="flex items-center gap-1 text-xs font-bold text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-full transition-colors"
              >
                <Check className="h-3 w-3" />{loading ? "..." : "Guardar"}
              </button>
              <button
                onClick={() => {
                  setEditando(false);
                  setNombre(cliente.nombre);
                  setTelefono(cliente.telefono || "");
                  setEmail(cliente.email || "");
                  setNif(cliente.nif || "");
                }}
                className="flex items-center gap-1 text-xs text-stone-500 px-3 py-1.5 rounded-full"
              >
                <X className="h-3 w-3" />Cancelar
              </button>
            </div>
          </div>
        ) : (
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
            {cliente.nif && (
              <p className="text-muted-foreground">NIF: {cliente.nif}</p>
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
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Sin teléfono — pulsa el lápiz para añadirlo
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
