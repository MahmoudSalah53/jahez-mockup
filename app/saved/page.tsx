"use client";

import Link from "next/link";
import { getMealById } from "@/data/meals";
import { useSaved } from "@/lib/saved-context";
import { MealCard } from "@/components/MealCard";
import { getRestaurantById } from "@/data/restaurants";

export default function SavedPage() {
  const { savedIds, removeSaved } = useSaved();
  const savedMeals = savedIds
    .map((id) => getMealById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        المحفوظات
      </h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        الوجبات التي حفظتها للطلب لاحقاً
      </p>

      {savedMeals.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-muted">لا توجد وجبات محفوظة بعد</p>
          <Link
            href="/restaurants"
            className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-hover"
          >
            تصفح المطاعم
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
          {savedMeals.map((meal) => (
            <div key={meal.id} className="relative">
              <MealCard
                meal={meal}
                restaurantName={getRestaurantById(meal.restaurantId)?.name}
              />
              <button
                type="button"
                onClick={() => removeSaved(meal.id)}
                className="absolute end-2 top-2 z-10 rounded-md bg-surface/95 px-2 py-1 text-xs font-medium text-muted shadow-sm transition-colors hover:text-accent"
              >
                إزالة
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
