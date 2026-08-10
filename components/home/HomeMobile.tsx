"use client";

import Image from "next/image";
import Link from "next/link";
import { ForkKnife, ShoppingBag } from "@phosphor-icons/react";
import { getMealPrice } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { RestaurantListItem } from "@/components/RestaurantListItem";
import { MealListItem } from "@/components/MealListItem";
import { SearchBox } from "@/components/SearchBox";
import { formatPrice } from "@/lib/format";
import {
  HOME_OFFER_PREVIEW,
  HOME_RESTAURANT_PREVIEW,
} from "@/lib/list-limits";
import { useCuisineScope } from "@/lib/use-cuisine-scope";
import { cn } from "@/lib/cn";

export function HomeMobile() {
  const {
    cuisine,
    setCuisine,
    foodCuisines,
    scopedRestaurants,
    offerMeals,
    promoMeals,
    features,
    restaurantsAllHref,
    offersAllHref,
  } = useCuisineScope();

  const previewRestaurants = scopedRestaurants.slice(
    0,
    HOME_RESTAURANT_PREVIEW,
  );
  const hasMoreRestaurants =
    scopedRestaurants.length > HOME_RESTAURANT_PREVIEW;

  return (
    <div className="mx-auto max-w-lg bg-surface pb-4">
      <div className="sticky top-12 z-30 border-b border-border bg-surface px-4 py-2.5 sm:top-14">
        <SearchBox inputId="home-search" variant="compact" />
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-4 pt-3">
        <Link
          href={restaurantsAllHref}
          className="flex items-center gap-2.5 rounded-2xl border border-border bg-background p-3 shadow-sm transition-colors active:bg-background/80"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <ForkKnife size={22} weight="duotone" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold">طعام</p>
            <p className="text-[11px] text-muted">
              {cuisine === "الكل" ? "كل المطاعم" : `مطاعم ${cuisine}`}
            </p>
          </div>
        </Link>
        <Link
          href="/restaurants?filter=grocery"
          className="flex items-center gap-2.5 rounded-2xl border border-border bg-background p-3 shadow-sm transition-colors active:bg-background/80"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShoppingBag size={22} weight="duotone" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold">بقالة</p>
            <p className="text-[11px] text-muted">ماركت لقمة</p>
          </div>
        </Link>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {foodCuisines.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCuisine(c)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              cuisine === c
                ? "border-accent bg-accent text-white"
                : "border-border bg-background text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {promoMeals.length > 0 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {promoMeals.map((meal) => {
            const restaurant = getRestaurantById(meal.restaurantId);
            return (
              <Link
                key={meal.id}
                href={`/meals/${meal.id}?from=home`}
                className="relative h-28 w-[85%] shrink-0 overflow-hidden rounded-2xl sm:w-[70%]"
              >
                <Image
                  src={meal.image}
                  alt={meal.name}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="text-sm font-bold">{meal.name}</p>
                  <p className="text-xs text-white/80">
                    {restaurant?.name} · {formatPrice(getMealPrice(meal))}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex justify-between gap-1 px-4">
        {features.map((f) => (
          <Link
            key={f.label}
            href={f.href}
            className="flex w-16 flex-col items-center gap-1"
          >
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                f.color,
              )}
            >
              <f.Icon size={22} weight="duotone" aria-hidden />
            </span>
            <span className="text-center text-[10px] font-medium text-foreground">
              {f.label}
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-4" id="strong-offers">
        <div className="mb-1 flex items-center justify-between px-4">
          <h2 className="text-base font-bold">عروض قوية</h2>
          <Link href={offersAllHref} className="text-xs font-medium text-accent">
            عرض الكل
          </Link>
        </div>
        {offerMeals.length === 0 ? (
          <p className="border-y border-border px-4 py-8 text-center text-sm text-muted">
            لا توجد عروض في «{cuisine}» حالياً
          </p>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {offerMeals.slice(0, HOME_OFFER_PREVIEW).map((m) => (
              <MealListItem
                key={m.id}
                meal={m}
                href={`/meals/${m.id}?from=home`}
                restaurantName={getRestaurantById(m.restaurantId)?.name}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-4" id="nearby-restaurants">
        <div className="mb-1 flex items-center justify-between px-4">
          <h2 className="text-base font-bold">
            {cuisine === "الكل" ? "مطاعم قريبة" : `مطاعم ${cuisine}`}
          </h2>
          <Link
            href={restaurantsAllHref}
            className="text-xs font-medium text-accent"
          >
            عرض الكل
          </Link>
        </div>
        <div className="border-y border-border">
          {scopedRestaurants.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">
              لا توجد مطاعم في هذا التصنيف
            </p>
          ) : (
            previewRestaurants.map((r) => (
              <RestaurantListItem key={r.id} restaurant={r} />
            ))
          )}
        </div>
        {hasMoreRestaurants ? (
          <div className="px-4 py-3">
            <Link
              href={restaurantsAllHref}
              className="flex w-full items-center justify-center rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-accent transition-colors active:bg-background/80"
            >
              عرض الكل ({scopedRestaurants.length})
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
