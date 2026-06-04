import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register Inter font
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2", fontWeight: 500 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiA.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2", fontWeight: 700 },
  ],
});

// ═══ COLORS ═══
const colors = {
  brand: "#EA580C", // orange-600
  brandLight: "#FFF7ED", // orange-50
  brandBorder: "#FDBA74", // orange-300
  text: "#1C1917", // stone-900
  textSecondary: "#78716C", // stone-500
  textMuted: "#A8A29E", // stone-400
  border: "#E7E5E4", // stone-200
  borderLight: "#F5F5F4", // stone-100
  bgStripe: "#FAFAF9", // stone-50
  white: "#FFFFFF",
  emerald: "#059669",
  blue: "#003399", // EU plate blue
};

// ═══ STYLES ═══
const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9,
    color: colors.text,
    paddingTop: 0,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },
  // Top accent bar
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.brand,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 24,
    marginBottom: 20,
  },
  tallerName: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 2,
  },
  tallerInfo: {
    fontSize: 8,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  orTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.textSecondary,
    textTransform: "uppercase" as any,
    letterSpacing: 1.5,
    textAlign: "right" as any,
  },
  orNumber: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.brand,
    textAlign: "right" as any,
    marginTop: 2,
  },
  orDate: {
    fontSize: 8,
    color: colors.textSecondary,
    textAlign: "right" as any,
    marginTop: 4,
  },
  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 7,
    fontWeight: 600,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
    alignSelf: "flex-end" as any,
    marginTop: 4,
  },
  // Separator
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 12,
  },
  // Section
  sectionLabel: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.textSecondary,
    textTransform: "uppercase" as any,
    letterSpacing: 1,
    marginBottom: 6,
  },
  // Two columns
  row: {
    flexDirection: "row",
    gap: 20,
  },
  col: {
    flex: 1,
  },
  // Vehicle plate style
  plate: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  plateBlue: {
    backgroundColor: colors.blue,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  plateStar: {
    fontSize: 5,
    color: "#FFD700",
    textAlign: "center" as any,
  },
  plateEU: {
    fontSize: 5,
    color: colors.white,
    fontWeight: 700,
    textAlign: "center" as any,
  },
  plateText: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 2,
    color: colors.text,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  fieldLabel: {
    fontSize: 7,
    color: colors.textMuted,
    marginBottom: 1,
  },
  fieldValue: {
    fontSize: 9,
    fontWeight: 500,
    color: colors.text,
    marginBottom: 6,
  },
  // Description box
  descBox: {
    backgroundColor: colors.bgStripe,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  descText: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.5,
  },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.brandLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.brandBorder,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableRowStripe: {
    backgroundColor: colors.bgStripe,
  },
  th: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.textSecondary,
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  td: {
    fontSize: 9,
    color: colors.text,
  },
  tdRight: {
    fontSize: 9,
    color: colors.text,
    textAlign: "right" as any,
  },
  tdBold: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.text,
    textAlign: "right" as any,
  },
  // Totals
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 3,
    paddingRight: 8,
  },
  totalsLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    width: 100,
    textAlign: "right" as any,
    paddingRight: 12,
  },
  totalsValue: {
    fontSize: 9,
    fontWeight: 500,
    width: 80,
    textAlign: "right" as any,
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
    paddingRight: 8,
    borderTopWidth: 2,
    borderTopColor: colors.text,
    marginTop: 4,
  },
  totalFinalLabel: {
    fontSize: 12,
    fontWeight: 700,
    width: 100,
    textAlign: "right" as any,
    paddingRight: 12,
  },
  totalFinalValue: {
    fontSize: 12,
    fontWeight: 700,
    width: 80,
    textAlign: "right" as any,
  },
  // Warranty
  warrantyBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 10,
    marginTop: 16,
  },
  warrantyText: {
    fontSize: 7.5,
    color: colors.textSecondary,
    lineHeight: 1.6,
  },
  // Signatures
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 40,
  },
  signatureBlock: {
    flex: 1,
    alignItems: "center" as any,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: "100%",
    marginTop: 40,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 7,
    color: colors.textMuted,
  },
  // QR section
  qrSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.bgStripe,
    borderRadius: 6,
  },
  qrText: {
    fontSize: 8,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  qrBold: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.brand,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 6.5,
    color: colors.textMuted,
    textAlign: "center" as any,
    lineHeight: 1.6,
  },
});

