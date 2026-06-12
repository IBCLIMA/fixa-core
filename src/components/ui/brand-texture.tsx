/**
 * Firma visual de FIXA — elementos derivados del mundo taller:
 * - HexPattern: trama hexagonal sutil (la tuerca) como textura de fondo
 * - SafetyStripe: franja diagonal naranja (la cinta de señalización)
 * Usar con cuentagotas: son la firma, no el papel pintado.
 */

export function HexPattern({ className = "", opacity = 0.025 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%231c1917' stroke-width='2'/%3E%3Cpath d='M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34' fill='none' stroke='%231c1917' stroke-width='2'/%3E%3C/svg%3E")`,
        backgroundSize: "56px 100px",
      }}
    />
  );
}

export function SafetyStripe({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-1.5 w-full ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, #f97316 0 12px, transparent 12px 24px)",
      }}
    />
  );
}
