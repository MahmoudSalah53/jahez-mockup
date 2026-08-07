import Image from "next/image";
import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/StarRating";

type Props = {
  restaurant: Restaurant;
};

export function RestaurantListItem({ restaurant }: Props) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="flex gap-3 border-b border-border bg-surface px-4 py-3 transition-colors active:bg-background"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-border sm:h-[72px] sm:w-[72px]">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          sizes="72px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5">
          <h3 className="truncate text-[15px] font-semibold text-foreground">
            {restaurant.name}
          </h3>
          {restaurant.verified && (
            <span
              className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
              title="موثّق"
            >
              ✓
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
          <StarRating rating={restaurant.rating} />
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">
          {restaurant.cuisine}
          <span className="mx-1 text-border">•</span>
          {restaurant.distanceKm.toFixed(1)} كم
          <span className="mx-1 text-border">•</span>
          {restaurant.deliveryTime}
        </p>
        <span className="mt-1.5 inline-flex rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
          التوصيل {formatPrice(restaurant.deliveryFee)}
        </span>
      </div>
    </Link>
  );
}
