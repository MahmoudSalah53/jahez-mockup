/**
 * Migrate catalog parts: offers = food combos (not price discounts).
 * - Clears discount-style isOffer / offerPrice on regular meals
 * - Adds isCombo + comboIncludes
 * - Appends 2–3 combo meals per restaurant
 *
 * Run: node scripts/apply-combo-offers.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const catalogDir = join(root, "data", "catalog");

const DEFAULT_ADDONS = [
  { id: "extra-cheese", name: "جبنة إضافية", price: 5 },
  { id: "bacon", name: "بيكون", price: 8 },
  { id: "large-fries", name: "بطاطس كبيرة", price: 10 },
  { id: "cola", name: "كولا", price: 6 },
  { id: "spicy-sauce", name: "صوص سبايسي", price: 3 },
];

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
  برجر: DEFAULT_ADDONS,
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
  const list = ADDONS_BY_CUISINE[cuisine] ?? DEFAULT_ADDONS;
  return list.map((a) => ({ ...a }));
}

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
  "comboIncludes",
  "spicyOption",
  "cashbackPercent",
  "addons",
];

/** cuisine -> 3 combo templates */
const COMBOS_BY_CUISINE = {
  مشاوي: [
    {
      slug: "combo-1",
      name: "كومبو مشاوي فردي",
      description: "وجبة كاملة: مشاوي مع أرز ومشروب.",
      includes: ["شيش طاووق", "أرز أبيض", "سلطة", "مشروب غازي"],
      price: 59,
      calories: 980,
      protein: 48,
      carbs: 85,
      fat: 38,
      spicy: true,
    },
    {
      slug: "combo-2",
      name: "كومبو عائلي مشاوي",
      description: "تشكيلة مشاوي تكفي ٣–٤ أشخاص مع مقبلات.",
      includes: ["مشكل مشاوي", "حمص", "خبز", "بطاطس", "٢ مشروب"],
      price: 189,
      calories: 2400,
      protein: 120,
      carbs: 180,
      fat: 110,
      spicy: true,
    },
    {
      slug: "combo-3",
      name: "كومبو كباب كامل",
      description: "كباب لحم مع أرز ومقبلات ومشروب.",
      includes: ["كباب لحم", "أرز بخاري", "طحينة", "مخلل", "كولا"],
      price: 72,
      calories: 1100,
      protein: 52,
      carbs: 90,
      fat: 45,
      spicy: true,
    },
  ],
  شامي: [
    {
      slug: "combo-1",
      name: "كومبو شاورما كامل",
      description: "شاورما مع بطاطس ومشروب وسلطة.",
      includes: ["شاورما دجاج", "بطاطس مقلية", "سلطة", "ثوم", "مشروب"],
      price: 42,
      calories: 920,
      protein: 38,
      carbs: 78,
      fat: 36,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو مقبلات شامية",
      description: "تشكيلة مقبلات مع خبز ومشروب.",
      includes: ["حمص", "متبل", "فتوش", "خبز عربي", "عصير"],
      price: 48,
      calories: 780,
      protein: 22,
      carbs: 70,
      fat: 38,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو فلافل وجبة",
      description: "صحن فلافل كامل مع إضافات.",
      includes: ["فلافل", "حمص", "مخلل", "خبز", "مشروب"],
      price: 28,
      calories: 650,
      protein: 18,
      carbs: 72,
      fat: 24,
      spicy: false,
    },
  ],
  برجر: [
    {
      slug: "combo-1",
      name: "كومبو برجر كلاسيك",
      description: "برجر + بطاطس + مشروب.",
      includes: ["برجر لحم", "بطاطس كبيرة", "كولا"],
      price: 49,
      calories: 1150,
      protein: 36,
      carbs: 95,
      fat: 52,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو دبل تشيز",
      description: "دبل برجر مع بطاطس ومشروب.",
      includes: ["دبل تشيز برجر", "بطاطس", "صوص", "مشروب"],
      price: 62,
      calories: 1380,
      protein: 48,
      carbs: 90,
      fat: 68,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو تشيكن كرسبي",
      description: "برجر دجاج مقرمش وجبة كاملة.",
      includes: ["تشيكن برجر", "بطاطس", "سلطة كول سلو", "مشروب"],
      price: 46,
      calories: 1080,
      protein: 32,
      carbs: 98,
      fat: 48,
      spicy: true,
    },
  ],
  ياباني: [
    {
      slug: "combo-1",
      name: "كومبو سوشي للمبتدئين",
      description: "رولز مع ميسو ومشروب.",
      includes: ["رول كاليفورنيا", "سوشي سالمون ×٤", "شوربة ميسو", "شاي أخضر"],
      price: 78,
      calories: 720,
      protein: 34,
      carbs: 82,
      fat: 22,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو رامن وجبة",
      description: "رامن مع جيوزا ومشروب.",
      includes: ["رامن", "جيوزا ×٤", "إدامامي", "مشروب"],
      price: 68,
      calories: 980,
      protein: 38,
      carbs: 95,
      fat: 32,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو ترياكي كامل",
      description: "دجاج ترياكي مع أرز وسلطة.",
      includes: ["دجاج ترياكي", "أرز ياباني", "سلطة سي ويد", "مشروب"],
      price: 58,
      calories: 860,
      protein: 40,
      carbs: 88,
      fat: 20,
      spicy: false,
    },
  ],
  حلويات: [
    {
      slug: "combo-1",
      name: "كومبو حلا وقهوة",
      description: "تحلية مع مشروب ساخن.",
      includes: ["كنافة أو كيك", "لاتيه أو شاي", "تمر"],
      price: 36,
      calories: 620,
      protein: 12,
      carbs: 78,
      fat: 26,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو وافل آيس",
      description: "وافل مع آيس كريم وإضافات.",
      includes: ["وافل", "سكوب آيس كريم", "شوكولاتة", "فراولة"],
      price: 42,
      calories: 780,
      protein: 10,
      carbs: 95,
      fat: 34,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو بقلاوة وشاي",
      description: "بقلاوة مشكلة مع شاي كرك.",
      includes: ["بقلاوة مشكلة", "شاي كرك", "مكسرات"],
      price: 32,
      calories: 540,
      protein: 8,
      carbs: 62,
      fat: 28,
      spicy: false,
    },
  ],
  إيطالي: [
    {
      slug: "combo-1",
      name: "كومبو بيتزا فردي",
      description: "بيتزا شخصية مع مشروب وسلطة.",
      includes: ["بيتزا مارغريتا", "سلطة سيزر صغيرة", "مشروب"],
      price: 55,
      calories: 980,
      protein: 32,
      carbs: 105,
      fat: 36,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو باستا كامل",
      description: "باستا مع خبز وثوم ومشروب.",
      includes: ["باستا كاربونارا", "ثوم محمص", "مشروب"],
      price: 52,
      calories: 920,
      protein: 28,
      carbs: 88,
      fat: 38,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو عائلي بيتزا",
      description: "بيتزا كبيرة مع مقبلات ومشروبات.",
      includes: ["بيتزا كبيرة", "بروشيتا", "٢ مشروب"],
      price: 99,
      calories: 1800,
      protein: 60,
      carbs: 190,
      fat: 70,
      spicy: true,
    },
  ],
  هندي: [
    {
      slug: "combo-1",
      name: "كومبو برياني وجبة",
      description: "برياني مع رايتا ونان ومشروب.",
      includes: ["برياني دجاج", "رايتا", "نان", "لاسي أو مشروب"],
      price: 54,
      calories: 1050,
      protein: 40,
      carbs: 110,
      fat: 32,
      spicy: true,
    },
    {
      slug: "combo-2",
      name: "كومبو كاري كامل",
      description: "كاري مع أرز وخبز.",
      includes: ["تيكا ماسالا", "أرز بسمتي", "نان ثوم", "مشروب"],
      price: 58,
      calories: 980,
      protein: 38,
      carbs: 95,
      fat: 36,
      spicy: true,
    },
    {
      slug: "combo-3",
      name: "كومبو ثالي هندي",
      description: "تشكيلة أطباق صغيرة في وجبة واحدة.",
      includes: ["دال", "كاري خضار", "أرز", "نان", "مخلل"],
      price: 64,
      calories: 880,
      protein: 28,
      carbs: 100,
      fat: 28,
      spicy: true,
    },
  ],
  سعودي: [
    {
      slug: "combo-1",
      name: "كومبو كبسة فردي",
      description: "كبسة دجاج مع سلطة ومشروب.",
      includes: ["كبسة دجاج", "سلطة طحينة", "تمر", "مشروب"],
      price: 48,
      calories: 950,
      protein: 40,
      carbs: 95,
      fat: 28,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو مندي عائلي",
      description: "مندي لحم تكفي العائلة مع إضافات.",
      includes: ["مندي لحم", "شوربة", "سلطة", "٢ مشروب"],
      price: 149,
      calories: 2200,
      protein: 110,
      carbs: 180,
      fat: 90,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو جريش وهريس",
      description: "أطباق نجدية كلاسيكية في باكدج واحد.",
      includes: ["جريش", "هريس صغير", "تمر", "قهوة عربية"],
      price: 45,
      calories: 820,
      protein: 28,
      carbs: 90,
      fat: 26,
      spicy: false,
    },
  ],
  بحري: [
    {
      slug: "combo-1",
      name: "كومبو سمك مشوي",
      description: "سمك مع أرز وسلطة ومشروب.",
      includes: ["سمك مشوي", "أرز", "سلطة سيزر", "ليمون", "مشروب"],
      price: 68,
      calories: 780,
      protein: 48,
      carbs: 55,
      fat: 28,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو روبيان كامل",
      description: "روبيان مقلي مع بطاطس ومشروب.",
      includes: ["روبيان مقلي", "بطاطس", "صوص ثوم", "مشروب"],
      price: 74,
      calories: 920,
      protein: 42,
      carbs: 70,
      fat: 40,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو صيادية وجبة",
      description: "صيادية مع مقبلات بحرية.",
      includes: ["صيادية", "سلطة بطاطس", "مخلل", "مشروب"],
      price: 58,
      calories: 860,
      protein: 36,
      carbs: 90,
      fat: 26,
      spicy: false,
    },
  ],
  صحي: [
    {
      slug: "combo-1",
      name: "كومبو بروتين خفيف",
      description: "وجبة متوازنة بروتين وخضار.",
      includes: ["صدر دجاج مشوي", "سلطة خضراء", "بطاطا حلوة", "ماء"],
      price: 52,
      calories: 520,
      protein: 48,
      carbs: 40,
      fat: 14,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "كومبو بول صحي",
      description: "بول مع سموذي.",
      includes: ["كينوا بول", "سموذي أخضر", "مكسرات"],
      price: 48,
      calories: 580,
      protein: 22,
      carbs: 68,
      fat: 18,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "كومبو سمك صحي",
      description: "سلمون مع سلطة وخضار.",
      includes: ["سلمون مشوي", "خضار ستيم", "أرز بني", "ليمون"],
      price: 72,
      calories: 610,
      protein: 44,
      carbs: 45,
      fat: 24,
      spicy: false,
    },
  ],
  بقالة: [
    {
      slug: "combo-1",
      name: "باكدج فطور البيت",
      description: "مستلزمات فطور سريعة ليوم واحد.",
      includes: ["خبز توست", "بيض ٦ حبات", "جبنة", "حليب"],
      price: 29,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      spicy: false,
    },
    {
      slug: "combo-2",
      name: "باكدج ضيافة خفيفة",
      description: "مشروبات وتمور للضيوف.",
      includes: ["مياه ٦ عبوات", "تمر سكري", "عصير", "قهوة"],
      price: 45,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      spicy: false,
    },
    {
      slug: "combo-3",
      name: "باكدج سناك عائلي",
      description: "سناكات ومشروبات للتجمّع.",
      includes: ["شيبس عائلي", "عصير", "مياه", "مناديل"],
      price: 26,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      spicy: false,
    },
  ],
};

