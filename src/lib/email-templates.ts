import { SITE_URL } from "@/lib/seo";

/**
 * Emails de ciclo de vida — estilo Isra Bravo:
 * Cortos (<300 palabras), directos, sin florituras, con historia y dolor real.
 * Un email tiene que hacer que el mecánico sienta algo — y luego actúe.
 */

/** Día 0: Email de bienvenida — el mecánico acaba de registrarse */
export function emailBienvenida(nombre: string) {
  const firstName = nombre?.split(" ")[0] || "mecánico";
  return {
    subject: `${firstName}, tu taller acaba de dar un paso`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; color: #1c1917; line-height: 1.7; font-size: 15px;">
  <p>Hola ${firstName},</p>

  <p>Ayer a las 9 de la noche, un mecánico estaba haciendo un presupuesto en Word. Hoy te has registrado en FIXA para no volver a hacerlo.</p>

  <p><strong>Tienes 14 días gratis. Sin tarjeta. Sin trampa.</strong></p>

  <p>Lo que puedes hacer ahora mismo (literalmente, en 2 minutos):</p>

  <ol style="padding-left: 20px;">
    <li><strong>Instala FIXA en tu móvil</strong> — <a href="${SITE_URL}/instalar" style="color: #f97316;">aquí tienes cómo</a> (30 segundos)</li>
    <li><strong>Crea tu primera orden de trabajo</strong> — escribe una matrícula y verás lo rápido que es</li>
    <li><strong>Activa los avisos</strong> — pulsa la campana 🔔 y te vibra el móvil cuando pase algo</li>
  </ol>

  <p>Si te atascas en algo, responde a este email o escríbenos por <a href="https://wa.me/34611433218" style="color: #f97316;">WhatsApp</a>. Somos personas reales y sabemos lo que es un taller — porque FIXA nació dentro de uno.</p>

  <p>Un saludo,<br><strong>Sergi</strong><br><span style="color: #a8a29e;">Ibañez Clima · FIXA</span></p>

  <hr style="border: none; border-top: 2px solid #f97316; margin: 24px 0 16px;" />
  <p style="font-size: 12px; color: #a8a29e;">
    Recibes este email porque te has registrado en FIXA. Si no has sido tú, ignora este mensaje.
  </p>
</div>`,
  };
}

/** Día 2: Email de rescate — se registró pero no ha creado ninguna orden */
export function emailRescateDia2(nombre: string) {
  const firstName = nombre?.split(" ")[0] || "";
  return {
    subject: `${firstName}, ¿el coche sigue en la puerta?`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; color: #1c1917; line-height: 1.7; font-size: 15px;">
  <p>${firstName ? `Hola ${firstName},` : "Hola,"}</p>

  <p>Te registraste en FIXA hace dos días. Pero no has creado ninguna orden de trabajo.</p>

  <p>Y mira, lo entiendo: tienes 6 coches esperando, el teléfono que no para y un presupuesto que se te olvidó mandar ayer. ¿Quién tiene tiempo de probar software?</p>

  <p>Pero déjame contarte una cosa: <strong>la primera orden tarda 10 segundos</strong>. Matrícula, qué le pasa al coche, y hecho. Si no te convence, borras la cuenta y no vuelves a saber de nosotros.</p>

  <p>Pero si funciona... cada día que pasa sin usarla son llamadas que podrías no estar cogiendo, presupuestos que podrías haber enviado antes y clientes de ITV que se van a otro taller.</p>

  <p><a href="${SITE_URL}" style="display: inline-block; background: #f97316; color: white; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700;">Crear mi primera orden →</a></p>

  <p>¿Problema técnico? ¿No te aclaras? <a href="https://wa.me/34611433218" style="color: #f97316;">Escríbeme por WhatsApp</a> y te lo dejo montado yo en 5 minutos.</p>

  <p>Sergi<br><span style="color: #a8a29e;">FIXA · Ibañez Clima</span></p>
</div>`,
  };
}

/** Día 7: Email pre-fin de trial — persuasivo, con urgencia real (no falsa) */
export function emailDia7(nombre: string) {
  const firstName = nombre?.split(" ")[0] || "";
  return {
    subject: `${firstName}, te quedan 7 días de FIXA gratis`,
    html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; color: #1c1917; line-height: 1.7; font-size: 15px;">
  <p>${firstName ? `${firstName},` : "Hola,"}</p>

  <p>Llevas una semana con FIXA. Te quedan 7 días de prueba gratis.</p>

  <p>Déjame ser directo: <strong>si FIXA no te ha ahorrado ni media hora esta semana, no la pagues.</strong> En serio. 29€ al mes es poco, pero si no te aporta, es dinero tirado.</p>

  <p>Pero si esta semana...</p>

  <ul style="padding-left: 20px;">
    <li>Un cliente ha mirado el estado de su coche <strong>sin llamarte</strong></li>
    <li>Has hecho un presupuesto en <strong>2 minutos en vez de 20</strong></li>
    <li>Has visto una ITV que se te iba a escapar</li>
    <li>Has entregado un coche y el WhatsApp con el informe ha salido <strong>solo</strong></li>
  </ul>

  <p>...entonces sabes lo que vale. Y si lo multiplicas por 4 semanas, el cálculo es claro: <strong>FIXA te devuelve su precio en la primera hora de uso mensual.</strong></p>

  <p>Para seguir después del trial, escríbenos y lo activamos. Sin contratos, sin permanencia, sin sorpresas.</p>

  <p><a href="https://wa.me/34611433218?text=Hola%2C%20quiero%20activar%20FIXA%20para%20mi%20taller" style="display: inline-block; background: #f97316; color: white; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700;">Activar FIXA por WhatsApp →</a></p>

  <p>Y si no te convence, no pasa nada. Cancela y tus datos se borran. Sin preguntas, sin llamadas comerciales, sin "¿estás seguro?".</p>

  <p>Un saludo,<br><strong>Sergi</strong><br><span style="color: #a8a29e;">FIXA · Ibañez Clima</span></p>

  <hr style="border: none; border-top: 2px solid #f97316; margin: 24px 0 16px;" />
  <p style="font-size: 12px; color: #a8a29e;">
    PD: Si no has usado FIXA esta semana, respóndeme — quiero saber qué ha fallado. Cada taller que no la usa me dice algo que necesito mejorar.
  </p>
</div>`,
  };
}
