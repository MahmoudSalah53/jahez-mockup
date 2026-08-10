import { readFileSync } from "fs";

const catalog = JSON.parse(
  readFileSync(new URL("../data/catalog.json", import.meta.url), "utf8"),
) as {
  restaurants: Record<string, unknown>[];
};

const restaurantKeys = [
  "id",
  "name",
  "image",
  "rating",
  "cuisine",
  "deliveryTime",
  "deliveryFee",
  "minOrder",
  "distanceKm",
  "verified",
  "tags",
  "featured",
  "open24h",
  "fastDelivery",
  "meals",
];

const mealKeys = [
  "id",
  "restaurantId",
  "name",
  "description",
  "image",
  "price",
  "rating",
  "calories",
  "protein",
  "carbs",
  "fat",
  "category",
  "isPopular",
  "isOffer",
  "offerPrice",
  "isCombo",
  "offerKind",
  "comboIncludes",
  "spicyOption",
  "cashbackPercent",
  "addons",
];

function assertKeys(obj: Record<string, unknown>, keys: string[], label: string) {
  for (const key of keys) {
    if (!(key in obj)) throw new Error(`${label} missing key: ${key}`);
  }
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) throw new Error(`${label} unexpected key: ${key}`);
  }
}

let mealCount = 0;
for (const r of catalog.restaurants) {
  assertKeys(r, restaurantKeys, `restaurant ${String(r.id)}`);
  const meals = r.meals as Record<string, unknown>[];
  for (const m of meals) {
    assertKeys(m, mealKeys, `meal ${String(m.id)}`);
    mealCount += 1;
  }
}

console.log(
  `catalog ok: ${catalog.restaurants.length} restaurants, ${mealCount} meals, uniform keys`,
);
