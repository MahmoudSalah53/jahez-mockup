/** Shared Unsplash image maps + KSA-realistic price caps. */

export function foodImg(photoId) {
  return `https://images.unsplash.com/${photoId}?w=800&q=80`;
}

/** Restaurant cover photos by cuisine (food/venue matching the kitchen). */
export const RESTAURANT_COVERS = {
  مشاوي: [
    "photo-1555939594-58d7cb561ad1",
    "photo-1529692236671-f1f6cf9683ba",
    "photo-1544025162-d76694265947",
  ],
  شامي: [
    "photo-1529006557810-274b9b2fc783",
    "photo-1601050690117-94f5f6fa8bd7",
    "photo-1626082927389-6cd097cdc6ec",
  ],
  برجر: [
    "photo-1568901346375-23c9450c58cd",
    "photo-1551782450-a2132b4ba21d",
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
    "photo-1600891964599-f61ba0e24092",
    "photo-1544025162-d76694265947",
  ],
  بحري: [
    "photo-1519708227418-c8fd9a32b7a2",
    "photo-1559847844-5315695dadae",
    "photo-1615141982883-c7ad0e69fd62",
  ],
  صحي: [
    "photo-1512621776951-a57141f2eefd",
    "photo-1546069901-ba9599a7e63c",
    "photo-1490645935967-10de6ba17061",
  ],
  بقالة: [
    "photo-1509440159596-0249088772ff",
    "photo-1482049016688-2d3e1b311543",
    "photo-1550583724-b2692b85b150",
  ],
};

/** Dish photos keyed by Arabic keyword (checked first, then cuisine fallback). */
export const DISH_KEYWORDS = [
  ["برجر", "photo-1568901346375-23c9450c58cd"],
  ["تشيز كيك", "photo-1533134242443-d4fd215305ad"],
  ["تشيز", "photo-1553979459-d2229ba7433b"],
  ["تشيكن", "photo-1571091718767-18b5b1457add"],
  ["شاورما", "photo-1529006557810-274b9b2fc783"],
  ["فلافل", "photo-1626082927389-6cd097cdc6ec"],
  ["حمص", "photo-1601050690117-94f5f6fa8bd7"],
  ["فتوش", "photo-1512621776951-a57141f2eefd"],
  ["منقوش", "photo-1601050690117-94f5f6fa8bd7"],
  ["كبة", "photo-1529042410759-befb1204b468"],
  ["بيتزا", "photo-1513104890138-7c749659a591"],
  ["باستا", "photo-1551183053-bf91a1d81141"],
  ["لازانيا", "photo-1551183053-bf91a1d81141"],
  ["سوشي", "photo-1579584425555-c3ce17fd4351"],
  ["ساشيمي", "photo-1553621042-f6e147245754"],
  ["رامن", "photo-1569718212165-3a8278d5f624"],
  ["جيوزا", "photo-1611143669185-af224c5e3252"],
  ["ترياكي", "photo-1512058564366-18510be2db19"],
  ["كنافة", "photo-1488477181946-6428a0291777"],
  ["بقلاوة", "photo-1578985545062-69928b1d9587"],
  ["وافل", "photo-1563805042-7684c019e1cb"],
  ["كيك", "photo-1578985545062-69928b1d9587"],
  ["آيس", "photo-1563805042-7684c019e1cb"],
  ["قهوة", "photo-1519676867240-f03562e64548"],
  ["لاتيه", "photo-1519676867240-f03562e64548"],
  ["كبسة", "photo-1512058564366-18510be2db19"],
  ["مندي", "photo-1544025162-d76694265947"],
  ["جريش", "photo-1600891964599-f61ba0e24092"],
  ["هريس", "photo-1600891964599-f61ba0e24092"],
  ["سمك", "photo-1519708227418-c8fd9a32b7a2"],
  ["روبيان", "photo-1559847844-5315695dadae"],
  ["صيادية", "photo-1600699899970-b1c9fadd8f9e"],
  ["برياني", "photo-1585937421612-70a008356fbe"],
  ["كاري", "photo-1565557623262-b51c2513a641"],
  ["تيكا", "photo-1588168333986-5078d3ae3976"],
  ["نان", "photo-1588168333986-5078d3ae3976"],
  ["سلطة", "photo-1512621776951-a57141f2eefd"],
  ["بول", "photo-1546069901-ba9599a7e63c"],
  ["كينوا", "photo-1490645935967-10de6ba17061"],
  ["دجاج", "photo-1598103442097-8b74394b95c6"],
  ["كباب", "photo-1603360946369-dc9bb6258143"],
  ["ريش", "photo-1529692236671-f1f6cf9683ba"],
  ["مشاوي", "photo-1555939594-58d7cb561ad1"],
  ["بطاطس", "photo-1573080496219-bb080dd4f877"],
  ["حليب", "photo-1550583724-b2692b85b150"],
  ["بيض", "photo-1482049016688-2d3e1b311543"],
  ["خبز", "photo-1509440159596-0249088772ff"],
  ["مياه", "photo-1548839140-29a749e1cf4d"],
  ["تمر", "photo-1559181567-c3190ca9959b"],
  ["تاكو", "photo-1565299624946-b28f40a0ae38"],
  ["بوريتو", "photo-1626700051175-6818013e1d4f"],
];

