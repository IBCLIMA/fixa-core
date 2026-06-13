import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/content";

export const alt = "Artículo del blog de FIXA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const categoriaLabel: Record<string, string> = {
  gestion: "Gestión",
  marketing: "Marketing",
  legal: "Legal",
  tecnologia: "Tecnología",
  consejos: "Consejos",
};

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title || "Blog de FIXA";
  const category = post ? categoriaLabel[post.category] || post.category : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #1c1917 0%, #292524 60%, #44403c 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-220px",
            right: "-120px",
            width: "600px",
            height: "600px",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0) 70%)",
            display: "flex",
          }}
        />

        {/* Header: logo + categoría */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg width="56" height="56" viewBox="0 0 40 40">
              <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <path d="M20 4l13 7.5v17L20 36 7 28.5v-17L20 4z" fill="url(#bg)" stroke="url(#bg)" strokeWidth="5" strokeLinejoin="round" />
              <path d="M20 1.6l15.5 9-15.5 9-15.5-9 15.5-9z" fill="white" fillOpacity="0.12" />
              <path d="M14.5 11h11.5v4h-7v4h6v4h-6v6h-4.5V11z" fill="white" />
            </svg>
            <div style={{ color: "white", fontSize: "36px", fontWeight: 800, display: "flex" }}>FIXA</div>
          </div>
          {category && (
            <div
              style={{
                background: "rgba(249,115,22,0.15)",
                border: "1px solid rgba(249,115,22,0.4)",
                color: "#fdba74",
                borderRadius: "9999px",
                padding: "10px 24px",
                fontSize: "24px",
                fontWeight: 700,
                display: "flex",
              }}
            >
              {category}
            </div>
          )}
        </div>

        {/* Título */}
        <div
          style={{
            color: "white",
            fontSize: title.length > 70 ? "48px" : "56px",
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: "1000px",
            display: "flex",
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#a8a29e", fontSize: "26px", display: "flex" }}>
            Blog para talleres mecánicos · fixataller.es
          </div>
          <div
            style={{
              background: "#f97316",
              color: "white",
              borderRadius: "9999px",
              padding: "10px 26px",
              fontSize: "24px",
              fontWeight: 700,
              display: "flex",
            }}
          >
            Leer en el blog
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
