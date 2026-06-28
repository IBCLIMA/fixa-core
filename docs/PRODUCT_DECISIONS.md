# FIXA — Registro de Decisiones de Producto

> Cada decisión importante se anota aquí, con fecha y motivo. Las decisiones se pueden
> revertir, pero solo de forma explícita y documentada. Formato: una entrada por decisión.

---

## DECISION-001 · Posicionamiento: ni ERP ni "torre de control" comercial
**Fecha:** 2026-06-28 · **Estado:** vigente

FIXA **no** se posiciona como ERP, "software de gestión", "programa completo" ni "torre de
control" en el mensaje público. Internamente el concepto "torre de control" puede seguir en
el código y la arquitectura. El mensaje comercial se centra en **evitar el caos, recuperar
dinero y no depender de la memoria del gerente**.

**Por qué:** "torre de control" suena bien pero no vende; nadie compra una torre de control,
compra dejar de apagar fuegos. "Software de gestión / ERP" nos mete en una categoría saturada
donde competimos contra incumbentes más grandes y por features.

---

## DECISION-002 · La home es un asistente, no un dashboard
**Fecha:** 2026-06-28 · **Estado:** vigente

La pantalla principal de la app prioriza **acciones recomendadas** ("hoy no dejes escapar
esto"), no métricas decorativas. Las cifras operativas existen, pero **demotadas** debajo. El
producto **piensa** ("3 órdenes necesitan tu atención"), no muestra ("tienes 17 órdenes").

**Por qué:** el gerente no necesita más datos; necesita saber dónde poner su atención. El
hábito se crea con decisiones, no con paneles. Matiz técnico: el asistente debe ser
**conservador y correcto antes que listo** — una priorización equivocada destruye la confianza
más rápido de lo que la construye.

---

## DECISION-003 · La IA, solo cuando aporta de verdad
**Fecha:** 2026-06-28 · **Estado:** vigente

La IA entra **solo** cuando elimina escritura, mejora la comunicación con el cliente o ayuda a
tomar una acción. Primera (y única en V1): **explicación técnica → mensaje claro para el
cliente**, con revisión humana antes de enviar. El motor de avisos se mantiene **determinista**
(reglas, no IA). Nada de chatbot autónomo ni "IA" como argumento de marketing.

**Por qué:** una torre de control "inteligente" sin nada de IA visible parece vieja; pero la IA
decorativa o un chatbot mediocre destruyen confianza. La explicación al cliente es la mejor
relación valor/coste/riesgo.

---

## DECISION-004 · Cobro por SEPA manual (sin pasarela por ahora)
**Fecha:** 2026-06-25 · **Estado:** vigente

El cobro de las suscripciones se hace por **recibo SEPA mensual domiciliado desde Ibañez
Clima**; los impagos se marcan a mano en el panel de admin. **No** se monta Stripe ni dunning
automático todavía.

**Por qué:** pre-ingresos, sin volumen que justifique una pasarela. Cuando haya tracción, se
revisa (integrar pasarela + self-service es trabajo conocido, no incógnita).

---

## DECISION-005 · Scope congelado hasta validar con pilotos
**Fecha:** 2026-06-28 · **Estado:** vigente

La V1 está cerrada. **No se añaden features nuevas** hasta tener 5 talleres piloto usándola y
métricas de comportamiento. Congelado explícitamente: stock/almacén, contabilidad, BI
financiero, chatbot WhatsApp autónomo, OCR de albaranes, más alertas, más dashboards. El único
trabajo permitido sin pilotos es **copy/microcopy/identidad y corrección de bugs**.

**Por qué:** el mayor riesgo ahora no es técnico; es usar el desarrollo como excusa para no
poner el producto delante de clientes reales. Tenemos suficiente producto. Toca validar el
hábito.

---

## Decisiones abiertas (pendientes de confirmación del fundador)

- **Marca del portal del cliente (white-label).** Actualmente el portal muestra la identidad
  del **taller** (logo/nombre) + "Powered by FIXA" en el pie. Se desplegó como hipótesis (mejor
  para el WOW del cliente), pero falta la confirmación explícita de Sergi: mantener white-label
  o volver a marca FIXA arriba (más difusión viral para FIXA). → **pendiente.**
