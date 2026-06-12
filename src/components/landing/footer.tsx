import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { SafetyStripe } from "@/components/ui/brand-texture";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/60 bg-white">
      <SafetyStripe className="opacity-80" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Brand */}
          <div>
            <FixaLogo size="sm" />
            <p className="text-xs text-stone-400 mt-3 max-w-[200px]">
              Software de gestión para talleres mecánicos. Creado por mecánicos.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Producto</p>
            <div className="flex flex-col gap-2">
              <Link href="/funciones" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Funciones</Link>
              <Link href="/precios" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Precios</Link>
              <Link href="/blog" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Blog</Link>
              <Link href="/nosotros" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Sobre nosotros</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Legal</p>
            <div className="flex flex-col gap-2">
              <Link href="/aviso-legal" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Aviso Legal</Link>
              <Link href="/privacidad" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Privacidad</Link>
              <Link href="/cookies" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Cookies</Link>
              <Link href="/terminos" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Términos</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Contacto</p>
            <div className="flex flex-col gap-2">
              <a href="mailto:sergi@ibclima.com" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">sergi@ibclima.com</a>
              <a href="tel:+34611433218" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">611 433 218</a>
              <a href="https://wa.me/34611433218" target="_blank" rel="noopener noreferrer" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="text-xs text-stone-400">© 2026 FIXA by Ibañez Clima. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <Link href="/sign-up" className="text-orange-600 font-semibold hover:text-orange-500 transition-colors">Probar gratis</Link>
            <Link href="/sign-in" className="hover:text-stone-700 transition-colors">Acceder</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
