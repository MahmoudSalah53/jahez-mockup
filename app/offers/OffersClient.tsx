"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { meals } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { MealListItem } from "@/components/MealListItem";
import { MealCard } from "@/components/MealCard";

export function OffersClient() {
  const searchParams = useSearchParams();
  const cashbackOnly = searchParams.get("cashback") === "1";
  const cuisine = searchParams.get("cuisine");

  const offers = useMemo(() => {
    let base = meals.filter((m) => m.isOffer);
    if (cashbackOnly) {
      base = base.filter((m) => (m.cashbackPercent ?? 0) > 0);
    }
    if (cuisine) {
      base = base.filter((m) => {
        const r = getRestaurantById(m.restaurantId);
        return r?.cuisine === cuisine;
      });
    }
    return base;
  }, [cashbackOnly, cuisine]);

  const title = cashbackOnly
    ? cuisine
      ? `كاش باك · ${cuisine}`
      : "عروض الكاش باك"
    : cuisine
      ? `عروض ${cuisine}`
      : "العروض";

  return (
    <div className="mx-auto max-w-lg md:max-w-6xl">
      <div className="px-4 py-4 sm:px-6 md:py-8">
        <h1 className="text-xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">{offers.length} عرض متاح الآن</p>
      </div>

      {offers.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted sm:px-6">
          لا توجد عروض حالياً
        </p>
      ) : (
        <>
          <div className="border-y border-border md:hidden">
            {offers.map((meal) => (
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
          <div className="hidden gap-5 px-6 pb-10 md:grid md:grid-cols-3 lg:grid-cols-4">
            {offers.map((meal) => (
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
        </>
      )}
    </div>
  );
}
