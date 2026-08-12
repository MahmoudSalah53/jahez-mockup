/**
 * Generates extra catalog parts (same schema as data/catalog.json) and merges
 * them with the original restaurants. Images use images.unsplash.com?w=800&q=80.
 *
 * Run: node scripts/expand-catalog.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "fs";
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

/** Same host + query style as the existing catalog */
function img(photoId) {
  return `https://images.unsplash.com/${photoId}?w=800&q=80`;
}

/** Only Unsplash ids verified to return 200 with ?w=800&q=80 (original catalog + UI). */
const IMAGES = [
  "photo-1555939594-58d7cb561ad1",
  "photo-1529692236671-f1f6cf9683ba",
  "photo-1598103442097-8b74394b95c6",
  "photo-1603360946369-dc9bb6258143",
  "photo-1512058564366-18510be2db19",
  "photo-1582878826629-29b7ad1cdc43",
  "photo-1529042410759-befb1204b468",
  "photo-1529006557810-274b9b2fc783",
  "photo-1601050690117-94f5f6fa8bd7",
  "photo-1626082927389-6cd097cdc6ec",
  "photo-1512621776951-a57141f2eefd",
  "photo-1565299624946-b28f40a0ae38",
  "photo-1568901346375-23c9450c58cd",
  "photo-1553979459-d2229ba7433b",
  "photo-1573080496219-bb080dd4f877",
  "photo-1572490122747-3968b75cc699",
  "photo-1579584425555-c3ce17fd4351",
  "photo-1553621042-f6e147245754",
  "photo-1617196034796-73dfa7b1fd56",
  "photo-1611143669185-af224c5e3252",
  "photo-1540189549336-e6e99c3679fe",
  "photo-1488477181946-6428a0291777",
  "photo-1578985545062-69928b1d9587",
  "photo-1519676867240-f03562e64548",
  "photo-1606313564200-e75d5e30476c",
  "photo-1533134242443-d4fd215305ad",
  "photo-1513104890138-7c749659a591",
  "photo-1551183053-bf91a1d81141",
  "photo-1585937421612-70a008356fbe",
  "photo-1519708227418-c8fd9a32b7a2",
  "photo-1559847844-5315695dadae",
  "photo-1546069901-ba9599a7e63c",
  "photo-1509440159596-0249088772ff",
  "photo-1414235077428-338989a2e8c0",
  "photo-1517248135467-4c7edcad34c4",
  "photo-1567620905732-2d1ec7ab7445",
  "photo-1565958011703-44f9829ba187",
  "photo-1476224203421-9ac39bcb3327",
  "photo-1467003909585-2f8a72700288",
  "photo-1455619452474-d2be8b1e70cd",
  "photo-1498837167922-ddd27525d352",
  "photo-1490645935967-10de6ba17061",
  "photo-1473093295043-cdd812d0e601",
  "photo-1505253758473-96b7015fcd40",
  "photo-1551782450-a2132b4ba21d",
  "photo-1571091718767-18b5b1457add",
  "photo-1600891964599-f61ba0e24092",
  "photo-1626645738196-c2a7c87a8f58",
  "photo-1563379926898-05f4575a45d8",
  "photo-1552566626-52f8b828add9",
  "photo-1544025162-d76694265947",
  "photo-1559847844-5315695dadae",
  "photo-1569718212165-3a8278d5f624",
  "photo-1506084868230-bb9d95c24759",
  "photo-1482049016688-2d3e1b311543",
  "photo-1525351484163-7529414344d8",
  "photo-1484723091739-30a097e8f929",
  "photo-1604908176997-125f25cc6f3d",
  "photo-1606755962773-d324e0a13086",
  "photo-1627308595229-7830a5c91f9f",
].map(img);

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260809);

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

