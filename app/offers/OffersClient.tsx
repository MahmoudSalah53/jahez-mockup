"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { meals } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { MealListItem } from "@/components/MealListItem";
import { MealCard } from "@/components/MealCard";
import { LIST_PAGE_SIZE } from "@/lib/list-limits";
import { useInfiniteList } from "@/lib/use-infinite-list";

export function OffersClient() {
  const searchParams = useSearchParams();
  const cashbackOnly = searchParams.get("cashback") === "1";
  const cuisine = searchParams.get("cuisine");

  const offers = useMemo(() => {
    let base = meals.filter((m) => m.isCombo || m.isOffer);
    if (cashbackOnly) {
      base = base.filter((m) => (m.cashbackPercent ?? 0) > 0);
    }
    if (cuisine) {
      base = base.filter((m) => {
        const r = getRestaurantById(m.restaurantId);
        return r?.cuisine === cuisine;
      });
    }
    return [...base].sort((a, b) => b.rating - a.rating);
  }, [cashbackOnly, cuisine]);

  const { visibleItems, sentinelRef, hasMore, pending } = useInfiniteList(
    offers,
    LIST_PAGE_SIZE,
  );

  const title = cashbackOnly
    ? cuisine
      ? `كاش باك · ${cuisine}`
      : "عروض الكاش باك"
    : cuisine
      ? `عروض ${cuisine}`
      : "العروض";

  return (
    <div className="mx-auto max-w-lg md:max-w-7xl">
      <div className="px-4 py-4 md:hidden">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted">
          {offers.length} عرض متاح — كومبو وعائلي وتشكيلات بسعر ثابت
        </p>
      </div>

      <div className="relative hidden overflow-hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/50 to-black/35" />
        <div className="relative mx-auto max-w-7xl px-8 py-14">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-base text-white/80">
            {offers.length} عرض — كومبو · عائلي · تشكيلة بسعر ثابت
          </p>
        </div>
      </div>

      {offers.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted sm:px-6">
          لا توجد عروض حالياً
        </p>
      ) : (
        <>
          <div className="border-y border-border md:hidden">
            {visibleItems.map((meal) => (
              <div key={meal.id} className="relative">
                <MealListItem
                  meal={meal}
                  href={`/meals/${meal.id}?from=offers`}
                  restaurantName={getRestaurantById(meal.restaurantId)?.name}
                />
                {meal.cashbackPercent ? (
                  <span className="absolute end-3 top-3 z-10 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    كاش باك {meal.cashbackPercent}%
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="hidden gap-6 px-8 py-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((meal) => (
              <div key={meal.id} className="relative">
                <MealCard
                  meal={meal}
                  href={`/meals/${meal.id}?from=offers`}
                  restaurantName={getRestaurantById(meal.restaurantId)?.name}
                />
                {meal.cashbackPercent ? (
                  <span className="absolute end-3 top-3 z-10 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    كاش باك {meal.cashbackPercent}%
                  </span>
                ) : null}
              </div>
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
              : `تم عرض كل العروض (${offers.length})`}
          </div>
        </>
      )}
    </div>
  );
}
