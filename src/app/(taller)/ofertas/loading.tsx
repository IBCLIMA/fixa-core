export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse max-w-2xl">
      <div className="h-8 w-44 bg-stone-200 rounded-xl" />
      <div className="h-4 w-72 bg-stone-100 rounded-lg" />
      <div className="space-y-3 mt-6">
        <div className="h-24 bg-stone-100 rounded-2xl" />
        <div className="h-12 bg-stone-100 rounded-2xl" />
      </div>
    </div>
  );
}
