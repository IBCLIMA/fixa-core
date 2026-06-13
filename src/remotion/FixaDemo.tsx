import {
  AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig,
  spring, staticFile, Sequence, Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";

const FONT = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

// ─── Shimmer Text ────────────────────────────────────────

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
      opacity: enter,
      filter: `blur(${blur}px)`,
      transform: `translateY(${y}px)`,
      fontSize: size,
      fontWeight: 800,
      fontFamily: FONT,
      letterSpacing: -3,
      lineHeight: 1.05,
      textAlign: "center",
      backgroundImage: `linear-gradient(90deg, ${color} 0%, ${color} 40%, ${shimmerColor} 50%, ${color} 60%, ${color} 100%)`,
      backgroundSize: "200% 100%",
      backgroundPosition: `${shimmerPos}% center`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {text}
    </div>
  );
}

function FadeText({ text, size = 22, delay = 0, color = "#78716c", children }: {
  text: string; size?: number; delay?: number; color?: string; children?: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 25 } });
  return (
    <div style={{ opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`, fontSize: size, color, fontFamily: FONT, textAlign: "center", fontWeight: 500 }}>
      {children || text}
    </div>
  );
}

// ─── 3D Device Mockup ────────────────────────────────────

function DeviceScene({ src, label, description, zoomDirection = "center" }: {
  src: string; label: string; description: string; zoomDirection?: "center" | "left" | "right";
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 3D perspective entrance
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 60 } });
  const rotateX = interpolate(enter, [0, 1], [15, 2]);
  const rotateY = interpolate(enter, [0, 1], [zoomDirection === "left" ? -8 : zoomDirection === "right" ? 8 : 0, 0]);
  const translateZ = interpolate(enter, [0, 1], [-200, 0]);
  const scale = interpolate(enter, [0, 1], [0.85, 1]);

  // Slow Ken Burns
  const kbScale = interpolate(frame, [0, durationInFrames], [1, 1.08], { extrapolateRight: "clamp" });

  // Label
  const labelEnter = spring({ frame: frame - 12, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse 80% 60% at 50% 40%, #111 0%, #050505 70%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      perspective: 1200,
    }}>
      {/* Ambient particles */}
      {[...Array(6)].map((_, i) => {
        const x = 15 + (i * 67 + 23) % 70;
        const y = 10 + (i * 43 + 17) % 70;
        const delay = i * 0.5;
        const particleOpacity = interpolate(frame, [delay * fps, delay * fps + 30], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            width: 4, height: 4, borderRadius: "50%",
            background: "#f97316", opacity: particleOpacity,
            filter: "blur(1px)",
            transform: `translateY(${Math.sin((frame + i * 20) / 30) * 15}px)`,
          }} />
        );
      })}

      {/* 3D Device */}
      <div style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
        transformStyle: "preserve-3d",
        width: "82%", maxWidth: 1500,
      }}>
        {/* Laptop top bezel */}
        <div style={{
          background: "linear-gradient(180deg, #2a2a2e 0%, #1a1a1e 100%)",
          borderRadius: "14px 14px 0 0",
          padding: "10px 16px 0",
          boxShadow: "0 -2px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          {/* Browser chrome */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px", marginBottom: 2 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.9 }} />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ height: 26, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", minWidth: 240 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "ui-monospace, monospace" }}>fixataller.es</span>
              </div>
            </div>
          </div>

          {/* Screenshot */}
          <div style={{ overflow: "hidden", borderRadius: "0 0 4px 4px" }}>
            <div style={{ transform: `scale(${kbScale})`, transformOrigin: "center center" }}>
              <Img src={staticFile(`demo/screenshots/${src}`)} style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>

        {/* Laptop bottom (keyboard hint) */}
        <div style={{
          height: 14, background: "linear-gradient(180deg, #1a1a1e 0%, #0f0f12 100%)",
          borderRadius: "0 0 14px 14px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}>
          <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", margin: "5px auto 0" }} />
        </div>
      </div>

      {/* Floating label card */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: `translateX(-50%) translateY(${interpolate(labelEnter, [0, 1], [20, 0])}px)`,
        opacity: labelEnter,
        background: "rgba(12,10,9,0.85)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "16px 32px",
        display: "flex", flexDirection: "column", alignItems: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: FONT, letterSpacing: -1 }}>{label}</div>
        <div style={{ fontSize: 16, color: "#78716c", fontFamily: FONT, marginTop: 4 }}>{description}</div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Logo Reveal with Glow ───────────────────────────────

function LogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({ frame, fps, config: { damping: 10, stiffness: 40 } });
  const textEnter = spring({ frame: frame - 10, fps, config: { damping: 20 } });
  const glowSize = interpolate(frame, [0, 30, 60], [0, 500, 350], { extrapolateRight: "clamp" });
  const glowOpacity = interpolate(frame, [0, 15, 60], [0, 0.7, 0.3], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, #1a0800 0%, #050505 70%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      {/* Expanding glow ring */}
      <div style={{ position: "absolute", width: glowSize, height: glowSize, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)", opacity: glowOpacity, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", width: glowSize * 0.6, height: glowSize * 0.6, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.2)", opacity: glowOpacity }} />

      {/* Tuerca mecanizada B3 */}
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
      <div style={{ marginTop: 8, opacity: textEnter, fontSize: 20, color: "#78716c", fontFamily: FONT, letterSpacing: 2, textTransform: "uppercase" }}>Gestión de taller</div>
    </AbsoluteFill>
  );
}

// ─── Main Composition ────────────────────────────────────

export const FixaDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      <Audio src={staticFile("demo/bg-music-30s.mp3")} volume={0.4} />

      <TransitionSeries>
        {/* Scene 1: Hook (3s) */}
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

        {/* Scene 2: Pain (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <AbsoluteFill style={{
            background: "radial-gradient(ellipse 50% 50% at 30% 50%, rgba(239,68,68,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 70% 50%, rgba(245,158,11,0.04) 0%, transparent 60%), #050505",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20, padding: "0 80px",
          }}>
            <FadeText text="EL PROBLEMA" size={13} color="#ef4444" delay={0} />
            <ShimmerText text="20 llamadas al día para nada." size={56} color="#ef4444" shimmerColor="#fca5a5" delay={4} />
            <ShimmerText text="5 ITVs al mes que pierdes." size={56} color="#f59e0b" shimmerColor="#fde68a" delay={10} />
            <ShimmerText text="Presupuestos a las 9 de la noche." size={56} color="#525252" shimmerColor="#a8a29e" delay={16} />
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 10 })} />

        {/* Scene 3: Logo (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <LogoReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* Scene 4: Dashboard 3D (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <DeviceScene src="dashboard.png" label="Abres FIXA y tienes el día resuelto." description="Qué entra · Qué entregar · Quién no ha pagado" zoomDirection="center" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 8 })} />

        {/* Scene 5: Orders 3D (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <DeviceScene src="ordenes.png" label="Matrícula y en 10 segundos, hecho." description="Sin formularios de 20 campos · Legal según RD 1457/1986" zoomDirection="left" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={linearTiming({ durationInFrames: 8 })} />

        {/* Scene 6: Clients 3D (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <DeviceScene src="clientes.png" label="El cliente mira su coche solo." description="Un enlace y deja de llamarte · Presupuesto que acepta online" zoomDirection="right" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* Scene 7: Calendar 3D (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <DeviceScene src="calendario.png" label="La agenda que se llena sola." description="Citas online del cliente + avisos ITV automáticos" zoomDirection="center" />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: 10 })} />

        {/* Scene 8: Price (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, #1a0800 0%, #050505 65%)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8,
          }}>
            {/* Glow rings */}
            <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.12)" }} />
            <div style={{ position: "absolute", width: 550, height: 550, borderRadius: "50%", border: "1px solid rgba(249,115,22,0.06)" }} />

            <FadeText text="Menos que un cambio de aceite" size={24} />
            <ShimmerText text="29€/mes" size={120} color="#f97316" shimmerColor="#fbbf24" delay={6} />
            <FadeText text="" delay={14} size={1}>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {["Sin permanencia", "Sin sorpresas", "Setup gratuito"].map((t) => (
                  <div key={t} style={{ padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.06)", fontSize: 13, color: "#f97316", fontWeight: 600, fontFamily: FONT }}>
                    {t}
                  </div>
                ))}
              </div>
            </FadeText>
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* Scene 9: CTA (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <AbsoluteFill style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,115,22,0.1) 0%, #050505 60%)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          }}>
            {/* Particles */}
            {[...Array(12)].map((_, i) => {
              const x = 10 + (i * 47 + 13) % 80;
              const y = 10 + (i * 31 + 7) % 80;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${x}%`, top: `${y}%`,
                  width: 3, height: 3, borderRadius: "50%", background: "#f97316",
                  opacity: 0.12, filter: "blur(1px)",
                }} />
              );
            })}

            <ShimmerText text="14 días gratis." size={68} shimmerColor="#fbbf24" />
            <ShimmerText text="Sin tarjeta. Sin excusas." size={68} color="#f97316" shimmerColor="#fff" delay={8} />

            <FadeText text="" delay={14} size={1}>
              <div style={{ marginTop: 36, padding: "20px 56px", borderRadius: 999, background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", fontSize: 28, fontWeight: 800, fontFamily: FONT, boxShadow: "0 20px 60px rgba(249,115,22,0.5)", letterSpacing: 1 }}>
                fixataller.es
              </div>
            </FadeText>

            <FadeText text="El partner del taller pequeño." delay={22} size={16} color="#525252" />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
