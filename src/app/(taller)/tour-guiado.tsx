"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const tourSteps = [
  {
    element: "#kpi-en-taller",
    popover: {
      title: "🚗 Coches en taller",
      description: "Aquí ves de un vistazo cuántos coches tienes ahora mismo en el taller.",
      side: "bottom" as const,
    },
  },
  {
    element: "#kpi-citas",
    popover: {
      title: "📅 Citas de hoy",
      description: "Las citas programadas para hoy. Gestiona tu agenda desde el Calendario.",
      side: "bottom" as const,
    },
  },
  {
    element: "#btn-entrada-rapida",
    popover: {
      title: "⚡ Entrada rápida",
      description: "Escribe la matrícula y en 2 clics tienes la orden creada. Es la forma más rápida de registrar un coche.",
      side: "bottom" as const,
    },
  },
  {
    element: "#coches-en-taller",
    popover: {
      title: "🔧 Estado de los coches",
      description: "Cada coche muestra su estado actual: recibido, diagnóstico, en reparación, listo... Haz clic para ver la orden completa.",
      side: "top" as const,
    },
  },
  {
    element: "#citas-hoy",
    popover: {
      title: "📞 Citas y llamadas",
      description: "Las citas del día con hora y motivo. Puedes llamar al cliente directamente.",
      side: "top" as const,
    },
  },
  {
    element: "nav",
    popover: {
      title: "📱 Navegación",
      description: "Panel · Órdenes · Agenda · Clientes — y en 'Más' encuentras Avisos, Ofertas, Facturación y Configuración.",
      side: "top" as const,
    },
  },
];

export function TourGuiado() {
  const [mostrarBoton, setMostrarBoton] = useState(false);

  useEffect(() => {
    // Mostrar tour automáticamente la primera vez
    const yaVisto = localStorage.getItem("fixa-tour-visto");
    if (!yaVisto) {
      setTimeout(() => iniciarTour(), 1500);
      localStorage.setItem("fixa-tour-visto", "true");
    }
    setMostrarBoton(true);
  }, []);

  function iniciarTour() {
    const d = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Entendido!",
      progressText: "{{current}} de {{total}}",
      steps: tourSteps.filter((step) => document.querySelector(step.element)),
      popoverClass: "fixa-tour-popover",
    });
    d.drive();
  }

  if (!mostrarBoton) return null;

  return (
    <Button
      variant="ghost"
      onClick={iniciarTour}
      className="rounded-full h-8 px-3 text-xs text-stone-400 hover:text-stone-700 gap-1"
    >
      <HelpCircle className="h-3.5 w-3.5" />
      Ayuda
    </Button>
  );
}
