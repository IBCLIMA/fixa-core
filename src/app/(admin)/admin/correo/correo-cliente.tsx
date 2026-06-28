"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mail,
  RefreshCw,
  Loader2,
  AlertCircle,
  Send,
  Inbox,
  CornerUpLeft,
  PenSquare,
  X,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Validación básica de email (alineada con la del backend).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function emailValido(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

const LIMIT = 30;

type Carpeta = "recibidos" | "enviados" | "spam";

const CARPETAS: { id: Carpeta; label: string; icon: typeof Inbox }[] = [
  { id: "recibidos", label: "Recibidos", icon: Inbox },
  { id: "enviados", label: "Enviados", icon: Send },
  { id: "spam", label: "Spam", icon: ShieldAlert },
];

type MensajeResumen = {
  uid: number;
  from: string;
  fromName: string;
  subject: string;
  date: string | null;
  seen: boolean;
  snippet: string;
};

type MensajeCompleto = {
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

function formatFecha(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const ahora = new Date();
  const mismoDia =
    d.getFullYear() === ahora.getFullYear() &&
    d.getMonth() === ahora.getMonth() &&
    d.getDate() === ahora.getDate();
  if (mismoDia) {
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

export function CorreoCliente() {
  const [carpeta, setCarpeta] = useState<Carpeta>("recibidos");
  const [mensajes, setMensajes] = useState<MensajeResumen[]>([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [errorLista, setErrorLista] = useState<string | null>(null);
  const [hayMas, setHayMas] = useState(false);
  const [carpetaDisponible, setCarpetaDisponible] = useState(true);

  // Búsqueda: valor del input + valor "debounced" que dispara la consulta.
  const [busqueda, setBusqueda] = useState("");
  const [debounced, setDebounced] = useState("");

  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<MensajeCompleto | null>(null);
  const [cargandoMensaje, setCargandoMensaje] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const [respuesta, setRespuesta] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Composición de un correo nuevo (redactar desde cero).
  const [redactando, setRedactando] = useState(false);
  const [nuevoPara, setNuevoPara] = useState("");
  const [nuevoAsunto, setNuevoAsunto] = useState("");
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [enviandoNuevo, setEnviandoNuevo] = useState(false);
  const [tocadoPara, setTocadoPara] = useState(false);

  // Contador de petición para descartar respuestas obsoletas (carrera al
  // cambiar de carpeta o teclear en el buscador).
  const reqRef = useRef(0);

  const cargarPagina = useCallback(
    async (opts: { append: boolean; carp: Carpeta; q: string; offset: number }) => {
      const { append, carp, q, offset } = opts;
      const myReq = ++reqRef.current;

      if (append) {
        setCargandoMas(true);
      } else {
        setCargandoLista(true);
        setErrorLista(null);
      }

      try {
        const url =
          `/api/admin/correo?carpeta=${carp}&limit=${LIMIT}&offset=${offset}` +
          `&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        if (myReq !== reqRef.current) return; // respuesta obsoleta
        if (!res.ok) throw new Error(data?.error || "Error al cargar la bandeja.");

        setCarpetaDisponible(data.carpetaDisponible ?? true);
        setHayMas(data.hayMas ?? false);
        setMensajes((prev) =>
          append ? [...prev, ...(data.mensajes ?? [])] : data.mensajes ?? [],
        );
      } catch (e: any) {
        if (myReq !== reqRef.current) return;
        if (append) {
          toast.error("No se pudieron cargar más mensajes.");
        } else {
          setErrorLista(e?.message || "No se pudo conectar al buzón.");
          setMensajes([]);
        }
      } finally {
        if (myReq === reqRef.current) {
          setCargandoLista(false);
          setCargandoMas(false);
        }
      }
    },
    [],
  );

  // Debounce del buscador.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(busqueda.trim()), 350);
    return () => clearTimeout(t);
  }, [busqueda]);

  // Recarga (página 0) al cambiar de carpeta o de búsqueda.
  useEffect(() => {
    cargarPagina({ append: false, carp: carpeta, q: debounced, offset: 0 });
  }, [carpeta, debounced, cargarPagina]);

  const cambiarCarpeta = useCallback(
    (c: Carpeta) => {
      if (c === carpeta) return;
      // El UID pertenece al buzón anterior: cerramos el lector.
      setSeleccionado(null);
      setMensaje(null);
      setErrorMensaje(null);
      setBusqueda("");
      setDebounced("");
      setCarpeta(c);
    },
    [carpeta],
  );

  const recargar = useCallback(() => {
    cargarPagina({ append: false, carp: carpeta, q: debounced, offset: 0 });
  }, [cargarPagina, carpeta, debounced]);

  const cargarMas = useCallback(() => {
    cargarPagina({
      append: true,
      carp: carpeta,
      q: debounced,
      offset: mensajes.length,
    });
  }, [cargarPagina, carpeta, debounced, mensajes.length]);

  const abrir = useCallback(
    async (uid: number) => {
      setRedactando(false);
      setSeleccionado(uid);
      setMensaje(null);
      setRespuesta("");
      setErrorMensaje(null);
      setCargandoMensaje(true);
      try {
        const res = await fetch(`/api/admin/correo/${uid}?carpeta=${carpeta}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error al abrir el mensaje.");
        setMensaje(data.mensaje);
        // Marcar como leído en la lista local.
        setMensajes((prev) =>
          prev.map((m) => (m.uid === uid ? { ...m, seen: true } : m)),
        );
      } catch (e: any) {
        setErrorMensaje(e?.message || "No se pudo abrir el mensaje.");
      } finally {
        setCargandoMensaje(false);
      }
    },
    [carpeta],
  );

  const enviarRespuesta = useCallback(async () => {
    if (!mensaje) return;
    if (!respuesta.trim()) {
      toast.error("Escribe una respuesta.");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/admin/correo/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: mensaje.from,
          subject: mensaje.subject,
          text: respuesta,
          inReplyTo: mensaje.messageId,
          references: mensaje.references,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo enviar.");
      toast.success("Respuesta enviada.");
      setRespuesta("");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo enviar la respuesta.");
    } finally {
      setEnviando(false);
    }
  }, [mensaje, respuesta]);

  const abrirRedactar = useCallback(() => {
    setRedactando(true);
    setSeleccionado(null);
    setMensaje(null);
    setErrorMensaje(null);
    setTocadoPara(false);
  }, []);

  const cerrarRedactar = useCallback(() => {
    setRedactando(false);
    setNuevoPara("");
    setNuevoAsunto("");
    setNuevoTexto("");
    setTocadoPara(false);
  }, []);

  const enviarNuevo = useCallback(async () => {
    if (!emailValido(nuevoPara)) {
      setTocadoPara(true);
      toast.error("Introduce un email de destinatario válido.");
      return;
    }
    if (!nuevoAsunto.trim()) {
      toast.error("Escribe un asunto.");
      return;
    }
    if (!nuevoTexto.trim()) {
      toast.error("Escribe el mensaje.");
      return;
    }
    setEnviandoNuevo(true);
    try {
      const res = await fetch("/api/admin/correo/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: nuevoPara.trim(),
          subject: nuevoAsunto.trim(),
          text: nuevoTexto,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo enviar.");
      toast.success(`Correo enviado a ${nuevoPara.trim()}.`);
      cerrarRedactar();
    } catch (e: any) {
      toast.error(e?.message || "No se pudo enviar el correo.");
    } finally {
      setEnviandoNuevo(false);
    }
  }, [nuevoPara, nuevoAsunto, nuevoTexto, cerrarRedactar]);

  const paraInvalido = tocadoPara && nuevoPara.trim().length > 0 && !emailValido(nuevoPara);

  const esEnviados = carpeta === "enviados";
  const carpetaActual = CARPETAS.find((c) => c.id === carpeta)!;
  const IconoCarpeta = carpetaActual.icon;
  const hayBusqueda = debounced.length > 0;

  // Texto del estado vacío según el contexto.
  const vacioTitulo = !carpetaDisponible
    ? `La carpeta "${carpetaActual.label}" no está disponible en este buzón.`
    : hayBusqueda
      ? "Sin resultados para tu búsqueda."
      : carpeta === "enviados"
        ? "No hay correos en Enviados."
        : carpeta === "spam"
          ? "No hay correos en Spam."
          : "No hay mensajes en la bandeja.";

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Correo</h1>
            <p className="text-sm text-muted-foreground mt-0.5">hola@fixataller.es</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={recargar}
            disabled={cargandoLista}
          >
            {cargandoLista ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            Actualizar
          </Button>
          <Button size="sm" onClick={abrirRedactar} disabled={redactando}>
            <PenSquare className="size-3.5" />
            Redactar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Bandeja */}
        <div className="flex flex-col rounded-2xl border bg-card">
          {/* Carpetas */}
          <div className="border-b p-2">
            <div
              role="tablist"
              aria-label="Carpetas de correo"
              className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
            >
              {CARPETAS.map((c) => {
                const activa = c.id === carpeta;
                const Icono = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={activa}
                    onClick={() => cambiarCarpeta(c.id)}
                    className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-[13px] font-medium transition-colors ${
                      activa
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icono className="size-4 shrink-0" />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buscador */}
          <div className="border-b p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                inputMode="search"
                placeholder={`Buscar en ${carpetaActual.label.toLowerCase()}…`}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar correos"
                className="h-11 pl-9 pr-9"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[64vh] min-h-[200px] overflow-y-auto">
            {cargandoLista ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : errorLista ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <AlertCircle className="size-6 text-destructive" />
                <p className="text-sm text-muted-foreground">{errorLista}</p>
                <Button variant="outline" size="sm" onClick={recargar}>
                  Reintentar
                </Button>
              </div>
            ) : mensajes.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 px-4 py-10 text-center">
                <IconoCarpeta className="size-6 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">{vacioTitulo}</p>
                {hayBusqueda && carpetaDisponible && (
                  <Button variant="ghost" size="sm" onClick={() => setBusqueda("")}>
                    Limpiar búsqueda
                  </Button>
                )}
              </div>
            ) : (
              <>
                <ul className="divide-y">
                  {mensajes.map((m) => {
                    const activo = m.uid === seleccionado;
                    return (
                      <li key={m.uid}>
                        <button
                          type="button"
                          onClick={() => abrir(m.uid)}
                          className={`flex min-h-11 w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/60 ${
                            activo ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span
                              className={`truncate text-sm ${
                                m.seen ? "text-foreground" : "font-semibold"
                              }`}
                            >
                              {esEnviados && (
                                <span className="text-muted-foreground">Para: </span>
                              )}
                              {m.fromName}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {formatFecha(m.date)}
                            </span>
                          </div>
                          <span
                            className={`truncate text-[13px] ${
                              m.seen
                                ? "text-muted-foreground"
                                : "font-medium text-foreground"
                            }`}
                          >
                            {m.subject}
                          </span>
                          {m.snippet && (
                            <span className="truncate text-xs text-muted-foreground">
                              {m.snippet}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {hayMas && (
                  <div className="p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={cargarMas}
                      disabled={cargandoMas}
                    >
                      {cargandoMas ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          Cargando…
                        </>
                      ) : (
                        "Cargar más"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Lector + responder / Redactar */}
        <div className="rounded-2xl border bg-card">
          {redactando ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2 border-b px-6 py-4">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <PenSquare className="size-4 text-primary" />
                  Nuevo correo
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={cerrarRedactar}
                  disabled={enviandoNuevo}
                  aria-label="Cerrar redacción"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="nuevo-para"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Para
                  </label>
                  <Input
                    id="nuevo-para"
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    placeholder="destinatario@email.com"
                    value={nuevoPara}
                    onChange={(e) => setNuevoPara(e.target.value)}
                    onBlur={() => setTocadoPara(true)}
                    disabled={enviandoNuevo}
                    aria-invalid={paraInvalido}
                    className={
                      paraInvalido ? "border-destructive focus-visible:ring-destructive/30" : ""
                    }
                  />
                  {paraInvalido && (
                    <p className="text-xs text-destructive">
                      Email no válido.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="nuevo-asunto"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Asunto
                  </label>
                  <Input
                    id="nuevo-asunto"
                    placeholder="Asunto del correo"
                    value={nuevoAsunto}
                    onChange={(e) => setNuevoAsunto(e.target.value)}
                    disabled={enviandoNuevo}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="nuevo-texto"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Mensaje
                  </label>
                  <Textarea
                    id="nuevo-texto"
                    value={nuevoTexto}
                    onChange={(e) => setNuevoTexto(e.target.value)}
                    placeholder="Escribe tu mensaje…"
                    className="min-h-48"
                    disabled={enviandoNuevo}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    Se enviará desde hola@fixataller.es
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cerrarRedactar}
                      disabled={enviandoNuevo}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={enviarNuevo}
                      disabled={
                        enviandoNuevo ||
                        !emailValido(nuevoPara) ||
                        !nuevoAsunto.trim() ||
                        !nuevoTexto.trim()
                      }
                    >
                      {enviandoNuevo ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                      Enviar correo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : seleccionado === null ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <Mail className="size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Selecciona un mensaje para leerlo y responder, o redacta uno nuevo.
              </p>
              <Button variant="outline" size="sm" onClick={abrirRedactar}>
                <PenSquare className="size-3.5" />
                Redactar correo
              </Button>
            </div>
          ) : cargandoMensaje ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <div className="space-y-2 pt-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ) : errorMensaje ? (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <AlertCircle className="size-6 text-destructive" />
              <p className="text-sm text-muted-foreground">{errorMensaje}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => abrir(seleccionado)}
              >
                Reintentar
              </Button>
            </div>
          ) : mensaje ? (
            <div className="flex flex-col">
              <div className="border-b px-6 py-4">
                <h2 className="text-base font-semibold">{mensaje.subject}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {mensaje.fromName}
                  </span>
                  <span>&lt;{mensaje.from}&gt;</span>
                  {mensaje.date && (
                    <span className="ml-auto">
                      {new Date(mensaje.date).toLocaleString("es-ES", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-[42vh] overflow-y-auto px-6 py-4">
                {mensaje.html ? (
                  <div
                    className="prose prose-sm max-w-none break-words text-sm [&_a]:text-primary [&_img]:max-w-full"
                    // El HTML viene del buzón de soporte. Visible solo para el
                    // super-admin (fundador), no es contenido público.
                    dangerouslySetInnerHTML={{ __html: mensaje.html }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm text-foreground">
                    {mensaje.text || "(Mensaje sin contenido de texto)"}
                  </pre>
                )}
              </div>

              {/* Responder */}
              <div className="border-t bg-muted/30 px-6 py-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CornerUpLeft className="size-3.5" />
                  Responder a {mensaje.from}
                </div>
                <Textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  placeholder="Escribe tu respuesta…"
                  className="min-h-28 bg-background"
                  disabled={enviando}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={enviarRespuesta}
                    disabled={enviando || !respuesta.trim()}
                  >
                    {enviando ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Send className="size-3.5" />
                    )}
                    Enviar respuesta
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
