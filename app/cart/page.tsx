"use client";

import Image from "next/image";
import Link from "next/link";
import { getMealById, getMealPrice } from "@/data/meals";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold sm:text-3xl">السلة</h1>
        <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-muted">سلتك فارغة</p>
          <Link
            href="/restaurants"
            className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-hover"
          >
            ابدأ التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">
        السلة{" "}
        <span className="text-base font-normal text-muted">
          ({totalItems} عنصر)
        </span>
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        <ul className="order-2 space-y-3 lg:order-1">
          {items.map((item) => {
            const meal = getMealById(item.mealId);
            if (!meal) return null;
            const price = getMealPrice(meal);
            return (
              <li
                key={item.mealId}
                className="flex gap-3 rounded-2xl border border-border bg-surface p-3 sm:gap-4 sm:p-4"
              >
                <Link
                  href={`/meals/${meal.id}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24"
                >
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/meals/${meal.id}`}
                      className="font-semibold text-foreground hover:text-accent"
                    >
                      {meal.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.mealId)}
                      className="shrink-0 text-xs text-muted transition-colors hover:text-accent"
                    >
                      حذف
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-accent font-medium">
                    {formatPrice(price)}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      aria-label="إنقاص الكمية"
                      onClick={() =>
                        setQuantity(item.mealId, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-lg leading-none transition-colors hover:border-accent/40"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="زيادة الكمية"
                      onClick={() =>
                        setQuantity(item.mealId, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-lg leading-none transition-colors hover:border-accent/40"
                    >
                      +
                    </button>
                    <span className="ms-auto text-sm font-semibold">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="order-1 h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-20 lg:order-2">
          <h2 className="font-bold text-foreground">ملخص الطلب</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted">المجموع</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            رسوم التوصيل تُحسب عند إتمام الطلب حسب المطعم
          </p>
          <Link
            href="/checkout"
            className="mt-5 block min-h-12 rounded-xl bg-accent py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            إتمام الطلب
          </Link>
        </aside>
      </div>
    </div>
  );
}
