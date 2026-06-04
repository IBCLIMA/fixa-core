import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const FONT = "Helvetica";
const FONT_BOLD = "Helvetica-Bold";

const c = {
  black: "#000000",
  dark: "#1C1917",
  gray: "#57534E",
  lightGray: "#A8A29E",
  border: "#D6D3D1",
  lineDots: "#E7E5E4",
  bgLight: "#F5F5F4",
  white: "#FFFFFF",
  brand: "#EA580C",
};

const s = StyleSheet.create({
  page: {
    fontFamily: FONT,
    fontSize: 9,
    color: c.dark,
    padding: 30,
    paddingBottom: 40,
  },
  // ── Header ──
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: c.black,
    paddingBottom: 10,
  },
  tallerName: { fontSize: 14, fontFamily: FONT_BOLD },
  tallerInfo: { fontSize: 7.5, color: c.gray, lineHeight: 1.5, marginTop: 2 },
  orBlock: { alignItems: "flex-end" as any },
  orLabel: { fontSize: 8, color: c.gray, textTransform: "uppercase" as any, letterSpacing: 1 },
  orNumber: { fontSize: 22, fontFamily: FONT_BOLD, marginTop: 1 },
  // ── Matrícula destacada ──
  plateRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    gap: 20,
  },
  plateBox: {
    borderWidth: 2,
    borderColor: c.black,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  plateText: { fontSize: 20, fontFamily: FONT_BOLD, letterSpacing: 3 },
  dateText: { fontSize: 8, color: c.gray },
  // ── Bloques datos ──
  twoCol: { flexDirection: "row", gap: 12, marginBottom: 10 },
  colBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 4,
    padding: 8,
  },
  colTitle: {
    fontSize: 7,
    fontFamily: FONT_BOLD,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
    color: c.gray,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: c.lineDots,
    paddingBottom: 3,
  },
  fieldRow: { flexDirection: "row", marginBottom: 3 },
  fieldLabel: { fontSize: 7.5, color: c.lightGray, width: 50 },
  fieldValue: { fontSize: 9, fontFamily: FONT_BOLD, flex: 1 },
  // ── Sección grande: trabajos ──
  sectionTitle: {
    fontSize: 9,
    fontFamily: FONT_BOLD,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
    backgroundColor: c.bgLight,
    padding: 6,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 3,
    marginBottom: 4,
    marginTop: 8,
  },
  blankLine: {
    borderBottomWidth: 1,
    borderBottomColor: c.lineDots,
    borderBottomStyle: "dotted" as any,
    height: 18,
    marginBottom: 0,
  },
  filledLine: {
    borderBottomWidth: 1,
    borderBottomColor: c.lineDots,
    borderBottomStyle: "dotted" as any,
    minHeight: 18,
    paddingBottom: 2,
    paddingTop: 2,
    marginBottom: 0,
  },
  lineText: { fontSize: 9, lineHeight: 1.4 },
  // ── Tabla líneas ──
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: c.black,
    paddingBottom: 3,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: c.lineDots,
    paddingVertical: 3,
    minHeight: 16,
  },
  th: { fontSize: 7, fontFamily: FONT_BOLD, color: c.gray, textTransform: "uppercase" as any },
  td: { fontSize: 8 },
  // ── Totales ──
  totalsBlock: {
    alignItems: "flex-end" as any,
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  totalRow: { flexDirection: "row", marginBottom: 2 },
  totalLabel: { fontSize: 8, color: c.gray, width: 80, textAlign: "right" as any, paddingRight: 8 },
  totalValue: { fontSize: 8, width: 60, textAlign: "right" as any },
  totalFinalLabel: { fontSize: 10, fontFamily: FONT_BOLD, width: 80, textAlign: "right" as any, paddingRight: 8 },
  totalFinalValue: { fontSize: 10, fontFamily: FONT_BOLD, width: 60, textAlign: "right" as any },
  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 15,
    left: 30,
    right: 30,
  },
  footerText: { fontSize: 6, color: c.lightGray, textAlign: "center" as any, lineHeight: 1.5 },
  // ── Signatures ──
  sigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 30,
  },
  sigBlock: { flex: 1, alignItems: "center" as any },
  sigLine: { borderBottomWidth: 1, borderBottomColor: c.border, width: "100%", marginBottom: 3 },
  sigLabel: { fontSize: 7, color: c.lightGray },
  // QR
  qrRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: c.lineDots,
    borderRadius: 4,
  },
  qrText: { fontSize: 7, color: c.gray, lineHeight: 1.5 },
});

