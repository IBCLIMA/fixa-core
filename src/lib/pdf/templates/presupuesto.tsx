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
  ptLbl: { fontSize: 6.5, color: c.gray, textTransform: "uppercase" as any, letterSpacing: 1, textAlign: "right" as any },
  ptNum: { fontSize: 18, fontFamily: FB, color: c.brand, textAlign: "right" as any },
  // Dates row
  datesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: c.dots },
  dtCol: { fontSize: 7, color: c.gray, lineHeight: 1.6 },
  dtBold: { fontFamily: FB, color: c.dark },
  // Plate
  midRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: c.dots },
  plate: { borderWidth: 2, borderColor: c.black, paddingHorizontal: 12, paddingVertical: 3, borderRadius: 3 },
  plateTxt: { fontSize: 16, fontFamily: FB, letterSpacing: 3 },
  // 2-col
  row2: { flexDirection: "row", gap: 6, marginBottom: 5 },
  box: { flex: 1, borderWidth: 1, borderColor: c.border, borderRadius: 3, padding: 5 },
  boxT: { fontSize: 6, fontFamily: FB, textTransform: "uppercase" as any, letterSpacing: 0.8, color: c.gray, marginBottom: 3, borderBottomWidth: 1, borderBottomColor: c.dots, paddingBottom: 2 },
  fr: { flexDirection: "row", marginBottom: 1.5 },
  fl: { fontSize: 6.5, color: c.light, width: 42 },
  fv: { fontSize: 8, fontFamily: FB, flex: 1 },
  // Sections
  sec: { fontSize: 7.5, fontFamily: FB, textTransform: "uppercase" as any, letterSpacing: 0.6, backgroundColor: c.bg, padding: 4, borderWidth: 1, borderColor: c.border, borderRadius: 2, marginBottom: 2, marginTop: 5 },
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
  // Legal
  legalSec: { marginTop: 8, padding: 5, borderWidth: 1, borderColor: c.dots, borderRadius: 3 },
  legalTxt: { fontSize: 6, color: c.gray, lineHeight: 1.5 },
  // Acceptance signatures
  accSec: { marginTop: 8 },
  accTitle: { fontSize: 7, fontFamily: FB, textTransform: "uppercase" as any, letterSpacing: 0.6, color: c.gray, marginBottom: 6 },
  sigRow: { flexDirection: "row", justifyContent: "space-between", gap: 20 },
  sigBox: { flex: 1, borderWidth: 1, borderColor: c.border, borderRadius: 3, padding: 6, minHeight: 50 },
  sigLabel: { fontSize: 6.5, fontFamily: FB, color: c.dark, marginBottom: 2 },
  sigSub: { fontSize: 5.5, color: c.light, marginBottom: 8 },
  sigLine: { borderBottomWidth: 1, borderBottomColor: c.border, marginTop: "auto" as any },
  sigCaption: { fontSize: 5.5, color: c.light, textAlign: "center" as any, marginTop: 2 },
  // QR
  qrR: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6, padding: 4, borderWidth: 1, borderColor: c.dots, borderRadius: 3 },
  qrT: { fontSize: 6, color: c.gray, lineHeight: 1.3 },
  // Footer
  foot: { position: "absolute", bottom: 10, left: 24, right: 24 },
  footT: { fontSize: 5, color: c.light, textAlign: "center" as any, lineHeight: 1.4 },
});

export type PresupuestoPDFData = {
  tallerNombre: string;
  tallerCif?: string | null;
  tallerDireccion?: string | null;
  tallerTelefono?: string | null;
  tallerEmail?: string | null;
  tallerRegistro?: string | null;
  numero: number;
  fechaCreacion: string | Date;
  validezDias: number;
  notas?: string | null;
  clienteNombre: string;
  clienteNif?: string | null;
  clienteTelefono?: string | null;
  clienteDireccion?: string | null;
  matricula: string;
  marca?: string | null;
  modelo?: string | null;
  anio?: number | null;
  vin?: string | null;
  lineas: {
    tipo: string;
    descripcion: string;
    cantidad: string | number;
    precioUnitario: string | number;
    descuentoPct?: string | number | null;
    ivaPct: string | number;
  }[];
  qrDataUrl?: string | null;
  publicUrl?: string | null;
};

