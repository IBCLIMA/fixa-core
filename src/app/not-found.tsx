import Link from "next/link";
import { ArrowLeft, Home, BookOpen, MessageCircle } from "lucide-react";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { Button } from "@/components/ui/button";
import { SafetyStripe } from "@/components/ui/brand-texture";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-sm">
        <SafetyStripe className="rounded-full max-w-[120px] mx-auto" />
        <div className="mx-auto opacity-30">
          <FixaLogo size="lg" variant="icon" />
        </div>
        <div>
          <h1 className="text-6xl font-extrabold text-stone-200">404</h1>
          <p className="text-lg font-bold text-stone-900 mt-2">Esta página se nos ha quedado en el elevador</p>
          <p className="text-sm text-muted-foreground mt-1">No existe o la hemos movido. Pero arreglamos cosas a diario: te llevamos de vuelta.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="rounded-full w-full">
              <Home className="mr-2 h-4 w-4" />Ir al inicio
            </Button>
          </Link>
          <div className="flex gap-3">
            <Link href="/blog" className="flex-1">
              <Button variant="outline" className="rounded-full w-full">
                <BookOpen className="mr-2 h-4 w-4" />Blog
              </Button>
            </Link>
            <a
              href="https://wa.me/34611433218?text=Hola%2C%20necesito%20ayuda%20con%20FIXA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="rounded-full w-full">
                <MessageCircle className="mr-2 h-4 w-4" />Contacto
              </Button>
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">FIXA by Ibañez Clima</p>
      </div>
    </div>
  );
}
