import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const F = "Helvetica";
const FB = "Helvetica-Bold";

const c = {
  black: "#000000",
  dark: "#1C1917",
  gray: "#57534E",
  light: "#A8A29E",
  border: "#D6D3D1",
  dots: "#E7E5E4",
  bg: "#F5F5F4",
  white: "#FFFFFF",
  brand: "#EA580C",
  brandLight: "#FFF7ED",
};

const s = StyleSheet.create({
  page: { fontFamily: F, fontSize: 8.5, color: c.dark, padding: 28, paddingTop: 0, paddingBottom: 36 },
  // Orange bar
  accentBar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: c.brand },
  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 16, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: c.black, marginBottom: 8 },
  tallerName: { fontSize: 12, fontFamily: FB },
  tallerInfo: { fontSize: 7, color: c.gray, lineHeight: 1.4, marginTop: 1 },
  orLabel: { fontSize: 7, color: c.gray, textTransform: "uppercase" as any, letterSpacing: 1, textAlign: "right" as any },
  orNum: { fontSize: 20, fontFamily: FB, color: c.brand, textAlign: "right" as any },
  // Plate row
  plateRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  plateBox: { borderWidth: 2, borderColor: c.black, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 3 },
  plateText: { fontSize: 18, fontFamily: FB, letterSpacing: 3 },
  dateCol: { fontSize: 7.5, color: c.gray, lineHeight: 1.6 },
  // Data blocks
  row2: { flexDirection: "row", gap: 8, marginBottom: 6 },
  box: { flex: 1, borderWidth: 1, borderColor: c.border, borderRadius: 3, padding: 6 },
  boxTitle: { fontSize: 6.5, fontFamily: FB, textTransform: "uppercase" as any, letterSpacing: 0.8, color: c.gray, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: c.dots, paddingBottom: 2 },
  fRow: { flexDirection: "row", marginBottom: 2 },
  fLabel: { fontSize: 7, color: c.light, width: 45 },
  fVal: { fontSize: 8.5, fontFamily: FB, flex: 1 },
  // Sections
  secTitle: { fontSize: 8, fontFamily: FB, textTransform: "uppercase" as any, letterSpacing: 0.8, backgroundColor: c.bg, padding: 5, borderWidth: 1, borderColor: c.border, borderRadius: 2, marginBottom: 3, marginTop: 6 },
  blankLine: { borderBottomWidth: 1, borderBottomColor: c.dots, borderBottomStyle: "dotted" as any, height: 15 },
  filledLine: { borderBottomWidth: 1, borderBottomColor: c.dots, borderBottomStyle: "dotted" as any, minHeight: 14, paddingVertical: 1 },
  lineText: { fontSize: 8.5, lineHeight: 1.3 },
  // Table
  tHead: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.black, paddingBottom: 2, marginTop: 3 },
  tRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.dots, paddingVertical: 2, minHeight: 14 },
  th: { fontSize: 6.5, fontFamily: FB, color: c.gray, textTransform: "uppercase" as any },
  td: { fontSize: 8 },
  // Totals
  totals: { alignItems: "flex-end" as any, marginTop: 4, paddingTop: 3, borderTopWidth: 1, borderTopColor: c.border },
  tR: { flexDirection: "row", marginBottom: 1 },
  tL: { fontSize: 7.5, color: c.gray, width: 70, textAlign: "right" as any, paddingRight: 6 },
  tV: { fontSize: 7.5, width: 55, textAlign: "right" as any },
  tFL: { fontSize: 9, fontFamily: FB, width: 70, textAlign: "right" as any, paddingRight: 6 },
  tFV: { fontSize: 9, fontFamily: FB, width: 55, textAlign: "right" as any },
  // Signatures
  sigRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, gap: 24 },
  sigBlock: { flex: 1, alignItems: "center" as any },
  sigLine: { borderBottomWidth: 1, borderBottomColor: c.border, width: "100%", marginBottom: 2 },
  sigLabel: { fontSize: 6.5, color: c.light },
  // QR
  qrRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, padding: 5, borderWidth: 1, borderColor: c.dots, borderRadius: 3 },
  qrText: { fontSize: 6.5, color: c.gray, lineHeight: 1.4 },
  // Footer
  footer: { position: "absolute", bottom: 12, left: 28, right: 28 },
  footerText: { fontSize: 5.5, color: c.light, textAlign: "center" as any, lineHeight: 1.4 },
});

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
  if (!d) return "";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const combLabels: Record<string, string> = {
  gasolina: "Gas.", diesel: "Diésel", electrico: "Eléc.", hibrido: "Híb.", glp: "GLP",
};
const ramaLabels: Record<string, string> = {
  mecanica: "Mecánica", electricidad: "Elec.", carroceria: "Carrocería", pintura: "Pintura",
};

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
  const emptyRows = Math.max(0, 5 - lineasCalc.length);

  // Build vehicle info line
  const vehicleInfo = [data.marca, data.modelo, data.anio].filter(Boolean).join(" ");
  const vehicleExtra = [
    data.kmEntrada && `${data.kmEntrada.toLocaleString("es-ES")} km`,
    data.color,
    data.combustible && combLabels[data.combustible],
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.accentBar} fixed />

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.tallerName}>{data.tallerNombre}</Text>
            <Text style={s.tallerInfo}>
              {[data.tallerCif && `CIF: ${data.tallerCif}`, data.tallerDireccion].filter(Boolean).join(" · ")}
            </Text>
            <Text style={s.tallerInfo}>
              {[data.tallerTelefono, data.tallerEmail].filter(Boolean).join(" · ")}
            </Text>
            {data.tallerRegistro && <Text style={s.tallerInfo}>Reg. Ind.: {data.tallerRegistro}</Text>}
          </View>
          <View>
            <Text style={s.orLabel}>Orden de reparación</Text>
            <Text style={s.orNum}>OR-{data.numero}</Text>
          </View>
        </View>

        {/* ── MATRÍCULA + FECHAS ── */}
        <View style={s.plateRow}>
          <View>
            <Text style={s.dateCol}>Entrada: {fmt(data.fechaEntrada)}</Text>
            {data.fechaEstimada && <Text style={s.dateCol}>Entrega: {fmt(data.fechaEstimada)}</Text>}
          </View>
          <View style={s.plateBox}>
            <Text style={s.plateText}>{data.matricula}</Text>
          </View>
          <View>
            {vehicleExtra.length > 0 && <Text style={s.dateCol}>{vehicleExtra.join(" · ")}</Text>}
          </View>
        </View>

        {/* ── CLIENTE + VEHÍCULO ── */}
        <View style={s.row2}>
          <View style={s.box}>
            <Text style={s.boxTitle}>Cliente</Text>
            <View style={s.fRow}><Text style={s.fLabel}>Nombre</Text><Text style={s.fVal}>{data.clienteNombre}</Text></View>
            {data.clienteTelefono && <View style={s.fRow}><Text style={s.fLabel}>Tel.</Text><Text style={s.fVal}>{data.clienteTelefono}</Text></View>}
            {data.clienteNif && <View style={s.fRow}><Text style={s.fLabel}>NIF</Text><Text style={s.fVal}>{data.clienteNif}</Text></View>}
          </View>
          <View style={s.box}>
            <Text style={s.boxTitle}>Vehículo</Text>
            {vehicleInfo && <View style={s.fRow}><Text style={s.fLabel}>Modelo</Text><Text style={s.fVal}>{vehicleInfo}</Text></View>}
            {data.vin && <View style={s.fRow}><Text style={s.fLabel}>VIN</Text><Text style={[s.fVal, { fontSize: 6.5 }]}>{data.vin}</Text></View>}
          </View>
        </View>

        {/* ── TRABAJOS A REALIZAR ── */}
        <Text style={s.secTitle}>Trabajos a realizar</Text>
        {data.descripcionCliente && (
          <View style={s.filledLine}><Text style={s.lineText}>{data.descripcionCliente}</Text></View>
        )}
        {Array.from({ length: 3 }).map((_, i) => <View key={`t${i}`} style={s.blankLine} />)}

        {/* ── DIAGNÓSTICO ── */}
        <Text style={s.secTitle}>Diagnóstico / Observaciones del mecánico</Text>
        {data.diagnostico && (
          <View style={s.filledLine}><Text style={s.lineText}>{data.diagnostico}</Text></View>
        )}
        {data.observacionesEntrada && (
          <View style={s.filledLine}><Text style={[s.lineText, { color: c.gray }]}>Daños preexistentes: {data.observacionesEntrada}</Text></View>
        )}
        {Array.from({ length: 3 }).map((_, i) => <View key={`d${i}`} style={s.blankLine} />)}

        {/* ── RECAMBIOS Y MANO DE OBRA ── */}
        <Text style={s.secTitle}>Recambios y mano de obra</Text>
        <View style={s.tHead}>
          <Text style={[s.th, { width: "7%" }]}>Tipo</Text>
          <Text style={[s.th, { width: "48%" }]}>Descripción</Text>
          <Text style={[s.th, { width: "10%", textAlign: "right" as any }]}>Cant.</Text>
          <Text style={[s.th, { width: "15%", textAlign: "right" as any }]}>Precio</Text>
          <Text style={[s.th, { width: "20%", textAlign: "right" as any }]}>Importe</Text>
        </View>
        {lineasCalc.map((l, i) => (
          <View key={i} style={s.tRow}>
            <Text style={[s.td, { width: "7%", color: c.light, fontSize: 6.5 }]}>
              {l.tipo === "mano_obra" ? "MO" : l.tipo === "recambio" ? "RC" : "OT"}
            </Text>
            <Text style={[s.td, { width: "48%" }]}>{l.descripcion}</Text>
            <Text style={[s.td, { width: "10%", textAlign: "right" as any }]}>{Number(l.cantidad)}</Text>
            <Text style={[s.td, { width: "15%", textAlign: "right" as any }]}>{Number(l.precioUnitario).toFixed(2)}</Text>
            <Text style={[s.td, { width: "20%", textAlign: "right" as any, fontFamily: FB }]}>{l.base.toFixed(2)}</Text>
          </View>
        ))}
        {Array.from({ length: emptyRows }).map((_, i) => (
          <View key={`e${i}`} style={s.tRow}><Text style={s.td}> </Text></View>
        ))}

        {/* Totals */}
        {lineasCalc.length > 0 && (
          <View style={s.totals}>
            <View style={s.tR}><Text style={s.tL}>Base</Text><Text style={s.tV}>{totalBase.toFixed(2)}</Text></View>
            <View style={s.tR}><Text style={s.tL}>IVA</Text><Text style={s.tV}>{totalIva.toFixed(2)}</Text></View>
            <View style={[s.tR, { borderTopWidth: 1, borderTopColor: c.black, paddingTop: 2, marginTop: 1 }]}>
              <Text style={s.tFL}>TOTAL</Text><Text style={s.tFV}>{totalFinal.toFixed(2)} EUR</Text>
            </View>
          </View>
        )}

        {/* ── FIRMAS ── */}
        <View style={s.sigRow}>
          <View style={s.sigBlock}><View style={{ height: 22 }} /><View style={s.sigLine} /><Text style={s.sigLabel}>Firma del cliente</Text></View>
          <View style={s.sigBlock}><View style={{ height: 22 }} /><View style={s.sigLine} /><Text style={s.sigLabel}>Sello del taller</Text></View>
        </View>

        {/* ── QR ── */}
        {data.qrDataUrl && data.trackingUrl && (
          <View style={s.qrRow}>
            <Image src={data.qrDataUrl} style={{ width: 30, height: 30 }} />
            <View>
              <Text style={s.qrText}>Seguimiento online: {data.trackingUrl}</Text>
              <Text style={[s.qrText, { fontSize: 5.5 }]}>Escanea el QR para consultar el estado de la reparación</Text>
            </View>
          </View>
        )}

        {/* ── FOOTER ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Garantía: 3 meses o 2.000 km (RD 1457/1986). Piezas sustituidas a disposición del cliente. Gastos estancia a partir del 3er día hábil.
            {"\n"}{data.tallerNombre}{data.tallerCif ? ` · CIF ${data.tallerCif}` : ""}{data.tallerRegistro ? ` · Reg. ${data.tallerRegistro}` : ""} · Generado con FIXA
          </Text>
        </View>
      </Page>
    </Document>
  );
}
