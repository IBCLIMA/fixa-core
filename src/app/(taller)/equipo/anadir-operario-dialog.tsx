"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { crearOperarioSimple } from "../actions/operarios";
import { useRouter } from "next/navigation";

export function AnadirOperarioDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!nombre.trim()) {
      toast.error("Escribe el nombre del operario");
      return;
    }
    startTransition(async () => {
      try {
        await crearOperarioSimple(nombre.trim());
        toast.success(`${nombre.trim()} añadido al equipo`);
        setNombre("");
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Error al crear el operario");
      }
    });
  }

  return (
    <>
      <Button variant="outline" className="rounded-full" onClick={() => setOpen(true)}>
        <Wrench className="mr-1.5 h-4 w-4" />Añadir operario
      </Button>
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setNombre(""); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir operario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Añade un mecánico por nombre. No necesita cuenta ni email &mdash; aparecerá directamente en las órdenes para asignarle trabajo.
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Nombre del operario</Label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan, Paco, Miguel..."
              className="h-11 rounded-xl"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />
          </div>

          <Button onClick={handleSubmit} disabled={isPending || !nombre.trim()} className="w-full rounded-xl">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Añadir
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}
