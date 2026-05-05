import { Wrench } from "lucide-react";
import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand"><Wrench className="h-4 w-4 text-white" /></div>
            <span className="font-extrabold">FIXA</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 prose prose-stone">
        <h1>Política de Privacidad</h1>
        <p><strong>Última actualización:</strong> Mayo 2026</p>

        <h2>1. Responsable del tratamiento</h2>
        <p>FIXA es un producto de Ibañez Clima. Los datos son tratados como responsable del tratamiento conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>

        <h2>2. Datos que recopilamos</h2>
        <p>Recopilamos los siguientes datos para prestar el servicio de gestión de taller:</p>
        <ul>
          <li><strong>Datos del taller:</strong> nombre, CIF, dirección, teléfono, email</li>
          <li><strong>Datos de clientes del taller:</strong> nombre, teléfono, email, NIF, dirección</li>
          <li><strong>Datos de vehículos:</strong> matrícula, marca, modelo, año, kilómetros, VIN, fecha ITV</li>
          <li><strong>Datos de reparaciones:</strong> órdenes de trabajo, diagnósticos, presupuestos, historial</li>
          <li><strong>Datos de citas:</strong> fecha, hora, motivo</li>
        </ul>

        <h2>3. Finalidad del tratamiento</h2>
        <p>Los datos se utilizan exclusivamente para:</p>
        <ul>
          <li>Gestionar las operaciones del taller mecánico</li>
          <li>Comunicarse con los clientes del taller (avisos, presupuestos)</li>
          <li>Generar informes de actividad del taller</li>
          <li>Mantener el historial de reparaciones de vehículos</li>
        </ul>

        <h2>4. Base legal</h2>
        <p>El tratamiento se basa en la ejecución del contrato de servicio entre FIXA y el taller, y en el interés legítimo del taller para gestionar su actividad comercial.</p>

        <h2>5. Conservación de datos</h2>
        <p>Los datos se conservan mientras el taller mantenga su cuenta activa. Tras la cancelación, los datos se eliminan en un plazo máximo de 30 días, salvo obligación legal de conservación.</p>

        <h2>6. Derechos del interesado</h2>
        <p>Los usuarios y los clientes de los talleres tienen derecho a:</p>
        <ul>
          <li><strong>Acceso:</strong> solicitar una copia de sus datos personales</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de sus datos ("derecho al olvido")</li>
          <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado</li>
          <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos</li>
        </ul>
        <p>Para ejercer estos derechos, contactar a: <strong>sergi@ibclima.com</strong></p>

        <h2>7. Seguridad</h2>
        <p>Implementamos las siguientes medidas de seguridad:</p>
        <ul>
          <li>Cifrado en tránsito (TLS/HTTPS obligatorio)</li>
          <li>Cifrado en reposo de la base de datos</li>
          <li>Autenticación segura con Clerk (contraseñas hasheadas, 2FA disponible)</li>
          <li>Aislamiento de datos por taller (multi-tenancy)</li>
          <li>Backups automáticos diarios</li>
          <li>Headers de seguridad (HSTS, X-Frame-Options, CSP)</li>
        </ul>

        <h2>8. Subencargados</h2>
        <ul>
          <li><strong>Vercel:</strong> alojamiento de la aplicación (UE/US)</li>
          <li><strong>Neon:</strong> base de datos PostgreSQL (UE)</li>
          <li><strong>Clerk:</strong> autenticación de usuarios (US, con DPA firmado)</li>
        </ul>

        <h2>9. Transferencias internacionales</h2>
        <p>Algunos datos pueden transferirse fuera del EEE a proveedores con cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>

        <h2>10. Contacto</h2>
        <p>Para cualquier consulta sobre privacidad: <strong>sergi@ibclima.com</strong></p>
        <p>Autoridad de control: Agencia Española de Protección de Datos (AEPD) — <a href="https://www.aepd.es" target="_blank">www.aepd.es</a></p>
      </main>
    </div>
  );
}
