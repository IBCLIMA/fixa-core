# FIXA

**FIXA evita que al gerente de un taller se le escape lo importante.**

No es un programa de gestión. No es un ERP. No es "el software que lo hace todo".
FIXA es lo que hace que un taller **deje de depender de la memoria de una persona**.

---

## El problema que resolvemos (el enemigo: el caos)

Un taller no se descontrola por falta de trabajo. Se descontrola porque **todo depende de la
cabeza del gerente**: a quién llamar, qué presupuesto quedó pendiente, qué coche espera pieza,
a quién le caduca la ITV, qué cliente lleva dos días sin noticias.

Y cada olvido **cuesta dinero**:

- Presupuesto no perseguido → venta perdida.
- Coche parado / bloqueado por una pieza → menos rotación, dinero parado.
- Cliente sin noticias → llamadas constantes o una mala reseña.
- Revisión / ITV olvidada → cliente que se va a otro taller.
- Coche listo sin avisar → una plaza ocupada que necesitas.

## Qué hace FIXA

1. **Para el gerente** — cada mañana le dice las pocas cosas que de verdad necesitan su
   atención hoy, y **qué hacer** con cada una. No le muestra datos: le dice qué hacer.
2. **Para el cliente** — un seguimiento de su reparación **en tiempo real** (tipo Amazon):
   recibe un enlace, ve el estado de su coche y **deja de llamar** para preguntar.
3. **IA útil (una sola)** — convierte la jerga del mecánico en un mensaje claro para el
   cliente. El humano revisa y envía. Nada de chatbots ni humo.

## Qué NO es FIXA (y nunca será)

- **No es un ERP.** Nada de contabilidad, stock completo, nóminas, compras complejas,
  almacén ni BI financiero.
- **No es "el programa que lo hace todo".** Hacemos pocas cosas, y que muevan dinero o
  eviten un problema.
- **No es un sistema de registro.** No existimos para registrar lo que pasa; existimos para
  que no se escape lo importante.
- **No es un chatbot de WhatsApp autónomo.** La IA propone, el humano decide.
- **No competimos en funciones** contra Taller Manager, Quiter o GDTaller. Competimos contra
  el **caos** y contra el **cuaderno**.

## Principios de producto

1. **Regla de oro:** FIXA no existe para registrar; existe para que no se escape lo importante.
2. **Vendemos resultados** (control, tiempo, dinero recuperado), no funcionalidades.
3. **El producto piensa, no muestra:** "3 órdenes necesitan tu atención", no "tienes 17 órdenes".
4. **Lenguaje humano, no administrativo:** "este presupuesto se está enfriando", no "pendiente".
5. **El hábito es el producto:** si una función no hace que el gerente abra FIXA mañana, no es
   prioritaria. El objetivo no es tener muchas funciones; es crear un hábito difícil de sustituir.
6. **Cada decisión pasa el Filtro FIXA** (ver `docs/PRODUCT_BIBLE.md`). Si no, no se construye.

## Visión

El día que un gerente abra FIXA **automáticamente cada mañana** —antes que el WhatsApp y el
correo— habremos construido algo muy difícil de copiar.

## Estado y roadmap inmediato

La **V1 está construida y desplegada**: el asistente diario del gerente, el portal de
seguimiento del cliente y la IA de explicación. **El siguiente paso NO es más producto:** es
ponerlo delante de **5 talleres piloto** y medir **comportamiento** (¿abren FIXA cada mañana?
¿el cliente abre el portal? ¿se recuperan presupuestos?). El producto está **congelado** salvo
copy/microcopy hasta validar con pilotos.

Más detalle en [`docs/PRODUCT_BIBLE.md`](docs/PRODUCT_BIBLE.md) ·
decisiones en [`docs/PRODUCT_DECISIONS.md`](docs/PRODUCT_DECISIONS.md).

---

## Desarrollo

Next.js 16 · TypeScript · Tailwind v4 · Drizzle + Neon (Postgres) · Clerk · Vercel · PWA.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verificación antes de desplegar
```

Variables sensibles en `.env.local` (gitignored). Producción en Vercel.
