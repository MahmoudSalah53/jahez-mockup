import Image from "next/image";
import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/StarRating";

type Props = {
  restaurant: Restaurant;
};

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-border">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          <h3 className="text-base font-semibold text-foreground sm:text-lg">
            {restaurant.name}
          </h3>
          <StarRating rating={restaurant.rating} />
        </div>
        <p className="mt-1 text-sm text-muted">{restaurant.cuisine}</p>
        <div className="mt-2.5 flex flex-col gap-1 text-xs text-muted sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:text-sm">
          <span>{restaurant.deliveryTime}</span>
          <span className="hidden text-border sm:inline">|</span>
          <span>التوصيل {formatPrice(restaurant.deliveryFee)}</span>
          <span className="hidden text-border sm:inline">|</span>
          <span>الحد الأدنى {formatPrice(restaurant.minOrder)}</span>
        </div>
      </div>
    </Link>
  );
}
