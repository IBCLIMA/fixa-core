import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/60 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <FixaLogo size="sm" />
          <span className="text-xs text-stone-400">Soluciones digitales para talleres</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-stone-400">
          <Link href="/privacidad" className="hover:text-stone-700 transition-colors">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-stone-700 transition-colors">
            Términos
          </Link>
          <span>© 2026 FIXA by Ibañez Clima</span>
        </div>
      </div>
    </footer>
  );
}
