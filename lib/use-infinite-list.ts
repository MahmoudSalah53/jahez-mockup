"use client";

import { useEffect, useRef, useState } from "react";

const LOAD_DELAY_MS = 500;

/**
 * Progressive list window for large catalogs (infinite scroll via sentinel).
 * When the sentinel enters view, waits ~1s then appends the next page.
 */
export function useInfiniteList<T>(items: T[], pageSize = 12) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [pending, setPending] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(pageSize);
    setPending(false);
  }, [items, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (visibleCount >= items.length) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (!visible) {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            setPending(false);
          }
          return;
        }

        if (timeoutId) return;

        setPending(true);
        timeoutId = setTimeout(() => {
          timeoutId = null;
          setPending(false);
          setVisibleCount((count) => Math.min(count + pageSize, items.length));
        }, LOAD_DELAY_MS);
      },
      { rootMargin: "40px 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [items.length, pageSize, visibleCount]);

  return {
    visibleItems: items.slice(0, visibleCount),
    sentinelRef,
    hasMore: visibleCount < items.length,
    pending,
    visibleCount,
  };
}
