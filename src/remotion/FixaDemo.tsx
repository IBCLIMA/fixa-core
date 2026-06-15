import {
  AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig,
  spring, staticFile,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const FONT = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

function BigText({ text, size = 72, color = "#fff", delay = 0 }: { text: string; size?: number; color?: string; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 60 } });
  return <div style={{ opacity: e, transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, fontSize: size, fontWeight: 800, fontFamily: FONT, letterSpacing: -2, lineHeight: 1.1, color, textAlign: "center" }}>{text}</div>;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - delay, fps, config: { damping: 22 } });
  return <div style={{ opacity: e, transform: `translateY(${interpolate(e, [0, 1], [24, 0])}px)` }}>{children}</div>;
}

/* ── Captura completa de fondo + texto grande superpuesto + degradado cálido ── */

function ScreenScene({ src, title, subtitle, imgW = 2500, align = "center" }: {
  src: string; title: string; subtitle: string; imgW?: number; align?: "center" | "bottom-left" | "bottom-right";
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20 } });
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04], { extrapolateRight: "clamp" });

  const textAlign = align === "center" ? "center" : "left";
  const textPos = align === "center"
    ? { top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center" }
    : align === "bottom-left"
      ? { bottom: 60, left: 80, right: "40%" }
      : { bottom: 60, right: 80, left: "40%" };

  return (
    <AbsoluteFill>
      {/* Captura completa de fondo con zoom lento */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "center center", width: "100%", height: "100%" }}>
          <Img src={staticFile(`demo/screenshots/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: interpolate(enter, [0, 1], [0, 1]) }} />
        </div>
      </div>

      {/* Degradado cálido sobre la captura para legibilidad */}
      <div style={{
        position: "absolute", inset: 0,
        background: align === "center"
          ? "linear-gradient(180deg, rgba(28,25,23,0.75) 0%, rgba(28,25,23,0.5) 40%, rgba(28,25,23,0.75) 100%)"
          : align === "bottom-left"
            ? "linear-gradient(45deg, rgba(28,25,23,0.85) 0%, rgba(28,25,23,0.3) 60%, transparent 100%)"
            : "linear-gradient(-45deg, rgba(28,25,23,0.85) 0%, rgba(28,25,23,0.3) 60%, transparent 100%)",
      }} />

      {/* Texto superpuesto */}
      <div style={{ position: "absolute", ...textPos, padding: align === "center" ? "0 120px" : "0", textAlign, zIndex: 10 }}>
        <FadeIn delay={4}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#fff", fontFamily: FONT, letterSpacing: -2, lineHeight: 1.15, textShadow: "0 4px 30px rgba(0,0,0,0.5)", textAlign }}>{title}</div>
        </FadeIn>
        <FadeIn delay={10}>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.8)", fontFamily: FONT, marginTop: 14, lineHeight: 1.5, textShadow: "0 2px 20px rgba(0,0,0,0.5)", maxWidth: 700, textAlign }}>{subtitle}</div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

/* ── Logo ── */

function LogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({ frame, fps, config: { damping: 10, stiffness: 40 } });
  const textEnter = spring({ frame: frame - 10, fps, config: { damping: 20 } });
  const glow = interpolate(frame, [0, 30, 60], [0, 500, 350], { extrapolateRight: "clamp" });
  const glowO = interpolate(frame, [0, 15, 60], [0, 0.7, 0.3], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, #291a0a 0%, #1c1917 70%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: glow, height: glow, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)", opacity: glowO, filter: "blur(40px)" }} />
      <div style={{ transform: `scale(${pulse})` }}>
        <svg width="110" height="110" viewBox="0 0 40 40"><defs><linearGradient id="vg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" /></linearGradient></defs><path d="M20 4l13 7.5v17L20 36 7 28.5v-17L20 4z" fill="url(#vg)" stroke="url(#vg)" strokeWidth="5" strokeLinejoin="round" /><path d="M20 1.6l15.5 9-15.5 9-15.5-9 15.5-9z" fill="white" fillOpacity="0.12" /><path d="M14.5 11h11.5v4h-7v4h6v4h-6v6h-4.5V11z" fill="white" /></svg>
      </div>
      <div style={{ marginTop: 24, opacity: textEnter, fontSize: 72, fontWeight: 800, color: "white", letterSpacing: -4, fontFamily: FONT }}>FIXA</div>
    </AbsoluteFill>
  );
}

/* ── MAIN ── */

export const FixaDemo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#1c1917" }}>
      <Audio src={staticFile("demo/bg-music-30s.mp3")} volume={0.35} />
      <TransitionSeries>

        {/* 1. El problema (3s) — degradado cálido, sin captura */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, #291a0a 0%, #1c1917 65%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 100px", gap: 8 }}>
            <BigText text="20 llamadas al día." delay={0} size={64} />
            <BigText text="Presupuestos a las 9 de la noche." delay={6} size={64} color="#a8a29e" />
            <BigText text="ITVs que se te escapan." delay={12} size={64} color="#78716c" />
            <FadeIn delay={20}><div style={{ marginTop: 20, fontSize: 28, color: "#f97316", fontWeight: 700, fontFamily: FONT }}>¿Te suena?</div></FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 2. Logo (1.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
          <LogoReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 3. Panel — captura completa de fondo + texto encima (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <ScreenScene src="dashboard.png" title="Abres FIXA y tu día está resuelto." subtitle="Entregas, cobros pendientes y presupuestos sin respuesta — de un vistazo." imgW={2410} align="bottom-left" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 4. Órdenes (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <ScreenScene src="ordenes.png" title="Matrícula y la orden está creada." subtitle="10 segundos. Sin formularios. Legal según RD 1457/1986." imgW={2668} align="bottom-right" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 5. Clientes (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <ScreenScene src="clientes.png" title="Tu cliente deja de llamarte." subtitle="Ve el estado de su coche online. El presupuesto se acepta desde el sofá." imgW={2590} align="bottom-left" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 6. Calendario (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <ScreenScene src="calendario.png" title="Las citas se organizan solas." subtitle="El cliente pide cita online. Tú ves la agenda antes de abrir." imgW={2636} align="bottom-right" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 7. Precio (3s) — degradado cálido */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, #291a0a 0%, #1c1917 65%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <FadeIn><div style={{ fontSize: 26, color: "#78716c", fontFamily: FONT }}>Menos que un cambio de aceite</div></FadeIn>
            <BigText text="29€/mes" size={130} color="#f97316" delay={6} />
            <FadeIn delay={14}>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {["Sin tarjeta", "Sin permanencia", "14 días gratis"].map((t) => (
                  <div key={t} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.08)", fontSize: 15, color: "#f97316", fontWeight: 600, fontFamily: FONT }}>{t}</div>
                ))}
              </div>
            </FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 8. CTA (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,115,22,0.08) 0%, #1c1917 60%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <BigText text="Pruébalo gratis." size={76} delay={0} />
            <BigText text="Sin excusas." size={76} color="#f97316" delay={8} />
            <FadeIn delay={16}>
              <div style={{ marginTop: 40, padding: "22px 60px", borderRadius: 999, background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", fontSize: 30, fontWeight: 800, fontFamily: FONT, boxShadow: "0 20px 60px rgba(249,115,22,0.4)" }}>fixataller.es</div>
            </FadeIn>
            <FadeIn delay={22}><div style={{ fontSize: 18, color: "#78716c", fontFamily: FONT, marginTop: 20 }}>Hecho por mecánicos. Para mecánicos.</div></FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>

      </TransitionSeries>
    </AbsoluteFill>
  );
};
