import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";

/**
 * Cliente de correo para el buzón hola@fixataller.es (soporte FIXA).
 *
 * Pensado para entorno serverless (Vercel): cada función abre y CIERRA su
 * propia conexión IMAP/SMTP. NUNCA se reutiliza una conexión entre llamadas.
 *
 * Credenciales SOLO desde variables de entorno. Nada hardcodeado.
 */

const HOST = process.env.HOLA_MAIL_HOST;
const USER = process.env.HOLA_MAIL_USER;
const PASS = process.env.HOLA_IMAP_PASSWORD;

const FROM = `Soporte FIXA <${USER ?? "hola@fixataller.es"}>`;

function assertConfig() {
  if (!HOST || !USER || !PASS) {
    throw new Error(
      "Correo no configurado: faltan HOLA_MAIL_HOST / HOLA_MAIL_USER / HOLA_IMAP_PASSWORD en el entorno.",
    );
  }
}

function nuevoClienteImap(): ImapFlow {
  assertConfig();
  return new ImapFlow({
    host: HOST!,
    port: 993,
    secure: true,
    auth: { user: USER!, pass: PASS! },
    // Silenciar el logger ruidoso de imapflow en producción.
    logger: false,
  });
}

export type MensajeResumen = {
  uid: number;
  from: string;
  fromName: string;
  subject: string;
  date: string | null;
  seen: boolean;
  snippet: string;
};

export type MensajeCompleto = {
  uid: number;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  date: string | null;
  seen: boolean;
  text: string;
  html: string | null;
  messageId: string | null;
  references: string | null;
};

function parseDireccion(value: unknown): { address: string; name: string } {
  // imapflow envelope.from es un array de { name, address }
  if (Array.isArray(value) && value.length > 0) {
    const first = value[0] as { name?: string; address?: string };
    return { address: first.address ?? "", name: first.name ?? "" };
  }
  return { address: "", name: "" };
}

/**
 * Lista los últimos `limit` mensajes de INBOX (más recientes primero).
 * Trae cabeceras + un snippet de texto. Abre y cierra la conexión.
 */
