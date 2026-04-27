# FIXA CORE

Herramienta digital para talleres mecánicos. Menos llamadas, menos interrupciones, trabaja sin parar.

## Qué es

FIXA CORE es una app mobile-first que permite a un taller mecánico responder a sus clientes por WhatsApp en 1 clic, sin escribir mensajes, sin llamar, sin perder tiempo.

## Qué hace esta versión

- Lista de clientes con nombre, teléfono y vehículo
- Acciones rápidas: Coche listo, Presupuesto listo, Pide cita, Toca revisión
- Mensajes por WhatsApp pre-rellenados (wa.me)
- Gestión de citas (crear, ver hoy, ver próximas)
- Datos guardados en el navegador (localStorage)

## Qué NO hace todavía

- No tiene backend ni base de datos en la nube
- No tiene login ni multiusuario
- No envía WhatsApp automáticamente (abre WhatsApp con mensaje listo)
- No tiene facturación ni VeriFactu
- No tiene integración con DGT ni proveedores

## Cómo probarlo en tu taller

1. Abre la app en el móvil: https://solcraft-rho.vercel.app/app/hoy
2. Ve a "Clientes" y añade 5 clientes reales
3. Vuelve a "Hoy" y prueba las acciones rápidas
4. Crea una cita para hoy
5. Usa "Mensajes" para enviar un WhatsApp personalizado

## Stack

- Next.js 16 + TypeScript + Tailwind CSS
- shadcn/ui
- localStorage para persistencia
- Vercel para hosting
- WhatsApp vía wa.me (sin API)

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000
