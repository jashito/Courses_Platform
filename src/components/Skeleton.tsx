interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = "20px", borderRadius = "8px", style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card">
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" width="100%" style={{ marginTop: 12 }} />
      <Skeleton height="16px" width="80%" style={{ marginTop: 8 }} />
      <Skeleton height="16px" width="40%" style={{ marginTop: 8 }} />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
