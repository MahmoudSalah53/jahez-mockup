import Image from "next/image";
import Link from "next/link";
import type { Meal } from "@/lib/types";
import { getMealPrice } from "@/data/meals";
import { formatPrice } from "@/lib/format";
import { ComboChips } from "@/components/ComboChips";
import { offerBadgeLabel } from "@/lib/offer-badge";

type Props = {
  meal: Meal;
  href?: string;
  restaurantName?: string;
};

export function MealListItem({ meal, href, restaurantName }: Props) {
  const price = getMealPrice(meal);
  const isDeal = meal.isCombo || meal.isOffer;
  const badge = offerBadgeLabel(meal.offerKind, isDeal);
  const link = href ?? `/meals/${meal.id}`;

  return (
    <Link
      href={link}
      className="flex gap-3 border-b border-border bg-surface px-4 py-3 transition-colors active:bg-background"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-border">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-foreground">
            {meal.name}
          </h3>
          {badge ? (
            <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
              {badge}
            </span>
          ) : null}
        </div>
        {restaurantName && (
          <p className="truncate text-xs text-muted">{restaurantName}</p>
        )}
        {isDeal && meal.comboIncludes?.length ? (
          <ComboChips includes={meal.comboIncludes} className="mt-1" />
        ) : (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">
            {meal.description}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-accent">
            {formatPrice(price)}
          </span>
          <span className="text-[11px] text-muted">{meal.calories} سعرة</span>
        </div>
      </div>
    </Link>
  );
}
