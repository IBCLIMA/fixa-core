"use client";

import { useState } from "react";
import { MessageSquare, Mail, Phone, BookOpen, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function AyudaPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const asunto = (form.elements.namedItem("asunto") as HTMLInputElement).value;
    const mensaje = (form.elements.namedItem("mensaje") as HTMLTextAreaElement).value;

    // Abrir email con los datos pre-rellenados
    const mailtoLink = `mailto:sergi@ibclima.com?subject=${encodeURIComponent(`[FIXA Soporte] ${asunto}`)}&body=${encodeURIComponent(mensaje)}`;
    window.open(mailtoLink);
    setEnviado(true);
    toast.success("Se ha abierto tu cliente de email");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Ayuda y soporte</h1>
        <p className="text-sm text-muted-foreground mt-0.5">¿Necesitas ayuda? Estamos aquí para ti.</p>
      </div>

      {/* Contacto rápido */}
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href="https://wa.me/34611433218?text=Hola%2C%20necesito%20ayuda%20con%20FIXA"
          target="_blank"
          className="block"
        >
          <Card className="hover:border-emerald-300 hover:shadow-md transition-all duration-300 cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">WhatsApp</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Respuesta inmediata</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">Abrir chat →</p>
              </div>
            </CardContent>
          </Card>
        </a>

        <a href="mailto:sergi@ibclima.com?subject=[FIXA Soporte]" className="block">
          <Card className="hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Email</h3>
                <p className="text-xs text-muted-foreground mt-0.5">sergi@ibclima.com</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">Enviar email →</p>
              </div>
            </CardContent>
          </Card>
        </a>

        <a href="tel:+34611433218" className="block">
          <Card className="hover:border-orange-300 hover:shadow-md transition-all duration-300 cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Teléfono</h3>
                <p className="text-xs text-muted-foreground mt-0.5">611 433 218</p>
                <p className="text-xs text-orange-600 font-semibold mt-1">Llamar →</p>
              </div>
            </CardContent>
          </Card>
        </a>

        <Link href="/primeros-pasos" className="block">
          <Card className="hover:border-violet-300 hover:shadow-md transition-all duration-300 cursor-pointer h-full">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50">
                <BookOpen className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Primeros pasos</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Guía paso a paso</p>
                <p className="text-xs text-violet-600 font-semibold mt-1">Ver guía →</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Formulario */}
      <Card>
        <CardContent className="p-5">
          <h2 className="font-bold mb-4">Enviar consulta</h2>
          {enviado ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="font-bold">¡Consulta enviada!</p>
              <p className="text-sm text-muted-foreground">Te responderemos lo antes posible.</p>
              <Button variant="outline" className="rounded-full" onClick={() => setEnviado(false)}>Enviar otra consulta</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="asunto" className="text-xs font-bold text-stone-500">Asunto</Label>
                <Input id="asunto" name="asunto" placeholder="¿En qué podemos ayudarte?" required className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mensaje" className="text-xs font-bold text-stone-500">Mensaje</Label>
                <Textarea id="mensaje" name="mensaje" placeholder="Describe tu duda o problema..." required rows={4} className="rounded-xl" />
              </div>
              <Button type="submit" className="w-full h-11 rounded-xl font-bold">
                <Send className="mr-2 h-4 w-4" />Enviar consulta
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
