import { Skeleton } from "@/components/ui/skeleton";

export default function VscoGallerySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="group relative overflow-hidden rounded-lg">
          <Skeleton className="aspect-square w-full" />
        </div>
      ))}
    </div>
  );
}
