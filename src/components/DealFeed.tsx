"use client";

import { useEffect, useRef } from "react";
import { useDeals } from "@/hooks/useDeals";
import DealCard from "./DealCard";
import SkeletonCard from "./SkeletonCard";

interface DealFeedProps {
  showBigBox: boolean;
  category: string;
}

export default function DealFeed({ showBigBox, category }: DealFeedProps) {
  const { deals, isLoading, isLoadingMore, hasMore, loadMore, refresh } = useDeals({
    showBigBox,
    category,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  return (
    <div className="px-3 pb-6">
      {/* Refresh button */}
      <div className="flex justify-center mb-3">
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor: "#141414",
            color: "#8a8a82",
            border: "1px solid #2a2a2a",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1e1e1e";
            e.currentTarget.style.borderColor = "#2D6A4F";
            e.currentTarget.style.color = "#3A8A66";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#141414";
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.color = "#8a8a82";
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isLoading ? "animate-spin" : ""}
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Skeleton loading state */}
      {isLoading && (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Deal cards */}
      {!isLoading && deals.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {deals.map((deal, i) => (
            <DealCard key={deal.id} deal={deal} index={i} showBigBox={showBigBox} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && deals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#2a2a2a" }}
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <p
            className="mt-4 text-sm font-medium"
            style={{ color: "#5c5c56" }}
          >
            No deals found
          </p>
          <p className="text-xs mt-1" style={{ color: "#5c5c56" }}>
            Try adjusting your filters or check back later
          </p>
        </div>
      )}

      {/* Loading more spinner */}
      {isLoadingMore && (
        <div className="flex justify-center py-6">
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{
              borderColor: "#2a2a2a",
              borderTopColor: "#2D6A4F",
            }}
          />
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* End of list */}
      {!isLoading && !hasMore && deals.length > 0 && (
        <p
          className="text-center text-xs py-6"
          style={{ color: "#5c5c56" }}
        >
          You&apos;ve reached the end
        </p>
      )}
    </div>
  );
}
