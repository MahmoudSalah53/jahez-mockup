import Image from "next/image";
import { notFound } from "next/navigation";
import { getRestaurantById } from "@/data/restaurants";
import { getMealsByRestaurant } from "@/data/meals";
import { MealCard } from "@/components/MealCard";
import { StarRating } from "@/components/StarRating";
import { formatPrice } from "@/lib/format";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);
  if (!restaurant) notFound();

  const restaurantMeals = getMealsByRestaurant(id);

  return (
    <div>
      <div className="relative h-44 w-full sm:h-56 md:h-64">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-5 sm:px-6 sm:pb-6">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {restaurant.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/90">
            <span>{restaurant.cuisine}</span>
            <StarRating rating={restaurant.rating} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          <span>الوقت: {restaurant.deliveryTime}</span>
          <span>التوصيل: {formatPrice(restaurant.deliveryFee)}</span>
          <span>الحد الأدنى: {formatPrice(restaurant.minOrder)}</span>
        </div>

        <h2 className="mt-8 text-xl font-bold text-foreground">القائمة</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {restaurantMeals.map((m) => (
            <MealCard key={m.id} meal={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
