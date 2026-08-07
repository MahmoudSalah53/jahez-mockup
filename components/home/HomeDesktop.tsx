"use client";

import Link from "next/link";
import { ForkKnife, ShoppingBag } from "@phosphor-icons/react";
import { getRestaurantById } from "@/data/restaurants";
import { Hero } from "@/components/home/Hero";
import { SectionHeader } from "@/components/home/SectionHeader";
import { MealCard } from "@/components/MealCard";
import { RestaurantCard } from "@/components/RestaurantCard";
import { useCuisineScope } from "@/lib/use-cuisine-scope";
import { cn } from "@/lib/cn";

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

  return (
    <div className="bg-background pb-16">
      <Hero />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Link
            href={restaurantsAllHref}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <ForkKnife size={26} weight="duotone" aria-hidden />
            </span>
            <div>
              <p className="font-bold">طعام</p>
              <p className="text-sm text-muted">
                {cuisine === "الكل" ? "كل المطاعم" : `مطاعم ${cuisine}`}
              </p>
            </div>
          </Link>
          <Link
            href="/restaurants?filter=grocery"
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShoppingBag size={26} weight="duotone" aria-hidden />
            </span>
            <div>
              <p className="font-bold">بقالة</p>
              <p className="text-sm text-muted">ماركت لقمة</p>
            </div>
          </Link>
          {features.slice(0, 2).map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  f.color,
                )}
              >
                <f.Icon size={26} weight="duotone" aria-hidden />
              </span>
              <div>
                <p className="font-bold">{f.label}</p>
                <p className="text-sm text-muted">تصفح الآن</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {foodCuisines.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCuisine(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                cuisine === c
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-foreground hover:border-accent/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {features.map((f) => (
            <Link
              key={`chip-${f.label}`}
              href={f.href}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40"
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  f.color,
                )}
              >
                <f.Icon size={18} weight="duotone" aria-hidden />
              </span>
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <SectionHeader title="عروض قوية" href={offersAllHref} linkLabel="الكل">
        {offerMeals.length === 0 ? (
          <p className="rounded-2xl border border-border bg-surface px-6 py-12 text-center text-muted">
            لا توجد عروض في «{cuisine}» حالياً
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-5 lg:grid-cols-4">
            {offerMeals.map((m) => (
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
        title={cuisine === "الكل" ? "مطاعم قريبة" : `مطاعم ${cuisine}`}
        href={restaurantsAllHref}
        linkLabel="الكل"
      >
        {scopedRestaurants.length === 0 ? (
          <p className="rounded-2xl border border-border bg-surface px-6 py-12 text-center text-muted">
            لا توجد مطاعم في هذا التصنيف
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {scopedRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </SectionHeader>
    </div>
  );
}
