import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center gap-2">
          <Link href="/inicio"><FixaLogo size="sm" /></Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 prose prose-stone">
        <h1>Política de Cookies</h1>
        <p><strong>Última actualización:</strong> Mayo 2026</p>

        <h2>1. ¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan para recordar tus preferencias, mejorar la experiencia de navegación y, en algunos casos, para fines analíticos o publicitarios.</p>

        <h2>2. ¿Qué cookies utilizamos?</h2>

        <h3>2.1. Cookies estrictamente necesarias</h3>
        <p>Son imprescindibles para el funcionamiento del sitio web. No se pueden desactivar.</p>
        <table>
          <thead>
            <tr><th>Cookie</th><th>Proveedor</th><th>Finalidad</th><th>Duración</th></tr>
          </thead>
          <tbody>
            <tr><td>__clerk_db_jwt</td><td>Clerk</td><td>Autenticación de sesión</td><td>Sesión</td></tr>
            <tr><td>__session</td><td>Clerk</td><td>Token de sesión activa</td><td>Sesión</td></tr>
            <tr><td>__client_uat</td><td>Clerk</td><td>Estado de autenticación</td><td>Sesión</td></tr>
            <tr><td>fixa-cookie-consent</td><td>FIXA</td><td>Guardar preferencias de cookies</td><td>1 año</td></tr>
          </tbody>
        </table>

        <h3>2.2. Cookies de analítica (opcionales)</h3>
        <p>Nos permiten medir el tráfico y analizar el comportamiento de los usuarios para mejorar el servicio. Solo se activan con tu consentimiento.</p>
        <table>
          <thead>
            <tr><th>Cookie</th><th>Proveedor</th><th>Finalidad</th><th>Duración</th></tr>
          </thead>
          <tbody>
            <tr><td>va</td><td>Vercel Analytics</td><td>Analítica web respetuosa con la privacidad</td><td>Sesión</td></tr>
          </tbody>
        </table>
        <p className="text-sm text-muted-foreground">Nota: Vercel Analytics no utiliza cookies de terceros y cumple con RGPD sin necesidad de consentimiento en muchos casos, ya que no identifica usuarios individualmente.</p>

        <h3>2.3. Cookies de marketing (opcionales)</h3>
        <p>Actualmente FIXA <strong>no utiliza cookies de marketing ni de publicidad</strong>. Si en el futuro se implementaran, se actualizará esta política y se solicitará tu consentimiento previo.</p>

        <h2>3. ¿Cómo gestionar las cookies?</h2>
        <p>Puedes gestionar tus preferencias de cookies de las siguientes formas:</p>
        <ul>
          <li><strong>Banner de cookies:</strong> Al acceder al sitio web por primera vez, un banner te permite aceptar todas, rechazar las opcionales o personalizar tu elección.</li>
          <li><strong>Configuración del navegador:</strong> Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que esto puede afectar al funcionamiento del sitio.</li>
        </ul>

        <h3>Cómo desactivar cookies en tu navegador:</h3>
        <ul>
          <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
          <li><strong>Firefox:</strong> Opciones → Privacidad → Cookies</li>
          <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
          <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
        </ul>

        <h2>4. Cookies de terceros</h2>
        <p>Los siguientes servicios de terceros pueden establecer cookies cuando usas FIXA:</p>
        <ul>
          <li><strong>Clerk (clerk.com):</strong> Servicio de autenticación. <a href="https://clerk.com/privacy" target="_blank" rel="noopener">Política de privacidad de Clerk</a></li>
          <li><strong>Vercel (vercel.com):</strong> Alojamiento y analítica. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Política de privacidad de Vercel</a></li>
        </ul>

        <h2>5. Base legal</h2>
        <p>Las cookies estrictamente necesarias se basan en el interés legítimo del responsable (Art. 6.1.f RGPD). Las cookies de analítica y marketing requieren tu consentimiento previo (Art. 6.1.a RGPD), conforme al artículo 22.2 de la LSSI-CE.</p>

        <h2>6. Actualizaciones</h2>
        <p>Esta política puede actualizarse para reflejar cambios en las cookies utilizadas. Te recomendamos revisarla periódicamente.</p>

        <h2>7. Contacto</h2>
        <p>Para cualquier consulta sobre cookies: <strong>sergi@ibclima.com</strong></p>
        <p>Más información sobre tus derechos en la <Link href="/privacidad">Política de Privacidad</Link>.</p>
      </main>
    </div>
  );
}
