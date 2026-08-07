"use client";

import { useState } from "react";
import { getMealById, lineUnitPrice } from "@/data/meals";
import { useCart } from "@/lib/cart-context";
import { useSaved } from "@/lib/saved-context";

/** Simple add/save actions (used only if needed elsewhere). Prefer MealDetailClient. */
export function MealActions({ mealId }: { mealId: string }) {
  const { addItem } = useCart();
  const { isSaved, toggleSaved } = useSaved();
  const [added, setAdded] = useState(false);
  const saved = isSaved(mealId);
  const meal = getMealById(mealId);

  function handleAdd() {
    if (!meal) return;
    addItem({
      mealId,
      quantity: 1,
      spicy: false,
      addons: [],
      unitPrice: lineUnitPrice(meal, false, []),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleAdd}
        className="flex-1 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:text-base"
      >
        {added ? "تمت الإضافة" : "أضف إلى السلة"}
      </button>
      <button
        type="button"
        onClick={() => toggleSaved(mealId)}
        className={`rounded-xl border px-5 py-3.5 text-sm font-semibold transition-colors sm:text-base ${
          saved
            ? "border-accent bg-accent-soft text-accent"
            : "border-border bg-surface text-foreground hover:border-accent/40"
        }`}
      >
        {saved ? "محفوظ" : "حفظ"}
      </button>
    </div>
  );
}