const CUISINE_PACKS = [
  {
    file: "01-grill.json",
    cuisine: "مشاوي",
    tags: ["مشاوي", "لحوم", "فحم"],
    restaurants: [
      ["nar-aljamar", "نار الجمر"],
      ["shawaya-alqasr", "شواية القصر"],
      ["lahm-wa-fahm", "لحم وفحم"],
      ["majalis-almashawi", "مجالس المشاوي"],
      ["dukhan-house", "بيت الدخان"],
      ["kabab-alwadi", "كباب الوادي"],
      ["fahm-riyadh", "فحم الرياض"],
      ["mashawi-alnakheel", "مشاوي النخيل"],
    ],
    meals: [
      ["مشكل مشاوي ملكي", "تشكيلة لحم ودجاج وكباب مع أرز.", 75, 840, 50, 58, 40, true],
      ["ريش غنم فاخر", "ريش غنم على الفحم مع طحينة.", 92, 720, 54, 10, 50, true],
      ["شيش طاووق", "قطع دجاج متبلة مشوية.", 48, 480, 42, 18, 22, true],
      ["كباب لحم", "كباب لحم بقري مع بصل مشوي.", 55, 610, 38, 20, 36, true],
      ["دجاج كامل مشوي", "دجاجة كاملة متبلة على الفحم.", 62, 780, 55, 8, 48, true],
      ["لحم بعجين مشوي", "عجينة رقيقة مع لحم مفروم.", 38, 520, 22, 48, 24, false],
      ["نقانق مشوية", "نقانق بقري مع خضار مشوية.", 42, 560, 28, 15, 38, true],
      ["كبدة مشوية", "كبدة غنم مع ثوم وليمون.", 36, 390, 32, 8, 22, true],
      ["صينية مشاوي عائلية", "تشكيلة كبيرة تكفي ٤ أشخاص.", 149, 1600, 95, 90, 85, true],
      ["أرز باللحم", "أرز بخاري مع قطع لحم طرية.", 44, 680, 30, 70, 22, false],
    ],
  },
  {
    file: "02-levant.json",
    cuisine: "شامي",
    tags: ["شامي", "مشاوي", "مقبلات"],
    restaurants: [
      ["sham-alaseel", "شام الأصيل"],
      ["beit-falafel", "بيت الفلافل"],
      ["dimashq-kitchen", "مطبخ دمشق"],
      ["halab-taam", "طعم حلب"],
      ["zaatar-wzeit", "زعتر وزيت"],
      ["laban-wbasil", "لبن وباسل"],
      ["manakeesh-street", "شارع المناقيش"],
      ["hummus-house", "بيت الحمص"],
    ],
    meals: [
      ["حمص باللحمة", "حمص كريمي مع لحم مفروم وصنوبر.", 32, 390, 18, 28, 22, false],
      ["فتة شامية", "خبز وحمص ولبن مع سمنة.", 36, 450, 16, 42, 20, false],
      ["شاورما دجاج", "شاورما دجاج مع ثوم ومخلل.", 28, 520, 30, 40, 22, true],
      ["فلافل صحن", "فلافل مقرمشة مع سلطة وتحينة.", 22, 410, 14, 38, 18, false],
      ["منقوشة زعتر", "عجينة طازجة بزعتر وزيت زيتون.", 18, 320, 8, 36, 12, false],
      ["كبة مقلية", "كبة محشوة لحم مع لبن.", 34, 480, 20, 32, 26, false],
      ["مسخن رول", "دجاج مع سماق وبصل في خبز.", 40, 560, 28, 45, 24, false],
      ["فتوش", "سلطة خضار مقرمشة مع خل رمان.", 24, 210, 6, 22, 10, false],
      ["محاشي مشكل", "كوسا وباذنجان محشي أرز.", 38, 440, 12, 48, 16, false],
      ["كباب حلبي", "كباب لحم ببهارات حلبية.", 52, 600, 36, 18, 38, true],
    ],
  },
  {
    file: "03-burger.json",
    cuisine: "برجر",
    tags: ["برجر", "وجبات سريعة"],
    restaurants: [
      ["smash-lab", "مختبر السماش"],
      ["bun-city", "مدينة البان"],
      ["grill-burger-co", "جرل برجر"],
      ["cheese-stack", "تشيز ستاك"],
      ["fire-patty", "فاير باتي"],
      ["urban-bun", "أوربان بان"],
      ["double-deck", "دبل ديك"],
      ["crispy-yard", "كريسبي يارد"],
    ],
    meals: [
      ["كلاسيك برجر", "لحم أنجوس مع خس وطماطم.", 36, 640, 32, 42, 34, false],
      ["دبل تشيز", "شريحتان لحم مع جبنة ذائبة.", 48, 820, 44, 40, 48, false],
      ["تشيكن كرسبي", "دجاج مقرمش مع مايونيز حار.", 34, 710, 28, 48, 36, true],
      ["سماش برجر", "لحم مسحوق على الشواية.", 38, 690, 34, 38, 40, false],
      ["ماشروم سويس", "فطر وجبنة سويسرية.", 42, 730, 30, 40, 42, false],
      ["بيكون برجر", "لحم مع بيكون مقرمش.", 46, 860, 38, 36, 52, false],
      ["وجبة بطاطس كبيرة", "بطاطس مقلية مع صوص.", 16, 480, 6, 55, 24, false],
      ["برجر نباتي", "باتي نباتي مع أفوكادو.", 40, 580, 22, 48, 26, false],
      ["تريبل ستاك", "ثلاث شرائح لحم للعشاق.", 58, 1100, 58, 42, 68, false],
      ["سبايسي رانش", "دجاج حار مع رانش.", 37, 750, 30, 46, 38, true],
    ],
  },
  {
    file: "04-japanese.json",
    cuisine: "ياباني",
    tags: ["ياباني", "سوشي"],
    restaurants: [
      ["tokyo-bite", "لقمة طوكيو"],
      ["sakura-roll", "ساكورا رول"],
      ["umami-house", "بيت الأومامي"],
      ["nori-kitchen", "مطبخ النوري"],
      ["ramen-lane", "شارع الرامن"],
      ["wasabi-bar", "واسابي بار"],
      ["katsu-corner", "ركن الكاتسو"],
      ["edo-express", "إدو إكسبرس"],
    ],
    meals: [
      ["سوشي سالمون", "قطع سالمون طازج على أرز.", 54, 420, 28, 48, 12, false],
      ["رول كاليفورنيا", "كراب وأفوكادو وخيار.", 42, 380, 16, 44, 14, false],
      ["رامن تونكوستو", "مرق غني مع نودلز وبيض.", 48, 680, 32, 62, 28, false],
      ["دجاج ترياكي", "دجاج بصلصة ترياكي وأرز.", 44, 560, 34, 55, 16, false],
      ["كاتسو دون", "شينيتزل لحم مع أرز وبيض.", 46, 720, 36, 60, 28, false],
      ["إدامامي", "فول الصويا المملح.", 18, 160, 12, 10, 6, false],
      ["تمبورا روبيان", "روبيان مقرمش مع صوص tentuyu.", 52, 510, 24, 42, 26, false],
      ["ساشيمي مشكل", "تشكيلة سمك نيء.", 68, 280, 36, 4, 10, false],
      ["جيوزا", "زلابية لحم مشوية.", 32, 340, 14, 28, 16, false],
      ["موشي آيس كريم", "كرات أرز محشوة آيس كريم.", 24, 260, 4, 36, 10, false],
    ],
  },
  {
    file: "05-desserts.json",
    cuisine: "حلويات",
    tags: ["حلويات", "كافيه"],
    restaurants: [
      ["sukkar-lane", "زقاق السكر"],
      ["creamery-riyadh", "كريمري الرياض"],
      ["kunafa-lab", "مختبر الكنافة"],
      ["choc-atelier", "أتولييه الشوكولاتة"],
      ["date-delight", "متعة التمر"],
      ["waffle-nest", "عش الوافل"],
      ["baklava-house", "بيت البقلاوة"],
      ["sweet-noon", "حلاوة الظهر"],
    ],
    meals: [
      ["كنافة نابلسية", "كنافة بالجبنة مع قطر.", 28, 480, 10, 52, 22, false],
      ["بقلاوة مشكلة", "بقلاوة مكسرات وفستق.", 32, 520, 8, 48, 28, false],
      ["تشيز كيك", "تشيز كيك بالفراولة.", 30, 450, 8, 40, 26, false],
      ["وافل بلجيكي", "وافل مع آيس كريم وشوكولاتة.", 34, 610, 10, 70, 28, false],
      ["براوني دافئ", "براوني مع صوص شوكولاتة.", 26, 540, 6, 48, 32, false],
      ["آيس كريم ملعقتين", "نكهتان من اختيارك.", 18, 280, 4, 32, 14, false],
      ["لقيمات", "لقيمات مقرمشة مع سمن وعسل.", 22, 420, 5, 50, 18, false],
      ["تمر محشي", "تمر باللوز والشوكولاتة.", 24, 360, 6, 40, 16, false],
      ["تيراميسو", "تيراميسو إيطالي كلاسيك.", 33, 430, 8, 38, 24, false],
      ["مولتن كيك", "كيكة شوكولاتة سائلة من الداخل.", 29, 490, 7, 44, 28, false],
    ],
  },
  {
    file: "06-italian.json",
    cuisine: "إيطالي",
    tags: ["إيطالي", "بيتزا", "باستا"],
    restaurants: [
      ["nonna-oven", "فرن النونة"],
      ["roma-pasta", "باستا روما"],
      ["truffle-table", "طاولة الكمأة"],
      ["olive-crust", "قشرة الزيتون"],
      ["vesuvio-pizza", "بيتزا فيزوفيو"],
      ["basilico", "بازيليكو"],
      ["formaggio", "فورماجيو"],
      ["amico-kitchen", "مطبخ أميكو"],
    ],
    meals: [
      ["مارغريتا", "صلصة طماطم وموزاريلا وريحان.", 42, 680, 24, 72, 24, false],
      ["بيبروني", "بيتزا بيبروني حارة.", 48, 760, 28, 70, 32, true],
      ["باستا كاربونارا", "سباغيتي مع بيض وجبنة.", 46, 720, 26, 68, 30, false],
      ["لازانيا لحم", "طبقات باستا ولحم وبيشاميل.", 52, 820, 34, 60, 38, false],
      ["بينّي أرابياتا", "باستا بصلصة طماطم حارة.", 38, 580, 16, 70, 14, true],
      ["ريزوتو فطر", "أرز إيطالي كريمي بالفطر.", 44, 540, 14, 58, 20, false],
      ["سلطة سيزر", "خس ورُمان وكروتون.", 28, 320, 18, 16, 18, false],
      ["بروشيتا", "خبز محمص مع طماطم وثوم.", 22, 280, 6, 32, 10, false],
      ["كالتزوني", "بيتزا مطوية محشوة.", 45, 740, 26, 68, 28, false],
      ["تيراميسو صغير", "تحلية إيطالية كلاسيكية.", 26, 360, 6, 34, 18, false],
    ],
  },
  {
    file: "07-indian.json",
    cuisine: "هندي",
    tags: ["هندي", "كاري", "حار"],
    restaurants: [
      ["spice-route", "طريق التوابل"],
      ["tandoor-flame", "لهب التندور"],
      ["masala-bowl", "بول الماسالا"],
      ["curry-garden", "حديقة الكاري"],
      ["biryani-dar", "دار البرياني"],
      ["naan-house", "بيت الخبز النان"],
      ["tikka-spot", "تيكا سبوت"],
      ["delhi-express", "دلهي إكسبرس"],
    ],
    meals: [
      ["برياني دجاج", "أرز برياني مع دجاج وتوابل.", 42, 720, 32, 78, 22, true],
      ["دجاج تيكا ماسالا", "دجاج مشوي بصلصة كريمية.", 46, 680, 36, 40, 32, true],
      ["بالتي لحم", "لحم بقري بصلصة بالتي.", 48, 740, 38, 28, 42, true],
      ["دال ماخاني", "عدس أسود بالزبدة.", 28, 420, 16, 40, 16, false],
      ["نان بالثوم", "خبز تندور بالثوم.", 14, 260, 6, 36, 8, false],
      ["سمبوسة خضار", "سمبوسة مقرمشة مع تشاتني.", 18, 280, 6, 30, 12, false],
      ["بانيير تيكا", "جبنة بانيير مشوية.", 36, 480, 20, 22, 28, true],
      ["صاموسا تشات", "تشات هندي حار وحامض.", 24, 340, 8, 36, 12, true],
      ["مطبخ ثالي", "تشكيلة أطباق هندية صغيرة.", 55, 800, 28, 90, 30, true],
      ["مانجو لاسي", "مشروب لبن بالمانجو.", 16, 220, 6, 28, 8, false],
    ],
  },
  {
    file: "08-saudi.json",
    cuisine: "سعودي",
    tags: ["سعودي", "كبتة", "أرز"],
    restaurants: [
      ["dar-almandi", "دار المندي"],
      ["kabsa-palace", "قصر الكبسة"],
      ["najd-table", "سفرة نجد"],
      ["harees-house", "بيت الهريس"],
      ["jareesh-corner", "ركن الجريش"],
      ["samak-wa-ruz", "سمك وأرز"],
      ["qursan-kitchen", "مطبخ القرصان"],
      ["madafa-aloud", "مضافة العود"],
    ],
    meals: [
      ["كبسة دجاج", "كبسة سعودية كلاسيكية.", 38, 680, 34, 72, 18, false],
      ["مندي لحم", "لحم طري مع أرز مندي.", 55, 820, 42, 70, 32, false],
      ["مطازيز", "عجين مع مرق ولحم وخضار.", 36, 540, 22, 48, 20, false],
      ["جريش", "جريش بالقشدة والسمن.", 32, 480, 14, 52, 16, false],
      ["هريس", "هريس لحم بالقمح.", 34, 520, 24, 48, 18, false],
      ["صاية لحم", "مرق لحم مع خضار.", 40, 460, 28, 30, 22, false],
      ["قرصان", "خبز مع مرق ودجاج.", 35, 500, 26, 45, 16, false],
      ["حنيذ", "لحم مطهو ببطء مع أرز.", 58, 860, 46, 68, 36, false],
      ["مرقوق", "عجين رقيق مع خضار ولحم.", 37, 530, 24, 50, 18, false],
      ["تمر وسمن", "تحلية تمر بالسمن البلدي.", 18, 320, 3, 36, 14, false],
    ],
  },
  {
    file: "09-seafood.json",
    cuisine: "بحري",
    tags: ["بحري", "سمك", "روبيان"],
    restaurants: [
      ["blue-harbor", "الميناء الأزرق"],
      ["shrimp-coast", "ساحل الروبيان"],
      ["coral-grill", "مشواة المرجان"],
      ["wave-kitchen", "مطبخ الموجة"],
      ["pearl-seafood", "لؤلؤة البحر"],
      ["anchor-fish", "سمك المرساة"],
      ["tide-table", "طاولة المد"],
      ["salt-breeze", "نسيم الملح"],
    ],
    meals: [
      ["سمك مشوي", "سمك طازج مشوي مع أرز وسلطة.", 52, 480, 42, 30, 16, false],
      ["روبيان مقلي", "روبيان مقرمش مع ثوم.", 58, 560, 36, 28, 28, false],
      ["صيادية", "أرز صيادية مع سمك.", 44, 620, 32, 68, 18, false],
      ["كاليماري", "حلقات حبار مقلية.", 36, 420, 22, 32, 20, false],
      ["سوشي رول بحري", "رول سلمون وأفوكادو.", 48, 390, 24, 40, 12, false],
      ["شوربة سي فود", "مرق بحري غني.", 28, 240, 18, 14, 10, false],
      ["سلمون مشوي", "فيليه سلمون مع خضار.", 68, 520, 40, 8, 28, false],
      ["سمك هامور", "هامور مشوي على الفحم.", 75, 540, 48, 6, 24, false],
      ["مأكولات بحرية مشكلة", "تشكيلة مشوية للعائلة.", 120, 980, 70, 40, 48, false],
      ["أرز بالروبيان", "أرز بسمتي مع روبيان.", 46, 640, 28, 70, 16, false],
    ],
  },
  {
    file: "10-healthy.json",
    cuisine: "صحي",
    tags: ["صحي", "سلطات", "بروتين"],
    restaurants: [
      ["green-fuel", "وقود أخضر"],
      ["protein-box", "صندوق البروتين"],
      ["leaf-bowl", "بول الأوراق"],
      ["fit-kitchen", "مطبخ اللياقة"],
      ["quinoa-lab", "مختبر الكينوا"],
      ["light-bites", "لقمات خفيفة"],
      ["fresh-press", "عصير طازج"],
      ["balance-plate", "صحن التوازن"],
    ],
    meals: [
      ["بول سلمون", "أرز بني وسلمون وأفوكادو.", 48, 520, 36, 42, 22, false],
      ["سلطة دجاج مشوي", "خس ودجاج ورمان.", 36, 340, 34, 18, 12, false],
      ["كينوا بول", "كينوا وخضار مشوية.", 34, 410, 14, 48, 12, false],
      ["راب تركي خفيف", "راب دجاج مع زبادي.", 32, 390, 28, 32, 12, false],
      ["شوكة أفوكادو", "توست أسمر مع أفوكادو وبيض.", 28, 380, 16, 28, 20, false],
      ["سموذي أخضر", "سبانخ وتفاح وموز.", 22, 210, 4, 40, 2, false],
      ["صدر دجاج مشوي", "مع بطاطا حلوة مشوية.", 40, 440, 42, 30, 10, false],
      ["سلطة تونة", "تونة وخضار وزيت زيتون.", 34, 320, 30, 12, 14, false],
      ["زبادي يوناني وفواكه", "بروتين خفيف مع عسل.", 24, 260, 18, 28, 6, false],
      ["شوربة عدس", "عدس أحمر مع خضار.", 20, 240, 12, 32, 4, false],
    ],
  },
  {
    file: "11-grocery.json",
    cuisine: "بقالة",
    tags: ["بقالة", "مستلزمات"],
    restaurants: [
      ["luqma-express-mart", "ماركت لقمة السريع"],
      ["bayt-almanzil", "بيت المنزل"],
      ["daily-basket", "السلة اليومية"],
      ["fresh-aisle", "ممر الطازج"],
      ["pantry-plus", "المونة بلس"],
      ["corner-staples", "أساسيات الزاوية"],
      ["family-cart", "عربة العائلة"],
      ["quick-shelf", "الرف السريع"],
    ],
    meals: [
      ["مياه ٦ عبوات", "مياه شرب معبأة.", 9, 0, 0, 0, 0, false],
      ["حليب طازج", "حليب كامل الدسم ١ لتر.", 8, 150, 8, 12, 8, false],
      ["خبز توست", "رغيف توست أسمر.", 7, 220, 8, 40, 3, false],
      ["بيض ١٢ حبة", "بيض طازج.", 14, 840, 72, 4, 56, false],
      ["جبنة شرائح", "شرائح جبنة للساندويتش.", 12, 320, 16, 4, 26, false],
      ["عصير برتقال", "عصير برتقال ١ لتر.", 11, 180, 2, 40, 0, false],
      ["شيبس عائلي", "كيس شيبس كبير.", 10, 520, 6, 52, 32, false],
      ["تمر سكري", "علبة تمر سكري.", 22, 400, 3, 80, 0, false],
      ["قهوة مطحونة", "علبة قهوة ٢٥٠غ.", 28, 0, 0, 0, 0, false],
      ["مناديل مطبخ", "رول مناديل مطبخ.", 6, 0, 0, 0, 0, false],
    ],
  },
  {
    file: "12-more-grill-cafe.json",
    cuisine: "مشاوي",
    tags: ["مشاوي", "استراحة"],
    restaurants: [
      ["fahm-night", "فحم الليل"],
      ["skewer-club", "نادي الأسياخ"],
      ["charcoal-yard", "ساحة الفحم"],
      ["meat-square", "ميدان اللحم"],
    ],
    altCuisineMeals: false,
    meals: null, // filled from grill pack below
  },
];

