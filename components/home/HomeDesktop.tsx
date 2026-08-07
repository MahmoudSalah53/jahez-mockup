"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "@phosphor-icons/react";
import { restaurants } from "@/data/restaurants";
import { getRestaurantById } from "@/data/restaurants";
import { getMealPrice } from "@/data/meals";
import { Hero } from "@/components/home/Hero";
import { SectionHeader } from "@/components/home/SectionHeader";
import { MealCard } from "@/components/MealCard";
import { RestaurantCard } from "@/components/RestaurantCard";
import { useCuisineScope } from "@/lib/use-cuisine-scope";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Meal } from "@/lib/types";

function cuisineThumb(cuisine: string): string {
  if (cuisine === "الكل") {
    return "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80";
  }
  const match = restaurants.find((r) => r.cuisine === cuisine);
  return (
    match?.image ??
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80"
  );
}

function offerScore(meal: Meal): number {
  const discount =
    meal.offerPrice != null && meal.price > 0
      ? (meal.price - meal.offerPrice) / meal.price
      : 0;
  return discount * 100 + meal.rating * 2 + (meal.cashbackPercent ?? 0);
}

export function HomeDesktop() {
  const {
    cuisine,
    setCuisine,
    foodCuisines,
    scopedRestaurants,
    offerMeals,
    features,
    restaurantsAllHref,
    offersAllHref,
  } = useCuisineScope();

  /** Desktop promo banners: top 2 offers only */
  const topPromoMeals = useMemo(
    () =>
      [...offerMeals]
        .sort((a, b) => offerScore(b) - offerScore(a))
        .slice(0, 2),
    [offerMeals],
  );

  const featured = scopedRestaurants.filter((r) => r.featured).slice(0, 6);
  const feed =
    featured.length >= 3 ? featured : scopedRestaurants.slice(0, 6);

  return (
    <div className="bg-[#faf8f6] pb-20">
      <Hero />

      {/* Discovery strip — marketplace style */}
      <div className="relative z-10 -mt-8 mx-auto max-w-7xl px-8">
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-surface px-5 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <MapPin size={22} weight="fill" className="shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted">التوصيل إلى</p>
            <p className="truncate text-sm font-bold text-foreground">
              الرياض · حي النرجس
            </p>
          </div>
          <Link
            href={restaurantsAllHref}
            className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            تصفح المطاعم
          </Link>
        </div>
      </div>

      {/* Cuisine circles */}
      <div className="mx-auto max-w-7xl px-8 pt-10">
        <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {foodCuisines.map((c) => {
            const active = cuisine === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCuisine(c)}
                className="group flex w-[88px] shrink-0 flex-col items-center gap-2.5"
              >
                <span
                  className={cn(
                    "relative h-[72px] w-[72px] overflow-hidden rounded-full ring-2 transition duration-300",
                    active
                      ? "ring-accent shadow-[0_0_0_4px_var(--accent-soft)]"
                      : "ring-transparent group-hover:ring-border",
                  )}
                >
                  <Image
                    src={cuisineThumb(c)}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </span>
                <span
                  className={cn(
                    "text-center text-xs font-semibold",
                    active ? "text-accent" : "text-foreground",
                  )}
                >
                  {c}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Large promo banners — best 2 only */}
      {topPromoMeals.length > 0 && (
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-5 px-8">
          {topPromoMeals.map((meal) => {
            const restaurant = getRestaurantById(meal.restaurantId);
            return (
              <Link
                key={meal.id}
                href={`/meals/${meal.id}?from=home`}
                className="group relative min-h-[260px] overflow-hidden rounded-3xl"
              >
                <Image
                  src={meal.image}
                  alt={meal.name}
                  fill
                  sizes="50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold">
                    عرض قوي
                  </span>
                  <p className="text-xl font-bold lg:text-2xl">{meal.name}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {restaurant?.name} · {formatPrice(getMealPrice(meal))}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Shortcut row */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-4 gap-4 px-8">
        {features.map((f) => (
          <Link
            key={f.label}
            href={f.href}
            className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-surface px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
          >
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105",
                f.color,
              )}
            >
              <f.Icon size={24} weight="duotone" aria-hidden />
            </span>
            <div>
              <p className="font-bold text-foreground">{f.label}</p>
              <p className="text-xs text-muted">استكشف الآن</p>
            </div>
          </Link>
        ))}
      </div>

      <SectionHeader
        title="عروض قوية"
        subtitle={
          cuisine === "الكل"
            ? "أفضل الخصومات المتاحة للتوصيل الآن"
            : `عروض مختارة من مطابخ ${cuisine}`
        }
        href={offersAllHref}
        linkLabel="كل العروض"
      >
        {offerMeals.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center text-muted">
            لا توجد عروض في «{cuisine}» حالياً
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {offerMeals.slice(0, 4).map((m) => (
              <MealCard
                key={m.id}
                meal={m}
                href={`/meals/${m.id}?from=home`}
                restaurantName={getRestaurantById(m.restaurantId)?.name}
              />
            ))}
          </div>
        )}
      </SectionHeader>

      <SectionHeader
        title={cuisine === "الكل" ? "مطاعم قريبة منك" : `مطاعم ${cuisine}`}
        subtitle="صور حقيقية، تقييمات واضحة، وتوصيل سريع"
        href={restaurantsAllHref}
        linkLabel="كل المطاعم"
      >
        {scopedRestaurants.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center text-muted">
            لا توجد مطاعم في هذا التصنيف
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {(feed.length ? feed : scopedRestaurants).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </SectionHeader>

      {scopedRestaurants.length > feed.length && (
        <div className="mx-auto max-w-7xl px-8 pb-4">
          <div className="grid grid-cols-3 gap-6">
            {scopedRestaurants
              .filter((r) => !feed.some((f) => f.id === r.id))
              .map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
