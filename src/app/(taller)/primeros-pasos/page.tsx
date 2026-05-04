import Link from "next/link";
import {
  Settings, Users, Car, ClipboardList, CalendarDays,
  MessageSquare, Bell, Megaphone, ArrowRight, CheckCircle2,
  Wrench, Search, FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pasos = [
  {
    numero: 1,
    titulo: "Configura tu taller",
    desc: "Añade el nombre, CIF, teléfono y dirección de tu taller. Estos datos aparecerán en presupuestos y en el portal del cliente.",
    icon: Settings,
    color: "from-stone-500 to-stone-600",
    href: "/configuracion",
    boton: "Ir a Configuración",
  },
  {
    numero: 2,
    titulo: "Añade tus clientes",
    desc: "Crea fichas de clientes con nombre, teléfono y email. Después podrás asignarles vehículos y crear órdenes.",
    icon: Users,
    color: "from-violet-500 to-violet-600",
    href: "/clientes",
    boton: "Ir a Clientes",
  },
  {
    numero: 3,
    titulo: "Registra los vehículos",
    desc: "Dentro de cada ficha de cliente, añade sus coches con matrícula, marca, modelo y km. Si tiene fecha de ITV, ponla para recibir avisos.",
    icon: Car,
    color: "from-blue-500 to-blue-600",
    href: "/clientes",
    boton: "Ir a Clientes",
  },
  {
    numero: 4,
    titulo: "Crea tu primera orden",
    desc: 'Usa el botón "Entrada rápida" en el panel: escribe la matrícula, describe lo que le pasa al coche, y crea la orden en 10 segundos.',
    icon: ClipboardList,
    color: "from-orange-500 to-orange-600",
    href: "/",
    boton: "Ir al Panel",
  },
  {
    numero: 5,
    titulo: "Gestiona el estado",
    desc: "Dentro de cada orden, cambia el estado con un toque: recibido → diagnóstico → reparación → listo → entregado. Añade líneas de trabajo con precios.",
    icon: Wrench,
    color: "from-emerald-500 to-emerald-600",
    href: "/ordenes",
    boton: "Ver Órdenes",
  },
  {
    numero: 6,
    titulo: "Avisa al cliente por WhatsApp",
    desc: "Cuando el coche esté listo, pulsa el botón de WhatsApp en la orden o en el panel. Se abre WhatsApp con el mensaje escrito.",
    icon: MessageSquare,
    color: "from-emerald-600 to-emerald-700",
    href: "/ordenes",
    boton: "Ver Órdenes",
  },
  {
    numero: 7,
    titulo: "Comparte el portal del cliente",
    desc: "Cada orden tiene un link público. Envíaselo al cliente y podrá ver el estado de su coche sin llamarte.",
    icon: Search,
    color: "from-cyan-500 to-cyan-600",
    href: "/ordenes",
    boton: "Ver Órdenes",
  },
  {
    numero: 8,
    titulo: "Genera avisos de ITV",
    desc: "En Avisos, pulsa 'Generar avisos ITV' y el sistema detecta automáticamente los coches con ITV próxima. Envía el aviso por WhatsApp.",
    icon: Bell,
    color: "from-red-500 to-red-600",
    href: "/avisos",
    boton: "Ir a Avisos",
  },
  {
    numero: 9,
    titulo: "Envía ofertas a todos tus clientes",
    desc: "En Ofertas, elige una plantilla o escribe tu mensaje. Se preparan links de WhatsApp para todos tus clientes con un clic.",
    icon: Megaphone,
    color: "from-pink-500 to-pink-600",
    href: "/ofertas",
    boton: "Ir a Ofertas",
  },
];

export default function PrimerosPasosPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Primeros pasos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sigue estos pasos para empezar a usar FIXA en tu taller
        </p>
      </div>

      <div className="space-y-3">
        {pasos.map((paso) => (
          <Card key={paso.numero} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex gap-4 p-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${paso.color} shadow-sm`}>
                  <paso.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">PASO {paso.numero}</span>
                    <h3 className="text-sm font-bold text-stone-900">{paso.titulo}</h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{paso.desc}</p>
                  <Link href={paso.href} className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 mt-2 hover:text-orange-700 transition-colors">
                    {paso.boton}<ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-4 text-center space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <p className="font-bold text-emerald-800">¡Listo!</p>
          <p className="text-sm text-emerald-700">
            Con estos 9 pasos tu taller está funcionando con FIXA.
            Si necesitas ayuda, pulsa el icono <span className="font-bold">?</span> en el panel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
