"use client";

import type { Deal } from "@/lib/types";

/** Format a date string into a relative "time ago" label. */
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/** Pretty-print a source name. */
function formatSource(source: string): string {
  const map: Record<string, string> = {
    slickdeals: "Slickdeals",
    dealnews: "DealNews",
    retailmenot: "RetailMeNot",
    chicagoshopper: "ChiShopper",
  };
  return map[source.toLowerCase()] ?? source;
}

interface DealCardProps {
  deal: Deal;
  index: number;
  showBigBox: boolean;
}

export default function DealCard({ deal, index, showBigBox }: DealCardProps) {
  const staggerDelay = Math.min(index * 60, 600); // cap at 600ms

  return (
    <a
      href={deal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-stagger block rounded-xl p-4 transition-all duration-250 no-underline group"
      style={{
        animationDelay: `${staggerDelay}ms`,
        backgroundColor: "#141414",
        border: "1px solid #2a2a2a",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#1e1e1e";
        e.currentTarget.style.borderColor = "#2D6A4F";
        e.currentTarget.style.boxShadow = "0 0 16px rgba(45, 106, 79, 0.15)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#141414";
        e.currentTarget.style.borderColor = "#2a2a2a";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top row: source + badges + time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {/* Source badge */}
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "#1e1e1e",
              color: "#5c5c56",
              border: "1px solid #2a2a2a",
            }}
          >
            {formatSource(deal.source)}
          </span>

          {/* Big Box badge */}
          {showBigBox && deal.isBigBox && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "rgba(232, 119, 46, 0.12)",
                color: "#E8772E",
                border: "1px solid rgba(232, 119, 46, 0.25)",
              }}
            >
              Big Box
            </span>
          )}

          {/* Expiring soon badge */}
          {deal.expiresAt && new Date(deal.expiresAt).getTime() - Date.now() < 86_400_000 && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "rgba(214, 59, 47, 0.10)",
                color: "#D63B2F",
                border: "1px solid rgba(214, 59, 47, 0.2)",
              }}
            >
              Expiring
            </span>
          )}
        </div>

        {/* Time ago */}
        <span className="text-[10px]" style={{ color: "#5c5c56" }}>
          {timeAgo(deal.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold leading-snug mb-2"
        style={{
          color: "#f0f0eb",
          fontFamily: "var(--font-display), sans-serif",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {deal.title}
      </h3>

      {/* Bottom row: store + price + external icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Store */}
          {deal.store && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: "rgba(45, 106, 79, 0.15)",
                color: "#3A8A66",
                border: "1px solid rgba(45, 106, 79, 0.2)",
              }}
            >
              {deal.store}
            </span>
          )}

          {/* Category */}
          {deal.category && deal.category !== "retail" && (
            <span className="text-[10px]" style={{ color: "#5c5c56" }}>
              {deal.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Price display */}
          {deal.price != null && (
            <div className="flex items-center gap-1.5">
              {deal.originalPrice != null && deal.originalPrice > deal.price && (
                <span
                  className="text-xs line-through"
                  style={{ color: "#5c5c56" }}
                >
                  ${deal.originalPrice.toFixed(2)}
                </span>
              )}
              <span
                className="text-sm font-bold"
                style={{ color: "#E8772E" }}
              >
                ${deal.price.toFixed(2)}
              </span>
            </div>
          )}

          {/* External link icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-hover:opacity-60 transition-opacity duration-200"
            style={{ color: "#5c5c56" }}
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>
      </div>
    </a>
  );
}
