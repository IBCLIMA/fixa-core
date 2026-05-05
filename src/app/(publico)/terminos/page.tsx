import { Wrench } from "lucide-react";
import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center gap-2">
          <Link href="/inicio" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand"><Wrench className="h-4 w-4 text-white" /></div>
            <span className="font-extrabold">FIXA</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 prose prose-stone">
        <h1>Condiciones de servicio</h1>
        <p><strong>Última actualización:</strong> Mayo 2026</p>

        <h2>1. Definiciones</h2>
        <p><strong>FIXA</strong> es un servicio de software en la nube (SaaS) para la gestión de talleres mecánicos, operado por Ibañez Clima.</p>
        <p><strong>El cliente</strong> es la empresa o profesional autónomo que contrata el servicio FIXA.</p>

        <h2>2. Objeto del contrato</h2>
        <p>FIXA proporciona al cliente acceso a una plataforma digital para gestionar órdenes de trabajo, clientes, vehículos, citas, presupuestos y comunicaciones con sus clientes finales.</p>

        <h2>3. Período de prueba</h2>
        <p>El cliente dispone de un período de prueba gratuita de 14 días naturales desde el registro. Durante este período, el cliente tiene acceso a todas las funcionalidades del plan contratado. Finalizado el período de prueba, el acceso se limitará hasta la activación de un plan de pago.</p>

        <h2>4. Planes y precios</h2>
        <ul>
          <li><strong>Plan Básico:</strong> 29€/mes + IVA — 1 usuario</li>
          <li><strong>Plan Taller:</strong> 49€/mes + IVA — hasta 5 usuarios</li>
          <li><strong>Plan Pro:</strong> 79€/mes + IVA — usuarios ilimitados</li>
        </ul>
        <p>Los precios pueden ser actualizados con un preaviso mínimo de 30 días.</p>

        <h2>5. Forma de pago</h2>
        <p>El pago se realiza mediante domiciliación bancaria SEPA con periodicidad mensual. El cliente facilita los datos de la cuenta bancaria para la domiciliación. La factura se emite desde Ibañez Clima.</p>

        <h2>6. Duración y cancelación</h2>
        <p>El contrato no tiene permanencia mínima. El cliente puede cancelar en cualquier momento notificándolo por escrito (email o WhatsApp). La cancelación surte efecto al final del período de facturación en curso.</p>

        <h2>7. Disponibilidad del servicio</h2>
        <p>FIXA se compromete a mantener una disponibilidad del servicio del 99% mensual, excluyendo ventanas de mantenimiento programado que serán notificadas con antelación.</p>

        <h2>8. Propiedad de los datos</h2>
        <p>Los datos introducidos por el cliente en FIXA son propiedad exclusiva del cliente. FIXA actúa como encargado del tratamiento conforme al RGPD. El cliente puede exportar sus datos en cualquier momento desde la sección de Configuración.</p>

        <h2>9. Copias de seguridad</h2>
        <p>FIXA realiza copias de seguridad automáticas diarias con una retención mínima de 7 días. Adicionalmente, el cliente puede descargar una copia completa de sus datos en formato JSON.</p>

        <h2>10. Limitación de responsabilidad</h2>
        <p>FIXA no se responsabiliza de pérdidas indirectas, lucro cesante o daños consecuenciales derivados del uso del servicio. La responsabilidad máxima de FIXA se limita al importe abonado por el cliente en los últimos 3 meses.</p>

        <h2>11. Modificaciones</h2>
        <p>FIXA se reserva el derecho de modificar estas condiciones con un preaviso de 30 días. El uso continuado del servicio tras la notificación implica la aceptación de las nuevas condiciones.</p>

        <h2>12. Legislación aplicable</h2>
        <p>Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Lleida.</p>

        <h2>13. Contacto</h2>
        <p>Para cualquier consulta: <strong>sergi@ibclima.com</strong> · <strong>611 433 218</strong></p>
      </main>
    </div>
  );
}
