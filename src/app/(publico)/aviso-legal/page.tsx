import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center gap-2">
          <Link href="/"><FixaLogo size="sm" /></Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 prose prose-stone">
        <h1>Aviso Legal</h1>
        <p><strong>Última actualización:</strong> Mayo 2026</p>

        <h2>1. Datos identificativos (LSSI-CE)</h2>
        <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa:</p>
        <ul>
          <li><strong>Titular:</strong> Ibañez Clima</li>
          <li><strong>CIF:</strong> B25825761</li>
          <li><strong>Actividad:</strong> Desarrollo y comercialización del software de gestión FIXA</li>
          <li><strong>Email de contacto:</strong> sergi@ibclima.com</li>
          <li><strong>Teléfono:</strong> 611 433 218</li>
          <li><strong>Dominio:</strong> fixataller.es</li>
        </ul>

        <h2>2. Objeto</h2>
        <p>Este sitio web tiene como finalidad la promoción y comercialización de FIXA, un software de gestión en la nube (SaaS) dirigido a talleres mecánicos. A través de esta web se facilita información sobre el servicio, sus funcionalidades y precios, así como el acceso a la plataforma.</p>

        <h2>3. Propiedad intelectual e industrial</h2>
        <p>Todos los contenidos de este sitio web, incluyendo textos, imágenes, diseños, logotipos, código fuente, software y marcas, son propiedad de Ibañez Clima o se utilizan con autorización de sus legítimos propietarios. Quedan reservados todos los derechos de explotación.</p>
        <p>Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa y por escrito del titular.</p>

        <h2>4. Condiciones de uso</h2>
        <p>El usuario se compromete a hacer un uso correcto del sitio web conforme a la ley, la buena fe y el orden público. Queda prohibido:</p>
        <ul>
          <li>Utilizar el sitio web con fines ilícitos o contrarios a estas condiciones</li>
          <li>Dañar, sobrecargar o impedir el normal funcionamiento del sitio web</li>
          <li>Introducir virus, programas maliciosos o cualquier otro sistema que pueda causar daños</li>
          <li>Intentar acceder a áreas restringidas sin autorización</li>
          <li>Suplantar la identidad de otros usuarios</li>
        </ul>

        <h2>5. Exclusión de responsabilidad</h2>
        <p>Ibañez Clima no se responsabiliza de:</p>
        <ul>
          <li>Errores u omisiones en los contenidos del sitio web</li>
          <li>Interrupciones o fallos de disponibilidad debidos a causas ajenas a su control</li>
          <li>Daños derivados del uso del sitio web por parte del usuario</li>
          <li>Contenidos de sitios web de terceros enlazados desde esta página</li>
        </ul>

        <h2>6. Enlaces a terceros</h2>
        <p>Este sitio web puede contener enlaces a páginas de terceros. Ibañez Clima no se hace responsable del contenido, políticas de privacidad o prácticas de dichos sitios web.</p>

        <h2>7. Protección de datos</h2>
        <p>El tratamiento de datos personales se rige por nuestra <Link href="/privacidad">Política de Privacidad</Link>, conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>

        <h2>8. Cookies</h2>
        <p>Este sitio web utiliza cookies. Para más información, consulte nuestra <Link href="/cookies">Política de Cookies</Link>.</p>

        <h2>9. Legislación aplicable y jurisdicción</h2>
        <p>Este aviso legal se rige por la legislación española. Para la resolución de cualquier controversia, las partes se someten a los juzgados y tribunales de Lleida, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>

        <h2>10. Modificaciones</h2>
        <p>Ibañez Clima se reserva el derecho a modificar este aviso legal en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio web.</p>
      </main>
    </div>
  );
}
