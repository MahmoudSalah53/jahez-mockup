import type { Meal } from "@/lib/types";
import { restaurants } from "@/data/restaurants";

export const meals: Meal[] = [
  // بيت الشواية
  {
    id: "shawaya-mixed",
    restaurantId: "bayt-alshawaya",
    name: "مشكل مشاوي",
    description: "تشكيلة لحم ودجاج مشوي على الفحم مع أرز وسلطة.",
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80",
    price: 69,
    rating: 4.9,
    calories: 820,
    protein: 48,
    carbs: 55,
    fat: 38,
    isPopular: true,
  },
  {
    id: "shawaya-lamb",
    restaurantId: "bayt-alshawaya",
    name: "ريش غنم",
    description: "ريش غنم طازجة مشوية مع بهارات خاصة وصلصة طحينة.",
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
    price: 85,
    rating: 4.8,
    calories: 710,
    protein: 52,
    carbs: 12,
    fat: 48,
    isOffer: true,
    offerPrice: 72,
  },
  {
    id: "shawaya-chicken",
    restaurantId: "bayt-alshawaya",
    name: "دجاج على الفحم",
    description: "نصف دجاجة متبلة ومشوية مع خبز عربي ومخللات.",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    price: 42,
    rating: 4.6,
    calories: 540,
    protein: 42,
    carbs: 18,
    fat: 28,
    isPopular: true,
  },
  {
    id: "shawaya-kofta",
    restaurantId: "bayt-alshawaya",
    name: "كفتة لحم",
    description: "كفتة لحم بقري مشوية مع صلصة طماطم وبطاطس.",
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
    price: 48,
    rating: 4.5,
    calories: 620,
    protein: 36,
    carbs: 32,
    fat: 34,
  },
  {
    id: "shawaya-rice",
    restaurantId: "bayt-alshawaya",
    name: "أرز بخاري",
    description: "أرز بخاري باللحم والجزر مع مكسرات محمصة.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    price: 38,
    rating: 4.4,
    calories: 580,
    protein: 28,
    carbs: 68,
    fat: 18,
  },

  // مذاق الشام
  {
    id: "sham-shawarma",
    restaurantId: "madhaq-alsham",
    name: "شاورما دجاج",
    description: "ساندويتش شاورما دجاج مع ثومية ومخلل وبطاطا.",
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80",
    price: 28,
    rating: 4.7,
    calories: 480,
    protein: 28,
    carbs: 42,
    fat: 20,
    isPopular: true,
    isOffer: true,
    offerPrice: 22,
  },
  {
    id: "sham-falafel",
    restaurantId: "madhaq-alsham",
    name: "صحن فلافل",
    description: "فلافل مقرمشة مع حمص وسلطة وخبز طازج.",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&q=80",
    price: 22,
    rating: 4.5,
    calories: 410,
    protein: 14,
    carbs: 48,
    fat: 16,
  },
  {
    id: "sham-hummus",
    restaurantId: "madhaq-alsham",
    name: "حمص باللحمة",
    description: "حمص كريمي مع لحم مفروم وصنوبر وزيت زيتون.",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
    price: 32,
    rating: 4.6,
    calories: 390,
    protein: 22,
    carbs: 28,
    fat: 22,
    isPopular: true,
  },
  {
    id: "sham-kibbeh",
    restaurantId: "madhaq-alsham",
    name: "كبة مقلية",
    description: "كبة محشوة بلحم وجوز مع لبن رائب.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    price: 35,
    rating: 4.4,
    calories: 450,
    protein: 18,
    carbs: 38,
    fat: 24,
  },
  {
    id: "sham-fattoush",
    restaurantId: "madhaq-alsham",
    name: "فتوش",
    description: "سلطة فتوش طازجة مع خبز محمص وسمك الرمان.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    price: 18,
    rating: 4.3,
    calories: 220,
    protein: 6,
    carbs: 24,
    fat: 10,
  },

  // أصيل برجر
  {
    id: "burger-classic",
    restaurantId: "aseel-burger",
    name: "برجر كلاسيك",
    description: "لحم بقري مشوي مع جبنة وخس وطماطم وصلصة خاصة.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    price: 36,
    rating: 4.6,
    calories: 650,
    protein: 32,
    carbs: 48,
    fat: 32,
    isPopular: true,
  },
  {
    id: "burger-double",
    restaurantId: "aseel-burger",
    name: "دبل تشيز",
    description: "قطعتان من اللحم مع جبنة شيدر مزدوجة وبصل مقرمش.",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
    price: 48,
    rating: 4.8,
    calories: 890,
    protein: 48,
    carbs: 52,
    fat: 48,
    isOffer: true,
    offerPrice: 42,
  },
  {
    id: "burger-chicken",
    restaurantId: "aseel-burger",
    name: "برجر دجاج مقرمش",
    description: "صدر دجاج مقلي مع مايونيز وثوم وخس طازج.",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80",
    price: 34,
    rating: 4.5,
    calories: 580,
    protein: 30,
    carbs: 50,
    fat: 26,
    isPopular: true,
  },
  {
    id: "burger-fries",
    restaurantId: "aseel-burger",
    name: "بطاطس مقلية",
    description: "بطاطس ذهبية مقرمشة مع بهارات أصيل.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
    price: 12,
    rating: 4.4,
    calories: 320,
    protein: 4,
    carbs: 42,
    fat: 14,
  },
  {
    id: "burger-shake",
    restaurantId: "aseel-burger",
    name: "ميلك شيك فانيلا",
    description: "مشروب حليب كريمي بنكهة الفانيلا الطازجة.",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
    price: 18,
    rating: 4.3,
    calories: 380,
    protein: 8,
    carbs: 48,
    fat: 16,
  },

  // سوشي نوي
  {
    id: "sushi-salmon",
    restaurantId: "sushi-noi",
    name: "رول سلمون",
    description: "أرز سوشي مع سلمون طازج وأفوكادو وسمسم.",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
    price: 55,
    rating: 4.8,
    calories: 420,
    protein: 24,
    carbs: 48,
    fat: 14,
    isPopular: true,
  },
  {
    id: "sushi-tuna",
    restaurantId: "sushi-noi",
    name: "نينيري تونا",
    description: "قطع سوشي تونا على أرز متبل بصلصة الصويا.",
    image:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80",
    price: 62,
    rating: 4.7,
    calories: 380,
    protein: 28,
    carbs: 42,
    fat: 10,
  },
  {
    id: "sushi-tempura",
    restaurantId: "sushi-noi",
    name: "رول تمبورا",
    description: "روبيان تمبورا مقرمش مع مايونيز حار.",
    image:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80",
    price: 48,
    rating: 4.6,
    calories: 510,
    protein: 20,
    carbs: 55,
    fat: 22,
    isOffer: true,
    offerPrice: 40,
    isPopular: true,
  },
  {
    id: "sushi-miso",
    restaurantId: "sushi-noi",
    name: "شوربة ميسو",
    description: "شوربة ميسو تقليدية مع توفو وأعشاب بحرية.",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    price: 16,
    rating: 4.4,
    calories: 90,
    protein: 6,
    carbs: 8,
    fat: 3,
  },
  {
    id: "sushi-edamame",
    restaurantId: "sushi-noi",
    name: "إدامامي",
    description: "فول الصويا المسلوق مع ملح البحر.",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    price: 14,
    rating: 4.2,
    calories: 150,
    protein: 12,
    carbs: 10,
    fat: 6,
  },

  // حلويات الرياض
  {
    id: "sweet-kunafa",
    restaurantId: "halawiyat-riyadh",
    name: "كنافة نابلسية",
    description: "كنافة بالجبن مع قطر وقطر الفستق.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    price: 32,
    rating: 4.9,
    calories: 480,
    protein: 10,
    carbs: 62,
    fat: 20,
    isPopular: true,
    isOffer: true,
    offerPrice: 26,
  },
  {
    id: "sweet-basbousa",
    restaurantId: "halawiyat-riyadh",
    name: "بسبوسة بالقشطة",
    description: "بسبوسة طرية محشوة بالقشطة ومغطاة بالمكسرات.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    price: 24,
    rating: 4.7,
    calories: 390,
    protein: 6,
    carbs: 52,
    fat: 16,
    isPopular: true,
  },
  {
    id: "sweet-baklava",
    restaurantId: "halawiyat-riyadh",
    name: "بقلاوة مشكلة",
    description: "طبق بقلاوة بالفستق والجوز والعسل.",
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80",
    price: 28,
    rating: 4.8,
    calories: 420,
    protein: 8,
    carbs: 48,
    fat: 22,
  },
  {
    id: "sweet-luqaimat",
    restaurantId: "halawiyat-riyadh",
    name: "لقيمات",
    description: "لقيمات ذهبية مقرمشة مع دبس التمر وسمسم.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    price: 18,
    rating: 4.6,
    calories: 340,
    protein: 4,
    carbs: 48,
    fat: 14,
  },
  {
    id: "sweet-cheesecake",
    restaurantId: "halawiyat-riyadh",
    name: "تشيز كيك فراولة",
    description: "تشيز كيك كريمي مع طبقة فراولة طازجة.",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
    price: 30,
    rating: 4.5,
    calories: 450,
    protein: 8,
    carbs: 42,
    fat: 26,
  },
];

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
      r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q),
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

/** Up to `limit` suggestions for the search dropdown (default 3). */
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
        href: `/meals/${m.id}`,
        kind: "meal",
        meta: "وجبة",
      });
    }
  }

  return items.slice(0, limit);
}
