"use client";

import Link from "next/link";
import { getMealById } from "@/data/meals";
import { useSaved } from "@/lib/saved-context";
import { MealListItem } from "@/components/MealListItem";
import { MealCard } from "@/components/MealCard";
import { getRestaurantById } from "@/data/restaurants";

export default function SavedPage() {
  const { savedIds, removeSaved } = useSaved();
  const savedMeals = savedIds
    .map((id) => getMealById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="mx-auto max-w-lg md:max-w-7xl">
      <div className="px-4 py-4 sm:px-6 md:px-8 md:py-10">
        <h1 className="text-xl font-bold md:text-4xl">المحفوظات</h1>
        <p className="mt-1 text-sm text-muted">وجباتك المحفوظة</p>
      </div>

      {savedMeals.length === 0 ? (
        <div className="mx-4 rounded-2xl border border-border bg-surface px-6 py-12 text-center sm:mx-6">
          <p className="text-muted">لا توجد وجبات محفوظة</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-accent">
            تصفح المطاعم
          </Link>
        </div>
      ) : (
        <>
          <div className="border-y border-border md:hidden">
            {savedMeals.map((meal) => (
              <div key={meal.id} className="relative">
                <MealListItem
                  meal={meal}
                  href={`/meals/${meal.id}?from=home`}
                  restaurantName={getRestaurantById(meal.restaurantId)?.name}
                />
                <button
                  type="button"
                  onClick={() => removeSaved(meal.id)}
                  className="absolute end-3 top-3 z-10 rounded-md bg-surface/95 px-2 py-1 text-[11px] text-muted shadow"
                >
                  إزالة
                </button>
              </div>
            ))}
          </div>
          <div className="hidden gap-6 px-8 pb-12 md:grid md:grid-cols-3 lg:grid-cols-4">
            {savedMeals.map((meal) => (
              <div key={meal.id} className="relative">
                <MealCard
                  meal={meal}
                  href={`/meals/${meal.id}?from=home`}
                  restaurantName={getRestaurantById(meal.restaurantId)?.name}
                />
                <button
                  type="button"
                  onClick={() => removeSaved(meal.id)}
                  className="absolute end-3 top-3 z-10 rounded-md bg-surface/95 px-2.5 py-1 text-xs text-muted shadow"
                >
                  إزالة
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
