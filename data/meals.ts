import type { Meal } from "@/lib/types";
import catalog from "@/data/catalog.json";
import { restaurants } from "@/data/restaurants";

export const meals: Meal[] = catalog.restaurants.flatMap((r) =>
  r.meals.map((m) => m as Meal),
);

export function getMealById(id: string): Meal | undefined {
  return meals.find((m) => m.id === id);
}

export function getMealsByRestaurant(restaurantId: string): Meal[] {
  return meals.filter((m) => m.restaurantId === restaurantId);
}

export function getMealPrice(meal: Meal): number {
  return meal.isOffer && meal.offerPrice != null ? meal.offerPrice : meal.price;
}

export function searchCatalog(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { restaurants: [], meals: [] };
  }

  const matchedRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)),
  );

  const matchedMeals = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q),
  );

  return { restaurants: matchedRestaurants, meals: matchedMeals };
}

export type SearchSuggestion = {
  id: string;
  label: string;
  href: string;
  kind: "restaurant" | "meal";
  meta?: string;
};

export function getSearchSuggestions(
  query: string,
  limit = 3,
): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const items: SearchSuggestion[] = [];

  for (const r of restaurants) {
    if (
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q)
    ) {
      items.push({
        id: `r-${r.id}`,
        label: r.name,
        href: `/restaurants/${r.id}`,
        kind: "restaurant",
        meta: r.cuisine,
      });
    }
  }

  for (const m of meals) {
    if (
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    ) {
      items.push({
        id: `m-${m.id}`,
        label: m.name,
        href: `/meals/${m.id}?from=home`,
        kind: "meal",
        meta: "وجبة",
      });
    }
  }

  return items.slice(0, limit);
}

export function lineUnitPrice(
  meal: Meal,
  spicy: boolean,
  addons: { price: number }[],
): number {
  const base = getMealPrice(meal);
  const spicyFee = spicy && meal.spicyOption ? 2 : 0;
  const addonsTotal = addons.reduce((s, a) => s + a.price, 0);
  return base + spicyFee + addonsTotal;
}
