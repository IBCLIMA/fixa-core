import {
  AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig,
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

function LaptopMockup({ src, label, sub }: {
  src: string; label: string; sub: string;
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 60 } });
  const rotateX = interpolate(enter, [0, 1], [12, 2]);
  const translateZ = interpolate(enter, [0, 1], [-200, 0]);
  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const kbScale = interpolate(frame, [0, durationInFrames], [1, 1.06], { extrapolateRight: "clamp" });
  const labelEnter = spring({ frame: frame - 12, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse 80% 60% at 50% 40%, #1c1917 0%, #0c0a09 70%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      perspective: 1200,
    }}>
      {/* Glow naranja */}
      <div style={{
        position: "absolute", width: 600, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
        filter: "blur(80px)", top: "20%",
      }} />

      <div style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scale})`,
        transformStyle: "preserve-3d", width: "85%", maxWidth: 1500,
      }}>
        {/* Laptop bezel */}
        <div style={{
          background: "linear-gradient(180deg, #292524 0%, #1c1917 100%)",
          borderRadius: "14px 14px 0 0", padding: "10px 16px 0",
          boxShadow: "0 -2px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px", marginBottom: 2 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ height: 26, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", minWidth: 220 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "ui-monospace, monospace" }}>fixataller.es</span>
              </div>
            </div>
          </div>
          <div style={{ overflow: "hidden", borderRadius: "0 0 4px 4px" }}>
            <div style={{ transform: `scale(${kbScale})`, transformOrigin: "center top" }}>
              <Img src={staticFile(`demo/screenshots/${src}`)} style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>
        <div style={{
          height: 14, background: "linear-gradient(180deg, #1c1917 0%, #0f0f12 100%)",
          borderRadius: "0 0 14px 14px", boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}>
          <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", margin: "5px auto 0" }} />
        </div>
      </div>

      {/* Label */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%",
        transform: `translateX(-50%) translateY(${interpolate(labelEnter, [0, 1], [20, 0])}px)`,
        opacity: labelEnter,
        background: "rgba(12,10,9,0.85)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "16px 32px",
        display: "flex", flexDirection: "column", alignItems: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: FONT, letterSpacing: -1 }}>{label}</div>
        <div style={{ fontSize: 16, color: "#78716c", fontFamily: FONT, marginTop: 4 }}>{sub}</div>
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
      <Audio src={staticFile("demo/bg-music-30s.mp3")} volume={0.35} />
      <TransitionSeries>
        {/* 1. Hook (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0a00 0%, #050505 65%)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 80px",
          }}>
            <div style={{ width: 50, height: 3, borderRadius: 2, background: "linear-gradient(90deg, transparent, #f97316, transparent)", marginBottom: 28 }} />
            <ShimmerText text="Tu taller. Tu móvil." size={72} shimmerColor="#fbbf24" />
            <ShimmerText text="Todo controlado." size={72} color="#f97316" shimmerColor="#fff" delay={8} />
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
          <LaptopMockup src="dashboard.png" label="Tu día resuelto al abrir." sub="Citas · Entregas · Presupuestos pendientes" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 5. Órdenes (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <LaptopMockup src="ordenes.png" label="Cada coche, controlado." sub="Estado, matrícula, mecánico — de un vistazo" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 6. Clientes (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <LaptopMockup src="clientes.png" label="El cliente no te llama." sub="Ve su coche online · Acepta el presupuesto desde el sofá" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 7. Calendario (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <LaptopMockup src="calendario.png" label="La agenda que se llena sola." sub="Citas online + avisos ITV automáticos" />
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
