import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, MessageSquare, ExternalLink, Car, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDocumentoCobro } from "../../actions/documentos";
import { DocumentoActions } from "./documento-actions";

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

export default async function DocumentoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getDocumentoCobro(id);
  if (!doc) return notFound();

  const lineas = (doc.lineas as LineaSnapshot[]) || [];
  const docNumero = `DOC-${String(doc.numero).padStart(4, "0")}`;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 no-print">
        <Link href="/documentos">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">{docNumero}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date(doc.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <DocumentoActions
          documentoId={doc.id}
          tokenPublico={doc.tokenPublico}
          clienteTelefono={doc.clienteTelefono}
          clienteNombre={doc.clienteNombre}
          matricula={doc.matricula}
          docNumero={docNumero}
        />
      </div>

      {/* Printable document */}
      <div className="print:p-8">
        {/* Document header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-extrabold">{doc.tallerNombre}</h2>
            {doc.tallerCif && <p className="text-sm text-muted-foreground">CIF: {doc.tallerCif}</p>}
            {doc.tallerDireccion && <p className="text-sm text-muted-foreground">{doc.tallerDireccion}</p>}
            {doc.tallerTelefono && <p className="text-sm text-muted-foreground">Tel: {doc.tallerTelefono}</p>}
            {doc.tallerEmail && <p className="text-sm text-muted-foreground">{doc.tallerEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold tracking-tight">{docNumero}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(doc.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Client & Vehicle */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Cliente</p>
              <p className="text-sm font-bold">{doc.clienteNombre}</p>
              {doc.clienteNif && <p className="text-sm text-muted-foreground">NIF: {doc.clienteNif}</p>}
              {doc.clienteDireccion && <p className="text-sm text-muted-foreground">{doc.clienteDireccion}</p>}
              {doc.clienteTelefono && <p className="text-sm text-muted-foreground">Tel: {doc.clienteTelefono}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Vehiculo</p>
              <p className="text-lg font-bold tracking-wider">{doc.matricula}</p>
              <p className="text-sm text-muted-foreground">
                {[doc.marca, doc.modelo].filter(Boolean).join(" ")}
              </p>
              {doc.km && <p className="text-sm text-muted-foreground">{doc.km.toLocaleString("es-ES")} km</p>}
            </CardContent>
          </Card>
        </div>

        {/* Lines table */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              Detalle
            </p>

            {/* Desktop table */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-[auto_1fr_60px_80px_50px_50px_80px] gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border px-1">
                <span>Tipo</span>
                <span>Descripcion</span>
                <span className="text-right">Cant.</span>
                <span className="text-right">Precio</span>
                <span className="text-right">Dto.</span>
                <span className="text-right">IVA</span>
                <span className="text-right">Subtotal</span>
              </div>
              {lineas.map((linea, i) => (
                <div key={i} className="grid grid-cols-[auto_1fr_60px_80px_50px_50px_80px] gap-2 text-sm py-2 border-b border-border/50 px-1 items-center">
                  <Badge variant="outline" className="text-[10px] w-fit">
                    {linea.tipo === "mano_obra" ? "M.O." : linea.tipo === "recambio" ? "Recambio" : "Otros"}
                  </Badge>
                  <span>{linea.descripcion}</span>
                  <span className="text-right">{linea.cantidad}</span>
                  <span className="text-right">{linea.precioUnitario.toFixed(2)}EUR</span>
                  <span className="text-right">{linea.descuentoPct > 0 ? `${linea.descuentoPct}%` : "-"}</span>
                  <span className="text-right">{linea.ivaPct}%</span>
                  <span className="text-right font-bold">{linea.subtotal.toFixed(2)}EUR</span>
                </div>
              ))}
            </div>

            {/* Mobile list */}
            <div className="sm:hidden space-y-2">
              {lineas.map((linea, i) => (
                <div key={i} className="rounded-xl bg-muted/50 px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {linea.tipo === "mano_obra" ? "M.O." : linea.tipo === "recambio" ? "Recambio" : "Otros"}
                      </Badge>
                      <span className="text-sm font-medium">{linea.descripcion}</span>
                    </div>
                    <span className="text-sm font-bold">{linea.subtotal.toFixed(2)}EUR</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {linea.cantidad} x {linea.precioUnitario.toFixed(2)}EUR
                    {linea.descuentoPct > 0 && ` (-${linea.descuentoPct}%)`}
                    {" - IVA "}{linea.ivaPct}%
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base imponible</span>
                <span>{Number(doc.baseImponible).toFixed(2)}EUR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA</span>
                <span>{Number(doc.totalIva).toFixed(2)}EUR</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-border">
                <span>TOTAL</span>
                <span>{Number(doc.totalFinal).toFixed(2)}EUR</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment info */}
        <Card className="mb-6">
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
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Notas</p>
              <p className="text-sm">{doc.notas}</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Documento generado por FIXA — fixataller.es</p>
        </div>
      </div>

      {/* Back to order link */}
      <div className="no-print">
        <Link href={`/ordenes/${doc.ordenId}`}>
          <Button variant="outline" size="sm" className="rounded-full">
            <ArrowLeft className="mr-1.5 h-3 w-3" />
            Volver a la orden
          </Button>
        </Link>
      </div>
    </div>
  );
}
