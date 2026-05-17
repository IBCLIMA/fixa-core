import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf9f7",
          backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.15), transparent)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "28px",
              fontWeight: "800",
            }}
          >
            FX
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "#1c1917",
              letterSpacing: "-2px",
            }}
          >
            FIXA
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: "#1c1917",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "800px",
            letterSpacing: "-1px",
          }}
        >
          Gestiona tu taller
          <br />
          <span style={{ color: "#f97316" }}>desde el móvil.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#78716c",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          Órdenes · Citas · WhatsApp · Presupuestos · Desde 29€/mes
        </div>

        {/* Bottom badge */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            fontSize: "18px",
            color: "#a8a29e",
          }}
        >
          <span>14 días gratis</span>
          <span>•</span>
          <span>Sin permanencia</span>
          <span>•</span>
          <span>Creado por mecánicos</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