// ═══ TYPES ═══
export type OrdenPDFData = {
  // Taller
  tallerNombre: string;
  tallerCif?: string | null;
  tallerDireccion?: string | null;
  tallerTelefono?: string | null;
  tallerEmail?: string | null;
  tallerRegistro?: string | null;
  tallerRama?: string[] | null;
  // Orden
  numero: number;
  estado: string;
  fechaEntrada: string | Date;
  fechaEstimada?: string | Date | null;
  descripcionCliente?: string | null;
  diagnostico?: string | null;
  observacionesEntrada?: string | null;
  kmEntrada?: number | null;
  // Cliente
  clienteNombre: string;
  clienteNif?: string | null;
  clienteTelefono?: string | null;
  clienteDireccion?: string | null;
  // Vehículo
  matricula: string;
  marca?: string | null;
  modelo?: string | null;
  anio?: number | null;
  vin?: string | null;
  color?: string | null;
  combustible?: string | null;
  // Líneas
  lineas: {
    tipo: string;
    descripcion: string;
    cantidad: string | number;
    precioUnitario: string | number;
    descuentoPct?: string | number | null;
    ivaPct: string | number;
    tipoPieza?: string | null;
  }[];
  // QR
  qrDataUrl?: string | null;
  trackingUrl?: string | null;
  // Firma
  firmaCliente?: string | null;
};

