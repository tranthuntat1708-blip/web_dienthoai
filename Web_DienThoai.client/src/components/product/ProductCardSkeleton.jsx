export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* IMAGE */}
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        <Shimmer />
      </div>

      {/* CONTENT */}
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4 relative overflow-hidden">
          <Shimmer />
        </div>

        <div className="h-3 bg-gray-200 rounded w-1/2 relative overflow-hidden">
          <Shimmer />
        </div>

        <div className="h-4 bg-gray-300 rounded w-1/3 mt-2 relative overflow-hidden">
          <Shimmer />
        </div>

        <div className="h-3 bg-gray-200 rounded w-1/4 relative overflow-hidden">
          <Shimmer />
        </div>
      </div>
    </div>
  );
}

/* 🔥 QUAN TRỌNG: phải có component này */
function Shimmer() {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
  );
}
