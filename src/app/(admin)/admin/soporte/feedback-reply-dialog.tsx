"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Reply, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { responderFeedback } from "./actions";

type Props = {
  feedbackId: string;
  to: string;
  tallerNombre: string | null;
  mensaje: string;
};

/** Cita el mensaje del taller como contexto en el cuerpo de la respuesta. */
function plantilla(tallerNombre: string | null, mensaje: string) {
  const saludo = tallerNombre ? `Hola ${tallerNombre},` : "Hola,";
  const citado = mensaje
    .split("\n")
    .map((l) => `> ${l}`)
    .join("\n");
  return `${saludo}\n\n\n\n— — —\nTu mensaje en FIXA:\n${citado}\n\nUn saludo,\nEquipo FIXA`;
}

export function FeedbackReplyDialog({ feedbackId, to, tallerNombre, mensaje }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [subject, setSubject] = useState("Re: tu mensaje en FIXA");
  const [text, setText] = useState(() => plantilla(tallerNombre, mensaje));

  function enviarRespuesta() {
    startTransition(async () => {
      try {
        await responderFeedback({ feedbackId, to, subject, text });
        toast.success(`Respuesta enviada a ${to}`);
        setOpen(false);
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudo enviar la respuesta");
      }
    });
  }

  return (
    <>
      {/* Patrón controlado: onClick abre el dialog (DialogTrigger asChild tiene bug en este proyecto). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Responder a ${to}`}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50/60 px-2.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
      >
        <Reply className="h-4 w-4" />
        Responder
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Responder al taller</DialogTitle>
            <DialogDescription>
              Se enviará desde el buzón de soporte (hola@fixataller.es) a{" "}
              <span className="font-medium text-foreground">{to}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="reply-to">Para</Label>
              <Input id="reply-to" value={to} readOnly disabled className="bg-muted text-muted-foreground" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reply-subject">Asunto</Label>
              <Input
                id="reply-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={pending}
                placeholder="Re: tu mensaje en FIXA"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reply-text">Mensaje</Label>
              <Textarea
                id="reply-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={pending}
                rows={10}
                className="resize-y font-sans"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button onClick={enviarRespuesta} disabled={pending || !subject.trim() || !text.trim()}>
              {pending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-1.5 h-4 w-4" />
              )}
              Enviar respuesta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
