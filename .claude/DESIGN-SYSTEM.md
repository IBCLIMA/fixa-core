# FIXA — Sistema de diseño "Warm Premium"

> Fuente de verdad visual. Todo cambio de UI cumple esto. Objetivo: 10/10 en UI/UX.
> Dirección elegida por el fundador: **Warm Premium** — identidad cálida + naranja actual,
> llevada a nivel Stripe/Linear mediante craft (tipografía, espaciado, profundidad, motion).
> NO es un rediseño desde cero: es elevar lo que hay y matar la deuda.

## Principios

1. **Cálido, no frío.** Fondo off-white cálido (`bg-background`), nunca blanco puro #fff salvo en cards (`bg-card`).
2. **Profundidad sutil.** Las cosas flotan con sombras cálidas en capas, no con bordes duros ni sombras negras.
3. **Naranja con intención.** El naranja es acento y acción, no decoración. Un CTA primario por vista.
4. **Aire.** Espaciado generoso y rítmico. Si dudas, más padding.
5. **Táctil.** App de taller usada en móvil con manos sucias: objetivos de toque ≥ 44px, feedback en cada acción.
6. **Coherencia > originalidad por sección.** Mismo patrón en todas partes.

## Tokens (definidos en `src/app/globals.css` — NO hardcodear)

### Color de marca — usa la rampa, NUNCA `orange-*`
`bg-brand-50 … bg-brand-950`, `text-brand-600`, `border-brand-200`, `ring-brand-500`, etc.
- Reemplaza TODO `orange-50/100/.../900` por `brand-50/100/.../900` (son visualmente equivalentes pero tokenizados).
- `bg-brand` / `text-brand` siguen existiendo (= brand-500) para usos simples.
- Acción primaria: `bg-primary text-primary-foreground` (el componente Button ya lo hace).

### Semánticos (shadcn) — úsalos siempre
`background, foreground, card, muted, muted-foreground, border, ring, primary, secondary, accent, destructive`.
Estados de órdenes: mapa en `src/lib/constants.ts` (no inventar colores nuevos por pantalla).

### Elevación (sombras cálidas)
`shadow-2xs, shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl`.
- Card en reposo: `shadow-sm`. Hover interactivo: `shadow-md` + `-translate-y-0.5` + `transition-all`.
- CTA principal con glow de marca: `shadow-brand` / `shadow-brand-lg` (sustituye a `shadow-orange-500/25`).
- NUNCA sombras negras puras hardcodeadas ni `shadow-2xl shadow-orange-500/...` a mano.

### Radio
Base `--radius` 0.625rem. Cards `rounded-2xl`, botones `rounded-lg`, pills/badges `rounded-full`. Mantener.

### Movimiento
`transition-all` + easing `var(--ease-out-soft)`. Hover 150–200ms. Entradas con `--animate-appear`.
Respetar `prefers-reduced-motion` (ya respetado en landing). Sin animaciones gratuitas.

### Tipografía
Geist (sans) ya cargada. Jerarquía:
- Display/hero: `text-4xl/5xl font-extrabold tracking-tight`.
- Título de página: `text-2xl font-bold tracking-tight`.
- Título de card: `font-semibold`.
- Body: `text-sm` (app) / `text-base` (web). Secundario: `text-muted-foreground`.
- Números/KPIs: `tabular-nums font-bold`.

## Primitivas (ya refinadas — reutilizar, no recrear)
`src/components/ui/*` (shadcn + Radix + CVA): Button, Card, Badge, Dialog, Input, Select, Table, Tabs, Sheet, etc.
- Button: variantes default/outline/secondary/ghost/destructive/link. Ya tiene hover + elevación.
- Card: ya tiene `shadow-sm` + ring fino. Para card clicable añadir hover (md + lift).
- Dialogs: patrón controlado `open` + `onClick` (el `DialogTrigger asChild` no abre — bug conocido).

## Reglas anti-Frankenstein (OBLIGATORIO)
- ❌ NO colores hex/rgb inline ni `style={{...}}` con color/gradiente → usar tokens/utilidades.
- ❌ NO `orange-*`, `stone-*` sueltos para marca → `brand-*` / semánticos.
- ❌ NO crear componentes nuevos si existe la primitiva.
- ✅ Extraer patrones repetidos (badges, feature cards, pricing cards) a componentes reutilizables.
- ✅ Mobile-first: probar mentalmente a 375px. Sin overflow horizontal.
- ✅ Estados: loading (skeleton), vacío (mensaje + acción), error. Nada de pantallas en blanco.

## Prioridades de impacto (orden de trabajo)
**App (mecánico):** detalle de orden (footer sticky de acciones en móvil) · facturación y configuración (densidad: tabs/secciones) · nueva orden/presupuesto (menos toques).
**Web (conversión):** `/vs/[slug]` y `/funciones/[slug]` (prosa pelada → hero visual + tabla comparativa) · `/nosotros` (más visual) · `/taller/[ciudad]` (valor local real).
