import Link from "next/link";
import { Receipt, Search, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDocumentos } from "../actions/documentos";
import { DocumentosSearch } from "./documentos-search";

const metodoPagoLabels: Record<string, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  bizum: "Bizum",
  domiciliacion: "Domiciliacion",
  otro: "Otro",
};

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  try {
    await requireRole(["admin", "recepcion"]);
  } catch {
    redirect("/");
  }

  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const search = sp.q || "";

  const { documentos, total, totalPages } = await getDocumentos(page, search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Documentos de cobro</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} {total === 1 ? "documento" : "documentos"} generados
          </p>
        </div>
      </div>

      {/* Search */}
      <DocumentosSearch initialSearch={search} />

      {/* Documents list */}
      <Card>
        <CardContent className="p-4">
          {documentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-sm font-bold">
                {search ? "Sin resultados" : "Sin documentos de cobro"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                {search
                  ? "Prueba con otro termino de busqueda."
                  : "Los documentos se generan al cobrar una orden desde la pantalla de detalle."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documentos/${doc.id}`}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-muted-foreground">
                      DOC-{String(doc.numero).padStart(4, "0")}
                    </span>
                    <span className="text-sm font-medium">{doc.matricula}</span>
                    <span className="text-xs text-muted-foreground truncate">{doc.clienteNombre}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {doc.metodoPago && (
                      <Badge variant="outline" className="text-[10px]">
                        {metodoPagoLabels[doc.metodoPago] || doc.metodoPago}
                      </Badge>
                    )}
                    <span className="text-sm font-bold">{Number(doc.totalFinal).toFixed(2)}EUR</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/documentos?page=${page - 1}${search ? `&q=${search}` : ""}`}>
              <Button variant="outline" size="sm" className="rounded-xl">
                Anterior
              </Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Pagina {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/documentos?page=${page + 1}${search ? `&q=${search}` : ""}`}>
              <Button variant="outline" size="sm" className="rounded-xl">
                Siguiente
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
