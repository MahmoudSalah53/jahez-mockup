"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Meal, MealCategory, Restaurant } from "@/lib/types";
import { MealListItem } from "@/components/MealListItem";
import { MealCard } from "@/components/MealCard";
import { StarRating } from "@/components/StarRating";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

const tabs: { id: "all" | MealCategory; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "offers", label: "عروض" },
  { id: "popular", label: "الأكثر طلباً" },
  { id: "menu", label: "القائمة" },
];

type Props = {
  restaurant: Restaurant;
  meals: Meal[];
};

export function RestaurantMenu({ restaurant, meals }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return meals;
    if (tab === "offers")
      return meals.filter((m) => m.isOffer || m.category === "offers");
    if (tab === "popular")
      return meals.filter((m) => m.isPopular || m.category === "popular");
    return meals.filter(
      (m) => m.category === "menu" || (!m.isOffer && !m.isPopular),
    );
  }, [meals, tab]);

  return (
    <div className="mx-auto max-w-lg md:max-w-6xl">
      <div className="relative h-36 w-full sm:h-44 md:h-64">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 sm:px-6 md:pb-5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white md:text-3xl">
              {restaurant.name}
            </h1>
            {restaurant.verified && (
              <span className="rounded-full bg-accent px-1.5 text-[10px] font-bold text-white md:text-xs">
                ✓
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/90 md:text-sm">
            <span>{restaurant.cuisine}</span>
            <StarRating rating={restaurant.rating} />
            <span>{restaurant.distanceKm.toFixed(1)} كم</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-border bg-surface px-4 py-2.5 text-xs text-muted sm:px-6 md:text-sm">
        <span>{restaurant.deliveryTime}</span>
        <span>التوصيل {formatPrice(restaurant.deliveryFee)}</span>
        <span>الحد {formatPrice(restaurant.minOrder)}</span>
      </div>

      <div className="sticky top-12 z-20 flex gap-1 overflow-x-auto border-b border-border bg-surface px-2 py-2 sm:top-14 sm:px-4 md:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors md:text-sm",
              tab === t.id
                ? "bg-accent text-white"
                : "bg-background text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted sm:px-6">
          لا توجد أصناف في هذا القسم
        </p>
      ) : (
        <>
          <div className="border-b border-border md:hidden">
            {filtered.map((m) => (
              <MealListItem
                key={m.id}
                meal={m}
                href={`/meals/${m.id}?from=restaurant`}
              />
            ))}
          </div>
          <div className="hidden gap-5 px-6 py-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <MealCard
                key={m.id}
                meal={m}
                href={`/meals/${m.id}?from=restaurant`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
