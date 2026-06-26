"use client";

import { useState, useTransition } from "react";
import { Plus, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { crearInvitacion } from "../actions/equipo";

export function InvitarUsuarioDialog() {
  const [open, setOpen] = useState(false);
  const [rol, setRol] = useState<"mecanico" | "recepcion" | "admin">("mecanico");
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  function generarLink() {
    startTransition(async () => {
      try {
        const url = await crearInvitacion(rol);
        setInviteUrl(url);
      } catch {
        toast.error("Error al generar la invitación");
      }
    });
  }

  function copiarLink() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Link copiado");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Button className="rounded-full" onClick={() => setOpen(true)}>
        <Plus className="mr-1.5 h-4 w-4" />Invitar
      </Button>
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setInviteUrl(""); setCopied(false); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar al equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Genera un link de invitación para que un nuevo miembro se una a tu taller con el rol que elijas. El link expira en 7 días.
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Rol del nuevo usuario</Label>
            <Select value={rol} onValueChange={(v) => { setRol(v as typeof rol); setInviteUrl(""); }}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mecanico">Mecánico</SelectItem>
                <SelectItem value="recepcion">Recepción</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!inviteUrl ? (
            <Button onClick={generarLink} disabled={isPending} className="w-full rounded-xl">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Generar link de invitación
            </Button>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-500">Link de invitación</Label>
              <div className="flex gap-2">
                <div className="flex-1 rounded-xl bg-stone-50 border border-stone-200 px-3 py-2.5 text-sm text-stone-600 truncate">
                  {inviteUrl}
                </div>
                <Button variant="outline" className="rounded-xl shrink-0" onClick={copiarLink}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Cada link es de un solo uso. El nuevo usuario se unirá directamente a tu taller con el rol seleccionado.
          </p>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}
