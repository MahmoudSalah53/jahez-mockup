import type { Restaurant } from "@/lib/types";
import catalog from "@/data/load-catalog";

export type CatalogRestaurant = (typeof catalog.restaurants)[number];

export const restaurants: Restaurant[] = catalog.restaurants.map(
  ({ meals: _meals, ...restaurant }) => restaurant,
);

export const cuisines = [
  "الكل",
  ...Array.from(new Set(restaurants.map((r) => r.cuisine))),
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}

export function filterRestaurants(
  filter?: string | null,
  cuisine?: string | null,
): Restaurant[] {
  let list = restaurants;

  if (filter === "24h") list = list.filter((r) => r.open24h);
  else if (filter === "fast") list = list.filter((r) => r.fastDelivery);
  else if (filter === "grocery")
    list = list.filter((r) => r.cuisine === "بقالة");
  else if (!filter || filter === "all") {
    // keep all unless cuisine narrows
  }

  if (cuisine && cuisine !== "الكل") {
    list = list.filter((r) => r.cuisine === cuisine);
  } else if (!filter || filter === "all") {
    if (filter !== "grocery") {
      list = list.filter((r) => r.cuisine !== "بقالة");
    }
  }

  return list;
}
