import { SkeletonCard } from "@/components/Skeleton";

export default function Loading() {
  return (
    <section className="bg-soft-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
