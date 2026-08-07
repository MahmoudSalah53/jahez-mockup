import { restaurants } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";

export default function RestaurantsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        المطاعم
      </h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        تصفح جميع المطاعم المتاحة في العرض التجريبي
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
