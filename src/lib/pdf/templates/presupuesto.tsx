import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const F = "Helvetica";
const FB = "Helvetica-Bold";

// Premium color palette — minimal, intentional
const c = {
  black: "#171717",
  dark: "#525252",
  muted: "#A3A3A3",
  light: "#D4D4D4",
  line: "#E5E5E5",
  bg: "#FAFAFA",
  white: "#FFFFFF",
  brand: "#EA580C",
  green: "#16A34A",
};

const s = StyleSheet.create({
  page: { fontFamily: F, fontSize: 8.5, color: c.black, padding: 40, paddingTop: 0, paddingBottom: 45 },
  bar: { position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: c.brand },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 20, marginBottom: 24 },
  logoRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1 },
  tallerName: { fontSize: 18, fontFamily: FB, color: c.black },
  tallerInfo: { fontSize: 8, color: c.dark, lineHeight: 1.5, marginTop: 2 },
  presLabel: { fontSize: 8, color: c.muted, textTransform: "uppercase" as any, letterSpacing: 2, textAlign: "right" as any },
  presDate: { fontSize: 8, color: c.dark, textAlign: "right" as any, marginTop: 4 },
  presValid: { fontSize: 7.5, color: c.muted, textAlign: "right" as any, marginTop: 2 },

  // Divider
  divider: { borderBottomWidth: 0.5, borderBottomColor: c.line, marginBottom: 20 },

  // Data blocks
  row2: { flexDirection: "row", gap: 24, marginBottom: 20 },
  col: { flex: 1 },
  sectionLabel: { fontSize: 7, fontFamily: FB, color: c.muted, textTransform: "uppercase" as any, letterSpacing: 1.5, borderBottomWidth: 0.5, borderBottomColor: c.line, paddingBottom: 4, marginBottom: 8 },
  fieldLabel: { fontSize: 7, color: c.muted, marginBottom: 1 },
  fieldValue: { fontSize: 9, fontFamily: FB, color: c.black, marginBottom: 6 },

  // Plate
  plate: { alignSelf: "flex-start" as any, borderWidth: 1.5, borderColor: c.black, borderRadius: 4, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 8 },
  plateText: { fontSize: 15, fontFamily: FB, letterSpacing: 2.5 },

  // Description
  descBox: { backgroundColor: c.bg, borderRadius: 6, padding: 14, marginBottom: 20 },
  descLabel: { fontSize: 7, fontFamily: FB, color: c.muted, textTransform: "uppercase" as any, letterSpacing: 1, marginBottom: 6 },
  descText: { fontSize: 9, color: c.dark, lineHeight: 1.6 },

  // Table
  tableHead: { flexDirection: "row", backgroundColor: c.bg, paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: c.line },
  th: { fontSize: 7, fontFamily: FB, color: c.muted, textTransform: "uppercase" as any, letterSpacing: 0.8 },
  tableRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: "#F0F0F0" },
  tdDesc: { fontSize: 9, color: c.black },
  tdDetail: { fontSize: 7, color: c.muted, marginTop: 2 },
  tdAmount: { fontSize: 9, fontFamily: FB, color: c.black, textAlign: "right" as any },

  // Total card
  totalCard: { alignSelf: "flex-end" as any, width: 200, backgroundColor: c.bg, borderRadius: 6, padding: 14, marginTop: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  totalLabel: { fontSize: 8, color: c.dark },
  totalValue: { fontSize: 8, color: c.dark },
  totalDivider: { borderBottomWidth: 1, borderBottomColor: c.line, marginVertical: 6 },
  totalFinalLabel: { fontSize: 9, color: c.dark },
  totalFinalValue: { fontSize: 16, fontFamily: FB, color: c.black },

  // Guarantee
  guarantee: { backgroundColor: "#F9FAFB", borderRadius: 6, padding: 12, marginTop: 20 },
  guaranteeText: { fontSize: 7.5, color: c.dark, lineHeight: 1.6 },

  // Signatures
  sigRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 28, gap: 40 },
  sigBlock: { flex: 1, alignItems: "center" as any },
  sigLine: { borderBottomWidth: 0.5, borderBottomColor: c.muted, width: "100%", marginBottom: 4 },
  sigLabel: { fontSize: 7, color: c.muted },

  // QR
  qrRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 },
  qrText: { fontSize: 7, color: c.muted, lineHeight: 1.4 },

  // Footer
  footer: { position: "absolute", bottom: 16, left: 40, right: 40, borderTopWidth: 0.5, borderTopColor: c.line, paddingTop: 6 },
  footerText: { fontSize: 6, color: c.muted, textAlign: "center" as any, lineHeight: 1.5 },
});

