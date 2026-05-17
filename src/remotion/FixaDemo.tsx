import { AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig, spring, staticFile, Sequence } from "remotion";

// --- Shared Components ---

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame: frame - delay * fps, fps, config: { damping: 20 } });
  const y = interpolate(opacity, [0, 1], [30, 0]);
  return <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>;
}

function TextSlide({
  title,
  subtitle,
  bg = "#0c0a09",
  titleColor = "#fff",
  accentColor = "#f97316",
}: {
  title: string;
  subtitle?: string;
  bg?: string;
  titleColor?: string;
  accentColor?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOpacity = spring({ frame, fps, config: { damping: 20 } });
  const subtitleOpacity = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 20 } });
  const titleY = interpolate(titleOpacity, [0, 1], [40, 0]);
  const subtitleY = interpolate(subtitleOpacity, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 80px",
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: titleColor,
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: -2,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
        dangerouslySetInnerHTML={{
          __html: title.replace(/\*(.*?)\*/g, `<span style="color:${accentColor}">$1</span>`),
        }}
      />
      {subtitle && (
        <div
          style={{
            fontSize: 28,
            color: "#a8a29e",
            marginTop: 24,
            textAlign: "center",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
}

function ScreenshotSlide({
  src,
  label,
  description,
}: {
  src: string;
  label: string;
  description: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, config: { damping: 25, stiffness: 100 } });
  const imgOpacity = interpolate(imgScale, [0, 1], [0, 1]);
  const labelOpacity = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 20 } });
  const descOpacity = spring({ frame: frame - 0.6 * fps, fps, config: { damping: 20 } });

  const scale = interpolate(imgScale, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0c0a09",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "0",
      }}
    >
      {/* Screenshot - large, filling most of the frame */}
      <div
        style={{
          opacity: imgOpacity,
          transform: `scale(${scale})`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
          width: "92%",
          marginTop: 30,
        }}
      >
        <Img src={staticFile(`demo/screenshots/${src}`)} style={{ width: "100%", display: "block" }} />
      </div>

      {/* Label bar at bottom - over dark bg */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(12,10,9,0.95) 30%)",
          padding: "60px 60px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#ffffff",
            opacity: labelOpacity,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            color: "#a8a29e",
            opacity: descOpacity,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function LogoSlide() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const textOpacity = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0c0a09",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Logo icon */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 28,
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${logoScale})`,
          boxShadow: "0 20px 60px rgba(249,115,22,0.3)",
        }}
      >
        <span style={{ fontSize: 56, fontWeight: 800, color: "white", fontFamily: "system-ui" }}>FX</span>
      </div>

      {/* FIXA text */}
      <div
        style={{
          marginTop: 24,
          fontSize: 72,
          fontWeight: 800,
          color: "white",
          letterSpacing: -3,
          opacity: textOpacity,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        FIXA
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 24,
          color: "#a8a29e",
          opacity: textOpacity,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Gestión de taller. Desde el móvil.
      </div>
    </AbsoluteFill>
  );
}

// --- Main Composition ---

export const FixaDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0a09" }}>
      {/* Background music */}
      <Audio src={staticFile("demo/bg-music-30s.mp3")} volume={0.5} />

      {/* Scene 1: Hook (0-3s) */}
      <Sequence from={0} durationInFrames={3 * fps}>
        <TextSlide
          title="¿Sigues gestionando tu taller con *papel y WhatsApp*?"
          bg="#0c0a09"
        />
      </Sequence>

      {/* Scene 2: Pain (3-7s) */}
      <Sequence from={3 * fps} durationInFrames={4 * fps}>
        <TextSlide
          title="20 llamadas al día. Presupuestos a mano. *Clientes que desaparecen.*"
          subtitle="El software de los grandes cuesta 200€/mes. El papel ya no funciona."
          bg="#0c0a09"
        />
      </Sequence>

      {/* Scene 3: Solution reveal (7-10s) */}
      <Sequence from={7 * fps} durationInFrames={3 * fps}>
        <LogoSlide />
      </Sequence>

      {/* Scene 4: Dashboard (10-14s) */}
      <Sequence from={10 * fps} durationInFrames={4 * fps}>
        <ScreenshotSlide
          src="dashboard.png"
          label="Todo tu taller en un vistazo"
          description="KPIs, órdenes activas, citas del día, coches listos para recoger"
        />
      </Sequence>

      {/* Scene 5: Orders (14-18s) */}
      <Sequence from={14 * fps} durationInFrames={4 * fps}>
        <ScreenshotSlide
          src="ordenes.png"
          label="Órdenes de trabajo"
          description="Matrícula → orden creada en 10 segundos. Sin formularios."
        />
      </Sequence>

      {/* Scene 6: Clients (18-21s) */}
      <Sequence from={18 * fps} durationInFrames={3 * fps}>
        <ScreenshotSlide
          src="clientes.png"
          label="Tus clientes organizados"
          description="Historial completo, vehículos, contacto. Todo en un lugar."
        />
      </Sequence>

      {/* Scene 7: Calendar (21-24s) */}
      <Sequence from={21 * fps} durationInFrames={3 * fps}>
        <ScreenshotSlide
          src="calendario.png"
          label="Agenda de citas"
          description="Organiza entradas y controla disponibilidad al momento."
        />
      </Sequence>

      {/* Scene 8: Price (24-27s) */}
      <Sequence from={24 * fps} durationInFrames={3 * fps}>
        <TextSlide
          title="Todo esto por *29€/mes*"
          subtitle="Sin permanencia · Sin tarjeta de crédito · Setup gratuito"
          bg="#0c0a09"
        />
      </Sequence>

      {/* Scene 9: CTA (27-30s) */}
      <Sequence from={27 * fps} durationInFrames={3 * fps}>
        <AbsoluteFill
          style={{
            backgroundColor: "#0c0a09",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FadeIn>
            <div style={{ fontSize: 56, fontWeight: 800, color: "white", textAlign: "center", fontFamily: "system-ui", letterSpacing: -2 }}>
              Prueba gratis <span style={{ color: "#f97316" }}>14 días</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div
              style={{
                marginTop: 32,
                padding: "16px 48px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "white",
                fontSize: 24,
                fontWeight: 700,
                fontFamily: "system-ui",
                boxShadow: "0 12px 40px rgba(249,115,22,0.4)",
              }}
            >
              fixa.es
            </div>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div style={{ marginTop: 24, fontSize: 18, color: "#78716c", fontFamily: "system-ui" }}>
              Creado por mecánicos, para mecánicos.
            </div>
          </FadeIn>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