export async function listarMensajes(limit = 30): Promise<MensajeResumen[]> {
  const client = nuevoClienteImap();
  await client.connect();

  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const mailbox = client.mailbox;
      const total = typeof mailbox === "object" && mailbox ? mailbox.exists : 0;
      if (!total) return [];

      // Rango de secuencia de los últimos N mensajes.
      const desde = Math.max(1, total - limit + 1);
      const rango = `${desde}:${total}`;

      const mensajes: MensajeResumen[] = [];

      for await (const msg of client.fetch(
        rango,
        { uid: true, envelope: true, flags: true, source: true },
        { uid: false },
      )) {
        const from = parseDireccion(msg.envelope?.from);

        let snippet = "";
        if (msg.source) {
          try {
            const parsed = await simpleParser(msg.source);
            const texto = (parsed.text ?? "").replace(/\s+/g, " ").trim();
            snippet = texto.slice(0, 140);
          } catch {
            snippet = "";
          }
        }

        mensajes.push({
          uid: msg.uid,
          from: from.address,
          fromName: from.name || from.address,
          subject: msg.envelope?.subject ?? "(sin asunto)",
          date: msg.envelope?.date ? new Date(msg.envelope.date).toISOString() : null,
          seen: msg.flags?.has("\\Seen") ?? false,
          snippet,
        });
      }

      // Más recientes primero.
      mensajes.sort((a, b) => {
        const ta = a.date ? Date.parse(a.date) : 0;
        const tb = b.date ? Date.parse(b.date) : 0;
        return tb - ta;
      });

      return mensajes;
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

/**
 * Lee un mensaje completo por UID. Devuelve cuerpo en texto y HTML parseados.
 * Marca el mensaje como leído (\Seen). Abre y cierra la conexión.
 */
export async function leerMensaje(uid: number): Promise<MensajeCompleto | null> {
  const client = nuevoClienteImap();
  await client.connect();

  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const msg = await client.fetchOne(
        String(uid),
        { uid: true, envelope: true, flags: true, source: true },
        { uid: true },
      );

      if (!msg || !msg.source) return null;

      const parsed = await simpleParser(msg.source);
      const from = parseDireccion(msg.envelope?.from);
      const to = parseDireccion(msg.envelope?.to);

      // Marcar como leído.
      try {
        await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
      } catch {
        // No es crítico si falla.
      }

      const refs = Array.isArray(parsed.references)
        ? parsed.references.join(" ")
        : parsed.references ?? null;

      return {
        uid: msg.uid,
        from: from.address,
        fromName: from.name || from.address,
        to: to.address,
        subject: msg.envelope?.subject ?? "(sin asunto)",
        date: msg.envelope?.date ? new Date(msg.envelope.date).toISOString() : null,
        seen: true,
        text: parsed.text ?? "",
        html: typeof parsed.html === "string" ? parsed.html : null,
        messageId: parsed.messageId ?? null,
        references: refs,
      };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

// "-- " (guion-guion-espacio) es el delimitador estándar de firma (RFC 3676): muchos
// clientes lo reconocen y la ocultan al responder, para no acumularla en el hilo.
//
// Correo NUEVO → firma profesional completa + aviso legal y de protección de datos (RGPD).
const FIRMA_NUEVO = [
  "",
  "-- ",
  "Sergi Ibañez",
  "FIXA · fixataller.es",
  "hola@fixataller.es · 630 726 364",
  "",
  "──────────",
  "AVISO DE CONFIDENCIALIDAD: Este mensaje y sus archivos adjuntos son confidenciales y van dirigidos únicamente a su destinatario. Si lo ha recibido por error, le rogamos lo elimine y avise al remitente; queda prohibida su copia o difusión.",
  "PROTECCIÓN DE DATOS (RGPD): Tratamos tus datos para atender tu consulta y gestionar nuestra relación. Puedes ejercer tus derechos de acceso, rectificación, supresión y oposición escribiendo a hola@fixataller.es. Más información en fixataller.es/privacidad.",
].join("\n");

// RESPUESTA → firma corta, solo contacto (la parte legal ya viajó en el primer correo).
const FIRMA_RESPUESTA = [
  "",
  "-- ",
  "Sergi Ibañez · FIXA",
  "hola@fixataller.es · 630 726 364",
].join("\n");

/** Añade la firma indicada al final del cuerpo (sin espacios sobrantes). */
function conFirma(text: string, firma: string): string {
  return `${text.replace(/\s+$/, "")}\n${firma}`;
}

export type ResponderParams = {
  to: string;
  subject: string;
  text: string;
  inReplyTo?: string | null;
  references?: string | null;
};

/**
 * Envía una respuesta por SMTP (puerto 465, SSL). Añade cabeceras
 * In-Reply-To / References para que el cliente del destinatario lo agrupe
 * como respuesta dentro del hilo correcto.
 */
export async function responder({
  to,
  subject,
  text,
  inReplyTo,
  references,
}: ResponderParams): Promise<{ messageId: string }> {
  assertConfig();

  if (!to || !to.includes("@")) {
    throw new Error("Destinatario inválido.");
  }
  if (!text.trim()) {
    throw new Error("El cuerpo del mensaje está vacío.");
  }

  const transporter = nodemailer.createTransport({
    host: HOST!,
    port: 465,
    secure: true,
    auth: { user: USER!, pass: PASS! },
  });

  const asunto = subject.toLowerCase().startsWith("re:") ? subject : `Re: ${subject}`;

  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject: asunto,
    text: conFirma(text, FIRMA_RESPUESTA),
    inReplyTo: inReplyTo ?? undefined,
    references: references ?? inReplyTo ?? undefined,
  });

  return { messageId: info.messageId };
}

export type EnviarParams = {
  to: string;
  subject: string;
  text: string;
};

/**
 * Envía un correo NUEVO (redactado desde cero) por SMTP (puerto 465, SSL).
 * No añade cabeceras de hilo: es un mensaje nuevo, no una respuesta.
 * From = "Soporte FIXA <hola@fixataller.es>".
 */
export async function enviar({
  to,
  subject,
  text,
}: EnviarParams): Promise<{ messageId: string }> {
  assertConfig();

  if (!to || !to.includes("@")) {
    throw new Error("Destinatario inválido.");
  }
  if (!subject.trim()) {
    throw new Error("El asunto está vacío.");
  }
  if (!text.trim()) {
    throw new Error("El cuerpo del mensaje está vacío.");
  }

  const transporter = nodemailer.createTransport({
    host: HOST!,
    port: 465,
    secure: true,
    auth: { user: USER!, pass: PASS! },
  });

  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject,
    text: conFirma(text, FIRMA_NUEVO),
  });

  return { messageId: info.messageId };
}
