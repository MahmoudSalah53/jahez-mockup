import Image from "next/image";
import Link from "next/link";
import type { Meal } from "@/lib/types";
import { getMealPrice } from "@/data/meals";
import { formatPrice } from "@/lib/format";

type Props = {
  meal: Meal;
  restaurantName?: string;
  href?: string;
};

/** Desktop marketplace dish card — not used on mobile list UI */
export function MealCard({ meal, restaurantName, href }: Props) {
  const price = getMealPrice(meal);
  const hasOffer = meal.isOffer && meal.offerPrice != null;

  return (
    <Link
      href={href ?? `/meals/${meal.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-border/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:ring-accent/25"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-border">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="(max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {hasOffer && (
          <span className="absolute start-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white shadow">
            عرض
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
          <p className="text-lg font-bold text-white">{formatPrice(price)}</p>
          {hasOffer ? (
            <p className="text-xs text-white/70 line-through">
              {formatPrice(meal.price)}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold leading-snug text-foreground">
          {meal.name}
        </h3>
        {restaurantName ? (
          <p className="mt-1 truncate text-sm text-muted">{restaurantName}</p>
        ) : null}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {meal.description}
        </p>
        <div className="mt-auto flex items-center gap-1 pt-3 text-xs font-semibold text-foreground">
          <span className="text-star">★</span>
          {meal.rating.toFixed(1)}
        </div>
      </div>
    </Link>
  );
}
