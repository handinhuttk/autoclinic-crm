export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-navy-700/60 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
