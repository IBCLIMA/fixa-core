export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-stone-200 border-t-brand-500 animate-spin" />
        <p className="text-sm text-stone-400 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
