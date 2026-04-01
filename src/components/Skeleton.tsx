export function SkeletonLine({
  width = "100%",
  height = "1rem",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className="animate-pulse rounded bg-cream-dark/50"
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="border border-vermillion/10 bg-cream/50 overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square animate-pulse bg-cream-dark/40" />
      {/* Text lines */}
      <div className="p-4 sm:p-5 space-y-3">
        <SkeletonLine width="40%" height="0.6rem" />
        <SkeletonLine width="70%" height="1rem" />
        <SkeletonLine width="30%" height="0.85rem" />
      </div>
    </div>
  );
}