const FALLBACK_COMBOS = COMBOS_BY_CUISINE["برجر"];

/** Verified Unsplash food-dish photos (same ?w=800&q=80 style as catalog). */
function foodImg(photoId) {
  return `https://images.unsplash.com/${photoId}?w=800&q=80`;
}

const FOOD_IMAGES_BY_CUISINE = {
  مشاوي: [
    "photo-1555939594-58d7cb561ad1",
    "photo-1529692236671-f1f6cf9683ba",
    "photo-1603360946369-dc9bb6258143",
  ],
  شامي: [
    "photo-1529006557810-274b9b2fc783",
    "photo-1626082927389-6cd097cdc6ec",
    "photo-1601050690117-94f5f6fa8bd7",
  ],
  برجر: [
    "photo-1568901346375-23c9450c58cd",
    "photo-1553979459-d2229ba7433b",
    "photo-1571091718767-18b5b1457add",
  ],
  ياباني: [
    "photo-1579584425555-c3ce17fd4351",
    "photo-1553621042-f6e147245754",
    "photo-1611143669185-af224c5e3252",
  ],
  حلويات: [
    "photo-1488477181946-6428a0291777",
    "photo-1578985545062-69928b1d9587",
    "photo-1563805042-7684c019e1cb",
  ],
  إيطالي: [
    "photo-1513104890138-7c749659a591",
    "photo-1551183053-bf91a1d81141",
    "photo-1565299624946-b28f40a0ae38",
  ],
  هندي: [
    "photo-1585937421612-70a008356fbe",
    "photo-1565557623262-b51c2513a641",
    "photo-1588168333986-5078d3ae3976",
  ],
  سعودي: [
    "photo-1512058564366-18510be2db19",
    "photo-1544025162-d76694265947",
    "photo-1600891964599-f61ba0e24092",
  ],
  بحري: [
    "photo-1559339352-11d035aa65de",
    "photo-1559847844-5315695dadae",
    "photo-1615141982883-c7ad0e69fd62",
  ],
  صحي: [
    "photo-1512621776951-a57141f2eefd",
    "photo-1546069901-ba9599a7e63c",
    "photo-1490645935967-10de6ba17061",
  ],
  بقالة: [
    "photo-1504674900247-0877df9cc836",
    "photo-1482049016688-2d3e1b311543",
    "photo-1498837167922-ddd27525d352",
  ],
};

