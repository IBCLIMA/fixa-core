// Sanitización básica de inputs para prevenir XSS
export function sanitize(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// Validar email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validar teléfono español
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return /^(\+34|34)?[6-9]\d{8}$/.test(cleaned);
}

// Validar NIF/CIF español
export function isValidNif(nif: string): boolean {
  return /^[0-9A-Z]{8,9}[A-Z0-9]$/i.test(nif.replace(/[-\s]/g, ""));
}

// Validar matrícula española
export function isValidMatricula(matricula: string): boolean {
  const cleaned = matricula.replace(/[\s-]/g, "").toUpperCase();
  // Formato nuevo: 0000 XXX
  if (/^\d{4}[A-Z]{3}$/.test(cleaned)) return true;
  // Formato antiguo: X-0000-XX
  if (/^[A-Z]{1,2}\d{4}[A-Z]{2}$/.test(cleaned)) return true;
  return false;
}

// Limpiar matrícula para normalizar
export function normalizarMatricula(matricula: string): string {
  return matricula.replace(/[\s-]/g, "").toUpperCase();
}

// Rate limit simple por IP (en memoria, para producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}
