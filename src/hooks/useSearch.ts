/*
 * Copyright (c) 2025 Trash Panda Labs, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying prohibited.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import type { Deal } from "@/lib/types";

interface UseSearchOptions {
  query: string;
  showBigBox: boolean;
}

interface UseSearchReturn {
  results: Deal[];
  isSearching: boolean;
}

export function useSearch({ query, showBigBox }: UseSearchOptions): UseSearchReturn {
  const [results, setResults] = useState<Deal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const params = new URLSearchParams({
        q: trimmed,
        bigBox: String(showBigBox),
      });

      fetch(`/api/deals/search?${params}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error("Search failed");
          return res.json();
        })
        .then((data: Deal[]) => {
          setResults(data);
          setIsSearching(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setResults([]);
            setIsSearching(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query, showBigBox]);

  return { results, isSearching };
}