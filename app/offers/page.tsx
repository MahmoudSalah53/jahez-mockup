import { meals, getMealPrice } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

export default function OffersPage() {
  const offers = meals.filter((m) => m.isOffer);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">العروض</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        تخفيضات محدودة على أكلات مختارة
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2">
        {offers.map((meal) => {
          const restaurant = getRestaurantById(meal.restaurantId);
          return (
            <Link
              key={meal.id}
              href={`/meals/${meal.id}`}
              className="flex overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
            >
              <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-40">
                <Image
                  src={meal.image}
                  alt={meal.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-4">
                <span className="mb-1 w-fit rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                  عرض
                </span>
                <h2 className="font-semibold text-foreground sm:text-lg">
                  {meal.name}
                </h2>
                <p className="text-sm text-muted">{restaurant?.name}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-semibold text-accent">
                    {formatPrice(getMealPrice(meal))}
                  </span>
                  <span className="text-sm text-muted line-through">
                    {formatPrice(meal.price)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