// Fill the short grill pack meals from first pack
CUISINE_PACKS[11].meals = CUISINE_PACKS[0].meals;
CUISINE_PACKS[11].tags = ["مشاوي", "لحوم"];

// Extra mixed packs for volume
const EXTRA_PACKS = [
  {
    file: "13-cafe-bakery.json",
    cuisine: "حلويات",
    tags: ["كافيه", "مخبوزات"],
    restaurants: [
      ["croissant-lab", "مختبر الكرواسون"],
      ["latte-lane", "زقاق اللاتيه"],
      ["oven-morning", "فرن الصباح"],
      ["berry-bake", "توت المخبز"],
      ["cardamom-cafe", "كافيه الهيل"],
      ["toast-bar", "بار التوست"],
      ["nutella-nest", "عش النوتيلا"],
      ["sesame-sweet", "سمسم وحلاوة"],
    ],
    meals: [
      ["كرواسون زبدة", "كرواسون فرنسي طازج.", 14, 320, 6, 32, 18, false],
      ["لاتيه", "قهوة حليب مخملية.", 16, 140, 6, 12, 6, false],
      ["سينابون", "لفائف قرفة مع صوص.", 22, 480, 6, 58, 20, false],
      ["توست أفوكادو", "خبز محمص مع أفوكادو.", 24, 360, 10, 28, 20, false],
      ["كيكة فانيلا", "شريحة كيك فانيلا.", 18, 380, 4, 42, 18, false],
      ["آيس لاتيه", "لاتيه مثلج.", 17, 120, 4, 14, 4, false],
      ["دونات محشية", "دونات كريمة.", 12, 340, 4, 40, 16, false],
      ["مافن توت", "مافن بالتوت الأزرق.", 13, 300, 4, 38, 12, false],
      ["فطور إنجليزي خفيف", "بيض وتوست وفطر.", 32, 420, 22, 28, 20, false],
      ["شاي كرك", "شاي حليب بالهارات.", 10, 90, 2, 12, 3, false],
    ],
  },
  {
    file: "14-mexican-asian.json",
    cuisine: "برجر",
    tags: ["عالمي", "سريع"],
    restaurants: [
      ["taco-fiesta", "تاكو فييستا"],
      ["wrap-republic", "جمهورية الراب"],
      ["bao-street", "شارع الباو"],
      ["noodle-box", "صندوق النودلز"],
      ["kimchi-kitchen", "مطبخ الكيمتشي"],
      ["satay-house", "بيت الساتيه"],
      ["pho-bowl", "بول الفو"],
      ["padthai-express", "باد تاي إكسبرس"],
    ],
    meals: [
      ["تاكو لحم", "تاكو لحم مع صلصة حارة.", 34, 480, 24, 36, 22, true],
      ["بوريتو دجاج", "بوريتو محشي أرز ودجاج.", 38, 620, 30, 58, 22, true],
      ["باو لحم", "خبز باو محشي لحم.", 28, 360, 16, 34, 12, false],
      ["نودلز سويا", "نودلز بصلصة صويا وخضار.", 32, 520, 14, 70, 12, false],
      ["بيبيمباب", "أرز كوري مع خضار وبيض.", 42, 580, 22, 72, 16, false],
      ["ساتيه دجاج", "أسياخ دجاج مع فول سوداني.", 36, 440, 32, 18, 20, true],
      ["شوربة فو", "مرق فيتنامي مع نودلز.", 40, 390, 24, 40, 10, false],
      ["باد تاي", "نودلز تايلندي بالروبيان.", 44, 610, 26, 68, 18, true],
      ["راب شاورما آسيوي", "راب بخلطة آسيوية.", 30, 500, 26, 42, 18, true],
      ["سبرينغ رولز", "لفائف ربيعية مقرمشة.", 22, 280, 8, 30, 12, false],
    ],
  },
];

