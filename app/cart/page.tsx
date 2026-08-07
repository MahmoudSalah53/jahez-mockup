"use client";

import Image from "next/image";
import Link from "next/link";
import { getMealById } from "@/data/meals";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-6xl sm:px-6">
        <h1 className="text-xl font-bold md:text-3xl">السلة</h1>
        <div className="mt-8 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-muted">سلتك فارغة</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-accent"
          >
            ابدأ التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:max-w-6xl sm:px-6 md:py-8">
      <h1 className="text-xl font-bold md:text-3xl">
        السلة{" "}
        <span className="text-sm font-normal text-muted">({totalItems})</span>
      </h1>

      <div className="mt-4 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8">
        <ul className="space-y-2">
          {items.map((item) => {
            const meal = getMealById(item.mealId);
            if (!meal) return null;
            return (
              <li
                key={item.lineId}
                className="flex gap-3 rounded-2xl border border-border bg-surface p-3"
              >
                <Link
                  href={`/meals/${meal.id}?from=restaurant`}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"
                >
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-semibold">{meal.name}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.lineId)}
                      className="text-xs text-muted"
                    >
                      حذف
                    </button>
                  </div>
                  {(item.spicy || item.addons.length > 0) && (
                    <p className="mt-0.5 text-[11px] text-muted">
                      {item.spicy ? "سبايسي" : ""}
                      {item.spicy && item.addons.length > 0 ? " · " : ""}
                      {item.addons.map((a) => a.name).join(" · ")}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-medium text-accent">
                    {formatPrice(item.unitPrice)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.lineId, item.quantity - 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.lineId, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border"
                    >
                      +
                    </button>
                    <span className="ms-auto text-sm font-semibold">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 lg:sticky lg:top-20 lg:mt-0">
          <div className="flex justify-between text-sm">
            <span className="text-muted">المجموع</span>
            <span className="font-bold text-accent">
              {formatPrice(subtotal)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-4 block rounded-xl bg-accent py-3.5 text-center text-sm font-semibold text-white"
          >
            إتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  );
}
