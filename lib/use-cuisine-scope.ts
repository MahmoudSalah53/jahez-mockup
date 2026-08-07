"use client";

import { useMemo, useState } from "react";
import { Clock, Lightning, Percent, Tag } from "@phosphor-icons/react";
import { restaurants, cuisines } from "@/data/restaurants";
import { meals } from "@/data/meals";

export function useCuisineScope() {
  const [cuisine, setCuisine] = useState("الكل");

  const foodRestaurants = useMemo(
    () => restaurants.filter((r) => r.cuisine !== "بقالة"),
    [],
  );

  const scopedRestaurants = useMemo(() => {
    if (cuisine === "الكل") return foodRestaurants;
    return foodRestaurants.filter((r) => r.cuisine === cuisine);
  }, [cuisine, foodRestaurants]);

  const scopedRestaurantIds = useMemo(
    () => new Set(scopedRestaurants.map((r) => r.id)),
    [scopedRestaurants],
  );

  const scopedMeals = useMemo(
    () => meals.filter((m) => scopedRestaurantIds.has(m.restaurantId)),
    [scopedRestaurantIds],
  );

  const offerMeals = useMemo(
    () => scopedMeals.filter((m) => m.isOffer).slice(0, 8),
    [scopedMeals],
  );

  const promoMeals = useMemo(
    () => scopedMeals.filter((m) => m.isOffer).slice(0, 3),
    [scopedMeals],
  );

  const foodCuisines = useMemo(
    () => cuisines.filter((c) => c !== "بقالة"),
    [],
  );

  const features = useMemo(() => {
    const cuisineQuery =
      cuisine === "الكل" ? "" : `&cuisine=${encodeURIComponent(cuisine)}`;
    return [
      {
        href:
          cuisine === "الكل"
            ? "/offers"
            : `/offers?cuisine=${encodeURIComponent(cuisine)}`,
        label: "العروض",
        color: "bg-red-100 text-red-700",
        Icon: Tag,
      },
      {
        href: `/restaurants?filter=24h${cuisineQuery}`,
        label: "24 ساعة",
        color: "bg-orange-100 text-orange-700",
        Icon: Clock,
      },
      {
        href:
          cuisine === "الكل"
            ? "/offers?cashback=1"
            : `/offers?cashback=1&cuisine=${encodeURIComponent(cuisine)}`,
        label: "كاش باك",
        color: "bg-rose-100 text-rose-700",
        Icon: Percent,
      },
      {
        href: `/restaurants?filter=fast${cuisineQuery}`,
        label: "سريع",
        color: "bg-emerald-100 text-emerald-700",
        Icon: Lightning,
      },
    ];
  }, [cuisine]);

  const restaurantsAllHref =
    cuisine === "الكل"
      ? "/restaurants"
      : `/restaurants?cuisine=${encodeURIComponent(cuisine)}`;

  const offersAllHref =
    cuisine === "الكل"
      ? "/offers"
      : `/offers?cuisine=${encodeURIComponent(cuisine)}`;

  return {
    cuisine,
    setCuisine,
    foodCuisines,
    scopedRestaurants,
    scopedMeals,
    offerMeals,
    promoMeals,
    features,
    restaurantsAllHref,
    offersAllHref,
  };
}
