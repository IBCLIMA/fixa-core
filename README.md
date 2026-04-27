# FIXA CORE — Herramienta digital para talleres mecánicos

Prepara mensajes de WhatsApp para tus clientes en segundos y organiza citas sin llamadas.

## Qué problema resuelve

En un taller mecánico el teléfono suena constantemente. Los clientes llaman para preguntar si su coche está listo, para pedir cita, para saber cuándo les toca revisión. Cada llamada interrumpe el trabajo.

FIXA permite al taller preparar respuestas de WhatsApp con un solo toque, sin escribir mensajes, sin llamar, sin perder tiempo.

## Qué hace esta versión (v0.2)

- **Clientes**: añadir, editar y eliminar clientes (nombre, teléfono, vehículo). Datos guardados en el navegador.
- **Acciones rápidas**: botones de "Coche listo", "Presupuesto listo", "Pide cita" y "Toca revisión" que abren WhatsApp con un mensaje pre-escrito.
- **Citas**: crear citas con cliente, fecha, hora y motivo. Ver citas de hoy y próximas.
- **Mensajes personalizados**: elegir cliente, seleccionar plantilla o escribir mensaje libre, y abrir WhatsApp con el texto listo.
- **Registro de actividad**: lista de los últimos mensajes preparados con fecha y hora. Solo registra que se preparó el mensaje, no si se envió finalmente.

## Qué NO hace

- No envía mensajes automáticamente. Abre WhatsApp con el mensaje escrito; el usuario pulsa enviar.
- No tiene backend ni base de datos en la nube. Los datos se guardan solo en el navegador del dispositivo (localStorage).
- No tiene login ni multiusuario. Es una herramienta para un solo dispositivo.
- No tiene facturación, órdenes de trabajo ni gestión de stock.
- No tiene integración con DGT, proveedores ni aseguradoras.

## Limitaciones actuales

- Si se borran los datos del navegador, se pierden los clientes y citas.
- Los datos no se sincronizan entre dispositivos.
- El registro de mensajes solo indica que se preparó, no que se envió.
- Las plantillas son fijas (no se pueden personalizar desde la app).

## Cómo probarlo en un taller

1. Abrir en el móvil: https://solcraft-rho.vercel.app/app/hoy
2. Ir a "Clientes" y añadir 5 clientes reales con nombre, teléfono (con prefijo 34) y vehículo.
3. Volver a "Hoy" y pulsar una acción rápida (ej: "Coche listo") para probar el flujo.
4. Crear una cita para hoy desde "Hoy" > "Nueva cita".
5. Ir a "Mensajes" para enviar un mensaje personalizado.

## Stack

- Next.js 16, TypeScript, Tailwind CSS
- shadcn/ui
- localStorage
- Vercel
- WhatsApp vía wa.me

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000
