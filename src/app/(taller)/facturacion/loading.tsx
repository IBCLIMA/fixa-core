export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-56 bg-stone-200 rounded-xl" />
      <div className="h-4 w-72 bg-stone-100 rounded-lg" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-stone-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-40 bg-stone-100 rounded-2xl mt-4" />
      <div className="h-48 bg-stone-100 rounded-2xl" />
    </div>
  );
}
