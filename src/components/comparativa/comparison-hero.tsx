import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ComparisonHeroProps {
  /** Nombre del competidor (se muestra tras "FIXA vs"). */
  competitor: string;
  /** Subtítulo (normalmente la `description` de la comparativa). */
  subtitle: string;
}

/**
 * Hero de la página de comparativa. Es el ÚNICO `<h1>` semántico de la página
 * (el H1 del cuerpo MDX se degrada visualmente a tamaño de H2 en la prosa).
 * Estilo Warm Premium: fondo cálido, naranja con intención, un CTA primario.
 */
export function ComparisonHero({ competitor, subtitle }: ComparisonHeroProps) {
  return (
    <header className="text-center">
      <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-900 dark:bg-brand-950/40">
        Comparativa
      </span>

      <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        FIXA <span className="text-brand-600">vs</span> {competitor}
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
        {subtitle}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/sign-up"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-brand transition-all duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-brand-lg sm:w-auto"
        >
          Probar FIXA gratis
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/precios"
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-background px-7 text-sm font-semibold text-foreground shadow-xs transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-muted sm:w-auto"
        >
          Ver precios
        </Link>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">14 días gratis · Sin tarjeta de crédito</p>
    </header>
  );
}
