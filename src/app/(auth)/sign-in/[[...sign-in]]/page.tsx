import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { FixaLogo } from "@/components/ui/fixa-logo";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-6">
        <Link href="/inicio">
          <FixaLogo size="md" />
        </Link>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "shadow-xl border border-stone-200/60 rounded-2xl",
            headerTitle: "text-xl font-extrabold",
            headerSubtitle: "text-sm text-stone-500",
            formButtonPrimary: "bg-orange-500 hover:bg-orange-600 rounded-full h-11 font-bold",
            footerActionLink: "text-orange-600 font-semibold",
          },
        }}
      />

      <div className="mt-6 max-w-md text-center">
        <p className="text-xs text-stone-400 leading-relaxed">
          Si tienes problemas para acceder, prueba en una ventana de incógnito
          o desactiva temporalmente el bloqueador de anuncios.{" "}
          <a
            href="https://wa.me/34611433218?text=Hola%2C%20tengo%20problemas%20para%20acceder%20a%20FIXA"
            target="_blank"
            className="text-orange-600 font-medium underline"
          >
            ¿Necesitas ayuda?
          </a>
        </p>
      </div>
    </div>
  );
}
