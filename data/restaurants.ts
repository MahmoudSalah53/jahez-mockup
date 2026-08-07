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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
  },
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}
