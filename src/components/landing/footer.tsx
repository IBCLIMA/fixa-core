import Link from "next/link";
import { ArrowRight, MessageSquare, Phone, Mail } from "lucide-react";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { SafetyStripe } from "@/components/ui/brand-texture";

export function Footer() {
  return (
    <footer className="relative bg-stone-950 text-stone-400 overflow-hidden">
      <SafetyStripe />

      {/* CTA rápido antes del footer */}
      <div className="border-b border-stone-800/60">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-extrabold text-white">
              ¿Preparado para dejar el papel?
            </p>
            <p className="text-sm text-stone-500 mt-1">
              14 días gratis. Sin tarjeta. Y si no te convence, lo borras tú solo.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 hover:bg-brand-400 text-white font-bold h-12 px-8 text-sm transition-colors shrink-0 group"
          >
            Empezar gratis
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {/* Brand */}
          <div>
            <FixaLogo size="sm" theme="dark" />
            <p className="text-sm text-stone-500 mt-4 max-w-[220px] leading-relaxed">
              La torre de control para talleres modernos. Nació dentro de un taller de verdad, hecha por gente del sector, no por una startup.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/34611433218"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 hover:bg-emerald-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="h-4 w-4 text-stone-400 hover:text-white" />
              </a>
              <a
                href="tel:+34611433218"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 hover:bg-brand-600 transition-colors"
                aria-label="Teléfono"
              >
                <Phone className="h-4 w-4 text-stone-400" />
              </a>
              <a
                href="mailto:sergi@ibclima.com"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 hover:bg-blue-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 text-stone-400" />
              </a>
            </div>
          </div>

          {/* Producto */}
          <div>
            <p className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4">Producto</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/funciones" className="text-sm hover:text-white transition-colors">Funciones</Link>
              <Link href="/demo" className="text-sm hover:text-white transition-colors">Demo</Link>
              <Link href="/precios" className="text-sm hover:text-white transition-colors">Precios</Link>
              <Link href="/blog" className="text-sm hover:text-white transition-colors">Blog</Link>
              <Link href="/nosotros" className="text-sm hover:text-white transition-colors">Sobre nosotros</Link>
            </div>
          </div>

          {/* Recursos */}
          <div>
            <p className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4">Recursos</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/blog/obligaciones-legales-taller-mecanico" className="text-sm hover:text-white transition-colors">Obligaciones legales del taller</Link>
              <Link href="/blog/plantilla-orden-de-trabajo-taller" className="text-sm hover:text-white transition-colors">Plantilla orden de trabajo</Link>
              <Link href="/blog/avisos-itv-automaticos-taller" className="text-sm hover:text-white transition-colors">Avisos ITV automáticos</Link>
              <Link href="/vs/fixa-vs-erp-taller" className="text-sm hover:text-white transition-colors">FIXA vs ERP</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-4">Legal</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/aviso-legal" className="text-sm hover:text-white transition-colors">Aviso legal</Link>
              <Link href="/privacidad" className="text-sm hover:text-white transition-colors">Privacidad</Link>
              <Link href="/cookies" className="text-sm hover:text-white transition-colors">Cookies</Link>
              <Link href="/terminos" className="text-sm hover:text-white transition-colors">Términos de uso</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800/60 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="text-xs text-stone-600">
            © {new Date().getFullYear()} FIXA by Ibañez Clima (CIF: B25825761)
          </span>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/sign-up" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">Probar gratis</Link>
            <Link href="/sign-in" className="text-stone-500 hover:text-white transition-colors">Acceder</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