export const CUISINE_DISHES = {
  مشاوي: [
    "photo-1555939594-58d7cb561ad1",
    "photo-1529692236671-f1f6cf9683ba",
    "photo-1603360946369-dc9bb6258143",
    "photo-1598103442097-8b74394b95c6",
  ],
  شامي: [
    "photo-1529006557810-274b9b2fc783",
    "photo-1626082927389-6cd097cdc6ec",
    "photo-1601050690117-94f5f6fa8bd7",
    "photo-1512621776951-a57141f2eefd",
  ],
  برجر: [
    "photo-1568901346375-23c9450c58cd",
    "photo-1553979459-d2229ba7433b",
    "photo-1571091718767-18b5b1457add",
    "photo-1573080496219-bb080dd4f877",
  ],
  ياباني: [
    "photo-1579584425555-c3ce17fd4351",
    "photo-1553621042-f6e147245754",
    "photo-1611143669185-af224c5e3252",
    "photo-1569718212165-3a8278d5f624",
  ],
  حلويات: [
    "photo-1488477181946-6428a0291777",
    "photo-1578985545062-69928b1d9587",
    "photo-1563805042-7684c019e1cb",
    "photo-1519676867240-f03562e64548",
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
    "photo-1519708227418-c8fd9a32b7a2",
    "photo-1559847844-5315695dadae",
    "photo-1615141982883-c7ad0e69fd62",
  ],
  صحي: [
    "photo-1512621776951-a57141f2eefd",
    "photo-1546069901-ba9599a7e63c",
    "photo-1490645935967-10de6ba17061",
  ],
  بقالة: [
    "photo-1509440159596-0249088772ff",
    "photo-1482049016688-2d3e1b311543",
    "photo-1550583724-b2692b85b150",
    "photo-1548839140-29a749e1cf4d",
  ],
};

export function restaurantCover(cuisine, seed = 0) {
  const pool = RESTAURANT_COVERS[cuisine] ?? RESTAURANT_COVERS["برجر"];
  return foodImg(pool[Math.abs(seed) % pool.length]);
}

export function dishImage(name, cuisine, seed = 0) {
  const text = String(name ?? "");
  for (const [keyword, photoId] of DISH_KEYWORDS) {
    if (text.includes(keyword)) return foodImg(photoId);
  }
  const pool = CUISINE_DISHES[cuisine] ?? CUISINE_DISHES["برجر"];
  return foodImg(pool[Math.abs(seed) % pool.length]);
}

export function allPhotoIds() {
  const ids = new Set();
  for (const list of Object.values(RESTAURANT_COVERS)) {
    for (const id of list) ids.add(id);
  }
  for (const list of Object.values(CUISINE_DISHES)) {
    for (const id of list) ids.add(id);
  }
  for (const [, id] of DISH_KEYWORDS) ids.add(id);
  return [...ids];
}

/** Max regular-menu price by cuisine (SAR). */
export const CUISINE_PRICE_MAX = {
  مشاوي: 79,
  شامي: 32,
  برجر: 38,
  ياباني: 68,
  حلويات: 28,
  إيطالي: 49,
  هندي: 42,
  سعودي: 89,
  بحري: 75,
  صحي: 42,
  بقالة: 22,
};

export const OFFER_PRICE_MAX = {
  combo: 35,
  family: 119,
  deal: 45,
};

export function realisticPrice(meal, cuisine) {
  const current = Number(meal.price) || 0;
  if (meal.isOffer) {
    const kind = meal.offerKind ?? "deal";
    let max = OFFER_PRICE_MAX[kind] ?? 45;
    if (kind === "family" && cuisine === "مشاوي") max = 119;
    if (kind === "family" && cuisine === "سعودي") max = 109;
    if (kind === "family" && cuisine === "بحري") max = 119;
    if (kind === "family" && cuisine === "برجر") max = 89;
    if (kind === "family" && cuisine === "إيطالي") max = 79;
    if (kind === "combo" && cuisine === "ياباني") max = 48;
    if (kind === "combo" && cuisine === "بحري") max = 48;
    if (kind === "combo" && cuisine === "حلويات") max = 26;
    if (kind === "combo" && cuisine === "شامي") max = 28;
    if (kind === "deal" && cuisine === "بقالة") max = 22;
    if (current <= max) return current;
    return Math.max(12, Math.round(max * 0.92));
  }

  const max = CUISINE_PRICE_MAX[cuisine] ?? 42;
  if (current <= max) {
    // still nudge expensive-looking singles down a bit
    if (current > max * 0.85 && cuisine !== "بقالة") {
      return Math.max(8, Math.round(current * 0.88));
    }
    return current;
  }
  return Math.max(8, Math.round(max * 0.9));
}
