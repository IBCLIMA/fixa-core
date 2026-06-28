import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 max-w-2xl">
      <Skeleton className="h-8 w-44 rounded-xl" />
      <Skeleton className="h-4 w-72 rounded-lg" />
      <div className="space-y-3 mt-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
