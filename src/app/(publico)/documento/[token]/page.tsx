import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Car, FileText } from "lucide-react";
import { PortalClienteHeader } from "@/components/portal-cliente-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDb } from "@/db";
import { documentosCobro, talleres } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatMoney } from "@/lib/format";
import { registrarApertura } from "@/lib/portal-views";

// Página privada de cliente (acceso por token): no indexable
export const metadata = { robots: { index: false, follow: false } };


const metodoPagoLabels: Record<string, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  bizum: "Bizum",
  domiciliacion: "Domiciliacion",
  otro: "Otro",
};

type LineaSnapshot = {
  tipo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuentoPct: number;
  ivaPct: number;
  subtotal: number;
};

export default async function DocumentoPublicoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const db = getDb();

  const [doc] = await db
    .select()
    .from(documentosCobro)
    .where(eq(documentosCobro.tokenPublico, token))
    .limit(1);

  if (!doc) return notFound();

  // Tracking de apertura del portal (no bloquea el render; ver portal-views.ts)
  registrarApertura({
    tallerId: doc.tallerId,
    tipo: "documento",
    entidadId: doc.id,
    token,
    clienteId: doc.clienteId,
    userAgent: (await headers()).get("user-agent"),
  });

  // Logo del taller para la cabecera white-label (el snapshot del documento no lo guarda)
  const [taller] = await db
    .select({ logoUrl: talleres.logoUrl })
    .from(talleres)
    .where(eq(talleres.id, doc.tallerId))
    .limit(1);

  const lineas = (doc.lineas as LineaSnapshot[]) || [];
  const docNumero = `DOC-${String(doc.numero).padStart(4, "0")}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header — identidad del taller (white-label) */}
      <PortalClienteHeader
        nombre={doc.tallerNombre}
        logoUrl={taller?.logoUrl}
        subtitle="Documento de cobro"
        className="no-print"
      />

      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Workshop header + doc number */}
        <div className="text-center space-y-3">
          <h2 className="text-lg font-bold">{doc.tallerNombre}</h2>
          {doc.tallerCif && (
            <p className="text-xs text-muted-foreground">CIF: {doc.tallerCif}</p>
          )}
          {doc.tallerDireccion && (
            <p className="text-xs text-muted-foreground">{doc.tallerDireccion}</p>
          )}
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            {doc.tallerTelefono && (
              <a href={`tel:${doc.tallerTelefono}`} className="hover:text-brand-600 transition-colors print:text-muted-foreground">
                Tel: {doc.tallerTelefono}
              </a>
            )}
            {doc.tallerEmail && (
              <a href={`mailto:${doc.tallerEmail}`} className="hover:text-brand-600 transition-colors print:text-muted-foreground">
                {doc.tallerEmail}
              </a>
            )}
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">{docNumero}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(doc.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Client + Vehicle */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Cliente
              </p>
              <p className="text-sm font-bold">{doc.clienteNombre}</p>
              {doc.clienteNif && <p className="text-xs text-muted-foreground">NIF: {doc.clienteNif.slice(0, 3)}{'*'.repeat(Math.max(0, doc.clienteNif.length - 5))}{doc.clienteNif.slice(-2)}</p>}
              {doc.clienteDireccion && <p className="text-xs text-muted-foreground">{doc.clienteDireccion}</p>}
            </div>
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-bold text-lg tracking-wider">{doc.matricula}</p>
                <p className="text-sm text-muted-foreground">
                  {[doc.marca, doc.modelo].filter(Boolean).join(" ")}
                  {doc.km ? ` - ${doc.km.toLocaleString("es-ES")} km` : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lines */}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              Detalle
            </p>
            {lineas.length > 0 ? (
              <div className="space-y-2">
                {lineas.map((linea, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {linea.tipo === "mano_obra"
                            ? "M.O."
                            : linea.tipo === "recambio"
                              ? "Recambio"
                              : "Otros"}
                        </Badge>
                        <span className="text-sm font-medium">{linea.descripcion}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {linea.cantidad} x {formatMoney(linea.precioUnitario)}
                        {linea.descuentoPct > 0 && ` (-${linea.descuentoPct}%)`}
                        {" - IVA "}{linea.ivaPct}%
                      </p>
                    </div>
                    <span className="text-sm font-bold">{formatMoney(linea.subtotal)}</span>
                  </div>
                ))}

                <Separator className="my-3" />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base imponible</span>
                    <span>{formatMoney(Number(doc.baseImponible))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA</span>
                    <span>{formatMoney(Number(doc.totalIva))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-border">
                    <span>TOTAL</span>
                    <span>{formatMoney(Number(doc.totalFinal))}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Sin lineas</p>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Pago</p>
                <p className="text-sm font-bold">
                  {doc.metodoPago ? metodoPagoLabels[doc.metodoPago] || doc.metodoPago : "-"}
                </p>
              </div>
              {doc.fechaPago && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Fecha de pago</p>
                  <p className="text-sm font-medium">
                    {new Date(doc.fechaPago).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {doc.notas && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Notas</p>
              <p className="text-sm">{doc.notas}</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Documento generado por FIXA — fixataller.es</p>
        </div>
      </main>
    </div>
  );
}
