"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Heart } from "@phosphor-icons/react";
import { getMealById, getMealPrice, lineUnitPrice } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { StarRating } from "@/components/StarRating";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { registerMealOptionsController } from "@/lib/meal-options-bridge";
import { useSaved } from "@/lib/saved-context";
import type { CartAddon } from "@/lib/types";
import { cn } from "@/lib/cn";

export function MealDetailClient() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const meal = getMealById(params.id);
  const { addItem } = useCart();
  const { isSaved, toggleSaved } = useSaved();

  const [spicy, setSpicy] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const from = searchParams.get("from");

  // Voice RPC luqma.setMealOptions → tick addons / spicy / qty on this page
  useEffect(() => {
    if (!meal) return;
    return registerMealOptionsController({
      mealId: meal.id,
      apply: ({ quantity, spicy: nextSpicy, addonIds }) => {
        const selected = (meal.addons ?? []).filter((a) =>
          addonIds.includes(a.id),
        );
        setQty(Math.max(1, quantity));
        setSpicy(Boolean(nextSpicy) && meal.spicyOption);
        setSelectedAddons(selected);
        return { ok: true, selected: selected.map((a) => a.id) };
      },
    });
  }, [meal]);

  // Smart back: Home/Offers/Search → Meal → (browser Back) → Restaurant
  // Push a same-URL guard; on popstate soft-navigate (Voice stays open).
  useEffect(() => {
    if (!meal) return;

    const needsStack =
      from === "home" || from === "offers" || from === "search";
    if (!needsStack) return;

    const restaurantUrl = `/restaurants/${meal.restaurantId}`;
    let armed = true;
    window.history.pushState(
      { luqma: "meal-guard", restaurantId: meal.restaurantId },
      "",
    );

    function onPopState() {
      if (!armed) return;
      armed = false;
      router.replace(restaurantUrl);
    }

    window.addEventListener("popstate", onPopState);
    return () => {
      armed = false;
      window.removeEventListener("popstate", onPopState);
    };
  }, [meal, from, router]);

  const restaurant = meal ? getRestaurantById(meal.restaurantId) : undefined;

  const unitPrice = useMemo(() => {
    if (!meal) return 0;
    return lineUnitPrice(meal, spicy, selectedAddons);
  }, [meal, spicy, selectedAddons]);

  if (!meal) {
    return (
      <div className="px-4 py-16 text-center text-muted">الوجبة غير موجودة</div>
    );
  }

  function toggleAddon(addon: CartAddon) {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      return exists ? prev.filter((a) => a.id !== addon.id) : [...prev, addon];
    });
  }

  function handleAdd() {
    if (!meal) return;
    addItem({
      mealId: meal.id,
      quantity: qty,
      spicy: meal.spicyOption ? spicy : false,
      addons: selectedAddons,
      unitPrice,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  function goBack() {
    if (!restaurant) {
      router.back();
      return;
    }
    const url = `/restaurants/${restaurant.id}`;
    if (from === "home" || from === "offers" || from === "search") {
      router.replace(url);
    } else {
      router.push(url);
    }
  }

  const saved = isSaved(meal.id);
  const basePrice = getMealPrice(meal);

  return (
    <div className="mx-auto max-w-lg pb-8 md:max-w-7xl md:px-8 md:py-10">
      <div className="md:grid md:grid-cols-2 md:items-start md:gap-10">
        <div className="relative aspect-[5/3] bg-border md:sticky md:top-24 md:aspect-[4/3] md:overflow-hidden md:rounded-3xl md:shadow-lg">
          <Image
            src={meal.image}
            alt={meal.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={goBack}
            className="absolute start-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/95 text-lg shadow"
            aria-label="رجوع للمطعم"
          >
            →
          </button>
          {meal.isOffer && (
            <span className="absolute end-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-bold text-white">
              عرض
            </span>
          )}
        </div>

        <div className="px-4 pt-4 md:px-0 md:pt-0">
          <h1 className="text-xl font-bold md:text-3xl">{meal.name}</h1>
          {restaurant && (
            <Link
              href={`/restaurants/${restaurant.id}`}
              className="mt-1 inline-block text-sm text-accent"
            >
              {restaurant.name}
            </Link>
          )}
          <div className="mt-2">
            <StarRating rating={meal.rating} size="md" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            {meal.description}
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-accent md:text-2xl">
              {formatPrice(basePrice)}
            </span>
            {meal.isOffer && meal.offerPrice != null && (
              <span className="text-sm text-muted line-through">
                {formatPrice(meal.price)}
              </span>
            )}
            {meal.cashbackPercent ? (
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                كاش باك {meal.cashbackPercent}%
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl border border-border bg-background p-3 text-center">
            <Nutrient label="سعرات" value={`${meal.calories}`} />
            <Nutrient label="بروتين" value={`${meal.protein}غ`} />
            <Nutrient label="كارب" value={`${meal.carbs}غ`} />
            <Nutrient label="دهون" value={`${meal.fat}غ`} />
          </div>

          {meal.spicyOption && (
            <label className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
              <span className="text-sm font-medium">سبايسي (+2 ر.س)</span>
              <input
                type="checkbox"
                checked={spicy}
                onChange={(e) => setSpicy(e.target.checked)}
                className="h-5 w-5 accent-[var(--accent)]"
              />
            </label>
          )}

          {meal.addons.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-2 text-sm font-bold">إضافات</h2>
              <ul className="space-y-2">
                {meal.addons.map((addon) => {
                  const checked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <li key={addon.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors",
                          checked
                            ? "border-accent bg-accent-soft"
                            : "border-border bg-surface",
                        )}
                      >
                        <span className="font-medium">
                          {addon.name}{" "}
                          <span className="text-muted">
                            (+{formatPrice(addon.price)})
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddon(addon)}
                          className="h-5 w-5 accent-[var(--accent)]"
                        />
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
            <span className="text-sm font-medium">الكمية</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="إنقاص"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-lg"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="زيادة"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted">الإجمالي للسطر</span>
            <span className="text-lg font-bold text-accent">
              {formatPrice(unitPrice * qty)}
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              {added ? "تمت الإضافة" : "أضف إلى السلة"}
            </button>
            <button
              type="button"
              onClick={() => toggleSaved(meal.id)}
              className={cn(
                "flex items-center justify-center rounded-xl border px-4 py-3.5",
                saved
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted",
              )}
              aria-label={saved ? "إزالة من المحفوظات" : "حفظ"}
            >
              <Heart size={20} weight={saved ? "fill" : "regular"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Nutrient({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted">{label}</p>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  );
}