export type PresupuestoPDFData = {
  tallerNombre: string;
  tallerCif?: string | null;
  tallerDireccion?: string | null;
  tallerTelefono?: string | null;
  tallerEmail?: string | null;
  tallerLogo?: string | null;
  fechaCreacion: string | Date;
  validezDias: number;
  clienteNombre: string;
  clienteTelefono?: string | null;
  clienteNif?: string | null;
  clienteDireccion?: string | null;
  matricula?: string | null;
  marca?: string | null;
  modelo?: string | null;
  anio?: number | null;
  vin?: string | null;
  notas?: string | null;
  lineas: {
    tipo: string;
    descripcion: string;
    cantidad: string | number;
    precioUnitario: string | number;
    descuentoPct?: string | number | null;
    ivaPct: string | number;
    referencia?: string | null;
  }[];
  qrDataUrl?: string | null;
  publicUrl?: string | null;
};

function fmt(d: string | Date): string {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function PresupuestoPDF({ data }: { data: PresupuestoPDFData }) {
  let totalBase = 0;
  let totalIva = 0;
  let totalDescuento = 0;
  const lineasCalc = data.lineas.map((l) => {
    const qty = Number(l.cantidad);
    const price = Number(l.precioUnitario);
    const disc = Number(l.descuentoPct || 0);
    const iva = Number(l.ivaPct || 21);
    const gross = qty * price;
    const discAmount = gross * (disc / 100);
    const base = gross - discAmount;
    totalBase += base;
    totalIva += base * (iva / 100);
    totalDescuento += discAmount;
    return { ...l, base, discAmount, gross };
  });
  const totalFinal = totalBase + totalIva;

  const created = new Date(data.fechaCreacion);
  const validUntil = new Date(created);
  validUntil.setDate(validUntil.getDate() + (data.validezDias || 30));
  const vehicleDesc = [data.marca, data.modelo].filter(Boolean).join(" ");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.bar} fixed />

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={s.logoRow}>
            {data.tallerLogo && <Image src={data.tallerLogo} style={{ width: 44, height: 44, borderRadius: 6 }} />}
            <View>
              <Text style={s.tallerName}>{data.tallerNombre}</Text>
              <Text style={s.tallerInfo}>
                {[data.tallerCif && `CIF: ${data.tallerCif}`, data.tallerDireccion].filter(Boolean).join("\n")}
              </Text>
              <Text style={s.tallerInfo}>
                {[data.tallerTelefono, data.tallerEmail].filter(Boolean).join(" · ")}
              </Text>
            </View>
          </View>
          <View>
            <Text style={s.presLabel}>Presupuesto</Text>
            <Text style={s.presDate}>{fmt(data.fechaCreacion)}</Text>
            <Text style={s.presValid}>Válido hasta {fmtShort(validUntil)}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── CLIENTE + VEHÍCULO ── */}
        <View style={s.row2}>
          <View style={s.col}>
            <Text style={s.sectionLabel}>Cliente</Text>
            <Text style={s.fieldValue}>{data.clienteNombre}</Text>
            {data.clienteTelefono && <><Text style={s.fieldLabel}>Teléfono</Text><Text style={s.fieldValue}>{data.clienteTelefono}</Text></>}
            {data.clienteNif && <><Text style={s.fieldLabel}>NIF</Text><Text style={s.fieldValue}>{data.clienteNif}</Text></>}
            {data.clienteDireccion && <><Text style={s.fieldLabel}>Dirección</Text><Text style={s.fieldValue}>{data.clienteDireccion}</Text></>}
          </View>
          <View style={s.col}>
            <Text style={s.sectionLabel}>Vehículo</Text>
            {data.matricula && data.matricula !== "PENDIENTE" && (
              <View style={s.plate}><Text style={s.plateText}>{data.matricula}</Text></View>
            )}
            {vehicleDesc && <Text style={s.fieldValue}>{vehicleDesc}{data.anio ? ` · ${data.anio}` : ""}</Text>}
            {data.vin && <><Text style={s.fieldLabel}>VIN</Text><Text style={[s.fieldValue, { fontSize: 7.5 }]}>{data.vin}</Text></>}
          </View>
        </View>

        {/* ── DESCRIPCIÓN ── */}
        {data.notas && (
          <View style={s.descBox}>
            <Text style={s.descLabel}>Motivo de la consulta</Text>
            <Text style={s.descText}>{data.notas}</Text>
          </View>
        )}

        {/* ── TABLA ── */}
        {lineasCalc.length > 0 && (
          <View>
            <View style={s.tableHead}>
              <Text style={[s.th, { width: "60%" }]}>Concepto</Text>
              <Text style={[s.th, { width: "15%", textAlign: "center" as any }]}>Uds.</Text>
              <Text style={[s.th, { width: "25%", textAlign: "right" as any }]}>Importe</Text>
            </View>
            {lineasCalc.map((l, i) => (
              <View key={i} style={s.tableRow}>
                <View style={{ width: "60%" }}>
                  <Text style={s.tdDesc}>{l.descripcion}</Text>
                  <Text style={s.tdDetail}>
                    {l.tipo === "mano_obra" ? "Mano de obra" : l.tipo === "recambio" ? "Recambio" : "Otros"}
                    {l.referencia ? ` · Ref: ${l.referencia}` : ""}
                    {" · "}{Number(l.precioUnitario).toFixed(2)}€/ud
                    {Number(l.descuentoPct || 0) > 0 ? ` · -${l.descuentoPct}% dto` : ""}
                  </Text>
                </View>
                <Text style={[s.tdDesc, { width: "15%", textAlign: "center" as any }]}>{Number(l.cantidad)}</Text>
                <Text style={[s.tdAmount, { width: "25%" }]}>{l.base.toFixed(2)} EUR</Text>
              </View>
            ))}

            <View style={s.totalCard}>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Base imponible</Text>
                <Text style={s.totalValue}>{totalBase.toFixed(2)} EUR</Text>
              </View>
              {totalDescuento > 0 && (
                <View style={s.totalRow}>
                  <Text style={[s.totalLabel, { color: c.green }]}>Ahorro aplicado</Text>
                  <Text style={[s.totalValue, { color: c.green }]}>-{totalDescuento.toFixed(2)} EUR</Text>
                </View>
              )}
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>IVA</Text>
                <Text style={s.totalValue}>{totalIva.toFixed(2)} EUR</Text>
              </View>
              <View style={s.totalDivider} />
              <View style={[s.totalRow, { alignItems: "flex-end" as any }]}>
                <Text style={s.totalFinalLabel}>Total presupuesto</Text>
                <Text style={s.totalFinalValue}>{totalFinal.toFixed(2)} EUR</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── GARANTÍA ── */}
        <View style={s.guarantee}>
          <Text style={s.guaranteeText}>
            Garantía de 3 meses o 2.000 km en mano de obra y recambios (RD 1457/1986) · Recambios originales o equivalentes homologados · Las piezas sustituidas quedan a disposición del cliente
          </Text>
        </View>

        {/* ── FIRMAS ── */}
        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <View style={{ height: 28 }} />
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Acepto el presupuesto</Text>
          </View>
          <View style={s.sigBlock}>
            <View style={{ height: 28 }} />
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Renuncio al presupuesto</Text>
          </View>
        </View>

        {/* ── QR ── */}
        {data.qrDataUrl && data.publicUrl && (
          <View style={s.qrRow}>
            <Image src={data.qrDataUrl} style={{ width: 32, height: 32 }} />
            <View>
              <Text style={s.qrText}>También puedes aceptar este presupuesto online:</Text>
              <Text style={[s.qrText, { fontFamily: FB, color: c.brand }]}>{data.publicUrl}</Text>
            </View>
          </View>
        )}

        {/* ── FOOTER ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Este presupuesto tiene una validez de {data.validezDias} días (mín. 12 hábiles según RD 1457/1986).
            {"\n"}{data.tallerNombre}{data.tallerCif ? ` · CIF ${data.tallerCif}` : ""} · Generado con FIXA
          </Text>
        </View>
      </Page>
    </Document>
  );
}
