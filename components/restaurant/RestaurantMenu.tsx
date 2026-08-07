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
    <div className="mx-auto max-w-lg md:max-w-7xl">
      {/* Mobile banner — same as before */}
      <div className="relative h-36 w-full sm:h-44 md:hidden">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{restaurant.name}</h1>
            {restaurant.verified && (
              <span className="rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                ✓
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/90">
            <span>{restaurant.cuisine}</span>
            <StarRating rating={restaurant.rating} />
            <span>{restaurant.distanceKm.toFixed(1)} كم</span>
          </div>
        </div>
      </div>

      {/* Desktop cinematic banner */}
      <div className="relative hidden h-72 w-full overflow-hidden md:block lg:h-80">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-8 pb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-white lg:text-5xl">
                  {restaurant.name}
                </h1>
                {restaurant.verified && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
                    موثّق
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/90">
                <span>{restaurant.cuisine}</span>
                <span className="text-white/40">·</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <span className="text-star">★</span>
                  {restaurant.rating.toFixed(1)}
                </span>
                <span className="text-white/40">·</span>
                <span>{restaurant.distanceKm.toFixed(1)} كم</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3.5 py-2 text-sm font-medium text-white backdrop-blur">
                {restaurant.deliveryTime}
              </span>
              <span className="rounded-full bg-white/15 px-3.5 py-2 text-sm font-medium text-white backdrop-blur">
                التوصيل {formatPrice(restaurant.deliveryFee)}
              </span>
              <span className="rounded-full bg-white/15 px-3.5 py-2 text-sm font-medium text-white backdrop-blur">
                الحد الأدنى {formatPrice(restaurant.minOrder)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-border bg-surface px-4 py-2.5 text-xs text-muted sm:px-6 md:hidden">
        <span>{restaurant.deliveryTime}</span>
        <span>التوصيل {formatPrice(restaurant.deliveryFee)}</span>
        <span>الحد الأدنى {formatPrice(restaurant.minOrder)}</span>
      </div>

      <div className="sticky top-12 z-20 flex gap-1 overflow-x-auto border-b border-border bg-surface px-2 py-2 sm:top-14 sm:px-4 md:top-16 md:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors md:px-5 md:py-2 md:text-sm",
              tab === t.id
                ? "bg-accent text-white"
                : "bg-background text-muted hover:text-foreground",
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
          <div className="hidden gap-6 px-8 py-8 md:grid md:grid-cols-2 lg:grid-cols-3">
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
