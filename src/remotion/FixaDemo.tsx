import {
  AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig,
  spring, staticFile,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const FONT = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

/* ─── Helpers ─────────────────────────────────────────── */

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

/* ─── Zoomed crop: text grande a la izq + trozo de captura a la dcha ─── */

function StoryScene({ title, subtitle, src, cropX, cropY, cropW, cropH, imgW = 2500, flip = false }: {
  title: string; subtitle: string; src: string;
  cropX: number; cropY: number; cropW: number; cropH: number;
  imgW?: number; flip?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20 } });
  const imgEnter = spring({ frame: frame - 6, fps, config: { damping: 22 } });
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], { extrapolateRight: "clamp" });
  const scale = imgW / cropW;

  return (
    <AbsoluteFill style={{ background: "#0c0a09", display: "flex", flexDirection: flip ? "row-reverse" : "row", alignItems: "center", padding: "0 80px" }}>
      <div style={{ position: "absolute", [flip ? "left" : "right"]: "10%", top: "20%", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
      {/* TEXT */}
      <div style={{ flex: 1, opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`, padding: flip ? "0 0 0 60px" : "0 60px 0 0" }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: "#fff", fontFamily: FONT, letterSpacing: -2, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontSize: 22, color: "#78716c", fontFamily: FONT, marginTop: 16, lineHeight: 1.5 }}>{subtitle}</div>
      </div>
      {/* CROPPED IMAGE */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: imgEnter, transform: `translateY(${interpolate(imgEnter, [0, 1], [20, 0])}px)` }}>
        <div style={{ width: 800, height: 550, borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)" }}>
          <div style={{ transform: `scale(${scale * zoom})`, transformOrigin: `${cropX + cropW / 2}px ${cropY + cropH / 2}px` }}>
            <Img src={staticFile(`demo/screenshots/${src}`)} style={{ width: imgW, display: "block" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ─── Logo ─────────────────────────────────────────────── */

function LogoReveal() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({ frame, fps, config: { damping: 10, stiffness: 40 } });
  const textEnter = spring({ frame: frame - 10, fps, config: { damping: 20 } });
  const glow = interpolate(frame, [0, 30, 60], [0, 500, 350], { extrapolateRight: "clamp" });
  const glowO = interpolate(frame, [0, 15, 60], [0, 0.7, 0.3], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, #1a0800 0%, #050505 70%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: glow, height: glow, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.5) 0%, transparent 70%)", opacity: glowO, filter: "blur(40px)" }} />
      <div style={{ transform: `scale(${pulse})` }}>
        <svg width="110" height="110" viewBox="0 0 40 40"><defs><linearGradient id="vg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" /></linearGradient></defs><path d="M20 4l13 7.5v17L20 36 7 28.5v-17L20 4z" fill="url(#vg)" stroke="url(#vg)" strokeWidth="5" strokeLinejoin="round" /><path d="M20 1.6l15.5 9-15.5 9-15.5-9 15.5-9z" fill="white" fillOpacity="0.12" /><path d="M14.5 11h11.5v4h-7v4h6v4h-6v6h-4.5V11z" fill="white" /></svg>
      </div>
      <div style={{ marginTop: 24, opacity: textEnter, fontSize: 72, fontWeight: 800, color: "white", letterSpacing: -4, fontFamily: FONT }}>FIXA</div>
    </AbsoluteFill>
  );
}

/* ─── MAIN — el relato comercial ──────────────────────── */
/*
  Estructura narrativa:
  1. El problema (el mecánico se identifica)
  2. La solución llega (logo FIXA)
  3. Escena 1: el día empieza bien (panel)
  4. Escena 2: la orden vuela (órdenes)
  5. Escena 3: el cliente no molesta (clientes)
  6. Escena 4: la agenda funciona (calendario)
  7. El precio que no duele
  8. El cierre que empuja
*/

export const FixaDemo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0a09" }}>
      <Audio src={staticFile("demo/bg-music-30s.mp3")} volume={0.35} />
      <TransitionSeries>

        {/* 1. EL PROBLEMA — "¿Te suena?" (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, #1a0a00 0%, #0c0a09 65%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 100px", gap: 8 }}>
            <BigText text="20 llamadas al día." delay={0} size={64} />
            <BigText text="Presupuestos a las 9 de la noche." delay={6} size={64} color="#a8a29e" />
            <BigText text="ITVs que se te escapan." delay={12} size={64} color="#78716c" />
            <FadeIn delay={20}><div style={{ marginTop: 20, fontSize: 24, color: "#f97316", fontWeight: 700, fontFamily: FONT }}>¿Te suena?</div></FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 2. LA SOLUCIÓN — Logo FIXA (1.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(1.5 * fps)}>
          <LogoReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 3. ESCENA: Abres FIXA y sabes qué hacer (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <StoryScene
            title="Abres FIXA y tu día está resuelto."
            subtitle="Qué entregar, a quién cobrar, qué presupuestos esperan respuesta."
            src="dashboard.png" cropX={430} cropY={130} cropW={800} cropH={550} imgW={2410}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 4. ESCENA: La orden en 10 seg (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <StoryScene
            title="Matrícula y la orden está creada."
            subtitle="10 segundos. Sin formularios. Legal según RD 1457/1986."
            src="ordenes.png" cropX={380} cropY={80} cropW={900} cropH={620} imgW={2668}
            flip
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 5. ESCENA: El cliente no llama (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <StoryScene
            title="Tu cliente deja de llamarte."
            subtitle="Ve el estado de su coche online. El presupuesto se acepta desde el sofá."
            src="clientes.png" cropX={350} cropY={60} cropW={850} cropH={580} imgW={2590}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 6. ESCENA: La agenda (2.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(2.5 * fps)}>
          <StoryScene
            title="Las citas se organizan solas."
            subtitle="El cliente pide cita online. Tú ves la agenda antes de abrir."
            src="calendario.png" cropX={350} cropY={60} cropW={900} cropH={620} imgW={2636}
            flip
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        {/* 7. EL PRECIO (3s) */}
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, #1a0800 0%, #0c0a09 65%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <FadeIn><div style={{ fontSize: 26, color: "#78716c", fontFamily: FONT }}>Menos que un cambio de aceite</div></FadeIn>
            <BigText text="29€/mes" size={130} color="#f97316" delay={6} />
            <FadeIn delay={14}>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {["Sin tarjeta", "Sin permanencia", "14 días gratis"].map((t) => (
                  <div key={t} style={{ padding: "8px 18px", borderRadius: 999, border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.06)", fontSize: 15, color: "#f97316", fontWeight: 600, fontFamily: FONT }}>{t}</div>
                ))}
              </div>
            </FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        {/* 8. CIERRE (3.5s) */}
        <TransitionSeries.Sequence durationInFrames={Math.round(3.5 * fps)}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,115,22,0.08) 0%, #0c0a09 60%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <BigText text="Pruébalo gratis." size={76} delay={0} />
            <BigText text="Sin excusas." size={76} color="#f97316" delay={8} />
            <FadeIn delay={16}>
              <div style={{ marginTop: 40, padding: "22px 60px", borderRadius: 999, background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", fontSize: 30, fontWeight: 800, fontFamily: FONT, boxShadow: "0 20px 60px rgba(249,115,22,0.5)" }}>fixataller.es</div>
            </FadeIn>
            <FadeIn delay={22}><div style={{ fontSize: 18, color: "#525252", fontFamily: FONT, marginTop: 20 }}>Hecho por mecánicos. Para mecánicos.</div></FadeIn>
          </AbsoluteFill>
        </TransitionSeries.Sequence>

      </TransitionSeries>
    </AbsoluteFill>
  );
};
