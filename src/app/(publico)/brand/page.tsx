import type { Metadata } from "next";
import { SafetyStripe, HexPattern } from "@/components/ui/brand-texture";

export const metadata: Metadata = {
  title: "Exploración de marca — interno",
  robots: { index: false, follow: false },
};

/**
 * PÁGINA INTERNA (noindex): exploración de logo y marca para decidir la evolución visual.
 * Candidatos A-D mostrados en tamaños reales y sobre claro/oscuro.
 */

function LogoA({ size = 64 }: { size?: number }) {
  // ACTUAL: F + X-llave en cuadrado redondeado
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#ga)" />
      <path d="M11 10h7.5v3h-4v3.5h3.5v3h-3.5v5h-3.5V10z" fill="white" fillOpacity="0.95" />
      <path d="M21 10l3.2 5.5L21 21l2 1.2 3.2-5.5 3.2 5.5 2-1.2-3.2-5.5L31.4 10h-3.6l-1.6 2.8L24.6 10H21z" fill="white" fillOpacity="0.95" />
      <path d="M23.2 24.5l-2.2 3.8v0c-.3.5-.1 1.1.4 1.4l1.7 1c.5.3 1.1.1 1.4-.4l2.2-3.8-1.8-1-1.7-1z" fill="white" fillOpacity="0.9" />
      <path d="M28.8 24.5l2.2 3.8c.3.5.1 1.1-.4 1.4l-1.7 1c-.5.3-1.1.1-1.4-.4l-2.2-3.8 1.8-1 1.7-1z" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function LogoB({ size = 64 }: { size?: number }) {
  // LA TUERCA: hexágono naranja + F rotunda. Máxima legibilidad a 16px.
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="gb" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path d="M20 1.5l15.6 9v19L20 38.5l-15.6-9v-19L20 1.5z" fill="url(#gb)" />
      <path d="M14.5 11h11.5v4h-7v4h6v4h-6v6h-4.5V11z" fill="white" />
    </svg>
  );
}

function LogoC({ size = 64 }: { size?: number }) {
  // LA LLAVE: cuadrado redondeado, F cuyo brazo central es una llave fija
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="gc" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#gc)" />
      {/* F sin brazo central */}
      <path d="M11 8h13v4.5h-8.5V32H11V8z" fill="white" />
      {/* brazo central = llave fija horizontal */}
      <path d="M15.5 18.5h9.2a3.6 3.6 0 013.3-2.2c.5 0 1 .1 1.4.3l-2.1 2.1 2.5 2.5 2.1-2.1c.2.4.3.9.3 1.4a3.6 3.6 0 01-6 2.7l-1.5.3h-9.2v-5z" fill="white" />
    </svg>
  );
}

function LogoD({ size = 64 }: { size?: number }) {
  // EL GATO: cuadrado redondeado con F y muesca hexagonal (tuerca) integrada en la F
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="gd" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#gd)" />
      <path d="M12 8h16v5h-11v5h9v5h-9v9h-5V8z" fill="white" />
      {/* tuerca en la esquina */}
      <path d="M28.5 24.5l4.3 2.5v5l-4.3 2.5-4.3-2.5v-5l4.3-2.5z" fill="white" fillOpacity="0.95" />
      <circle cx="28.5" cy="29.5" r="1.8" fill="#ea580c" />
    </svg>
  );
}

const candidatos = [
  { id: "A", nombre: "Actual — F + X llave", desc: "El que tenemos. La X-llave es original pero se embarra a tamaños pequeños.", Logo: LogoA },
  { id: "B", nombre: "La Tuerca", desc: "Hexágono (tuerca) + F rotunda. Legible hasta en 16px, conecta con el patrón de marca, silueta única en el dock.", Logo: LogoB },
  { id: "C", nombre: "La Llave", desc: "La F con el brazo central convertido en llave fija. Concepto fino: la herramienta DENTRO de la marca.", Logo: LogoC },
  { id: "D", nombre: "F + Tuerca", desc: "F protagonista con una tuerca como detalle. Equilibrio entre limpieza y guiño al oficio.", Logo: LogoD },
];

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-stone-100 py-12 px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Exploración de marca FIXA</h1>
          <p className="text-stone-500 mt-1">Página interna (no indexada). Elige candidato y lo despliego en toda la marca: web, app, PWA, OG, favicon y PDFs.</p>
        </div>

        {candidatos.map(({ id, nombre, desc, Logo }) => (
          <div key={id} className="rounded-2xl bg-white border border-stone-200 p-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-2xl font-extrabold text-orange-600">{id}</span>
              <h2 className="text-lg font-bold">{nombre}</h2>
            </div>
            <p className="text-sm text-stone-500 mb-6">{desc}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sobre claro */}
              <div className="rounded-xl border border-stone-200 p-6 flex items-end gap-6 bg-[#faf9f7]">
                <div className="text-center"><Logo size={64} /><p className="text-[10px] text-stone-400 mt-1">64</p></div>
                <div className="text-center"><Logo size={40} /><p className="text-[10px] text-stone-400 mt-1">40</p></div>
                <div className="text-center"><Logo size={24} /><p className="text-[10px] text-stone-400 mt-1">24</p></div>
                <div className="text-center"><Logo size={16} /><p className="text-[10px] text-stone-400 mt-1">16 (favicon)</p></div>
                <div className="flex items-center gap-2 ml-auto">
                  <Logo size={32} />
                  <span className="text-xl font-extrabold tracking-tight text-stone-900">FIXA</span>
                </div>
              </div>
              {/* Sobre oscuro */}
              <div className="rounded-xl bg-stone-950 p-6 flex items-end gap-6">
                <div className="text-center"><Logo size={64} /></div>
                <div className="text-center"><Logo size={24} /></div>
                <div className="flex items-center gap-2 ml-auto">
                  <Logo size={32} />
                  <span className="text-xl font-extrabold tracking-tight text-white">FIXA</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Brand board */}
        <div className="rounded-2xl bg-white border border-stone-200 p-6 relative overflow-hidden">
          <HexPattern opacity={0.03} />
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-4">Sistema de marca (ya en producción)</h2>
            <div className="flex flex-wrap gap-3 mb-5">
              {[
                { c: "#f97316", n: "Naranja seguridad" },
                { c: "#ea580c", n: "Naranja motor" },
                { c: "#1c1917", n: "Negro neumático" },
                { c: "#faf9f7", n: "Hueso (fondo)" },
                { c: "#44403c", n: "Gris herramienta" },
              ].map((x) => (
                <div key={x.c} className="text-center">
                  <div className="h-14 w-14 rounded-xl border border-stone-200" style={{ background: x.c }} />
                  <p className="text-[10px] text-stone-500 mt-1">{x.n}<br />{x.c}</p>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Franja de seguridad</p>
            <SafetyStripe className="rounded-full max-w-xs mb-5" />
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Tipografía</p>
            <p className="text-2xl font-extrabold tracking-tight">Geist — titulares extrabold, tracking apretado</p>
            <p className="text-sm text-stone-500">Cuerpo regular, cercano, sin jerga. &ldquo;Si sabes usar WhatsApp, sabes usar FIXA.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
