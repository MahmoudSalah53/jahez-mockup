import Image from "next/image";
import Link from "next/link";
import type { Meal } from "@/lib/types";
import { getMealPrice } from "@/data/meals";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/StarRating";

type Props = {
  meal: Meal;
  restaurantName?: string;
};

export function MealCard({ meal, restaurantName }: Props) {
  const price = getMealPrice(meal);
  const hasOffer = meal.isOffer && meal.offerPrice != null;

  return (
    <Link
      href={`/meals/${meal.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-border">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        {hasOffer && (
          <span className="absolute start-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-white sm:text-xs">
            عرض
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
        <h3 className="text-sm font-semibold leading-snug text-foreground sm:text-base">
          {meal.name}
        </h3>
        {restaurantName && (
          <p className="mt-0.5 truncate text-xs text-muted">{restaurantName}</p>
        )}
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted sm:text-sm">
          {meal.description}
        </p>
        <div className="mt-auto flex flex-col gap-1.5 pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-accent sm:text-base">
              {formatPrice(price)}
            </span>
            {hasOffer && (
              <span className="text-[11px] text-muted line-through sm:text-xs">
                {formatPrice(meal.price)}
              </span>
            )}
          </div>
          <StarRating rating={meal.rating} />
        </div>
      </div>
    </Link>
  );
}