function fmt(d: string | Date | null | undefined): string {
  if (!d) return "__ / __ / ____";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function addDays(d: string | Date, days: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
}

export function PresupuestoPDF({ data }: { data: PresupuestoPDFData }) {
  let totalBase = 0, totalIva = 0;
  const lCalc = data.lineas.map((l) => {
    const q = Number(l.cantidad), p = Number(l.precioUnitario), d = Number(l.descuentoPct || 0), iv = Number(l.ivaPct || 21);
    const b = q * p * (1 - d / 100); totalBase += b; totalIva += b * (iv / 100); return { ...l, base: b };
  });
  const totalFinal = totalBase + totalIva;
  const emptyR = Math.max(0, 6 - lCalc.length);
  const vehInfo = [data.marca, data.modelo].filter(Boolean).join(" ");
  const fechaValidez = addDays(data.fechaCreacion, data.validezDias);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.bar} fixed />

        {/* -- HEADER -- */}
        <View style={s.hdr}>
          <View style={{ flex: 1 }}>
            <Text style={s.hName}>{data.tallerNombre}</Text>
            <Text style={s.hInfo}>{[data.tallerCif && `CIF: ${data.tallerCif}`, data.tallerDireccion].filter(Boolean).join(" · ")}</Text>
            <Text style={s.hInfo}>{[data.tallerTelefono, data.tallerEmail].filter(Boolean).join(" · ")}</Text>
            {data.tallerRegistro && <Text style={s.hInfo}>Reg. Industrial: {data.tallerRegistro}</Text>}
          </View>
          <View>
            <Text style={s.ptLbl}>Presupuesto</Text>
            <Text style={s.ptNum}>PT-{data.numero}</Text>
          </View>
        </View>

        {/* -- DATES + PLATE -- */}
        <View style={s.midRow}>
          <View>
            <Text style={s.dtCol}>Fecha: <Text style={s.dtBold}>{fmt(data.fechaCreacion)}</Text></Text>
            <Text style={s.dtCol}>Valido hasta: <Text style={s.dtBold}>{fmt(fechaValidez)}</Text></Text>
          </View>
          <View style={s.plate}><Text style={s.plateTxt}>{data.matricula}</Text></View>
        </View>

        {/* -- CLIENTE + VEHICULO -- */}
        <View style={s.row2}>
          <View style={s.box}>
            <Text style={s.boxT}>Cliente</Text>
            <View style={s.fr}><Text style={s.fl}>Nombre</Text><Text style={s.fv}>{data.clienteNombre}</Text></View>
            <View style={s.fr}><Text style={s.fl}>Tel.</Text><Text style={s.fv}>{data.clienteTelefono || ""}</Text></View>
            <View style={s.fr}><Text style={s.fl}>NIF</Text><Text style={s.fv}>{data.clienteNif || ""}</Text></View>
            {data.clienteDireccion && <View style={s.fr}><Text style={s.fl}>Dir.</Text><Text style={s.fv}>{data.clienteDireccion}</Text></View>}
          </View>
          <View style={s.box}>
            <Text style={s.boxT}>Vehiculo</Text>
            <View style={s.fr}><Text style={s.fl}>Modelo</Text><Text style={s.fv}>{vehInfo || ""}</Text></View>
            <View style={s.fr}><Text style={s.fl}>Anio</Text><Text style={s.fv}>{data.anio || ""}</Text></View>
            {data.vin && <View style={s.fr}><Text style={s.fl}>VIN</Text><Text style={[s.fv, { fontSize: 6 }]}>{data.vin}</Text></View>}
          </View>
        </View>

        {/* -- DESCRIPCION DEL TRABAJO -- */}
        {data.notas && (
          <>
            <Text style={s.sec}>Descripcion del trabajo</Text>
            <View style={s.fLine}><Text style={s.lTxt}>{data.notas}</Text></View>
          </>
        )}

        {/* -- LINEAS DEL PRESUPUESTO -- */}
        <Text style={s.sec}>Detalle del presupuesto</Text>
        <View style={s.tH}>
          <Text style={[s.th, { width: "7%" }]}>Tipo</Text>
          <Text style={[s.th, { width: "38%" }]}>Descripcion</Text>
          <Text style={[s.th, { width: "10%", textAlign: "right" as any }]}>Cant.</Text>
          <Text style={[s.th, { width: "13%", textAlign: "right" as any }]}>Precio</Text>
          <Text style={[s.th, { width: "12%", textAlign: "right" as any }]}>Dto.%</Text>
          <Text style={[s.th, { width: "20%", textAlign: "right" as any }]}>Importe</Text>
        </View>
        {lCalc.map((l, i) => (
          <View key={i} style={s.tR}>
            <Text style={[s.td, { width: "7%", color: c.light, fontSize: 6 }]}>{l.tipo === "mano_obra" ? "MO" : l.tipo === "recambio" ? "RC" : "OT"}</Text>
            <Text style={[s.td, { width: "38%" }]}>{l.descripcion}</Text>
            <Text style={[s.td, { width: "10%", textAlign: "right" as any }]}>{Number(l.cantidad)}</Text>
            <Text style={[s.td, { width: "13%", textAlign: "right" as any }]}>{Number(l.precioUnitario).toFixed(2)}</Text>
            <Text style={[s.td, { width: "12%", textAlign: "right" as any, color: c.gray }]}>{Number(l.descuentoPct || 0) > 0 ? `${Number(l.descuentoPct)}%` : ""}</Text>
            <Text style={[s.td, { width: "20%", textAlign: "right" as any, fontFamily: FB }]}>{l.base.toFixed(2)}</Text>
          </View>
        ))}
        {Array.from({ length: emptyR }).map((_, i) => <View key={`e${i}`} style={s.tR}><Text style={s.td}> </Text></View>)}

        {lCalc.length > 0 && (
          <View style={s.tots}>
            <View style={s.toR}><Text style={s.toL}>Base imponible</Text><Text style={s.toV}>{totalBase.toFixed(2)}</Text></View>
            <View style={s.toR}><Text style={s.toL}>IVA</Text><Text style={s.toV}>{totalIva.toFixed(2)}</Text></View>
            <View style={[s.toR, { borderTopWidth: 1, borderTopColor: c.black, paddingTop: 2, marginTop: 1 }]}>
              <Text style={s.toFL}>TOTAL</Text><Text style={s.toFV}>{totalFinal.toFixed(2)} EUR</Text>
            </View>
          </View>
        )}

        {/* -- LEGAL -- */}
        <View style={s.legalSec}>
          <Text style={s.legalTxt}>
            Este presupuesto tiene una validez de {data.validezDias} dias habiles (min. 12 segun RD 1457/1986).
          </Text>
          <Text style={[s.legalTxt, { marginTop: 2 }]}>
            La aceptacion de este presupuesto autoriza al taller a realizar los trabajos descritos.
          </Text>
          <Text style={[s.legalTxt, { marginTop: 2 }]}>
            El importe final podria variar si durante la reparacion se detectan averias ocultas, que seran comunicadas previamente al cliente para su autorizacion.
          </Text>
        </View>

        {/* -- ACCEPTANCE SIGNATURES -- */}
        <View style={s.accSec}>
          <Text style={s.accTitle}>Aceptacion del presupuesto</Text>
          <View style={s.sigRow}>
            <View style={s.sigBox}>
              <Text style={s.sigLabel}>Acepto el presupuesto</Text>
              <Text style={s.sigSub}>Autorizo al taller a realizar los trabajos descritos por el importe indicado.</Text>
              <View style={{ flexGrow: 1 }} />
              <View style={s.sigLine} />
              <Text style={s.sigCaption}>Firma del cliente</Text>
            </View>
            <View style={s.sigBox}>
              <Text style={s.sigLabel}>Renuncio al presupuesto</Text>
              <Text style={s.sigSub}>No deseo que se realicen los trabajos presupuestados.</Text>
              <View style={{ flexGrow: 1 }} />
              <View style={s.sigLine} />
              <Text style={s.sigCaption}>Firma del cliente</Text>
            </View>
          </View>
          <Text style={[s.legalTxt, { marginTop: 4, textAlign: "center" as any }]}>
            Fecha: __ / __ / ____
          </Text>
        </View>

        {/* -- QR -- */}
        {data.qrDataUrl && data.publicUrl && (
          <View style={s.qrR}>
            <Image src={data.qrDataUrl} style={{ width: 28, height: 28 }} />
            <View>
              <Text style={s.qrT}>Ver presupuesto online: {data.publicUrl}</Text>
              <Text style={[s.qrT, { fontSize: 5 }]}>El cliente puede consultar este presupuesto escaneando el QR</Text>
            </View>
          </View>
        )}

        {/* -- FOOTER -- */}
        <View style={s.foot} fixed>
          <Text style={s.footT}>
            Presupuesto segun RD 1457/1986, de 10 de enero. Precios con IVA incluido en el total.
            {"\n"}{data.tallerNombre}{data.tallerCif ? ` · CIF ${data.tallerCif}` : ""}{data.tallerRegistro ? ` · Reg. ${data.tallerRegistro}` : ""} · Generado con FIXA
          </Text>
        </View>
      </Page>
    </Document>
  );
}
