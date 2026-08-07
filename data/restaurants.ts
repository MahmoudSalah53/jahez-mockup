import type { Restaurant } from "@/lib/types";

export const restaurants: Restaurant[] = [
  {
    id: "bayt-alshawaya",
    name: "بيت الشواية",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    rating: 4.8,
    cuisine: "مشاوي",
    deliveryTime: "30–45 د",
    deliveryFee: 8,
    minOrder: 40,
    distanceKm: 1.2,
    verified: true,
    tags: ["مشاوي", "لحوم"],
    featured: true,
    open24h: true,
  },
  {
    id: "madhaq-alsham",
    name: "مذاق الشام",
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80",
    rating: 4.6,
    cuisine: "شامي",
    deliveryTime: "25–40 د",
    deliveryFee: 6,
    minOrder: 35,
    distanceKm: 0.8,
    verified: true,
    tags: ["شامي", "شاورما"],
    featured: true,
    fastDelivery: true,
    open24h: true,
  },
  {
    id: "aseel-burger",
    name: "أصيل برجر",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    rating: 4.5,
    cuisine: "برجر",
    deliveryTime: "20–35 د",
    deliveryFee: 5,
    minOrder: 30,
    distanceKm: 2.0,
    verified: true,
    tags: ["برجر", "وجبات سريعة"],
    featured: true,
    fastDelivery: true,
    open24h: true,
  },
  {
    id: "sushi-noi",
    name: "سوشي نوي",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
    rating: 4.7,
    cuisine: "ياباني",
    deliveryTime: "35–50 د",
    deliveryFee: 10,
    minOrder: 50,
    distanceKm: 3.1,
    verified: true,
    tags: ["سوشي", "آسيوي"],
  },
  {
    id: "halawiyat-riyadh",
    name: "حلويات الرياض",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    rating: 4.9,
    cuisine: "حلويات",
    deliveryTime: "25–40 د",
    deliveryFee: 7,
    minOrder: 25,
    distanceKm: 1.5,
    verified: true,
    tags: ["حلويات", "قهوة"],
    featured: true,
    fastDelivery: true,
  },
  {
    id: "pizza-roma",
    name: "بيتزا روما",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    rating: 4.4,
    cuisine: "إيطالي",
    deliveryTime: "30–45 د",
    deliveryFee: 9,
    minOrder: 45,
    distanceKm: 2.4,
    verified: true,
    tags: ["بيتزا", "إيطالي"],
    featured: true,
    open24h: true,
  },
  {
    id: "hindi-masala",
    name: "هندي ماسالا",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    rating: 4.6,
    cuisine: "هندي",
    deliveryTime: "35–50 د",
    deliveryFee: 8,
    minOrder: 40,
    distanceKm: 2.8,
    verified: true,
    tags: ["هندي", "كاري"],
  },
  {
    id: "kabsa-dar",
    name: "دار الكبسة",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    rating: 4.7,
    cuisine: "سعودي",
    deliveryTime: "30–45 د",
    deliveryFee: 7,
    minOrder: 50,
    distanceKm: 1.9,
    verified: true,
    tags: ["كبسة", "سعودي"],
    featured: true,
  },
  {
    id: "seafood-coast",
    name: "ساحل المأكولات البحرية",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    rating: 4.5,
    cuisine: "بحري",
    deliveryTime: "40–55 د",
    deliveryFee: 12,
    minOrder: 60,
    distanceKm: 4.2,
    verified: true,
    tags: ["سمك", "روبيان"],
  },
  {
    id: "healthy-bowl",
    name: "بول الصحية",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    rating: 4.3,
    cuisine: "صحي",
    deliveryTime: "20–35 د",
    deliveryFee: 6,
    minOrder: 30,
    distanceKm: 1.1,
    verified: false,
    tags: ["سلطات", "صحي"],
    featured: true,
    fastDelivery: true,
  },
  {
    id: "luqma-mart",
    name: "ماركت لقمة",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    rating: 4.4,
    cuisine: "بقالة",
    deliveryTime: "15–25 د",
    deliveryFee: 4,
    minOrder: 20,
    distanceKm: 0.6,
    verified: true,
    tags: ["بقالة", "مواد غذائية"],
    featured: true,
    fastDelivery: true,
    open24h: true,
  },
];

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
    // default food list excludes grocery only when no explicit grocery filter
    if (filter !== "grocery") {
      list = list.filter((r) => r.cuisine !== "بقالة");
    }
  }

  return list;
}
