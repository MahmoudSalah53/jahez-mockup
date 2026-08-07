export type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  featured?: boolean;
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
  isPopular?: boolean;
  isOffer?: boolean;
  offerPrice?: number;
};

export type CartItem = {
  mealId: string;
  quantity: number;
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
  }[];
  total: number;
};
