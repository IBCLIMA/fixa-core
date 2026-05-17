import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FixaLogo } from "@/components/ui/fixa-logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="mx-auto opacity-30">
          <FixaLogo size="lg" variant="icon" />
        </div>
        <div>
          <h1 className="text-6xl font-extrabold text-stone-200">404</h1>
          <p className="text-lg font-bold text-stone-900 mt-2">Página no encontrada</p>
          <p className="text-sm text-muted-foreground mt-1">La página que buscas no existe o ha sido movida.</p>
        </div>
        <Link href="/">
          <Button className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />Volver al panel
          </Button>
        </Link>
      </div>
    </div>
  );
}
