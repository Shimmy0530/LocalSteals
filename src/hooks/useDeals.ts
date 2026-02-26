"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Deal } from "@/lib/types";

const PAGE_SIZE = 30;

interface UseDealsOptions {
  demoMode: boolean;
  showBigBox: boolean;
  category: string;
}

interface UseDealsReturn {
  deals: Deal[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useDeals({ demoMode, showBigBox, category }: UseDealsOptions): UseDealsReturn {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (page: number, signal?: AbortSignal): Promise<Deal[]> => {
      const params = new URLSearchParams({
        demo: String(demoMode),
        bigBox: String(showBigBox),
        category,
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/deals?${params}`, { signal });
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json();
    },
    [demoMode, showBigBox, category],
  );

  // Initial load + reload when filters change
  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    pageRef.current = 1;
    setIsLoading(true);
    setHasMore(true);

    fetchPage(1, controller.signal)
      .then((data) => {
        setDeals(data);
        setHasMore(data.length >= PAGE_SIZE);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setDeals([]);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;

    fetchPage(nextPage)
      .then((data) => {
        pageRef.current = nextPage;
        setDeals((prev) => [...prev, ...data]);
        setHasMore(data.length >= PAGE_SIZE);
        setIsLoadingMore(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setIsLoadingMore(false);
        }
      });
  }, [fetchPage, isLoadingMore, hasMore]);

  const refresh = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    pageRef.current = 1;
    setIsLoading(true);
    setHasMore(true);

    fetchPage(1, controller.signal)
      .then((data) => {
        setDeals(data);
        setHasMore(data.length >= PAGE_SIZE);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setIsLoading(false);
        }
      });
  }, [fetchPage]);

  return { deals, isLoading, isLoadingMore, hasMore, loadMore, refresh };
}
