import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMealById, getMealPrice } from "@/data/meals";
import { getRestaurantById } from "@/data/restaurants";
import { StarRating } from "@/components/StarRating";
import { formatPrice } from "@/lib/format";
import { MealActions } from "@/components/MealActions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MealPage({ params }: Props) {
  const { id } = await params;
  const meal = getMealById(id);
  if (!meal) notFound();

  const restaurant = getRestaurantById(meal.restaurantId);
  const price = getMealPrice(meal);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-border sm:aspect-[16/11]">
          <Image
            src={meal.image}
            alt={meal.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {meal.isOffer && (
            <span className="absolute start-3 top-3 rounded-md bg-accent px-2.5 py-1 text-sm font-medium text-white">
              عرض
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {meal.name}
          </h1>
          {restaurant && (
            <Link
              href={`/restaurants/${restaurant.id}`}
              className="mt-2 text-sm text-accent transition-colors hover:text-accent-hover"
            >
              {restaurant.name}
            </Link>
          )}
          <div className="mt-3">
            <StarRating rating={meal.rating} size="md" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            {meal.description}
          </p>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-accent">
              {formatPrice(price)}
            </span>
            {meal.isOffer && meal.offerPrice != null && (
              <span className="text-base text-muted line-through">
                {formatPrice(meal.price)}
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-4">
            <Nutrient label="سعرات" value={`${meal.calories}`} unit="kcal" />
            <Nutrient label="بروتين" value={`${meal.protein}`} unit="غ" />
            <Nutrient label="كاربوهيدرات" value={`${meal.carbs}`} unit="غ" />
            <Nutrient label="دهون" value={`${meal.fat}`} unit="غ" />
          </div>

          <MealActions mealId={meal.id} />
        </div>
      </div>
    </div>
  );
}

function Nutrient({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {value}{" "}
        <span className="text-xs font-normal text-muted">{unit}</span>
      </p>
    </div>
  );
}