function buildRestaurant([id, name], pack, indexInPack) {
  const rating = round1(4.2 + rand() * 0.7);
  const deliveryFee = [0, 5, 6, 8, 10, 12][Math.floor(rand() * 6)];
  const minOrder = [25, 30, 35, 40, 45, 50][Math.floor(rand() * 6)];
  const distanceKm = round1(0.5 + rand() * 6);
  const times = ["20–30 د", "25–35 د", "30–45 د", "35–50 د", "40–55 د"];
  const featured = rand() > 0.75 ? true : null;
  const verified = rand() > 0.35 ? true : null;
  const open24h = rand() > 0.85 ? true : null;
  const fastDelivery = rand() > 0.55 ? true : null;

  const meals = pack.meals.map((mealDef, mealIdx) => {
    const [mealName, description, price, calories, protein, carbs, fat, spicyOption] =
      mealDef;
    const mealId = `${id}-${mealIdx + 1}`;
    const isPopular = rand() > 0.55;
    const cat = isPopular ? "popular" : "menu";
    const mealRating = round1(4.1 + rand() * 0.8);

    return {
      id: mealId,
      restaurantId: id,
      name: mealName,
      description,
      image: dishImage(mealName, pack.cuisine, mealIdx),
      price: realisticPrice(
        { price, isOffer: false },
        pack.cuisine,
      ),
      rating: mealRating,
      calories,
      protein,
      carbs,
      fat,
      category: cat,
      isPopular: Boolean(isPopular),
      isOffer: false,
      offerPrice: null,
      isCombo: false,
      offerKind: null,
      comboIncludes: [],
      spicyOption: Boolean(spicyOption),
      cashbackPercent: null,
      addons: getAddonsForCuisine(pack.cuisine),
    };
  });

  if (!meals.some((m) => m.isPopular)) {
    meals[0].isPopular = true;
    meals[0].category = "popular";
  }

  // Combos are attached later by apply-combo-offers.mjs (or call shared templates).
  // Keep expand output combo-ready: regular meals only here.

  return {
    id,
    name,
    image: restaurantCover(pack.cuisine, indexInPack),
    rating,
    cuisine: pack.cuisine,
    deliveryTime: pick(times),
    deliveryFee,
    minOrder,
    distanceKm,
    verified,
    tags: [...pack.tags],
    featured,
    open24h,
    fastDelivery,
    meals,
  };
}

