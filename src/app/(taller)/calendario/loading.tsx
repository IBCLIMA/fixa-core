export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-36 bg-stone-200 rounded-xl" />
      <div className="h-4 w-48 bg-stone-100 rounded-lg" />
      <div className="h-32 bg-stone-100 rounded-2xl mt-4" />
      <div className="hidden md:grid grid-cols-7 gap-3 mt-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-36 bg-stone-100 rounded-xl" />
        ))}
      </div>
      <div className="md:hidden space-y-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-stone-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
