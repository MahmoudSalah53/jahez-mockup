import Image from "next/image";
import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  restaurant: Restaurant;
};

/** Desktop marketplace card — not used on mobile list UI */
export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="group block overflow-hidden rounded-3xl bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-border/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] hover:ring-accent/25"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-border">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        <div className="absolute start-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur">
          <span className="text-star">★</span>
          {restaurant.rating.toFixed(1)}
        </div>
        <div className="absolute bottom-3 start-3 end-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {restaurant.deliveryTime}
          </span>
          {restaurant.fastDelivery ? (
            <span className="rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] font-semibold text-white">
              سريع
            </span>
          ) : null}
          {restaurant.open24h ? (
            <span className="rounded-full bg-orange-500/90 px-2.5 py-1 text-[11px] font-semibold text-white">
              24 ساعة
            </span>
          ) : null}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-snug text-foreground">
            {restaurant.name}
            {restaurant.verified ? (
              <span className="ms-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-white align-middle">
                ✓
              </span>
            ) : null}
          </h3>
          <span className="shrink-0 text-xs text-muted">
            {restaurant.distanceKm.toFixed(1)} كم
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{restaurant.cuisine}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          <span>التوصيل {formatPrice(restaurant.deliveryFee)}</span>
          <span className="text-border">·</span>
          <span>الحد الأدنى {formatPrice(restaurant.minOrder)}</span>
        </div>
      </div>
    </Link>
  );
}
