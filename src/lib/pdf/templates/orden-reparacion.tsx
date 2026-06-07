import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const F = "Helvetica";
const FB = "Helvetica-Bold";

const c = {
  black: "#000000", dark: "#1C1917", gray: "#57534E", light: "#A8A29E",
  border: "#D6D3D1", dots: "#E7E5E4", bg: "#F5F5F4", white: "#FFFFFF",
  brand: "#EA580C",
};

const s = StyleSheet.create({
  page: { fontFamily: F, fontSize: 8, color: c.dark, padding: 24, paddingTop: 0, paddingBottom: 32 },
  bar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: c.brand },
  // Header
  hdr: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 14, paddingBottom: 6, borderBottomWidth: 2, borderBottomColor: c.black, marginBottom: 6 },
  hName: { fontSize: 11, fontFamily: FB },
  hInfo: { fontSize: 6.5, color: c.gray, lineHeight: 1.4, marginTop: 1 },
  orLbl: { fontSize: 6.5, color: c.gray, textTransform: "uppercase" as any, letterSpacing: 1, textAlign: "right" as any },
  orNum: { fontSize: 18, fontFamily: FB, color: c.brand, textAlign: "right" as any },
  // Plate + dates row
  midRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: c.dots },
  plate: { borderWidth: 2, borderColor: c.black, paddingHorizontal: 12, paddingVertical: 3, borderRadius: 3 },
  plateTxt: { fontSize: 16, fontFamily: FB, letterSpacing: 3 },
  dtCol: { fontSize: 7, color: c.gray, lineHeight: 1.6 },
  dtBold: { fontFamily: FB, color: c.dark },
  // 2-col
  row2: { flexDirection: "row", gap: 6, marginBottom: 5 },
  box: { flex: 1, borderWidth: 1, borderColor: c.border, borderRadius: 3, padding: 5 },
  boxT: { fontSize: 6, fontFamily: FB, textTransform: "uppercase" as any, letterSpacing: 0.8, color: c.gray, marginBottom: 3, borderBottomWidth: 1, borderBottomColor: c.dots, paddingBottom: 2 },
  fr: { flexDirection: "row", marginBottom: 1.5 },
  fl: { fontSize: 6.5, color: c.light, width: 42 },
  fv: { fontSize: 8, fontFamily: FB, flex: 1 },
  // Checkboxes row
  chkRow: { flexDirection: "row", flexWrap: "wrap" as any, gap: 4, marginBottom: 5, paddingVertical: 4, borderWidth: 1, borderColor: c.dots, borderRadius: 3, paddingHorizontal: 6 },
  chkItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  chkBox: { width: 9, height: 9, borderWidth: 1, borderColor: c.border, borderRadius: 1 },
  chkBoxChecked: { width: 9, height: 9, borderWidth: 1, borderColor: c.brand, borderRadius: 1, backgroundColor: c.brand },
  chkLabel: { fontSize: 6.5, color: c.gray },
  chkTitle: { fontSize: 6, fontFamily: FB, color: c.gray, textTransform: "uppercase" as any, letterSpacing: 0.5, marginRight: 6 },
  // Sections
  sec: { fontSize: 7.5, fontFamily: FB, textTransform: "uppercase" as any, letterSpacing: 0.6, backgroundColor: c.bg, padding: 4, borderWidth: 1, borderColor: c.border, borderRadius: 2, marginBottom: 2, marginTop: 5 },
  bLine: { borderBottomWidth: 1, borderBottomColor: c.dots, borderBottomStyle: "dotted" as any, height: 14 },
  fLine: { borderBottomWidth: 1, borderBottomColor: c.dots, borderBottomStyle: "dotted" as any, minHeight: 13, paddingVertical: 1 },
  lTxt: { fontSize: 8, lineHeight: 1.3 },
  // Table
  tH: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.black, paddingBottom: 2, marginTop: 2 },
  tR: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: c.dots, paddingVertical: 2, minHeight: 13 },
  th: { fontSize: 6, fontFamily: FB, color: c.gray, textTransform: "uppercase" as any },
  td: { fontSize: 7.5 },
  // Totals
  tots: { alignItems: "flex-end" as any, marginTop: 3, paddingTop: 2, borderTopWidth: 1, borderTopColor: c.border },
  toR: { flexDirection: "row", marginBottom: 1 },
  toL: { fontSize: 7, color: c.gray, width: 60, textAlign: "right" as any, paddingRight: 5 },
  toV: { fontSize: 7, width: 50, textAlign: "right" as any },
  toFL: { fontSize: 8.5, fontFamily: FB, width: 60, textAlign: "right" as any, paddingRight: 5 },
  toFV: { fontSize: 8.5, fontFamily: FB, width: 50, textAlign: "right" as any },
  // Legal checkboxes
  legalRow: { flexDirection: "row", gap: 12, marginTop: 5, paddingTop: 4, borderTopWidth: 1, borderTopColor: c.dots },
  legalItem: { flexDirection: "row", alignItems: "flex-start", gap: 3, flex: 1 },
  legalBox: { width: 8, height: 8, borderWidth: 1, borderColor: c.border, borderRadius: 1, marginTop: 1 },
  legalTxt: { fontSize: 6, color: c.gray, lineHeight: 1.4, flex: 1 },
  // Sigs
  sigR: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, gap: 20 },
  sigB: { flex: 1, alignItems: "center" as any },
  sigL: { borderBottomWidth: 1, borderBottomColor: c.border, width: "100%", marginBottom: 2 },
  sigT: { fontSize: 6, color: c.light },
  // QR
  qrR: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6, padding: 4, borderWidth: 1, borderColor: c.dots, borderRadius: 3 },
  qrT: { fontSize: 6, color: c.gray, lineHeight: 1.3 },
  // Footer
  foot: { position: "absolute", bottom: 10, left: 24, right: 24 },
  footT: { fontSize: 5, color: c.light, textAlign: "center" as any, lineHeight: 1.4 },
});

