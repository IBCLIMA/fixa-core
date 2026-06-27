import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { formatMoneyText, formatDecimal2 } from "@/lib/format";

const F = "Helvetica";
const FB = "Helvetica-Bold";

// Premium color palette — minimal, intentional
const c = {
  black: "#1A1A1A",
  dark: "#404040",
  muted: "#8C8C8C",
  subtle: "#B3B3B3",
  line: "#E8E8E8",
  bg: "#F7F7F7",
  white: "#FFFFFF",
  brand: "#EA580C",
  brandLight: "#FFF7ED",
  green: "#16A34A",
  greenLight: "#F0FDF4",
};

const s = StyleSheet.create({
  // Page
  page: {
    fontFamily: F,
    fontSize: 9,
    color: c.dark,
    paddingHorizontal: 44,
    paddingTop: 0,
    paddingBottom: 50,
  },

  // Top accent bar
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: c.brand,
  },

  // ─── HEADER ───
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 28,
    marginBottom: 18,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  tallerName: {
    fontSize: 16,
    fontFamily: FB,
    color: c.black,
    letterSpacing: 0.2,
  },
  tallerInfo: {
    fontSize: 7.5,
    color: c.muted,
    lineHeight: 1.5,
    marginTop: 2,
  },
  presCol: {
    alignItems: "flex-end" as any,
  },
  presLabel: {
    fontSize: 7,
    fontFamily: FB,
    color: c.muted,
    textTransform: "uppercase" as any,
    letterSpacing: 2.5,
  },
  presDate: {
    fontSize: 8,
    color: c.dark,
    textAlign: "right" as any,
    marginTop: 5,
  },
  presValid: {
    fontSize: 7,
    color: c.muted,
    textAlign: "right" as any,
    marginTop: 2,
  },

  // ─── THIN RULE ───
  rule: {
    borderBottomWidth: 0.5,
    borderBottomColor: c.line,
    marginBottom: 16,
  },

  // ─── TWO-COLUMN LAYOUT ───
  row2: {
    flexDirection: "row",
    gap: 30,
    marginBottom: 16,
  },
  col: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 6.5,
    fontFamily: FB,
    color: c.muted,
    textTransform: "uppercase" as any,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 6.5,
    color: c.subtle,
    marginBottom: 1,
  },
  fieldValue: {
    fontSize: 9,
    color: c.black,
    marginBottom: 5,
  },
  fieldValueBold: {
    fontSize: 9,
    fontFamily: FB,
    color: c.black,
    marginBottom: 5,
  },

  // ─── PLATE ───
  plate: {
    alignSelf: "flex-start" as any,
    borderWidth: 1.5,
    borderColor: c.black,
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 6,
  },
  plateText: {
    fontSize: 14,
    fontFamily: FB,
    letterSpacing: 2.5,
    color: c.black,
  },

  // ─── DESCRIPTION BOX ───
  descBox: {
    backgroundColor: c.bg,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  descLabel: {
    fontSize: 6.5,
    fontFamily: FB,
    color: c.muted,
    textTransform: "uppercase" as any,
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  descText: {
    fontSize: 8.5,
    color: c.dark,
    lineHeight: 1.6,
  },

  // ─── TABLE ───
  tableHead: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 0.75,
    borderBottomColor: c.dark,
  },
  th: {
    fontSize: 6.5,
    fontFamily: FB,
    color: c.muted,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: c.line,
  },
  tdDesc: {
    fontSize: 8.5,
    color: c.black,
  },
  tdDetail: {
    fontSize: 6.5,
    color: c.subtle,
    marginTop: 2,
  },
  tdAmount: {
    fontSize: 8.5,
    fontFamily: FB,
    color: c.black,
    textAlign: "right" as any,
  },

  // ─── TOTAL CARD ───
  totalCard: {
    alignSelf: "flex-end" as any,
    width: 210,
    backgroundColor: c.bg,
    borderLeftWidth: 3,
    borderLeftColor: c.brand,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 7.5,
    color: c.muted,
  },
  totalValue: {
    fontSize: 7.5,
    color: c.dark,
  },
  totalDivider: {
    borderBottomWidth: 0.75,
    borderBottomColor: c.line,
    marginVertical: 5,
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end" as any,
  },
  totalFinalLabel: {
    fontSize: 8.5,
    color: c.dark,
    fontFamily: FB,
  },
  totalFinalValue: {
    fontSize: 18,
    fontFamily: FB,
    color: c.black,
  },

  // ─── GUARANTEE ───
  guarantee: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 0.5,
    borderTopColor: c.line,
  },
  guaranteeTitle: {
    fontSize: 6.5,
    fontFamily: FB,
    color: c.muted,
    textTransform: "uppercase" as any,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  guaranteeBullet: {
    fontSize: 7,
    color: c.muted,
    lineHeight: 1.5,
    marginBottom: 1,
  },

  // ─── BOTTOM SECTION: SIGNATURES + QR ───
  bottomRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 20,
    alignItems: "flex-end" as any,
  },

  // Signatures
  sigContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  sigBlock: {
    flex: 1,
    alignItems: "center" as any,
  },
  sigLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: c.muted,
    width: "100%",
    marginBottom: 3,
  },
  sigLabel: {
    fontSize: 6.5,
    color: c.muted,
  },

  // QR section
  qrCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: c.brandLight,
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 10,
  },
  qrTextWrap: {
    flex: 1,
  },
  qrTitle: {
    fontSize: 7.5,
    fontFamily: FB,
    color: c.brand,
    marginBottom: 1,
  },
  qrUrl: {
    fontSize: 6,
    color: c.muted,
    lineHeight: 1.3,
  },

  // ─── THANK YOU ───
  thanksText: {
    fontSize: 7.5,
    color: c.muted,
    textAlign: "center" as any,
    marginTop: 14,
    fontStyle: "italic" as any,
  },

  // ─── FOOTER ───
  footer: {
    position: "absolute",
    bottom: 16,
    left: 44,
    right: 44,
    borderTopWidth: 0.5,
    borderTopColor: c.line,
    paddingTop: 5,
  },
  footerText: {
    fontSize: 5.5,
    color: c.subtle,
    textAlign: "center" as any,
    lineHeight: 1.5,
  },
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
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PresupuestoPDF({ data }: { data: PresupuestoPDFData }) {
  // ── Calculations ──
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
        {/* Accent bar */}
        <View style={s.bar} fixed />

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View style={s.logoRow}>
            {data.tallerLogo && (
              <Image
                src={data.tallerLogo}
                style={{ height: 36, maxWidth: 120 }}
              />
            )}
            <View>
              <Text style={s.tallerName}>{data.tallerNombre}</Text>
              <Text style={s.tallerInfo}>
                {[
                  data.tallerCif && `CIF: ${data.tallerCif}`,
                  data.tallerDireccion,
                ]
                  .filter(Boolean)
                  .join("\n")}
              </Text>
              <Text style={s.tallerInfo}>
                {[data.tallerTelefono, data.tallerEmail]
                  .filter(Boolean)
                  .join("  ·  ")}
              </Text>
            </View>
          </View>
          <View style={s.presCol}>
            <Text style={s.presLabel}>Presupuesto</Text>
            <Text style={s.presDate}>{fmt(data.fechaCreacion)}</Text>
            <Text style={s.presValid}>
              Validez hasta {fmtShort(validUntil)}
            </Text>
          </View>
        </View>

        <View style={s.rule} />

        {/* ── CLIENT + VEHICLE ── */}
        <View style={s.row2}>
          <View style={s.col}>
            <Text style={s.sectionLabel}>Cliente</Text>
            <Text style={s.fieldValueBold}>{data.clienteNombre}</Text>
            {data.clienteTelefono && (
              <>
                <Text style={s.fieldLabel}>Telefono</Text>
                <Text style={s.fieldValue}>{data.clienteTelefono}</Text>
              </>
            )}
            {data.clienteNif && (
              <>
                <Text style={s.fieldLabel}>NIF</Text>
                <Text style={s.fieldValue}>{data.clienteNif}</Text>
              </>
            )}
            {data.clienteDireccion && (
              <>
                <Text style={s.fieldLabel}>Direccion</Text>
                <Text style={s.fieldValue}>{data.clienteDireccion}</Text>
              </>
            )}
          </View>
          <View style={s.col}>
            <Text style={s.sectionLabel}>Vehiculo</Text>
            {data.matricula && data.matricula !== "PENDIENTE" && (
              <View style={s.plate}>
                <Text style={s.plateText}>{data.matricula}</Text>
              </View>
            )}
            {vehicleDesc && (
              <Text style={s.fieldValueBold}>
                {vehicleDesc}
                {data.anio ? `  ·  ${data.anio}` : ""}
              </Text>
            )}
            {data.vin && (
              <>
                <Text style={s.fieldLabel}>VIN</Text>
                <Text style={[s.fieldValue, { fontSize: 7 }]}>
                  {data.vin}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* ── DESCRIPTION ── */}
        {data.notas && (
          <View style={s.descBox}>
            <Text style={s.descLabel}>Motivo de la consulta</Text>
            <Text style={s.descText}>{data.notas}</Text>
          </View>
        )}

        {/* ── TABLE ── */}
        {lineasCalc.length > 0 && (
          <View>
            <View style={s.tableHead}>
              <Text style={[s.th, { width: "58%" }]}>Concepto</Text>
              <Text
                style={[s.th, { width: "14%", textAlign: "center" as any }]}
              >
                Uds.
              </Text>
              <Text
                style={[s.th, { width: "28%", textAlign: "right" as any }]}
              >
                Importe
              </Text>
            </View>
            {lineasCalc.map((l, i) => (
              <View key={i} style={s.tableRow}>
                <View style={{ width: "58%" }}>
                  <Text style={s.tdDesc}>{l.descripcion}</Text>
                  <Text style={s.tdDetail}>
                    {l.tipo === "mano_obra"
                      ? "Mano de obra"
                      : l.tipo === "recambio"
                        ? "Recambio"
                        : "Otros"}
                    {l.referencia ? `  ·  Ref: ${l.referencia}` : ""}
                    {"  ·  "}
                    {formatDecimal2(Number(l.precioUnitario))} EUR/ud
                    {Number(l.descuentoPct || 0) > 0
                      ? `  ·  -${l.descuentoPct}% dto`
                      : ""}
                  </Text>
                </View>
                <Text
                  style={[
                    s.tdDesc,
                    { width: "14%", textAlign: "center" as any },
                  ]}
                >
                  {Number(l.cantidad)}
                </Text>
                <Text style={[s.tdAmount, { width: "28%" }]}>
                  {formatMoneyText(l.base)}
                </Text>
              </View>
            ))}

            {/* ── TOTAL CARD ── */}
            <View style={s.totalCard}>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Base imponible</Text>
                <Text style={s.totalValue}>{formatMoneyText(totalBase)}</Text>
              </View>
              {totalDescuento > 0 && (
                <View style={s.totalRow}>
                  <Text style={[s.totalLabel, { color: c.green }]}>
                    Ahorro aplicado
                  </Text>
                  <Text style={[s.totalValue, { color: c.green }]}>
                    -{formatMoneyText(totalDescuento)}
                  </Text>
                </View>
              )}
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>IVA</Text>
                <Text style={s.totalValue}>{formatMoneyText(totalIva)}</Text>
              </View>
              <View style={s.totalDivider} />
              <View style={s.totalFinalRow}>
                <Text style={s.totalFinalLabel}>Total</Text>
                <Text style={s.totalFinalValue}>
                  {formatMoneyText(totalFinal)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── GUARANTEE ── */}
        <View style={s.guarantee}>
          <Text style={s.guaranteeTitle}>Garantia incluida</Text>
          <Text style={s.guaranteeBullet}>
            ·{"  "}3 meses o 2.000 km en mano de obra y recambios (RD
            1457/1986)
          </Text>
          <Text style={s.guaranteeBullet}>
            ·{"  "}Recambios originales o equivalentes homologados
          </Text>
          <Text style={s.guaranteeBullet}>
            ·{"  "}Piezas sustituidas a disposicion del cliente
          </Text>
        </View>

        {/* ── QR CTA ── */}
        {data.qrDataUrl && data.publicUrl && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14, backgroundColor: c.brandLight, borderRadius: 4, padding: 10 }}>
            <Image src={data.qrDataUrl} style={{ width: 36, height: 36 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 8, fontFamily: FB, color: c.brand, marginBottom: 2 }}>Acepta este presupuesto online</Text>
              <Text style={{ fontSize: 6.5, color: c.muted }}>{data.publicUrl}</Text>
            </View>
          </View>
        )}

        {/* ── SIGNATURES ── */}
        <View style={{ flexDirection: "row", marginTop: 16, gap: 30 }}>
          <View style={s.sigBlock}>
            <View style={{ height: 20 }} />
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Acepto el presupuesto</Text>
          </View>
          <View style={s.sigBlock}>
            <View style={{ height: 20 }} />
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Renuncio al presupuesto</Text>
          </View>
        </View>

        {/* ── THANK YOU ── */}
        <Text style={s.thanksText}>
          Gracias por confiar en {data.tallerNombre}
        </Text>

        {/* ── FOOTER ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Este presupuesto tiene una validez de {data.validezDias} dias (min.
            12 habiles segun RD 1457/1986).
            {"\n"}
            {data.tallerNombre}
            {data.tallerCif ? `  ·  CIF ${data.tallerCif}` : ""}
            {"  ·  "}Generado con FIXA
          </Text>
        </View>
      </Page>
    </Document>
  );
}
