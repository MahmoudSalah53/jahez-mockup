import Image from "next/image";
import Link from "next/link";
import type { Meal } from "@/lib/types";
import { getMealPrice } from "@/data/meals";
import { formatPrice } from "@/lib/format";

type Props = {
  meal: Meal;
  href?: string;
  restaurantName?: string;
};

export function MealListItem({ meal, href, restaurantName }: Props) {
  const price = getMealPrice(meal);
  const isCombo = meal.isCombo || meal.isOffer;
  const link = href ?? `/meals/${meal.id}`;
  const subtitle =
    isCombo && meal.comboIncludes?.length
      ? `يشمل: ${meal.comboIncludes.join(" · ")}`
      : meal.description;

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
        {isCombo && (
          <span className="absolute start-1 top-1 rounded bg-accent px-1 text-[9px] font-bold text-white">
            كومبو
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-foreground">
          {meal.name}
        </h3>
        {restaurantName && (
          <p className="truncate text-xs text-muted">{restaurantName}</p>
        )}
        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{subtitle}</p>
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