const estadoLabel: Record<string, string> = {
  recibido: "Recibido",
  diagnostico: "Diagnóstico",
  presupuestado: "Presupuestado",
  aprobado: "Aprobado",
  en_reparacion: "En reparación",
  esperando_recambio: "Esp. recambio",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const estadoBadgeColor: Record<string, { bg: string; text: string }> = {
  recibido: { bg: "#DBEAFE", text: "#1E40AF" },
  diagnostico: { bg: "#E0E7FF", text: "#3730A3" },
  presupuestado: { bg: "#FEF3C7", text: "#92400E" },
  aprobado: { bg: "#D1FAE5", text: "#065F46" },
  en_reparacion: { bg: "#FFF7ED", text: "#9A3412" },
  esperando_recambio: { bg: "#FEF3C7", text: "#92400E" },
  listo: { bg: "#D1FAE5", text: "#065F46" },
  entregado: { bg: "#F3F4F6", text: "#374151" },
  cancelado: { bg: "#FEE2E2", text: "#991B1B" },
};

function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCurrency(n: number): string {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " EUR";
}

const combustibleLabels: Record<string, string> = {
  gasolina: "Gasolina",
  diesel: "Diésel",
  electrico: "Eléctrico",
  hibrido: "Híbrido",
  glp: "GLP",
};

// ═══ COMPONENT ═══
export function OrdenReparacionPDF({ data }: { data: OrdenPDFData }) {
  // Calculate totals
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

  const badgeColors = estadoBadgeColor[data.estado] || estadoBadgeColor.recibido;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Orange accent bar */}
        <View style={s.accentBar} fixed />

        {/* ═══ HEADER ═══ */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.tallerName}>{data.tallerNombre}</Text>
            <Text style={s.tallerInfo}>
              {[data.tallerCif && `CIF: ${data.tallerCif}`, data.tallerDireccion]
                .filter(Boolean)
                .join(" · ")}
            </Text>
            <Text style={s.tallerInfo}>
              {[data.tallerTelefono, data.tallerEmail].filter(Boolean).join(" · ")}
            </Text>
            {data.tallerRegistro && (
              <Text style={s.tallerInfo}>Reg. Industrial: {data.tallerRegistro}</Text>
            )}
            {data.tallerRama && data.tallerRama.length > 0 && (
              <Text style={s.tallerInfo}>
                Rama: {data.tallerRama.map((r) => {
                  const labels: Record<string, string> = {
                    mecanica: "Mecánica",
                    electricidad: "Electricidad-Electrónica",
                    carroceria: "Carrocería",
                    pintura: "Pintura",
                  };
                  return labels[r] || r;
                }).join(", ")}
              </Text>
            )}
          </View>
          <View style={{ alignItems: "flex-end" as any }}>
            <Text style={s.orTitle}>Orden de reparación</Text>
            <Text style={s.orNumber}>OR-{data.numero}</Text>
            <Text style={s.orDate}>
              Entrada: {formatDate(data.fechaEntrada)}
            </Text>
            {data.fechaEstimada && (
              <Text style={s.orDate}>
                Entrega prevista: {formatDate(data.fechaEstimada)}
              </Text>
            )}
            <View
              style={[
                s.badge,
                { backgroundColor: badgeColors.bg, color: badgeColors.text },
              ]}
            >
              <Text style={{ color: badgeColors.text, fontSize: 7, fontWeight: 600 }}>
                {estadoLabel[data.estado] || data.estado}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.separator} />

        {/* ═══ CLIENTE + VEHÍCULO ═══ */}
        <View style={s.row}>
          {/* Cliente */}
          <View style={s.col}>
            <Text style={s.sectionLabel}>Datos del cliente</Text>
            <Text style={s.fieldValue}>{data.clienteNombre}</Text>
            {data.clienteNif && (
              <>
                <Text style={s.fieldLabel}>NIF/CIF</Text>
                <Text style={s.fieldValue}>{data.clienteNif}</Text>
              </>
            )}
            {data.clienteTelefono && (
              <>
                <Text style={s.fieldLabel}>Teléfono</Text>
                <Text style={s.fieldValue}>{data.clienteTelefono}</Text>
              </>
            )}
            {data.clienteDireccion && (
              <>
                <Text style={s.fieldLabel}>Dirección</Text>
                <Text style={s.fieldValue}>{data.clienteDireccion}</Text>
              </>
            )}
          </View>

          {/* Vehículo */}
          <View style={s.col}>
            <Text style={s.sectionLabel}>Datos del vehículo</Text>
            {/* EU-style plate */}
            <View style={s.plate}>
              <View style={s.plateBlue}>
                <Text style={s.plateStar}>★</Text>
                <Text style={s.plateEU}>E</Text>
              </View>
              <Text style={s.plateText}>{data.matricula}</Text>
            </View>
            <Text style={s.fieldValue}>
              {[data.marca, data.modelo, data.anio].filter(Boolean).join(" · ")}
            </Text>
            {data.vin && (
              <>
                <Text style={s.fieldLabel}>VIN / Bastidor</Text>
                <Text style={[s.fieldValue, { fontSize: 7.5, letterSpacing: 0.5 }]}>{data.vin}</Text>
              </>
            )}
            <View style={{ flexDirection: "row", gap: 16 }}>
              {data.kmEntrada && (
                <View>
                  <Text style={s.fieldLabel}>Km entrada</Text>
                  <Text style={s.fieldValue}>{data.kmEntrada.toLocaleString("es-ES")}</Text>
                </View>
              )}
              {data.color && (
                <View>
                  <Text style={s.fieldLabel}>Color</Text>
                  <Text style={s.fieldValue}>{data.color}</Text>
                </View>
              )}
              {data.combustible && (
                <View>
                  <Text style={s.fieldLabel}>Combustible</Text>
                  <Text style={s.fieldValue}>
                    {combustibleLabels[data.combustible] || data.combustible}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={s.separator} />

        {/* ═══ DESCRIPCIÓN + DIAGNÓSTICO ═══ */}
        {data.descripcionCliente && (
          <View style={s.descBox}>
            <Text style={s.sectionLabel}>Motivo de entrada</Text>
            <Text style={s.descText}>{data.descripcionCliente}</Text>
          </View>
        )}

        {data.diagnostico && (
          <View style={s.descBox}>
            <Text style={s.sectionLabel}>Diagnóstico</Text>
            <Text style={s.descText}>{data.diagnostico}</Text>
          </View>
        )}

        {data.observacionesEntrada && (
          <View style={s.descBox}>
            <Text style={s.sectionLabel}>Observaciones / Daños preexistentes</Text>
            <Text style={s.descText}>{data.observacionesEntrada}</Text>
          </View>
        )}

        {/* ═══ TABLA DE LÍNEAS ═══ */}
        {lineasCalc.length > 0 && (
          <View style={{ marginTop: 4 }}>
            <Text style={[s.sectionLabel, { marginBottom: 8 }]}>Trabajos y recambios</Text>

            {/* Table header */}
            <View style={s.tableHeader}>
              <Text style={[s.th, { width: "8%" }]}>Tipo</Text>
              <Text style={[s.th, { width: "42%" }]}>Descripción</Text>
              <Text style={[s.th, { width: "10%", textAlign: "right" as any }]}>Cant.</Text>
              <Text style={[s.th, { width: "15%", textAlign: "right" as any }]}>Precio</Text>
              <Text style={[s.th, { width: "10%", textAlign: "right" as any }]}>Dto.</Text>
              <Text style={[s.th, { width: "15%", textAlign: "right" as any }]}>Importe</Text>
            </View>

            {/* Table rows */}
            {lineasCalc.map((l, i) => (
              <View
                key={i}
                style={[s.tableRow, i % 2 === 1 ? s.tableRowStripe : {}]}
              >
                <Text style={[s.td, { width: "8%", fontSize: 7, color: colors.textSecondary }]}>
                  {l.tipo === "mano_obra" ? "M.O." : l.tipo === "recambio" ? "Rec." : "Otro"}
                </Text>
                <View style={{ width: "42%" }}>
                  <Text style={s.td}>{l.descripcion}</Text>
                  {l.tipoPieza && l.tipoPieza !== "nueva" && (
                    <Text style={{ fontSize: 6.5, color: colors.textMuted }}>
                      Pieza {l.tipoPieza}
                    </Text>
                  )}
                </View>
                <Text style={[s.tdRight, { width: "10%" }]}>{Number(l.cantidad)}</Text>
                <Text style={[s.tdRight, { width: "15%" }]}>
                  {Number(l.precioUnitario).toFixed(2)}
                </Text>
                <Text style={[s.tdRight, { width: "10%", color: Number(l.descuentoPct || 0) > 0 ? colors.brand : colors.textMuted }]}>
                  {Number(l.descuentoPct || 0) > 0 ? `-${l.descuentoPct}%` : "—"}
                </Text>
                <Text style={[s.tdBold, { width: "15%" }]}>{l.base.toFixed(2)}</Text>
              </View>
            ))}

            {/* Totals */}
            <View style={{ marginTop: 8 }}>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>Base imponible</Text>
                <Text style={s.totalsValue}>{formatCurrency(totalBase)}</Text>
              </View>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>IVA</Text>
                <Text style={s.totalsValue}>{formatCurrency(totalIva)}</Text>
              </View>
              <View style={s.totalFinalRow}>
                <Text style={s.totalFinalLabel}>Total</Text>
                <Text style={s.totalFinalValue}>{formatCurrency(totalFinal)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ═══ GARANTÍA ═══ */}
        <View style={s.warrantyBox}>
          <Text style={[s.sectionLabel, { marginBottom: 4 }]}>Garantía</Text>
          <Text style={s.warrantyText}>
            Los trabajos realizados y las piezas suministradas tienen una garantía de 3 meses o 2.000 km
            (lo que se cumpla primero) para vehículos particulares, y de 15 días o 2.000 km para vehículos
            industriales, conforme al RD 1457/1986. La garantía cubre materiales, mano de obra y transporte.
            {"\n"}Las piezas sustituidas quedan a disposición del cliente durante 15 días salvo renuncia expresa.
          </Text>
        </View>

        {/* ═══ FIRMAS ═══ */}
        <View style={s.signatureRow}>
          <View style={s.signatureBlock}>
            {data.firmaCliente ? (
              <Image src={data.firmaCliente} style={{ width: 120, height: 40, marginTop: 10 }} />
            ) : (
              <View style={s.signatureLine} />
            )}
            <Text style={s.signatureLabel}>Firma del cliente</Text>
          </View>
          <View style={s.signatureBlock}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>Firma del taller</Text>
          </View>
        </View>

        {/* ═══ QR + TRACKING ═══ */}
        {data.qrDataUrl && data.trackingUrl && (
          <View style={s.qrSection}>
            <Image src={data.qrDataUrl} style={{ width: 50, height: 50 }} />
            <View>
              <Text style={s.qrText}>
                Consulta el estado de tu reparación en tiempo real:
              </Text>
              <Text style={s.qrBold}>{data.trackingUrl}</Text>
            </View>
          </View>
        )}

        {/* ═══ FOOTER ═══ */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            {data.tallerNombre}
            {data.tallerCif ? ` · CIF ${data.tallerCif}` : ""}
            {data.tallerRegistro ? ` · Reg. Industrial ${data.tallerRegistro}` : ""}
            {"\n"}
            Datos protegidos conforme al RGPD. Este documento es un resguardo de depósito según el RD 1457/1986.
            {"\n"}
            Generado con FIXA — fixa.ibclima.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
