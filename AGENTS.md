<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agentes disponibles

### Director de Marketing
Instrucciones completas en `.claude/agents/DIRECTOR-MARKETING.md`. Es el agente principal de marketing: planifica Y ejecuta. Tiene un plan de 12 semanas en 3 fases (SEO → Distribución → Conversión). Lee MARKETING.md para el tono y las reglas de copy.

### Marketing Digital (referencia de copy)
Instrucciones de tono en `.claude/agents/MARKETING.md`. Buyer persona, tono Isra Bravo, keywords target, formatos de contenido, competidores y métricas. Todo agente que escriba texto público debe leer este archivo.

### Skills de SEO instaladas
- `@TheCraigHewitt/seomachine` — artículos SEO de largo formato con investigación de keywords
- `@citedy/citedy-seo-agent` — automatización de contenido, scouting de tendencias, análisis de competidores
- `@aaron-he-zhu/seo-geo-claude-skills` — 20 sub-skills de SEO: keyword research, auditorías, rank tracking, E-E-A-T
