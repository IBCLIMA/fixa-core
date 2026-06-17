import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

/**
 * Plantilla de Orden de Reparación en blanco, conforme al RD 1457/1986.
 * Lead magnet de FIXA: se descarga gratis desde el blog.
 */

const ORANGE = "#ea580c";
const STONE = "#44403c";
const LIGHT = "#a8a29e";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 8.5, fontFamily: "Helvetica", color: STONE },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  brand: { fontSize: 16, fontFamily: "Helvetica-Bold", color: ORANGE },
  title: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 7.5, color: LIGHT, marginTop: 2 },
  box: { borderWidth: 1, borderColor: "#e7e5e4", borderRadius: 4, padding: 8, marginBottom: 8 },
  boxTitle: { fontSize: 7, fontFamily: "Helvetica-Bold", color: ORANGE, marginBottom: 5, textTransform: "uppercase" },
  row: { flexDirection: "row", gap: 8 },
  col: { flex: 1 },
  field: { flexDirection: "row", alignItems: "flex-end", marginBottom: 7 },
  label: { fontSize: 8 },
  line: { flex: 1, borderBottomWidth: 0.8, borderBottomColor: "#d6d3d1", marginLeft: 4, height: 10 },
  check: { width: 9, height: 9, borderWidth: 1, borderColor: STONE, marginRight: 4 },
  checkRow: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  small: { fontSize: 6.8, color: LIGHT, lineHeight: 1.4 },
  workLine: { borderBottomWidth: 0.8, borderBottomColor: "#e7e5e4", height: 16 },
  sigBox: { flex: 1, borderWidth: 1, borderColor: "#e7e5e4", borderRadius: 4, height: 70, padding: 6 },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#e7e5e4", paddingTop: 6 },
});

function Field({ label, flex = 1 }: { label: string; flex?: number }) {
  return (
    <View style={[s.field, { flex }]}>
      <Text style={s.label}>{label}</Text>
      <View style={s.line} />
    </View>
  );
}

export function PlantillaOrPDF() {
  return (
    <Document title="Plantilla Orden de Reparación — FIXA" author="FIXA">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>ORDEN DE REPARACIÓN</Text>
            <Text style={s.subtitle}>Conforme al Real Decreto 1457/1986 · Nº de orden: ________</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.brand}>FIXA</Text>
            <Text style={s.subtitle}>Plantilla gratuita · fixataller.es</Text>
          </View>
        </View>

        {/* Taller */}
        <View style={s.box}>
          <Text style={s.boxTitle}>Datos del taller</Text>
          <View style={s.row}>
            <Field label="Nombre/Razón social:" flex={2} />
            <Field label="NIF/CIF:" />
          </View>
          <View style={s.row}>
            <Field label="Dirección:" flex={2} />
            <Field label="Teléfono:" />
          </View>
          <View style={s.row}>
            <Field label="Nº Registro Industrial:" />
            <Field label="Rama de actividad:" flex={2} />
          </View>
        </View>

        {/* Cliente y vehículo */}
        <View style={s.row}>
          <View style={[s.box, s.col]}>
            <Text style={s.boxTitle}>Cliente</Text>
            <Field label="Nombre:" />
            <Field label="DNI/NIF:" />
            <Field label="Teléfono:" />
            <Field label="Dirección:" />
          </View>
          <View style={[s.box, s.col]}>
            <Text style={s.boxTitle}>Vehículo</Text>
            <Field label="Matrícula:" />
            <Field label="Marca y modelo:" />
            <Field label="Kilómetros:" />
            <Field label="Fecha entrada:          Fecha prevista entrega:" />
          </View>
        </View>

        {/* Motivo y renuncias */}
        <View style={s.box}>
          <Text style={s.boxTitle}>Motivo del depósito y presupuesto</Text>
          <View style={[s.row, { marginBottom: 6 }]}>
            <View style={s.checkRow}><View style={s.check} /><Text style={s.label}>Elaboración de presupuesto</Text></View>
            <View style={s.checkRow}><View style={s.check} /><Text style={s.label}>Reparación</Text></View>
            <View style={s.checkRow}><View style={s.check} /><Text style={s.label}>El cliente RENUNCIA al presupuesto previo (firmar)</Text></View>
          </View>
          <View style={s.row}>
            <View style={s.checkRow}><View style={s.check} /><Text style={s.label}>El cliente desea conservar las piezas sustituidas</Text></View>
          </View>
        </View>

        {/* Trabajos */}
        <View style={s.box}>
          <Text style={s.boxTitle}>Descripción de los trabajos solicitados</Text>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={s.workLine} />
          ))}
        </View>

        {/* Estado del vehículo */}
        <View style={s.box}>
          <Text style={s.boxTitle}>Estado del vehículo a la entrada (daños preexistentes)</Text>
          {Array.from({ length: 2 }).map((_, i) => (
            <View key={i} style={s.workLine} />
          ))}
        </View>

        {/* Firmas */}
        <View style={[s.row, { marginTop: 4 }]}>
          <View style={s.sigBox}>
            <Text style={s.boxTitle}>Firma del cliente (autoriza los trabajos)</Text>
          </View>
          <View style={s.sigBox}>
            <Text style={s.boxTitle}>Por el taller (recibe el vehículo)</Text>
          </View>
        </View>

        <Text style={[s.small, { marginTop: 8 }]}>
          GARANTÍA: la reparación está garantizada durante 3 meses o 2.000 km (lo que antes ocurra) en
          vehículos de uso particular, conforme al RD 1457/1986. El cliente tiene derecho a presupuesto
          previo por escrito; su renuncia debe constar expresamente. Las piezas sustituidas quedan a
          disposición del cliente salvo intervención en garantía o canje.
        </Text>

        <View style={s.footer}>
          <Text style={s.small}>Plantilla cortesía de FIXA — el software de gestión de taller</Text>
          <Text style={s.small}>Crea órdenes como esta en 10 segundos: fixataller.es</Text>
        </View>
      </Page>
    </Document>
  );
}
