import { ImageResponse } from "next/og";

export const alt = "FIXA — Software de gestión para talleres mecánicos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        {/* Glow naranja */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <svg width="72" height="72" viewBox="0 0 40 40">
            <defs>
              <linearGradient id="bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="10" fill="url(#bg)" />
            <path d="M11 10h7.5v3h-4v3.5h3.5v3h-3.5v5h-3.5V10z" fill="white" fillOpacity="0.95" />
            <path d="M21 10l3.2 5.5L21 21l2 1.2 3.2-5.5 3.2 5.5 2-1.2-3.2-5.5L31.4 10h-3.6l-1.6 2.8L24.6 10H21z" fill="white" fillOpacity="0.95" />
            <path d="M23.2 24.5l-2.2 3.8v0c-.3.5-.1 1.1.4 1.4l1.7 1c.5.3 1.1.1 1.4-.4l2.2-3.8-1.8-1-1.7-1z" fill="white" fillOpacity="0.9" />
            <path d="M28.8 24.5l2.2 3.8c.3.5.1 1.1-.4 1.4l-1.7 1c-.5.3-1.1.1-1.4-.4l-2.2-3.8 1.8-1 1.7-1z" fill="white" fillOpacity="0.9" />
          </svg>
          <div style={{ color: "white", fontSize: "56px", fontWeight: 800, display: "flex" }}>
            FIXA
          </div>
        </div>
        <div
          style={{
            color: "white",
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: "900px",
            display: "flex",
          }}
        >
          El partner digital del taller pequeño
        </div>
        <div
          style={{
            color: "#d6d3d1",
            fontSize: "30px",
            marginTop: "28px",
            maxWidth: "850px",
            display: "flex",
          }}
        >
          Órdenes, presupuestos, citas y WhatsApp — desde el móvil, sin formación
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
              padding: "12px 28px",
              fontSize: "26px",
              fontWeight: 700,
              display: "flex",
            }}
          >
            Desde 29€/mes
          </div>
          <div style={{ color: "#a8a29e", fontSize: "26px", display: "flex" }}>
            14 días gratis · fixataller.es
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
