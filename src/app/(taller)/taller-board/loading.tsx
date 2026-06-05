export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-stone-200 rounded-xl" />
      <div className="h-4 w-72 bg-stone-100 rounded-lg" />
      <div className="hidden md:grid grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-24 bg-stone-200 rounded-lg" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-24 bg-stone-100 rounded-2xl" />
            ))}
          </div>
        ))}
      </div>
      <div className="md:hidden space-y-3 mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-stone-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
