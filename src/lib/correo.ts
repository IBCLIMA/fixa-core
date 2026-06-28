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

/** Carpetas soportadas por el cliente (alcance cerrado). */
export type Carpeta = "recibidos" | "enviados" | "spam";

export type MensajeResumen = {
  uid: number;
  /** Dirección de la "otra parte": remitente en Recibidos/Spam, destinatario en Enviados. */
  from: string;
  fromName: string;
  subject: string;
  date: string | null;
  seen: boolean;
  snippet: string;
};

export type ListarParams = {
  carpeta?: Carpeta;
  limit?: number;
  offset?: number;
  /** Texto de búsqueda IMAP (asunto / remitente / destinatario / cuerpo). */
  buscar?: string;
};

export type ListarResultado = {
  mensajes: MensajeResumen[];
  /** Total de mensajes que cumplen el filtro en la carpeta (para paginar). */
  total: number;
  /** `true` si quedan más mensajes por cargar tras esta página. */
  hayMas: boolean;
  /** `false` si la carpeta no existe en el servidor IMAP (p.ej. no hay Spam). */
  carpetaDisponible: boolean;
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

type BuzonImap = {
  path: string;
  name?: string;
  specialUse?: string;
};

type Buzones = {
  recibidos: string;
  enviados: string | null;
  spam: string | null;
};

/**
 * Encuentra el path de un buzón por nombre, de forma tolerante.
 * En cPanel/Webempresa los nombres reales varían (INBOX.Sent, INBOX.spam,
 * "Sent Items", "Correo no deseado"…), así que comparamos tanto el nombre
 * de la hoja como el último segmento del path en minúsculas.
 */
function buscarPorNombre(lista: BuzonImap[], candidatos: string[]): string | null {
  const norm = (s: string) => s.toLowerCase().trim();
  const cands = candidatos.map(norm);
  for (const b of lista) {
    const hoja = norm(b.name ?? b.path.split(/[./]/).pop() ?? b.path);
    if (cands.includes(hoja)) return b.path;
  }
  // Segundo intento: coincidencia parcial (p.ej. "INBOX.Sent Mail").
  for (const b of lista) {
    const hoja = norm(b.name ?? b.path.split(/[./]/).pop() ?? b.path);
    if (cands.some((c) => hoja.includes(c))) return b.path;
  }
  return null;
}

/**
 * Detecta los buzones reales de Recibidos / Enviados / Spam.
 *
 * Prioriza los special-use flags de IMAP (RFC 6154: `\Sent`, `\Junk`),
 * que es lo robusto. Si el servidor no los expone, cae a heurística por
 * nombre con variantes habituales en castellano e inglés.
 */
async function detectarBuzones(client: ImapFlow): Promise<Buzones> {
  let lista: BuzonImap[] = [];
  try {
    lista = (await client.list()) as unknown as BuzonImap[];
  } catch {
    lista = [];
  }

  let enviados: string | null = null;
  let spam: string | null = null;

  for (const b of lista) {
    if (b.specialUse === "\\Sent") enviados = b.path;
    else if (b.specialUse === "\\Junk") spam = b.path;
  }

  if (!enviados) {
    enviados = buscarPorNombre(lista, [
      "sent",
      "enviados",
      "sent mail",
      "sent items",
      "elementos enviados",
      "correo enviado",
    ]);
  }
  if (!spam) {
    spam = buscarPorNombre(lista, [
      "junk",
      "spam",
      "bulk",
      "correo no deseado",
      "no deseado",
    ]);
  }

  return { recibidos: "INBOX", enviados, spam };
}

function pathDeCarpeta(carpeta: Carpeta, buzones: Buzones): string | null {
  if (carpeta === "recibidos") return buzones.recibidos;
  if (carpeta === "enviados") return buzones.enviados;
  return buzones.spam;
}

/**
 * Lista mensajes de la carpeta indicada (más recientes primero), paginando
 * de `limit` en `limit` a partir de `offset`. Soporta búsqueda IMAP por
 * asunto / remitente / destinatario / cuerpo. Abre y cierra la conexión.
 *
 * - En "enviados" la dirección mostrada (`from`) es el DESTINATARIO (To).
 * - Si la carpeta no existe en el servidor, devuelve `carpetaDisponible: false`.
 */
/**
 * Cuenta los correos NO LEÍDOS de la bandeja de entrada. Ligero: usa IMAP STATUS
 * (no abre el buzón ni descarga mensajes). Para el badge de "correos nuevos".
 */
export async function contarNoLeidos(): Promise<number> {
  const client = nuevoClienteImap();
  await client.connect();
  try {
    const status = await client.status("INBOX", { unseen: true });
    return status.unseen ?? 0;
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function listarMensajes(
  params: ListarParams = {},
): Promise<ListarResultado> {
  const carpeta: Carpeta = params.carpeta ?? "recibidos";
  const limit = Math.min(Math.max(1, params.limit ?? 30), 50);
  const offset = Math.max(0, params.offset ?? 0);
  const buscar = (params.buscar ?? "").trim();

  const vacio: ListarResultado = {
    mensajes: [],
    total: 0,
    hayMas: false,
    carpetaDisponible: true,
  };

  const client = nuevoClienteImap();
  await client.connect();

  try {
    const buzones = await detectarBuzones(client);
    const path = pathDeCarpeta(carpeta, buzones);
    if (!path) {
      return { ...vacio, carpetaDisponible: false };
    }

    const lock = await client.getMailboxLock(path);
    try {
      const mailbox = client.mailbox;
      const existen = typeof mailbox === "object" && mailbox ? mailbox.exists : 0;
      if (!existen) return vacio;

      // Conjunto de UIDs candidatos (todos, o los que cumplen la búsqueda).
      const criterio = buscar
        ? {
            or: [
              { subject: buscar },
              { from: buscar },
              { to: buscar },
              { body: buscar },
            ],
          }
        : { all: true };

      const uids = ((await client.search(criterio, { uid: true })) || []) as number[];
      // Más recientes primero: el UID crece con el tiempo dentro del buzón.
      uids.sort((a, b) => b - a);

      const total = uids.length;
      const pageUids = uids.slice(offset, offset + limit);
      if (pageUids.length === 0) {
        return { mensajes: [], total, hayMas: false, carpetaDisponible: true };
      }

      const esEnviados = carpeta === "enviados";
      const mensajes: MensajeResumen[] = [];

      for await (const msg of client.fetch(
        pageUids,
        { uid: true, envelope: true, flags: true, source: true },
        { uid: true },
      )) {
        // En Enviados interesa el destinatario; en el resto, el remitente.
        const persona = esEnviados
          ? parseDireccion(msg.envelope?.to)
          : parseDireccion(msg.envelope?.from);

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
          from: persona.address,
          fromName: persona.name || persona.address,
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

      return {
        mensajes,
        total,
        hayMas: offset + pageUids.length < total,
        carpetaDisponible: true,
      };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

/**
 * Lee un mensaje completo por UID dentro de la carpeta indicada (el UID es
 * único por buzón, así que hay que abrir el correcto). Devuelve cuerpo en
 * texto y HTML parseados. Marca el mensaje como leído (\Seen).
 * Abre y cierra la conexión.
 */
export async function leerMensaje(
  uid: number,
  carpeta: Carpeta = "recibidos",
): Promise<MensajeCompleto | null> {
  const client = nuevoClienteImap();
  await client.connect();

  try {
    const buzones = await detectarBuzones(client);
    const path = pathDeCarpeta(carpeta, buzones);
    if (!path) return null;

    const lock = await client.getMailboxLock(path);
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