const FALLBACK_FOOD = FOOD_IMAGES_BY_CUISINE["برجر"];

function assertMealKeys(m) {
  for (const k of MEAL_KEYS) {
    if (!(k in m)) throw new Error(`meal ${m.id} missing ${k}`);
  }
}

function normalizeRegularMeal(m) {
  const next = { ...m };
  // strip old discount offers
  if (!next.isCombo) {
    next.isOffer = false;
    next.offerPrice = null;
    next.isCombo = false;
    next.comboIncludes = [];
    if (next.category === "offers") {
      next.category = next.isPopular ? "popular" : "menu";
    }
  }
  if (!Array.isArray(next.comboIncludes)) next.comboIncludes = [];
  if (typeof next.isCombo !== "boolean") next.isCombo = false;
  return next;
}

function buildComboMeal(restaurant, template, image) {
  return {
    id: `${restaurant.id}-${template.slug}`,
    restaurantId: restaurant.id,
    name: template.name,
    description: template.description,
    image,
    price: template.price,
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
    comboIncludes: [...template.includes],
    spicyOption: Boolean(template.spicy),
    cashbackPercent: null,
    addons: getAddonsForCuisine(restaurant.cuisine),
  };
}

function upgradeRestaurant(r) {
  // drop previous generated combos so re-run is idempotent
  const regular = r.meals
    .filter((m) => !String(m.id).includes("-combo-"))
    .map(normalizeRegularMeal);

  const templates = COMBOS_BY_CUISINE[r.cuisine] ?? FALLBACK_COMBOS;
  const foodPool = FOOD_IMAGES_BY_CUISINE[r.cuisine] ?? FALLBACK_FOOD;

  const combos = templates.map((t, i) =>
    buildComboMeal(r, t, foodImg(foodPool[i % foodPool.length])),
  );

  for (const m of [...regular, ...combos]) assertMealKeys(m);

  return { ...r, meals: [...regular, ...combos] };
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

  let comboCount = 0;
  for (const r of restaurants) {
    comboCount += r.meals.filter((m) => m.isCombo).length;
    if (!seen.has(r.id)) {
      seen.add(r.id);
      merged.push(r);
    }
  }
  console.log(`upgraded ${file}: ${restaurants.length} restaurants, ${comboCount} combos`);
}

writeFileSync(
  join(root, "data", "catalog.json"),
  JSON.stringify({ restaurants: merged }, null, 2) + "\n",
  "utf8",
);

const meals = merged.reduce((n, r) => n + r.meals.length, 0);
const combos = merged.reduce(
  (n, r) => n + r.meals.filter((m) => m.isCombo).length,
  0,
);
console.log(
  `merged: ${merged.length} restaurants, ${meals} meals, ${combos} combos`,
);
