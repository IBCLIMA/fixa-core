import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Tarjeta de previsualización (Open Graph) compartida por los enlaces que el
 * taller manda al cliente (estado, informe, presupuesto). Convierte una URL
 * pelada en una tarjeta de marca con SU coche. Sin matrícula ni nombre del
 * cliente, por si la tarjeta se reenviara.
 */
export function ogCard(opts: {
  taller: string;
  label: string; // "El estado de", "El informe de", "El presupuesto de"
  destacado: string; // "Mercedes GLC AMG 43" / "tu coche"
  cta: string; // "Ver en directo"
  ctaSub: string; // "Tu reparación, paso a paso · sin llamadas"
}) {
  const { taller, label, destacado, cta, ctaSub } = opts;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1c1917 0%, #292524 60%, #44403c 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(249,115,22,0.35) 0%, rgba(249,115,22,0) 70%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "36px" }}>
          <svg width="56" height="56" viewBox="0 0 40 40">
            <defs>
              <linearGradient id="bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <path d="M20 4l13 7.5v17L20 36 7 28.5v-17L20 4z" fill="url(#bg)" stroke="url(#bg)" strokeWidth="5" strokeLinejoin="round" />
            <path d="M14.5 11h11.5v4h-7v4h6v4h-6v6h-4.5V11z" fill="white" />
          </svg>
          <div style={{ color: "#d6d3d1", fontSize: "30px", fontWeight: 700, display: "flex" }}>{taller}</div>
        </div>

        <div style={{ color: "#a8a29e", fontSize: "30px", display: "flex" }}>{label}</div>
        <div
          style={{
            color: "white",
            fontSize: "84px",
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: "1000px",
            display: "flex",
            marginTop: "8px",
          }}
        >
          {destacado}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              background: "#f97316",
              color: "white",
              borderRadius: "9999px",
              padding: "12px 30px",
              fontSize: "28px",
              fontWeight: 700,
              display: "flex",
            }}
          >
            {cta}
          </div>
          <div style={{ color: "#a8a29e", fontSize: "26px", display: "flex" }}>{ctaSub}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
