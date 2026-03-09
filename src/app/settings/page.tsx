/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Keyword } from "@/lib/types";
import NotificationSetup from "@/components/NotificationSetup";

export default function SettingsPage() {
  // ── Keywords ──────────────────────────────────────────────
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);

  const fetchKeywords = useCallback(async () => {
    try {
      const res = await fetch("/api/keywords");
      if (res.ok) {
        const data: Keyword[] = await res.json();
        setKeywords(data);
      }
    } finally {
      setIsLoadingKeywords(false);
    }
  }, []);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const addKeyword = async () => {
    const kw = keywordInput.trim();
    if (!kw) return;
    const res = await fetch("/api/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: kw }),
    });
    if (res.ok) {
      setKeywordInput("");
      fetchKeywords();
    }
  };

  const deleteKeyword = async (id: number) => {
    await fetch("/api/keywords", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setKeywords((prev) => prev.filter((k) => k.id !== id));
  };

  // ── Manual Fetch ──────────────────────────────────────────
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchNow = async () => {
    setIsFetching(true);
    setFetchStatus(null);
    try {
      const res = await fetch("/api/fetch-now", { method: "POST" });
      const data = await res.json();
      const count = data.newDeals ?? data.totalNew ?? 0;
      setFetchStatus(`${count} new deal${count !== 1 ? "s" : ""} found`);
    } catch {
      setFetchStatus("Fetch failed. Try again.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#f0f0eb" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-4 h-14"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <Link
          href="/"
          className="p-1.5 rounded-lg transition-colors duration-200 no-underline"
          style={{ color: "#8a8a82" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f0f0eb";
            e.currentTarget.style.backgroundColor = "#1e1e1e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#8a8a82";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          Settings
        </h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-8">
        {/* ── Keyword Alerts ─────────────────────────────── */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#3A8A66", fontFamily: "var(--font-display), sans-serif" }}
          >
            Keyword Alerts
          </h2>
          <p className="text-xs mb-4" style={{ color: "#5c5c56" }}>
            Get notified when deals match your keywords.
          </p>

          {/* Add keyword */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addKeyword();
              }}
              placeholder="e.g. oil change, tires"
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-colors duration-200"
              style={{
                backgroundColor: "#1e1e1e",
                color: "#f0f0eb",
                border: "1px solid #2a2a2a",
                fontFamily: "var(--font-body), sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#2D6A4F";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
              }}
            />
            <button
              onClick={addKeyword}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: "#2D6A4F",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3A8A66";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2D6A4F";
              }}
            >
              Add
            </button>
          </div>

          {/* Keyword list */}
          {isLoadingKeywords ? (
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-7 w-20 rounded-full"
                />
              ))}
            </div>
          ) : keywords.length === 0 ? (
            <p className="text-xs" style={{ color: "#5c5c56" }}>
              No keywords yet. Add one above.
            </p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {keywords.map((kw) => (
                <div
                  key={kw.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "#141414",
                    color: "#8a8a82",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  {kw.keyword}
                  <button
                    onClick={() => deleteKeyword(kw.id)}
                    aria-label={`Remove keyword ${kw.keyword}`}
                    className="ml-0.5 p-0.5 rounded-full transition-colors duration-150"
                    style={{ color: "#5c5c56" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#D63B2F";
                      e.currentTarget.style.backgroundColor = "rgba(214,59,47,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#5c5c56";
                      e.currentTarget.style.backgroundColor = "transparent";
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
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Manual Fetch ───────────────────────────────── */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#3A8A66", fontFamily: "var(--font-display), sans-serif" }}
          >
            Manual Fetch
          </h2>
          <p className="text-xs mb-4" style={{ color: "#5c5c56" }}>
            Trigger a deal fetch immediately instead of waiting for the schedule.
          </p>
          <button
            onClick={handleFetchNow}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: isFetching ? "#3a3a3a" : "#E8772E",
              color: isFetching ? "#5c5c56" : "#0a0a0a",
              cursor: isFetching ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isFetching) e.currentTarget.style.filter = "brightness(0.9)";
            }}
            onMouseLeave={(e) => {
              if (!isFetching) e.currentTarget.style.filter = "none";
            }}
          >
            {isFetching && (
              <div
                className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "#5c5c56",
                  borderTopColor: "#8a8a82",
                }}
              />
            )}
            {isFetching ? "Fetching..." : "Fetch Deals Now"}
          </button>

          {fetchStatus && (
            <p
              className="mt-3 text-xs font-medium fade-in"
              style={{ color: "#3A8A66" }}
            >
              {fetchStatus}
            </p>
          )}
        </section>

        {/* ── Notifications ──────────────────────────────── */}
        <section>
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: "#3A8A66", fontFamily: "var(--font-display), sans-serif" }}
          >
            Notifications
          </h2>
          <p className="text-xs mb-4" style={{ color: "#5c5c56" }}>
            Receive push alerts when new deals match your keywords.
          </p>
          <NotificationSetup />
        </section>
      </div>
    </div>
  );
}