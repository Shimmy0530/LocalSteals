"use client";

export default function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "#141414",
        border: "1px solid #2a2a2a",
      }}
    >
      {/* Source + time row */}
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton-shimmer rounded h-3 w-16" />
        <div className="skeleton-shimmer rounded h-3 w-10" />
      </div>

      {/* Title lines */}
      <div className="skeleton-shimmer rounded h-4 w-full mb-2" />
      <div className="skeleton-shimmer rounded h-4 w-3/4 mb-3" />

      {/* Store + price row */}
      <div className="flex items-center justify-between">
        <div className="skeleton-shimmer rounded h-3.5 w-20" />
        <div className="skeleton-shimmer rounded h-5 w-14" />
      </div>
    </div>
  );
}
