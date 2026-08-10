/**
 * Rewrite meal/combo addons to be cuisine-aware.
 * Run: node scripts/apply-cuisine-addons.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const catalogDir = join(root, "data", "catalog");

const ADDONS_BY_CUISINE = {
  مشاوي: [
    { id: "garlic-sauce", name: "صوص ثوم", price: 3 },
    { id: "pickles", name: "مخلل", price: 3 },
    { id: "extra-rice", name: "أرز إضافي", price: 6 },
    { id: "cola", name: "كولا", price: 6 },
    { id: "side-salad", name: "سلطة صغيرة", price: 8 },
  ],
  سعودي: [
    { id: "garlic-sauce", name: "صوص ثوم", price: 3 },
    { id: "pickles", name: "مخلل", price: 3 },
    { id: "extra-rice", name: "أرز إضافي", price: 6 },
    { id: "cola", name: "كولا", price: 6 },
    { id: "side-salad", name: "سلطة صغيرة", price: 8 },
  ],
  برجر: [
    { id: "extra-cheese", name: "جبنة إضافية", price: 5 },
    { id: "bacon", name: "بيكون", price: 8 },
    { id: "large-fries", name: "بطاطس كبيرة", price: 10 },
    { id: "cola", name: "كولا", price: 6 },
    { id: "spicy-sauce", name: "صوص سبايسي", price: 3 },
  ],
  شامي: [
    { id: "extra-garlic", name: "ثوم إضافي", price: 3 },
    { id: "pickles", name: "مخلل", price: 3 },
    { id: "fries", name: "بطاطس مقلية", price: 8 },
    { id: "drink", name: "مشروب غازي", price: 6 },
    { id: "arabic-bread", name: "خبز عربي", price: 4 },
  ],
  ياباني: [
    { id: "extra-soy", name: "صوص صويا إضافي", price: 2 },
    { id: "ginger", name: "زنجبيل", price: 2 },
    { id: "edamame", name: "إدامامي", price: 10 },
    { id: "green-tea", name: "شاي أخضر", price: 8 },
    { id: "gyoza-2", name: "جيوزا ×٢", price: 12 },
  ],
  إيطالي: [
    { id: "parmesan", name: "جبنة بارميزان", price: 6 },
    { id: "garlic-bread", name: "ثوم محمص", price: 8 },
    { id: "extra-sauce", name: "صلصة زيادة", price: 4 },
    { id: "drink", name: "مشروب", price: 6 },
    { id: "side-salad", name: "سلطة صغيرة", price: 10 },
  ],
  هندي: [
    { id: "extra-naan", name: "نان إضافي", price: 7 },
    { id: "raita", name: "رايتا", price: 5 },
    { id: "indian-pickle", name: "مخلل هندي", price: 4 },
    { id: "lassi", name: "لاسي", price: 10 },
    { id: "extra-rice", name: "أرز إضافي", price: 6 },
  ],
  بحري: [
    { id: "garlic-sauce", name: "صوص ثوم", price: 3 },
    { id: "lemon", name: "ليمون إضافي", price: 2 },
    { id: "extra-rice", name: "أرز", price: 6 },
    { id: "side-salad", name: "سلطة", price: 8 },
    { id: "drink", name: "مشروب", price: 6 },
  ],
  صحي: [
    { id: "avocado", name: "أفوكادو", price: 8 },
    { id: "boiled-egg", name: "بيض مسلوق", price: 4 },
    { id: "yogurt-sauce", name: "صوص يوناني", price: 3 },
    { id: "water", name: "ماء", price: 3 },
    { id: "extra-salad", name: "سلطة زيادة", price: 8 },
  ],
  حلويات: [
    { id: "choc-sauce", name: "صوص شوكولاتة", price: 4 },
    { id: "ice-scoop", name: "سكوب آيس كريم", price: 8 },
    { id: "cream", name: "كريمة", price: 4 },
    { id: "extra-coffee", name: "قهوة إضافية", price: 10 },
    { id: "nuts", name: "مكسرات", price: 6 },
  ],
  بقالة: [],
};

function getAddonsForCuisine(cuisine) {
  const list = ADDONS_BY_CUISINE[cuisine] ?? ADDONS_BY_CUISINE["برجر"];
  return list.map((a) => ({ ...a }));
}

const partFiles = readdirSync(catalogDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const merged = [];
const seen = new Set();
const summary = {};

for (const file of partFiles) {
  const path = join(catalogDir, file);
  const part = JSON.parse(readFileSync(path, "utf8"));
  const restaurants = part.restaurants.map((r) => {
    const addons = getAddonsForCuisine(r.cuisine);
    summary[r.cuisine] = addons.map((a) => a.name).join(" · ") || "(none)";
    return {
      ...r,
      meals: r.meals.map((m) => ({
        ...m,
        addons: addons.map((a) => ({ ...a })),
      })),
    };
  });

  writeFileSync(path, JSON.stringify({ restaurants }, null, 2) + "\n", "utf8");

  for (const r of restaurants) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    merged.push(r);
  }
  console.log(`updated ${file}: ${restaurants.length} restaurants`);
}

writeFileSync(
  join(root, "data", "catalog.json"),
  JSON.stringify({ restaurants: merged }, null, 2) + "\n",
  "utf8",
);

console.log("\naddons by cuisine:");
for (const [c, names] of Object.entries(summary).sort()) {
  console.log(`  ${c}: ${names}`);
}
console.log(`\nmerged: ${merged.length} restaurants`);