// ═══ TYPES ═══
export type OrdenPDFData = {
  tallerNombre: string;
  tallerCif?: string | null;
  tallerDireccion?: string | null;
  tallerTelefono?: string | null;
  tallerEmail?: string | null;
  tallerRegistro?: string | null;
  tallerRama?: string[] | null;
  numero: number;
  estado: string;
  fechaEntrada: string | Date;
  fechaEstimada?: string | Date | null;
  descripcionCliente?: string | null;
  diagnostico?: string | null;
  observacionesEntrada?: string | null;
  kmEntrada?: number | null;
  clienteNombre: string;
  clienteNif?: string | null;
  clienteTelefono?: string | null;
  clienteDireccion?: string | null;
  matricula: string;
  marca?: string | null;
  modelo?: string | null;
  anio?: number | null;
  vin?: string | null;
  color?: string | null;
  combustible?: string | null;
  lineas: {
    tipo: string;
    descripcion: string;
    cantidad: string | number;
    precioUnitario: string | number;
    descuentoPct?: string | number | null;
    ivaPct: string | number;
    tipoPieza?: string | null;
  }[];
  qrDataUrl?: string | null;
  trackingUrl?: string | null;
  firmaCliente?: string | null;
};

function fmt(d: string | Date | null | undefined): string {
  if (!d) return "___/___/______";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const combustibleLabels: Record<string, string> = {
  gasolina: "Gasolina", diesel: "Diésel", electrico: "Eléctrico", hibrido: "Híbrido", glp: "GLP",
};

const ramaLabels: Record<string, string> = {
  mecanica: "Mecánica", electricidad: "Elec.", carroceria: "Carrocería", pintura: "Pintura",
};

// ═══ MAIN COMPONENT ═══
export function OrdenReparacionPDF({ data }: { data: OrdenPDFData }) {
  let totalBase = 0;
  let totalIva = 0;
  const lineasCalc = data.lineas.map((l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    const iva = Number(l.ivaPct || 21);
    const base = qty * price * (1 - disc / 100);
    totalBase += base;
    totalIva += base * (iva / 100);
    return { ...l, base };
  });
  const totalFinal = totalBase + totalIva;

  // Blank lines to fill total to ~8 for handwriting space
  const blanksNeeded = Math.max(0, 8 - lineasCalc.length);

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ══ HEADER: Taller + OR Number ══ */}
        <View style={s.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.tallerName}>{data.tallerNombre}</Text>
            <Text style={s.tallerInfo}>
              {[data.tallerCif && `CIF: ${data.tallerCif}`, data.tallerDireccion].filter(Boolean).join(" · ")}
            </Text>
            <Text style={s.tallerInfo}>
              {[data.tallerTelefono, data.tallerEmail].filter(Boolean).join(" · ")}
            </Text>
            {data.tallerRegistro && (
              <Text style={s.tallerInfo}>Reg. Industrial: {data.tallerRegistro}</Text>
            )}
            {data.tallerRama && data.tallerRama.length > 0 && (
              <Text style={s.tallerInfo}>
                {data.tallerRama.map((r) => ramaLabels[r] || r).join(" · ")}
              </Text>
            )}
          </View>
          <View style={s.orBlock}>
            <Text style={s.orLabel}>Orden de reparación</Text>
            <Text style={s.orNumber}>OR-{data.numero}</Text>
          </View>
        </View>

        {/* ══ MATRÍCULA GRANDE + FECHAS ══ */}
        <View style={s.plateRow}>
          <View>
            <Text style={[s.dateText, { marginBottom: 2 }]}>Entrada: {fmt(data.fechaEntrada)}</Text>
            <Text style={s.dateText}>Entrega prevista: {fmt(data.fechaEstimada)}</Text>
          </View>
          <View style={s.plateBox}>
            <Text style={s.plateText}>{data.matricula}</Text>
          </View>
          <View>
            <Text style={[s.dateText, { marginBottom: 2 }]}>Km: {data.kmEntrada?.toLocaleString("es-ES") || "________"}</Text>
            <Text style={s.dateText}>Color: {data.color || "________"}</Text>
          </View>
        </View>

        {/* ══ CLIENTE + VEHÍCULO ══ */}
        <View style={s.twoCol}>
          <View style={s.colBox}>
            <Text style={s.colTitle}>Cliente</Text>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Nombre</Text>
              <Text style={s.fieldValue}>{data.clienteNombre}</Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Teléfono</Text>
              <Text style={s.fieldValue}>{data.clienteTelefono || ""}</Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>NIF</Text>
              <Text style={s.fieldValue}>{data.clienteNif || ""}</Text>
            </View>
          </View>
          <View style={s.colBox}>
            <Text style={s.colTitle}>Vehículo</Text>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Marca</Text>
              <Text style={s.fieldValue}>{[data.marca, data.modelo].filter(Boolean).join(" ") || ""}</Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Año</Text>
              <Text style={s.fieldValue}>{data.anio || ""}</Text>
            </View>
            <View style={s.fieldRow}>
              <Text style={s.fieldLabel}>Combust.</Text>
              <Text style={s.fieldValue}>{data.combustible ? combustibleLabels[data.combustible] || data.combustible : ""}</Text>
            </View>
            {data.vin && (
              <View style={s.fieldRow}>
                <Text style={s.fieldLabel}>VIN</Text>
                <Text style={[s.fieldValue, { fontSize: 7 }]}>{data.vin}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ══ TRABAJOS A REALIZAR (sección principal) ══ */}
        <Text style={s.sectionTitle}>Trabajos a realizar / Descripción del cliente</Text>
        {data.descripcionCliente ? (
          <View style={s.filledLine}>
            <Text style={s.lineText}>{data.descripcionCliente}</Text>
          </View>
        ) : null}
        {/* Blank lines for handwriting */}
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={`trabajo-${i}`} style={s.blankLine} />
        ))}

        {/* ══ DIAGNÓSTICO / OBSERVACIONES DEL MECÁNICO ══ */}
        <Text style={s.sectionTitle}>Diagnóstico del mecánico</Text>
        {data.diagnostico ? (
          <View style={s.filledLine}>
            <Text style={s.lineText}>{data.diagnostico}</Text>
          </View>
        ) : null}
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={`diag-${i}`} style={s.blankLine} />
        ))}

        {/* ══ OBSERVACIONES DE ENTRADA ══ */}
        {data.observacionesEntrada && (
          <>
            <Text style={s.sectionTitle}>Observaciones / Daños preexistentes</Text>
            <View style={s.filledLine}>
              <Text style={s.lineText}>{data.observacionesEntrada}</Text>
            </View>
          </>
        )}

        {/* ══ RECAMBIOS Y MANO DE OBRA ══ */}
        <Text style={s.sectionTitle}>Recambios y mano de obra</Text>
        <View style={s.tableHeader}>
          <Text style={[s.th, { width: "8%" }]}>Tipo</Text>
          <Text style={[s.th, { width: "47%" }]}>Descripción</Text>
          <Text style={[s.th, { width: "10%", textAlign: "right" as any }]}>Cant.</Text>
          <Text style={[s.th, { width: "15%", textAlign: "right" as any }]}>Precio</Text>
          <Text style={[s.th, { width: "20%", textAlign: "right" as any }]}>Importe</Text>
        </View>
        {lineasCalc.map((l, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.td, { width: "8%", color: c.lightGray, fontSize: 7 }]}>
              {l.tipo === "mano_obra" ? "MO" : l.tipo === "recambio" ? "RC" : "OT"}
            </Text>
            <Text style={[s.td, { width: "47%" }]}>{l.descripcion}</Text>
            <Text style={[s.td, { width: "10%", textAlign: "right" as any }]}>{Number(l.cantidad)}</Text>
            <Text style={[s.td, { width: "15%", textAlign: "right" as any }]}>{Number(l.precioUnitario).toFixed(2)}</Text>
            <Text style={[s.td, { width: "20%", textAlign: "right" as any, fontFamily: FONT_BOLD }]}>{l.base.toFixed(2)}</Text>
          </View>
        ))}
        {/* Empty rows for handwriting */}
        {Array.from({ length: blanksNeeded }).map((_, i) => (
          <View key={`blank-${i}`} style={s.tableRow}>
            <Text style={[s.td, { width: "100%" }]}> </Text>
          </View>
        ))}

        {/* Totals */}
        {lineasCalc.length > 0 && (
          <View style={s.totalsBlock}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Base</Text>
              <Text style={s.totalValue}>{totalBase.toFixed(2)} EUR</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>IVA</Text>
              <Text style={s.totalValue}>{totalIva.toFixed(2)} EUR</Text>
            </View>
            <View style={[s.totalRow, { borderTopWidth: 1, borderTopColor: c.black, paddingTop: 3, marginTop: 2 }]}>
              <Text style={s.totalFinalLabel}>TOTAL</Text>
              <Text style={s.totalFinalValue}>{totalFinal.toFixed(2)} EUR</Text>
            </View>
          </View>
        )}

        {/* ══ FIRMAS ══ */}
        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <View style={{ height: 30 }} />
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Firma del cliente</Text>
          </View>
          <View style={s.sigBlock}>
            <View style={{ height: 30 }} />
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Firma del taller</Text>
          </View>
        </View>

        {/* ══ QR tracking ══ */}
        {data.qrDataUrl && data.trackingUrl && (
          <View style={s.qrRow}>
            <Image src={data.qrDataUrl} style={{ width: 35, height: 35 }} />
            <View>
              <Text style={s.qrText}>Estado online: {data.trackingUrl}</Text>
              <Text style={[s.qrText, { fontSize: 6 }]}>El cliente puede consultar el estado de su reparación escaneando este QR</Text>
            </View>
          </View>
        )}

        {/* ══ FOOTER ══ */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Garantía: 3 meses o 2.000 km (RD 1457/1986). Piezas sustituidas a disposición del cliente.
            {"\n"}Vehículo no retirado en 3 días hábiles: gastos de estancia aplicables.
            {"\n"}{data.tallerNombre}{data.tallerCif ? ` · CIF ${data.tallerCif}` : ""}{data.tallerRegistro ? ` · Reg. ${data.tallerRegistro}` : ""} · Generado con FIXA
          </Text>
        </View>

      </Page>
    </Document>
  );
}
