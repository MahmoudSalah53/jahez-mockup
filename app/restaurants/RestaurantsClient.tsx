"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { filterRestaurants } from "@/data/restaurants";
import { RestaurantListItem } from "@/components/RestaurantListItem";
import { RestaurantCard } from "@/components/RestaurantCard";

export function RestaurantsClient() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") ?? "all";
  const cuisine = searchParams.get("cuisine");

  const list = useMemo(
    () => filterRestaurants(filter, cuisine),
    [filter, cuisine],
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
    <div className="mx-auto max-w-lg md:max-w-6xl">
      <div className="px-4 py-4 sm:px-6 md:py-8">
        <h1 className="text-xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">{list.length} نتيجة</p>
      </div>

      {list.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted sm:px-6">
          لا توجد مطاعم في هذا التصنيف
        </p>
      ) : (
        <>
          <div className="border-y border-border md:hidden">
            {list.map((r) => (
              <RestaurantListItem key={r.id} restaurant={r} />
            ))}
          </div>
          <div className="hidden gap-5 px-6 pb-10 md:grid md:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
