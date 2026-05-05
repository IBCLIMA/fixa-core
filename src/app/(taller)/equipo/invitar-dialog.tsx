"use client";

import { useState } from "react";
import { Plus, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function InvitarUsuarioDialog() {
  const [open, setOpen] = useState(false);
  const [rol, setRol] = useState("mecanico");
  const [copied, setCopied] = useState(false);

  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/sign-up`
    : "";

  function copiarLink() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Link copiado");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="mr-1.5 h-4 w-4" />Invitar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar al equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Comparte este link con tu mecánico o recepcionista para que se registre en FIXA. Se unirá automáticamente a tu taller.
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Rol del nuevo usuario</Label>
            <Select value={rol} onValueChange={setRol}>
              <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mecanico">Mecánico</SelectItem>
                <SelectItem value="recepcion">Recepción</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-stone-500">Link de registro</Label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl bg-stone-50 border border-stone-200 px-3 py-2.5 text-sm text-stone-600 truncate">
                {inviteUrl}
              </div>
              <Button variant="outline" className="rounded-xl shrink-0" onClick={copiarLink}>
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Nota: Por ahora, los nuevos usuarios se registran con el link y se asignan automáticamente. La gestión de roles estará disponible próximamente.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
