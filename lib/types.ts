export type MealAddon = {
  id: string;
  name: string;
  price: number;
};

export type MealCategory = "offers" | "popular" | "menu";

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  distanceKm: number;
  verified: boolean | null;
  tags: string[];
  featured: boolean | null;
  open24h: boolean | null;
  fastDelivery: boolean | null;
};

export type Meal = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: MealCategory;
  isPopular: boolean;
  /** True for combo/package deals shown under العروض (not price discounts). */
  isOffer: boolean;
  offerPrice: number | null;
  isCombo: boolean;
  /** Items included in a combo package (Arabic labels). */
  comboIncludes: string[];
  spicyOption: boolean;
  cashbackPercent: number | null;
  addons: MealAddon[];
};

export type CartAddon = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  /** Unique line id so same meal with different addons can coexist */
  lineId: string;
  mealId: string;
  quantity: number;
  spicy: boolean;
  addons: CartAddon[];
  unitPrice: number;
};

export type Order = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  items: {
    mealId: string;
    mealName: string;
    price: number;
    quantity: number;
    spicy?: boolean;
    addons?: CartAddon[];
  }[];
  total: number;
};

export const DEFAULT_ADDONS: MealAddon[] = [
  { id: "extra-cheese", name: "جبنة إضافية", price: 5 },
  { id: "bacon", name: "بيكون", price: 8 },
  { id: "large-fries", name: "بطاطس كبيرة", price: 10 },
  { id: "cola", name: "كولا", price: 6 },
  { id: "spicy-sauce", name: "صوص سبايسي", price: 3 },
];
