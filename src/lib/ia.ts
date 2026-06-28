/**
 * IA de FIXA — la ÚNICA función de IA de la V1.
 *
 * "Explicación técnica → mensaje claro para el cliente": el mecánico escribe en
 * jerga de taller; esta función propone un mensaje breve, claro, profesional y
 * tranquilizador para el dueño del coche. El humano SIEMPRE revisa antes de enviar.
 *
 * Llama directamente a la Messages API de Anthropic por HTTP (sin SDK, por
 * decisión explícita). Modelo: claude-haiku-4-5 — rápido y barato, suficiente
 * para reescribir un texto corto.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

const SISTEMA = `Eres el asistente de comunicación de un taller mecánico en España. Tu único trabajo es convertir la nota técnica que escribe el mecánico (en jerga, abreviada, a veces telegráfica) en un mensaje claro para el dueño del coche.

Reglas:
- Escribe en español de España, en segunda persona ("tu coche", "te recomendamos").
- Tono profesional, cercano y tranquilizador. Sin alarmismo.
- Breve: 2 o 4 frases. Nada de relleno ni despedidas largas.
- Explica qué le pasa al coche y qué se va a hacer (o se ha hecho), en palabras que entienda alguien sin conocimientos de mecánica. Evita tecnicismos; si usas alguno, explícalo en una palabra.
- NO inventes datos que no estén en la nota: ni piezas, ni plazos, ni precios. Si el mecánico no da un precio, no menciones precios.
- No añadas saludos del tipo "Hola, soy..." ni firmes. Devuelve solo el cuerpo del mensaje, listo para enviar.
- Devuelve únicamente el mensaje, sin comillas ni encabezados.`;

export type ContextoExplicacion = {
  vehiculo?: string;
  cliente?: string;
};

/**
 * Convierte una explicación técnica del mecánico en un mensaje claro para el cliente.
 * @throws si falta `ANTHROPIC_API_KEY` o si la API de Anthropic falla.
 */
export async function explicarAlCliente(
  textoTecnico: string,
  contexto?: ContextoExplicacion
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta configurar ANTHROPIC_API_KEY. Añádela en las variables de entorno para activar la IA."
    );
  }

  const texto = textoTecnico?.trim();
  if (!texto) {
    throw new Error("No hay texto técnico que explicar.");
  }

  // Datos de contexto opcionales (nombre del cliente, vehículo) — ayudan a
  // personalizar el mensaje sin que la IA tenga que inventarlos.
  const partesContexto: string[] = [];
  if (contexto?.vehiculo) partesContexto.push(`Vehículo: ${contexto.vehiculo}.`);
  if (contexto?.cliente) partesContexto.push(`Cliente: ${contexto.cliente}.`);
  const cabecera = partesContexto.length ? partesContexto.join(" ") + "\n\n" : "";

  const userContent = `${cabecera}Nota técnica del mecánico:\n"""\n${texto}\n"""\n\nReescríbela como un mensaje claro para el cliente.`;

  let res: Response;
  try {
    res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SISTEMA,
        messages: [{ role: "user", content: userContent }],
      }),
    });
  } catch {
    // Errores de red / DNS / timeout antes de obtener respuesta.
    throw new Error(
      "No se pudo conectar con el servicio de IA. Revisa tu conexión e inténtalo de nuevo."
    );
  }

  if (!res.ok) {
    let detalle = "";
    try {
      const err = await res.json();
      detalle = err?.error?.message || "";
    } catch {
      /* respuesta sin cuerpo JSON */
    }
    throw new Error(
      `El servicio de IA devolvió un error (${res.status})${detalle ? `: ${detalle}` : ""}.`
    );
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
    stop_reason?: string;
  };

  // Si los clasificadores de seguridad rechazan, no habrá bloque de texto.
  if (data.stop_reason === "refusal") {
    throw new Error("La IA no pudo generar el mensaje. Reformula la nota técnica.");
  }

  const mensaje = (data.content || [])
    .filter((b) => b.type === "text" && b.text)
    .map((b) => b.text!.trim())
    .join("\n")
    .trim();

  if (!mensaje) {
    throw new Error("La IA no devolvió ningún mensaje. Inténtalo de nuevo.");
  }

  return mensaje;
}