export type OrdenPDFData = {
  tallerNombre: string; tallerCif?: string | null; tallerDireccion?: string | null;
  tallerTelefono?: string | null; tallerEmail?: string | null; tallerRegistro?: string | null; tallerLogo?: string | null;
  tallerRama?: string[] | null;
  numero: number; estado: string; fechaEntrada: string | Date; fechaEstimada?: string | Date | null;
  descripcionCliente?: string | null; diagnostico?: string | null; observacionesEntrada?: string | null;
  kmEntrada?: number | null; asignado?: string | null;
  clienteNombre: string; clienteNif?: string | null; clienteTelefono?: string | null; clienteDireccion?: string | null;
  matricula: string; marca?: string | null; modelo?: string | null; anio?: number | null;
  vin?: string | null; color?: string | null; combustible?: string | null;
  tipoIntervencion?: string[] | null;
  renunciaPresupuesto?: boolean | null; renunciaPiezas?: boolean | null;
  lineas: { tipo: string; descripcion: string; cantidad: string | number; precioUnitario: string | number; descuentoPct?: string | number | null; ivaPct: string | number; tipoPieza?: string | null; }[];
  qrDataUrl?: string | null; trackingUrl?: string | null; firmaCliente?: string | null;
};

function fmt(d: string | Date | null | undefined): string {
  if (!d) return "__ / __ / ____";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function fmtTime(d: string | Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
const estadoMap: Record<string, string> = {
  recibido: "RECIBIDO", diagnostico: "DIAGNÓSTICO", presupuestado: "PRESUPUESTADO",
  aprobado: "APROBADO", en_reparacion: "EN REPARACIÓN", esperando_recambio: "ESP. RECAMBIO",
  listo: "FINALIZADO", entregado: "ENTREGADO", cancelado: "CANCELADO",
};
const combL: Record<string, string> = { gasolina: "Gas.", diesel: "Diésel", electrico: "Eléc.", hibrido: "Híb.", glp: "GLP" };
const tipoL: Record<string, string> = { mecanica: "Mecánica", chapa: "Chapa", pintura: "Pintura", electricidad: "Electricidad", diagnostico: "Diagnóstico", mantenimiento: "Mantenimiento", pre_itv: "Pre-ITV", otro: "Otro" };

export function OrdenReparacionPDF({ data }: { data: OrdenPDFData }) {
  let totalBase = 0, totalIva = 0;
  const lCalc = data.lineas.map((l) => {
    const q = Number(l.cantidad), p = Number(l.precioUnitario), d = Number(l.descuentoPct || 0), iv = Number(l.ivaPct || 21);
    const b = q * p * (1 - d / 100); totalBase += b; totalIva += b * (iv / 100); return { ...l, base: b };
  });
  const totalFinal = totalBase + totalIva;
  const emptyR = Math.max(0, 6 - lCalc.length);
  const tipos = data.tipoIntervencion || [];
  const vehInfo = [data.marca, data.modelo].filter(Boolean).join(" ");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.bar} fixed />

        {/* ── HEADER ── */}
        <View style={s.hdr}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
            {data.tallerLogo && <Image src={data.tallerLogo} style={{ height: 36, maxWidth: 120 }} />}
            <View style={{ flex: 1 }}>
            <Text style={s.hName}>{data.tallerNombre}</Text>
            <Text style={s.hInfo}>{[data.tallerCif && `CIF: ${data.tallerCif}`, data.tallerDireccion].filter(Boolean).join(" · ")}</Text>
            <Text style={s.hInfo}>{[data.tallerTelefono, data.tallerEmail].filter(Boolean).join(" · ")}</Text>
            {data.tallerRegistro && <Text style={s.hInfo}>Reg. Industrial: {data.tallerRegistro}</Text>}
          </View></View>
          <View>
            <Text style={s.orLbl}>Orden de reparación</Text>
            <Text style={s.orNum}>OR-{data.numero}</Text>
            <Text style={[s.hInfo, { textAlign: "right" as any, marginTop: 2, fontFamily: FB, fontSize: 7 }]}>{estadoMap[data.estado] || data.estado}</Text>
          </View>
        </View>

        {/* ── MATRÍCULA + FECHAS + KM ── */}
        <View style={s.midRow}>
          <View>
            <Text style={s.dtCol}>Entrada: <Text style={s.dtBold}>{fmt(data.fechaEntrada)}</Text> {fmtTime(data.fechaEntrada)}</Text>
            <Text style={s.dtCol}>Entrega prevista: <Text style={s.dtBold}>{fmt(data.fechaEstimada)}</Text></Text>
          </View>
          <View style={s.plate}><Text style={s.plateTxt}>{data.matricula}</Text></View>
          <View>
            <Text style={s.dtCol}>Km entrada: <Text style={s.dtBold}>{data.kmEntrada?.toLocaleString("es-ES") || "______"}</Text></Text>
            {data.asignado && <Text style={s.dtCol}>Mecánico: <Text style={s.dtBold}>{data.asignado}</Text></Text>}
          </View>
        </View>

        {/* ── CLIENTE + VEHÍCULO ── */}
        <View style={s.row2}>
          <View style={s.box}>
            <Text style={s.boxT}>Cliente</Text>
            <View style={s.fr}><Text style={s.fl}>Nombre</Text><Text style={s.fv}>{data.clienteNombre}</Text></View>
            <View style={s.fr}><Text style={s.fl}>Tel.</Text><Text style={s.fv}>{data.clienteTelefono || ""}</Text></View>
            <View style={s.fr}><Text style={s.fl}>NIF</Text><Text style={s.fv}>{data.clienteNif || ""}</Text></View>
            {data.clienteDireccion && <View style={s.fr}><Text style={s.fl}>Dir.</Text><Text style={s.fv}>{data.clienteDireccion}</Text></View>}
          </View>
          <View style={s.box}>
            <Text style={s.boxT}>Vehículo</Text>
            <View style={s.fr}><Text style={s.fl}>Modelo</Text><Text style={s.fv}>{vehInfo || ""}</Text></View>
            <View style={s.fr}><Text style={s.fl}>Año</Text><Text style={s.fv}>{data.anio || ""}</Text></View>
            {(data.color || data.combustible) && (
              <View style={s.fr}>
                {data.color && <><Text style={s.fl}>Color</Text><Text style={[s.fv, { flex: 0, marginRight: 10 }]}>{data.color}</Text></>}
                {data.combustible && <><Text style={[s.fl, { width: 35 }]}>Comb.</Text><Text style={s.fv}>{combL[data.combustible] || data.combustible}</Text></>}
              </View>
            )}
            {data.vin && <View style={s.fr}><Text style={s.fl}>VIN</Text><Text style={[s.fv, { fontSize: 6 }]}>{data.vin}</Text></View>}
          </View>
        </View>

        {/* ── TIPO DE INTERVENCIÓN (checkboxes) ── */}
        <View style={s.chkRow}>
          <Text style={s.chkTitle}>Tipo:</Text>
          {Object.entries(tipoL).map(([k, v]) => (
            <View key={k} style={s.chkItem}>
              <View style={tipos.includes(k) ? s.chkBoxChecked : s.chkBox} />
              <Text style={s.chkLabel}>{v}</Text>
            </View>
          ))}
        </View>

        {/* ── TRABAJOS A REALIZAR ── */}
        <Text style={s.sec}>Trabajos a realizar / Descripción del cliente</Text>
        {data.descripcionCliente && <View style={s.fLine}><Text style={s.lTxt}>{data.descripcionCliente}</Text></View>}
        {Array.from({ length: 4 }).map((_, i) => <View key={`t${i}`} style={s.bLine} />)}

        {/* ── DIAGNÓSTICO ── */}
        <Text style={s.sec}>Diagnóstico / Observaciones del mecánico</Text>
        {data.diagnostico && <View style={s.fLine}><Text style={s.lTxt}>{data.diagnostico}</Text></View>}
        {data.observacionesEntrada && <View style={s.fLine}><Text style={[s.lTxt, { color: c.gray }]}>Daños previos: {data.observacionesEntrada}</Text></View>}
        {Array.from({ length: 3 }).map((_, i) => <View key={`d${i}`} style={s.bLine} />)}

        {/* ── RECAMBIOS Y MANO DE OBRA ── */}
        <Text style={s.sec}>Recambios y mano de obra</Text>
        <View style={s.tH}>
          <Text style={[s.th, { width: "7%" }]}>Tipo</Text>
          <Text style={[s.th, { width: "48%" }]}>Descripción</Text>
          <Text style={[s.th, { width: "10%", textAlign: "right" as any }]}>Cant.</Text>
          <Text style={[s.th, { width: "15%", textAlign: "right" as any }]}>Precio</Text>
          <Text style={[s.th, { width: "20%", textAlign: "right" as any }]}>Importe</Text>
        </View>
        {lCalc.map((l, i) => (
          <View key={i} style={s.tR}>
            <Text style={[s.td, { width: "7%", color: c.light, fontSize: 6 }]}>{l.tipo === "mano_obra" ? "MO" : l.tipo === "recambio" ? "RC" : "OT"}</Text>
            <Text style={[s.td, { width: "48%" }]}>{l.descripcion}</Text>
            <Text style={[s.td, { width: "10%", textAlign: "right" as any }]}>{Number(l.cantidad)}</Text>
            <Text style={[s.td, { width: "15%", textAlign: "right" as any }]}>{Number(l.precioUnitario).toFixed(2)}</Text>
            <Text style={[s.td, { width: "20%", textAlign: "right" as any, fontFamily: FB }]}>{l.base.toFixed(2)}</Text>
          </View>
        ))}
        {Array.from({ length: emptyR }).map((_, i) => <View key={`e${i}`} style={s.tR}><Text style={s.td}> </Text></View>)}

        {lCalc.length > 0 && (
          <View style={s.tots}>
            <View style={s.toR}><Text style={s.toL}>Base</Text><Text style={s.toV}>{totalBase.toFixed(2)}</Text></View>
            <View style={s.toR}><Text style={s.toL}>IVA</Text><Text style={s.toV}>{totalIva.toFixed(2)}</Text></View>
            <View style={[s.toR, { borderTopWidth: 1, borderTopColor: c.black, paddingTop: 2, marginTop: 1 }]}>
              <Text style={s.toFL}>TOTAL</Text><Text style={s.toFV}>{totalFinal.toFixed(2)} EUR</Text>
            </View>
          </View>
        )}

        {/* ── LEGAL CHECKBOXES ── */}
        <View style={s.legalRow}>
          <View style={s.legalItem}>
            <View style={data.renunciaPresupuesto ? s.chkBoxChecked : s.legalBox} />
            <Text style={s.legalTxt}>El cliente renuncia al presupuesto previo (Art. 12 RD 1457/1986)</Text>
          </View>
          <View style={s.legalItem}>
            <View style={data.renunciaPiezas ? s.chkBoxChecked : s.legalBox} />
            <Text style={s.legalTxt}>El cliente renuncia a recibir las piezas sustituidas (Art. 14 RD 1457/1986)</Text>
          </View>
        </View>

        {/* ── FIRMAS ── */}
        <View style={s.sigR}>
          <View style={s.sigB}><View style={{ height: 18 }} /><View style={s.sigL} /><Text style={s.sigT}>Firma del cliente</Text></View>
          <View style={s.sigB}><View style={{ height: 18 }} /><View style={s.sigL} /><Text style={s.sigT}>Sello del taller</Text></View>
        </View>

        {/* ── QR ── */}
        {data.qrDataUrl && data.trackingUrl && (
          <View style={s.qrR}>
            <Image src={data.qrDataUrl} style={{ width: 28, height: 28 }} />
            <View>
              <Text style={s.qrT}>Seguimiento: {data.trackingUrl}</Text>
              <Text style={[s.qrT, { fontSize: 5 }]}>El cliente puede consultar el estado escaneando este QR</Text>
            </View>
          </View>
        )}

        {/* ── FOOTER ── */}
        <View style={s.foot} fixed>
          <Text style={s.footT}>
            Garantía: 3 meses o 2.000 km (RD 1457/1986). Piezas sustituidas a disposición del cliente. Gastos estancia desde el 3er día hábil.
            {"\n"}{data.tallerNombre}{data.tallerCif ? ` · CIF ${data.tallerCif}` : ""}{data.tallerRegistro ? ` · Reg. ${data.tallerRegistro}` : ""} · Generado con FIXA
          </Text>
        </View>
      </Page>
    </Document>
  );
}
