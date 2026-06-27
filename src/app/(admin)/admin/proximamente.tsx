import type { LucideIcon } from "lucide-react";

export function Proximamente({
  icon: Icon,
  titulo,
  descripcion,
}: {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{titulo}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{descripcion}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
          <Icon className="h-6 w-6 text-stone-400" />
        </div>
        <p className="mt-4 text-sm font-bold text-stone-700">Próximamente</p>
        <p className="mt-1 text-sm text-muted-foreground">Esta sección se construye en la siguiente ronda.</p>
      </div>
    </div>
  );
}
