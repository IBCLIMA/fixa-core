import {
  AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig,
  spring, staticFile, Sequence,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";

const FONT = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

// ─── Helpers ─────────────────────────────────────────────

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 22 } });
  return (
    <div style={{ opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)` }}>
      {children}
    </div>
  );
}

function ShimmerText({ text, size = 64, delay = 0, color = "#fff", shimmerColor = "#f97316" }: {
  text: string; size?: number; delay?: number; color?: string; shimmerColor?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 60 } });
  const blur = interpolate(enter, [0, 1], [14, 0]);
  const y = interpolate(enter, [0, 1], [40, 0]);
  const shimmerPos = interpolate(frame - delay, [0, 60], [200, -100], { extrapolateRight: "clamp" });

  return (
    <div style={{
      opacity: enter, filter: `blur(${blur}px)`, transform: `translateY(${y}px)`,
      fontSize: size, fontWeight: 800, fontFamily: FONT, letterSpacing: -3, lineHeight: 1.05, textAlign: "center",
      backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 40%, ${shimmerColor} 50%, ${color} 60%, ${color} 100%)`,
      backgroundSize: "200% 100%", backgroundPosition: `${shimmerPos}% center`,
      WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
    }}>
      {text}
    </div>
  );
}

// ─── Phone Mockup (simulated mobile recording) ──────────

