export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-stone-200 rounded-xl" />
      <div className="h-4 w-72 bg-stone-100 rounded-lg" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-stone-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
