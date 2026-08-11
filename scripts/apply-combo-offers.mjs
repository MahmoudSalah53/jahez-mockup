/**
 * Rebuild restaurant offers: diverse kinds (combo/family/bogo/gift/party)
 * with unique names per restaurant — not all titled «كومبو».
 *
 * Run: node scripts/apply-combo-offers.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { dishImage, realisticPrice } from "./catalog-media.mjs";

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


/**
 * Each cuisine: 3 templates — combo | family | deal (generic «عرض»).
 * Clear Arabic titles (no 1+1 / هدية / باقة). Restaurant name appended for uniqueness.
 */
const OFFERS_BY_CUISINE = {
  مشاوي: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة مشاوي فردية",
      description: "طبق رئيسي مع أرز وسلطة ومشروب — وجبة كاملة لشخص واحد.",
      includes: ["شيش طاووق", "أرز أبيض", "سلطة", "مشروب غازي"],
      price: 32,
      calories: 980,
      protein: 48,
      carbs: 85,
      fat: 38,
      spicy: true,
    },
    {
      slug: "offer-2",
      kind: "family",
      nameTitle: "وجبة عائلية مشاوي",
      description: "تشكيلة تكفي ٣–٤ أشخاص مع مقبلات ومشروبات.",
      includes: ["مشكل مشاوي", "حمص", "خبز", "بطاطس", "٢ مشروب"],
      price: 109,
      calories: 2400,
      protein: 120,
      carbs: 180,
      fat: 110,
      spicy: true,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "اشتري كباب واحصل على الثاني مجاناً",
      description: "عرض: كبابين بنفس السعر — مع طحينة ومخلل.",
      includes: ["كباب لحم", "كباب لحم إضافي", "طحينة", "مخلل"],
      price: 41,
      calories: 1100,
      protein: 52,
      carbs: 40,
      fat: 55,
      spicy: true,
    },
  ],
  شامي: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة شاورما كاملة",
      description: "شاورما مع بطاطس ومشروب وسلطة.",
      includes: ["شاورما دجاج", "بطاطس", "سلطة", "ثوم", "مشروب"],
      price: 26,
      calories: 920,
      protein: 38,
      carbs: 78,
      fat: 36,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "deal",
      nameTitle: "عرض فلافل: صحنين ومشروب",
      description: "صحنان فلافل مع مخلل ومشروب بسعر واحد.",
      includes: ["فلافل صحن", "فلافل صحن", "مشروب", "مخلل"],
      price: 38,
      calories: 820,
      protein: 28,
      carbs: 90,
      fat: 30,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "تشكيلة مقبلات بسعر ثابت",
      description: "حمص ومتبل وفتوش وخبز وعصير — خمسة أصناف بسعر واحد.",
      includes: ["حمص", "متبل", "فتوش", "خبز عربي", "عصير"],
      price: 68,
      calories: 980,
      protein: 26,
      carbs: 95,
      fat: 42,
      spicy: false,
    },
  ],
  برجر: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة برجر كاملة",
      description: "برجر مع بطاطس ومشروب.",
      includes: ["برجر لحم", "بطاطس كبيرة", "كولا"],
      price: 32,
      calories: 1150,
      protein: 36,
      carbs: 95,
      fat: 52,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "family",
      nameTitle: "وجبة عائلية برجر",
      description: "أربعة برجر مع بطاطس عائلية وأربعة مشروبات.",
      includes: ["٤ برجر", "بطاطس عائلية", "٤ مشروب", "صوصات"],
      price: 89,
      calories: 3200,
      protein: 120,
      carbs: 280,
      fat: 160,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "اشتري برجر دجاج واحصل على الثاني مجاناً",
      description: "عرض برجرين دجاج بنفس السعر.",
      includes: ["تشيكن برجر", "تشيكن برجر إضافي"],
      price: 36,
      calories: 980,
      protein: 40,
      carbs: 80,
      fat: 42,
      spicy: true,
    },
  ],
  ياباني: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة سوشي خفيفة",
      description: "رولز مع شوربة وشاي.",
      includes: ["رول كاليفورنيا", "سوشي ×٤", "ميسو", "شاي أخضر"],
      price: 78,
      calories: 720,
      protein: 34,
      carbs: 82,
      fat: 22,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "deal",
      nameTitle: "عرض رامن مع جيوزا",
      description: "رامن وإدامامي وأربع قطع جيوزا بسعر واحد.",
      includes: ["رامن", "جيوزا ×٤", "إدامامي"],
      price: 58,
      calories: 880,
      protein: 36,
      carbs: 90,
      fat: 28,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "تشكيلة ساشيمي بسعر ثابت",
      description: "ساشيمي مشكل مع زنجبيل وواسابي وأرز للمشاركة.",
      includes: ["ساشيمي مشكل", "زنجبيل", "واسابي", "أرز"],
      price: 129,
      calories: 640,
      protein: 55,
      carbs: 40,
      fat: 20,
      spicy: false,
    },
  ],
  حلويات: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "حلا مع قهوة",
      description: "قطعة حلا مع مشروب ساخن.",
      includes: ["قطعة حلا", "لاتيه أو شاي"],
      price: 36,
      calories: 520,
      protein: 10,
      carbs: 60,
      fat: 22,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "deal",
      nameTitle: "اشتري كنافة واحصل على الثانية مجاناً",
      description: "عرض كنافتين مع قطر بنفس السعر.",
      includes: ["كنافة", "كنافة إضافية", "قطر"],
      price: 32,
      calories: 780,
      protein: 14,
      carbs: 90,
      fat: 32,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "عرض وافل مع آيس كريم",
      description: "وافل وسكوب آيس كريم وصوص بسعر واحد.",
      includes: ["وافل", "سكوب آيس كريم", "صوص"],
      price: 34,
      calories: 680,
      protein: 10,
      carbs: 85,
      fat: 28,
      spicy: false,
    },
  ],
  إيطالي: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة بيتزا فردية",
      description: "بيتزا شخصية مع سلطة ومشروب.",
      includes: ["بيتزا صغيرة", "سلطة", "مشروب"],
      price: 55,
      calories: 980,
      protein: 32,
      carbs: 105,
      fat: 36,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "family",
      nameTitle: "وجبة عائلية بيتزا",
      description: "بيتزا كبيرة مع مقبلات ومشروبين للعائلة.",
      includes: ["بيتزا كبيرة", "بروشيتا", "٢ مشروب"],
      price: 99,
      calories: 1800,
      protein: 60,
      carbs: 190,
      fat: 70,
      spicy: true,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "اشتري باستا واحصل على الثانية مجاناً",
      description: "عرض طبقي باستا مع ثوم محمص.",
      includes: ["باستا", "باستا إضافية", "ثوم محمص"],
      price: 48,
      calories: 1100,
      protein: 36,
      carbs: 120,
      fat: 40,
      spicy: false,
    },
  ],
  هندي: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة برياني كاملة",
      description: "برياني مع رايتا ونان ومشروب.",
      includes: ["برياني دجاج", "رايتا", "نان", "لاسي"],
      price: 54,
      calories: 1050,
      protein: 40,
      carbs: 110,
      fat: 32,
      spicy: true,
    },
    {
      slug: "offer-2",
      kind: "family",
      nameTitle: "وجبة عائلية ثالي",
      description: "تشكيلة أطباق هندية تكفي العائلة.",
      includes: ["دال", "كاري", "أرز", "نان", "مخلل"],
      price: 119,
      calories: 1600,
      protein: 55,
      carbs: 180,
      fat: 50,
      spicy: true,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "عرض كاري مع أرز ونان",
      description: "تيكا ماسالا وأرز ونان بسعر واحد.",
      includes: ["تيكا ماسالا", "أرز", "نان"],
      price: 52,
      calories: 900,
      protein: 38,
      carbs: 90,
      fat: 34,
      spicy: true,
    },
  ],
  سعودي: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة كبسة فردية",
      description: "كبسة مع سلطة وتمر ومشروب.",
      includes: ["كبسة دجاج", "سلطة", "تمر", "مشروب"],
      price: 48,
      calories: 950,
      protein: 40,
      carbs: 95,
      fat: 28,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "family",
      nameTitle: "وجبة عائلية مندي",
      description: "مندي لحم تكفي العائلة مع شوربة وسلطة ومشروبين.",
      includes: ["مندي لحم", "شوربة", "سلطة", "٢ مشروب"],
      price: 99,
      calories: 2200,
      protein: 110,
      carbs: 180,
      fat: 90,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "عرض ضيافة: جريش وهريس وتمر",
      description: "أربعة أصناف للضيافة بسعر ثابت مع قهوة عربية.",
      includes: ["جريش", "هريس صغير", "تمر", "قهوة عربية"],
      price: 79,
      calories: 1100,
      protein: 40,
      carbs: 120,
      fat: 35,
      spicy: false,
    },
  ],
  بحري: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة سمك مشوي",
      description: "سمك مع أرز وسلطة ومشروب.",
      includes: ["سمك مشوي", "أرز", "سلطة", "ليمون", "مشروب"],
      price: 68,
      calories: 780,
      protein: 48,
      carbs: 55,
      fat: 28,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "family",
      nameTitle: "وجبة عائلية بحرية",
      description: "سمك وروبيان وأرز وسلطة ومشروبين للمشاركة.",
      includes: ["سمك", "روبيان", "أرز", "سلطة", "٢ مشروب"],
      price: 109,
      calories: 1600,
      protein: 95,
      carbs: 100,
      fat: 60,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "اشتري روبيان واحصل على الثاني مجاناً",
      description: "عرض روبيانين مع صوص ثوم بنفس السعر.",
      includes: ["روبيان مقلي", "روبيان مقلي إضافي", "صوص ثوم"],
      price: 74,
      calories: 900,
      protein: 50,
      carbs: 40,
      fat: 45,
      spicy: false,
    },
  ],
  صحي: [
    {
      slug: "offer-1",
      kind: "combo",
      nameTitle: "وجبة بروتين خفيفة",
      description: "صدر دجاج مع سلطة وبطاطا حلوة وماء.",
      includes: ["صدر دجاج", "سلطة", "بطاطا حلوة", "ماء"],
      price: 52,
      calories: 520,
      protein: 48,
      carbs: 40,
      fat: 14,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "deal",
      nameTitle: "عرض بول مع سموذي",
      description: "كينوا بول وسموذي بسعر واحد.",
      includes: ["كينوا بول", "سموذي"],
      price: 48,
      calories: 480,
      protein: 20,
      carbs: 55,
      fat: 14,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "deal",
      nameTitle: "عرض ٣ سلطات بسعر ثابت",
      description: "سلطة دجاج وتونة وخضراء — ثلاثة أصناف بسعر واحد.",
      includes: ["سلطة دجاج", "سلطة تونة", "سلطة خضراء"],
      price: 79,
      calories: 720,
      protein: 55,
      carbs: 40,
      fat: 28,
      spicy: false,
    },
  ],
  بقالة: [
    {
      slug: "offer-1",
      kind: "deal",
      nameTitle: "عرض فطور البيت",
      description: "توست وبيض وجبنة وحليب — أربعة أصناف بسعر ثابت.",
      includes: ["خبز توست", "بيض", "جبنة", "حليب"],
      price: 29,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      spicy: false,
    },
    {
      slug: "offer-2",
      kind: "deal",
      nameTitle: "عرض مياه مع عصير",
      description: "مياه ٦ عبوات مع عصير بسعر واحد.",
      includes: ["مياه ٦ عبوات", "عصير"],
      price: 14,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      spicy: false,
    },
    {
      slug: "offer-3",
      kind: "family",
      nameTitle: "عرض ضيافة للعائلة",
      description: "تمر ومياه وعصير وقهوة للضيوف.",
      includes: ["تمر", "مياه", "عصير", "قهوة"],
      price: 45,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      spicy: false,
    },
  ],
};

