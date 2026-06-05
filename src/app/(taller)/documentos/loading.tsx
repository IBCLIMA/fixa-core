export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-56 bg-stone-200 rounded-xl" />
      <div className="h-4 w-40 bg-stone-100 rounded-lg" />
      <div className="h-10 w-full bg-stone-100 rounded-xl mt-4" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-stone-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
