/**
 * Live page snapshot the voice agent can read via luqma.getUiState.
 * Updated by UiStateSync whenever the Next.js route changes.
 */

export type UiStateSnapshot = {
  path: string;
  page:
    | "home"
    | "restaurants"
    | "restaurant"
    | "meals"
    | "meal"
    | "cart"
    | "checkout"
    | "orders"
    | "offers"
    | "search"
    | "saved"
    | "order_success"
    | "other";
  mealId: string | null;
  restaurantId: string | null;
  titleAr: string;
  updatedAt: number;
};

let snapshot: UiStateSnapshot = {
  path: "/",
  page: "home",
  mealId: null,
  restaurantId: null,
  titleAr: "الرئيسية",
  updatedAt: Date.now(),
};

const TITLE_AR: Record<UiStateSnapshot["page"], string> = {
  home: "الرئيسية",
  restaurants: "المطاعم",
  restaurant: "صفحة مطعم",
  meals: "الوجبات",
  meal: "صفحة وجبة",
  cart: "السلة",
  checkout: "إتمام الطلب",
  orders: "الطلبات",
  offers: "العروض",
  search: "البحث",
  saved: "المحفوظات",
  order_success: "نجاح الطلب",
  other: "صفحة أخرى",
};

export function classifyPath(path: string): Omit<UiStateSnapshot, "updatedAt"> {
  const clean = (path.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  if (clean === "/") {
    return { path: clean, page: "home", mealId: null, restaurantId: null, titleAr: TITLE_AR.home };
  }
  if (clean === "/cart") {
    return { path: clean, page: "cart", mealId: null, restaurantId: null, titleAr: TITLE_AR.cart };
  }
  if (clean === "/checkout") {
    return {
      path: clean,
      page: "checkout",
      mealId: null,
      restaurantId: null,
      titleAr: TITLE_AR.checkout,
    };
  }
  if (clean === "/orders") {
    return {
      path: clean,
      page: "orders",
      mealId: null,
      restaurantId: null,
      titleAr: TITLE_AR.orders,
    };
  }
  if (clean === "/offers") {
    return {
      path: clean,
      page: "offers",
      mealId: null,
      restaurantId: null,
      titleAr: TITLE_AR.offers,
    };
  }
  if (clean === "/search") {
    return {
      path: clean,
      page: "search",
      mealId: null,
      restaurantId: null,
      titleAr: TITLE_AR.search,
    };
  }
  if (clean === "/saved" || clean === "/account") {
    return {
      path: clean,
      page: "saved",
      mealId: null,
      restaurantId: null,
      titleAr: TITLE_AR.saved,
    };
  }
  if (clean === "/restaurants") {
    return {
      path: clean,
      page: "restaurants",
      mealId: null,
      restaurantId: null,
      titleAr: TITLE_AR.restaurants,
    };
  }
  if (clean.startsWith("/order-success")) {
    return {
      path: clean,
      page: "order_success",
      mealId: null,
      restaurantId: null,
      titleAr: TITLE_AR.order_success,
    };
  }
  const mealMatch = clean.match(/^\/meals\/([^/]+)$/);
  if (mealMatch) {
    return {
      path: clean,
      page: "meal",
      mealId: mealMatch[1],
      restaurantId: null,
      titleAr: TITLE_AR.meal,
    };
  }
  const restMatch = clean.match(/^\/restaurants\/([^/]+)$/);
  if (restMatch) {
    return {
      path: clean,
      page: "restaurant",
      mealId: null,
      restaurantId: restMatch[1],
      titleAr: TITLE_AR.restaurant,
    };
  }
  return {
    path: clean,
    page: "other",
    mealId: null,
    restaurantId: null,
    titleAr: TITLE_AR.other,
  };
}

export function setUiStateFromPath(path: string) {
  const next = classifyPath(path);
  snapshot = { ...next, updatedAt: Date.now() };
  return snapshot;
}

export function getUiState(): UiStateSnapshot {
  return snapshot;
}
