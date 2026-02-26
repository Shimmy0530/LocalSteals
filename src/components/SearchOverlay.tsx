"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearch } from "@/hooks/useSearch";
import DealCard from "./DealCard";
import SkeletonCard from "./SkeletonCard";

interface SearchOverlayProps {
  showBigBox: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ showBigBox, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isSearching } = useSearch({ query, showBigBox });

  // Autofocus the input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col ${closing ? "search-slide-up" : "search-slide-down"}`}
      style={{ backgroundColor: "rgba(10, 10, 10, 0.98)" }}
    >
      {/* Search header */}
      <div
        className="flex items-center gap-3 px-4 h-14 shrink-0"
        style={{ borderBottom: "1px solid #1f1f1f" }}
      >
        {/* Search icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "#737373", flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search deals, stores..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{
            color: "#f5f5f5",
            fontFamily: "var(--font-body), sans-serif",
          }}
        />

        {/* Clear input / Close */}
        <button
          onClick={handleClose}
          aria-label="Close search"
          className="p-1.5 rounded-lg transition-colors duration-200"
          style={{ color: "#737373" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f5f5f5";
            e.currentTarget.style.backgroundColor = "#222";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#737373";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {/* Searching indicator */}
        {isSearching && (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!isSearching && results.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {results.map((deal, i) => (
              <DealCard key={deal.id} deal={deal} index={i} showBigBox={showBigBox} />
            ))}
          </div>
        )}

        {/* No results */}
        {!isSearching && query.trim().length > 0 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#333" }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <p className="mt-4 text-sm" style={{ color: "#737373" }}>
              No deals match &ldquo;{query.trim()}&rdquo;
            </p>
          </div>
        )}

        {/* Empty initial state */}
        {!isSearching && query.trim().length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xs" style={{ color: "#555" }}>
              Type to search deals, stores, or categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
