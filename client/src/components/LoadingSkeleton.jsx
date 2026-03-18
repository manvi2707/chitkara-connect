// =============================================
// LoadingSkeleton.jsx — Loading Placeholders
// =============================================
// Shows animated placeholders while data loads
// Much better UX than plain "Loading..." text

// Base skeleton block — animated shimmer effect
const Skeleton = ({ className = "" }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }}
  />
);

// ── Faculty Card Skeleton ────────────────────
// Shows while faculty directory is loading
export const FacultyCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    {/* Top row — avatar + name */}
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
    {/* Bio lines */}
    <Skeleton className="h-3 w-full mb-2" />
    <Skeleton className="h-3 w-4/5 mb-4" />
    {/* Tags */}
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-24 rounded-full" />
    </div>
    {/* Bottom row */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-8 w-28 rounded-lg" />
    </div>
  </div>
);

// ── Meeting Card Skeleton ────────────────────
export const MeetingCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-36" />
      <Skeleton className="h-3 w-56" />
    </div>
  </div>
);

// ── Message Card Skeleton ────────────────────
export const MessageCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
    <div className="flex items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>
    </div>
  </div>
);

// ── Profile Skeleton ─────────────────────────
export const ProfileSkeleton = () => (
  <div className="p-6 max-w-2xl space-y-5">
    <div className="space-y-2 mb-6">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-64" />
    </div>
    {[1,2,3,4,5].map((i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ))}
  </div>
);

// ── Faculty Directory Grid Skeleton ──────────
export const DirectorySkeleton = () => (
  <div className="p-6">
    <div className="space-y-2 mb-6">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="flex gap-3 mb-6">
      <Skeleton className="h-10 flex-1 rounded-lg" />
      <Skeleton className="h-10 w-36 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {[1,2,3,4,5,6].map((i) => (
        <FacultyCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default Skeleton;