const FALLBACK_OFFERS = OFFERS_BY_CUISINE["برجر"];

const MEAL_KEYS = [
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

function assertMealKeys(m) {
  for (const k of MEAL_KEYS) {
    if (!(k in m)) throw new Error(`meal ${m.id} missing ${k}`);
  }
}

function normalizeRegularMeal(m) {
  const next = { ...m };
  if (!String(m.id).includes("-offer-") && !String(m.id).includes("-combo-")) {
    next.isOffer = false;
    next.offerPrice = null;
    next.isCombo = false;
    next.offerKind = null;
    next.comboIncludes = [];
    if (next.category === "offers") {
      next.category = next.isPopular ? "popular" : "menu";
    }
  }
  if (!("offerKind" in next)) next.offerKind = null;
  if (!Array.isArray(next.comboIncludes)) next.comboIncludes = [];
  if (typeof next.isCombo !== "boolean") next.isCombo = false;
  return next;
}

function buildOfferMeal(restaurant, template) {
  const drafted = {
    ...template,
    isOffer: true,
    offerKind: template.kind,
    price: template.price,
  };
  return {
    id: `${restaurant.id}-${template.slug}`,
    restaurantId: restaurant.id,
    name: template.nameTitle,
    description: template.description,
    image: dishImage(template.nameTitle, restaurant.cuisine),
    price: realisticPrice(drafted, restaurant.cuisine),
    rating: 4.6,
    calories: template.calories,
    protein: template.protein,
    carbs: template.carbs,
    fat: template.fat,
    category: "offers",
    isPopular: false,
    isOffer: true,
    offerPrice: null,
    isCombo: true,
    offerKind: template.kind,
    comboIncludes: [...template.includes],
    spicyOption: Boolean(template.spicy),
    cashbackPercent: null,
    addons: getAddonsForCuisine(restaurant.cuisine),
  };
}

function upgradeRestaurant(r) {
  const regular = r.meals
    .filter(
      (m) =>
        !String(m.id).includes("-combo-") && !String(m.id).includes("-offer-"),
    )
    .map(normalizeRegularMeal)
    .map((m) => ({
      ...m,
      addons: getAddonsForCuisine(r.cuisine),
      offerKind: null,
      isCombo: false,
      isOffer: false,
      offerPrice: null,
      comboIncludes: [],
    }));

  const templates = OFFERS_BY_CUISINE[r.cuisine] ?? FALLBACK_OFFERS;

  const offers = templates.map((t) => buildOfferMeal(r, t));

  for (const m of [...regular, ...offers]) assertMealKeys(m);

  return { ...r, meals: [...regular, ...offers] };
}

const partFiles = readdirSync(catalogDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const merged = [];
const seen = new Set();

for (const file of partFiles) {
  const path = join(catalogDir, file);
  const part = JSON.parse(readFileSync(path, "utf8"));
  const restaurants = part.restaurants.map(upgradeRestaurant);
  writeFileSync(path, JSON.stringify({ restaurants }, null, 2) + "\n", "utf8");

  let offerCount = 0;
  for (const r of restaurants) {
    offerCount += r.meals.filter((m) => m.isOffer).length;
    if (!seen.has(r.id)) {
      seen.add(r.id);
      merged.push(r);
    }
  }
  console.log(`upgraded ${file}: ${restaurants.length} restaurants, ${offerCount} offers`);
}

writeFileSync(
  join(root, "data", "catalog.json"),
  JSON.stringify({ restaurants: merged }, null, 2) + "\n",
  "utf8",
);

const offers = merged.flatMap((r) => r.meals.filter((m) => m.isOffer));
const names = new Set(offers.map((m) => m.name));
const kinds = {};
for (const m of offers) kinds[m.offerKind] = (kinds[m.offerKind] || 0) + 1;
const comboNamed = offers.filter((m) => m.name.startsWith("كومبو")).length;

console.log(
  `merged: ${merged.length} restaurants, ${offers.length} offers, unique names ${names.size}`,
);
console.log("kinds", kinds);
console.log("names starting with كومبو", comboNamed);