function assertRestaurant(r) {
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
  for (const k of restaurantKeys) {
    if (!(k in r)) throw new Error(`restaurant ${r.id} missing ${k}`);
  }
  for (const m of r.meals) {
    for (const k of mealKeys) {
      if (!(k in m)) throw new Error(`meal ${m.id} missing ${k}`);
    }
    if (!String(m.image).startsWith("https://images.unsplash.com/photo-")) {
      throw new Error(`bad image ${m.image}`);
    }
    if (!m.image.includes("?w=800&q=80")) {
      throw new Error(`image must use ?w=800&q=80: ${m.image}`);
    }
  }
}

// --- main ---
mkdirSync(catalogDir, { recursive: true });

const original = JSON.parse(
  readFileSync(join(root, "data", "catalog.json"), "utf8"),
);

// If catalog.json was already expanded, prefer 00-original snapshot if present
let baseRestaurants = original.restaurants;
const originalSnapshotPath = join(catalogDir, "00-original.json");
try {
  const snap = JSON.parse(readFileSync(originalSnapshotPath, "utf8"));
  if (Array.isArray(snap.restaurants) && snap.restaurants.length) {
    baseRestaurants = snap.restaurants;
  }
} catch {
  // first run: snapshot current as original (only if small / known baseline)
  writeFileSync(
    originalSnapshotPath,
    JSON.stringify({ restaurants: original.restaurants }, null, 2) + "\n",
    "utf8",
  );
  baseRestaurants = original.restaurants;
}

