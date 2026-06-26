"use client";

import { useState, useTransition } from "react";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { enviarFeedback } from "./actions/feedback";

type Tipo = "sugerencia" | "incidencia" | "consulta";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<Tipo>("sugerencia");
  const [mensaje, setMensaje] = useState("");
  const [isPending, startTransition] = useTransition();

  function enviar() {
    if (!mensaje.trim()) {
      toast.error("Escribe un mensaje");
      return;
    }
    startTransition(async () => {
      try {
        await enviarFeedback({
          tipo,
          mensaje,
          url: typeof window !== "undefined" ? window.location.pathname : undefined,
        });
        toast.success("¡Gracias! Lo hemos recibido.");
        setMensaje("");
        setTipo("sugerencia");
        setOpen(false);
      } catch {
        toast.error("No se pudo enviar. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Enviar sugerencia o incidencia"
        className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
      >
        <MessageSquarePlus className="h-5 w-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Una sugerencia o un problema?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cuéntanoslo. Lo leemos todo y nos ayuda a mejorar FIXA.
          </p>
          <Select value={tipo} onValueChange={(v) => setTipo(v as Tipo)}>
            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sugerencia">💡 Una sugerencia</SelectItem>
              <SelectItem value="incidencia">🐞 Algo no funciona</SelectItem>
              <SelectItem value="consulta">❓ Una duda</SelectItem>
            </SelectContent>
          </Select>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Escríbelo aquí…"
            className="w-full rounded-xl border border-stone-200 p-3 text-sm outline-none focus:border-orange-400"
          />
          <Button onClick={enviar} disabled={isPending} className="w-full rounded-xl">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Enviar
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}
