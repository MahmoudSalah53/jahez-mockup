/**
 * - Reassign images on GENERATED restaurants/meals/offers only
 * - Lower prices on ALL meals (including original 11)
 *
 * Run: node scripts/apply-images-and-prices.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  dishImage,
  realisticPrice,
  restaurantCover,
} from "./catalog-media.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const catalogDir = join(root, "data", "catalog");

const original = JSON.parse(
  readFileSync(join(catalogDir, "00-original.json"), "utf8"),
);
const originalIds = new Set(original.restaurants.map((r) => r.id));

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function patchRestaurant(r, { touchImages }) {
  const cuisine = r.cuisine;
  const next = { ...r };

  if (touchImages) {
    next.image = restaurantCover(cuisine, hashSeed(r.id));
  }

  next.meals = r.meals.map((m, i) => {
    const meal = { ...m, price: realisticPrice(m, cuisine) };
    if (touchImages) {
      meal.image = dishImage(m.name, cuisine, hashSeed(m.id) + i);
    }
    return meal;
  });

  return next;
}

const partFiles = readdirSync(catalogDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const merged = [];
const seen = new Set();

for (const file of partFiles) {
  const path = join(catalogDir, file);
  const part = JSON.parse(readFileSync(path, "utf8"));
  const isOriginalPart = file === "00-original.json";

  const restaurants = part.restaurants.map((r) =>
    patchRestaurant(r, {
      touchImages: !isOriginalPart && !originalIds.has(r.id),
    }),
  );

  writeFileSync(path, JSON.stringify({ restaurants }, null, 2) + "\n", "utf8");

  for (const r of restaurants) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    merged.push(r);
  }
  console.log(
    `patched ${file}: ${restaurants.length} restaurants (images=${!isOriginalPart})`,
  );
}

writeFileSync(
  join(root, "data", "catalog.json"),
  JSON.stringify({ restaurants: merged }, null, 2) + "\n",
  "utf8",
);

const meals = merged.flatMap((r) => r.meals);
const prices = meals.map((m) => m.price).sort((a, b) => a - b);
console.log(
  `merged ${merged.length} restaurants, ${meals.length} meals, price ${prices[0]}–${prices[prices.length - 1]} med ${prices[Math.floor(prices.length / 2)]}`,
);