const existingIds = new Set(baseRestaurants.map((r) => r.id));
const allPacks = [...CUISINE_PACKS, ...EXTRA_PACKS];
const partFiles = ["00-original.json"];

for (const pack of allPacks) {
  const restaurants = [];
  for (let i = 0; i < pack.restaurants.length; i++) {
    const [id] = pack.restaurants[i];
    if (existingIds.has(id)) {
      console.warn(`skip duplicate id ${id}`);
      continue;
    }
    existingIds.add(id);
    const r = buildRestaurant(pack.restaurants[i], pack, i);
    assertRestaurant(r);
    restaurants.push(r);
  }
  const out = { restaurants };
  writeFileSync(
    join(catalogDir, pack.file),
    JSON.stringify(out, null, 2) + "\n",
    "utf8",
  );
  partFiles.push(pack.file);
  console.log(`wrote ${pack.file}: ${restaurants.length} restaurants`);
}

// merge all parts in order
const merged = [];
const seen = new Set();
for (const file of partFiles) {
  const part = JSON.parse(readFileSync(join(catalogDir, file), "utf8"));
  for (const r of part.restaurants) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    merged.push(r);
  }
}

writeFileSync(
  join(root, "data", "catalog.json"),
  JSON.stringify({ restaurants: merged }, null, 2) + "\n",
  "utf8",
);

const mealCount = merged.reduce((n, r) => n + r.meals.length, 0);
console.log(
  `merged catalog.json: ${merged.length} restaurants, ${mealCount} meals, ${partFiles.length} parts`,
);