function PhoneMockup({ src, scrollPct = 0, label, sub }: {
  src: string; scrollPct?: number; label: string; sub: string;
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 50 } });
  const scale = interpolate(enter, [0, 1], [0.88, 1]);
  const y = interpolate(enter, [0, 1], [60, 0]);

  // Slow scroll dentro del mockup (simula un dedo scrolleando)
  const scrollY = interpolate(frame, [20, durationInFrames - 10], [0, scrollPct], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label
  const labelEnter = spring({ frame: frame - 15, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse 70% 50% at 50% 45%, #1a0a00 0%, #050505 65%)",
      display: "flex", alignItems: "center", justifyContent: "center", perspective: 1000,
    }}>
      {/* Glow detrás del teléfono */}
      <div style={{
        position: "absolute", width: 400, height: 700, borderRadius: 50,
        background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      <div style={{
        transform: `translateY(${y}px) scale(${scale})`,
        width: 375, position: "relative",
      }}>
        {/* Phone frame */}
        <div style={{
          borderRadius: 40, overflow: "hidden",
          boxShadow: "0 30px 100px rgba(0,0,0,0.8), 0 0 0 3px rgba(255,255,255,0.08)",
          background: "#111",
        }}>
          {/* Status bar */}
          <div style={{
            height: 44, background: "#111", display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{ width: 120, height: 28, borderRadius: 14, background: "#000", position: "absolute" }} />
            <span style={{ position: "absolute", left: 24, fontSize: 13, color: "white", fontWeight: 600, fontFamily: FONT }}>9:41</span>
          </div>

          {/* Screenshot con scroll */}
          <div style={{ height: 750, overflow: "hidden" }}>
            <div style={{ transform: `translateY(-${scrollY}%)`, transition: "transform 0.1s" }}>
              <Img src={staticFile(`demo/screenshots/${src}`)} style={{ width: 375, display: "block" }} />
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ height: 28, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>

        {/* Simulated finger tap (pulso naranja) */}
        <div style={{
          position: "absolute", top: "35%", left: "55%",
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(249,115,22,0.3)", border: "2px solid rgba(249,115,22,0.6)",
          opacity: interpolate(frame, [25, 35, 45, 55], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(frame, [25, 35], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        }} />
      </div>

      {/* Floating label */}
      <div style={{
        position: "absolute", bottom: 50, left: "50%",
        transform: `translateX(-50%) translateY(${interpolate(labelEnter, [0, 1], [20, 0])}px)`,
        opacity: labelEnter,
        background: "rgba(12,10,9,0.85)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "14px 28px",
        display: "flex", flexDirection: "column", alignItems: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: FONT, letterSpacing: -0.5 }}>{label}</div>
        <div style={{ fontSize: 14, color: "#78716c", fontFamily: FONT, marginTop: 4 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Typing scene (matrícula que se escribe) ─────────────

function TypingScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22 } });

  const text = "1234ABC";
  const charsPerSec = 6;
  const revealed = Math.min(text.length, Math.floor(((frame - 20) / fps) * charsPerSec));
  const typed = revealed > 0 ? text.slice(0, revealed) : "";
  const cursorOn = Math.floor((frame / fps) * 3) % 2 === 0;

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse 70% 50% at 50% 45%, #1a0a00 0%, #050505 65%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <FadeIn>
        <div style={{ fontSize: 18, color: "#78716c", fontFamily: FONT, marginBottom: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3 }}>
          ENTRADA RÁPIDA
        </div>
      </FadeIn>

      {/* Input simulado */}
      <FadeIn delay={8}>
        <div style={{
          width: 420, height: 90, borderRadius: 20, background: "rgba(255,255,255,0.05)",
          border: "2px solid rgba(249,115,22,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(249,115,22,0.1)",
        }}>
          <span style={{
            fontSize: 52, fontWeight: 800, fontFamily: "ui-monospace, monospace",
            color: "white", letterSpacing: 12,
          }}>
            {typed}
            {cursorOn && <span style={{ color: "#f97316", marginLeft: 2 }}>|</span>}
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={60}>
        <div style={{
          marginTop: 24, padding: "12px 28px", borderRadius: 999,
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          color: "white", fontSize: 18, fontWeight: 700, fontFamily: FONT,
          boxShadow: "0 10px 30px rgba(249,115,22,0.4)",
        }}>
          Orden creada en 10 segundos
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

// ─── Logo Reveal ─────────────────────────────────────────

function LogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({ frame, fps, config: { damping: 10, stiffness: 40 } });
  const textEnter = spring({ frame: frame - 10, fps, config: { damping: 20 } });
  const glowSize = interpolate(frame, [0, 30, 60], [0, 500, 350], { extrapolateRight: "clamp" });
  const glowOpacity = interpolate(frame, [0, 15, 60], [0, 0.7, 0.3], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, #1a0800 0%, #050505 70%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: glowSize, height: glowSize, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)", opacity: glowOpacity, filter: "blur(40px)" }} />

      <div style={{ transform: `scale(${pulse})` }}>
        <svg width="110" height="110" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="vg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <path d="M20 4l13 7.5v17L20 36 7 28.5v-17L20 4z" fill="url(#vg)" stroke="url(#vg)" strokeWidth="5" strokeLinejoin="round" />
          <path d="M20 1.6l15.5 9-15.5 9-15.5-9 15.5-9z" fill="white" fillOpacity="0.12" />
          <path d="M14.5 11h11.5v4h-7v4h6v4h-6v6h-4.5V11z" fill="white" />
        </svg>
      </div>

      <div style={{ marginTop: 24, opacity: textEnter, fontSize: 72, fontWeight: 800, color: "white", letterSpacing: -4, fontFamily: FONT }}>FIXA</div>
      <div style={{ marginTop: 8, opacity: textEnter, fontSize: 18, color: "#78716c", fontFamily: FONT, letterSpacing: 4, textTransform: "uppercase" }}>El partner del taller pequeño</div>
    </AbsoluteFill>
  );
}

// ─── Main Composition ────────────────────────────────────

export const FixaDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      <TransitionSeries>
        {/* 1. Hook (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0a00 0%, #050505 65%)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 80px",
          }}>
            <div style={{ width: 50, height: 3, borderRadius: 2, background: "linear-gradient(90deg, transparent, #f97316, transparent)", marginBottom: 28 }} />
            <ShimmerText text="Pierdes 2 horas al día" size={68} shimmerColor="#fbbf24" />
            <ShimmerText text="respondiendo '¿está listo?'" size={68} color="#f97316" shimmerColor="#fff" delay={8} />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 2. Logo (2s) */}
        <TransitionSeries.Sequence durationInFrames={2 * fps}>
          <LogoReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 3. Typing matrícula (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <TypingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 4. Panel del día — phone mockup con scroll (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <PhoneMockup src="dashboard.png" scrollPct={15} label="Tu día resuelto al abrir." sub="Citas · Entregas · Presupuestos pendientes" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 5. Órdenes (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <PhoneMockup src="ordenes.png" scrollPct={10} label="Cada coche, controlado." sub="Estado, matrícula, mecánico — de un vistazo" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 6. Clientes (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <PhoneMockup src="clientes.png" scrollPct={8} label="El cliente no te llama." sub="Ve su coche online · Acepta el presupuesto desde el sofá" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 7. Calendario (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <PhoneMockup src="calendario.png" scrollPct={5} label="La agenda que se llena sola." sub="Citas online + avisos ITV automáticos" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 8. Precio (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, #1a0800 0%, #050505 65%)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          }}>
            <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.12)" }} />
            <FadeIn><div style={{ fontSize: 22, color: "#78716c", fontFamily: FONT }}>Menos que un cambio de aceite</div></FadeIn>
            <ShimmerText text="29€/mes" size={120} color="#f97316" shimmerColor="#fbbf24" delay={6} />
            <FadeIn delay={14}>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {["Sin tarjeta", "Sin permanencia", "14 días gratis"].map((t) => (
                  <div key={t} style={{ padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.06)", fontSize: 13, color: "#f97316", fontWeight: 600, fontFamily: FONT }}>
                    {t}
                  </div>
                ))}
              </div>
            </FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 9. CTA final (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <AbsoluteFill style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,115,22,0.1) 0%, #050505 60%)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          }}>
            <ShimmerText text="14 días gratis." size={68} shimmerColor="#fbbf24" />
            <ShimmerText text="Sin tarjeta. Sin excusas." size={68} color="#f97316" shimmerColor="#fff" delay={8} />

            <FadeIn delay={14}>
              <div style={{ marginTop: 36, padding: "20px 56px", borderRadius: 999, background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", fontSize: 28, fontWeight: 800, fontFamily: FONT, boxShadow: "0 20px 60px rgba(249,115,22,0.5)", letterSpacing: 1 }}>
                fixataller.es
              </div>
            </FadeIn>

            <FadeIn delay={22}>
              <div style={{ fontSize: 16, color: "#525252", fontFamily: FONT, marginTop: 16 }}>El partner del taller pequeño.</div>
            </FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
