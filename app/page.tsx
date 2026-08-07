import { restaurants } from "@/data/restaurants";
import { meals } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { MealCard } from "@/components/MealCard";
import { Hero } from "@/components/home/Hero";
import { SectionHeader } from "@/components/home/SectionHeader";
import { formatPrice } from "@/lib/format";
import { getMealPrice } from "@/data/meals";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const featured = restaurants.filter((r) => r.featured).slice(0, 4);
  const popular = meals.filter((m) => m.isPopular).slice(0, 4);
  const topRated = [...meals].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const offers = meals.filter((m) => m.isOffer).slice(0, 3);

  return (
    <>
      <Hero />

      <SectionHeader title="مطاعم مميزة" href="/restaurants">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </SectionHeader>

      <div className="border-t border-border bg-surface">
        <SectionHeader title="أكلات مشهورة">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {popular.map((m) => (
              <MealCard
                key={m.id}
                meal={m}
                restaurantName={getRestaurantById(m.restaurantId)?.name}
              />
            ))}
          </div>
        </SectionHeader>
      </div>

      <SectionHeader title="أفضل تقييم">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {topRated.map((m) => (
            <MealCard
              key={m.id}
              meal={m}
              restaurantName={getRestaurantById(m.restaurantId)?.name}
            />
          ))}
        </div>
      </SectionHeader>

      <div className="border-t border-border bg-surface">
        <SectionHeader title="عروض" href="/offers">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {offers.map((meal) => {
              const restaurant = getRestaurantById(meal.restaurantId);
              return (
                <Link
                  key={meal.id}
                  href={`/meals/${meal.id}`}
                  className="flex overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-accent/40"
                >
                  <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-3 sm:p-4">
                    <span className="mb-1 w-fit rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                      عرض خاص
                    </span>
                    <h3 className="font-semibold text-foreground">
                      {meal.name}
                    </h3>
                    <p className="text-xs text-muted">{restaurant?.name}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-semibold text-accent">
                        {formatPrice(getMealPrice(meal))}
                      </span>
                      <span className="text-xs text-muted line-through">
                        {formatPrice(meal.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </SectionHeader>
      </div>
    </>
  );
}
