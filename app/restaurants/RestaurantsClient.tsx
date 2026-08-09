"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { filterRestaurants } from "@/data/restaurants";
import { RestaurantListItem } from "@/components/RestaurantListItem";
import { RestaurantCard } from "@/components/RestaurantCard";
import { LIST_PAGE_SIZE } from "@/lib/list-limits";
import { useInfiniteList } from "@/lib/use-infinite-list";

export function RestaurantsClient() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") ?? "all";
  const cuisine = searchParams.get("cuisine");

  const list = useMemo(
    () => filterRestaurants(filter, cuisine),
    [filter, cuisine],
  );

  const { visibleItems, sentinelRef, hasMore, pending } = useInfiniteList(
    list,
    LIST_PAGE_SIZE,
  );

  const title = useMemo(() => {
    if (filter === "grocery") return "بقالة";
    if (filter === "24h" && cuisine) return `24 ساعة · ${cuisine}`;
    if (filter === "24h") return "مفتوح 24 ساعة";
    if (filter === "fast" && cuisine) return `توصيل سريع · ${cuisine}`;
    if (filter === "fast") return "توصيل سريع";
    if (cuisine) return `مطاعم ${cuisine}`;
    return "المطاعم";
  }, [filter, cuisine]);

  return (
    <div className="mx-auto max-w-lg md:max-w-7xl">
      <div className="px-4 py-4 md:hidden">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{list.length} نتيجة</p>
      </div>

      <div className="relative hidden overflow-hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/55 to-black/40" />
        <div className="relative mx-auto max-w-7xl px-8 py-14">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-base text-white/80">
            {list.length} مطاعم متاحة للتوصيل الآن
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted sm:px-6">
          لا توجد مطاعم في هذا التصنيف
        </p>
      ) : (
        <>
          <div className="border-y border-border md:hidden">
            {visibleItems.map((r) => (
              <RestaurantListItem key={r.id} restaurant={r} />
            ))}
          </div>
          <div className="hidden gap-6 px-8 py-10 md:grid md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
          <div
            ref={sentinelRef}
            className="px-4 py-6 text-center text-xs text-muted md:px-8"
            aria-hidden={!hasMore}
          >
            {hasMore
              ? pending
                ? "جاري تحميل المزيد…"
                : "مرّر للمزيد"
              : `تم عرض كل النتائج (${list.length})`}
          </div>
        </>
      )}
    </div>
  );
}
