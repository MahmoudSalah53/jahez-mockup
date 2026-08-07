"use client";

import Link from "next/link";
import { useOrders } from "@/lib/orders-context";
import { formatDate, formatPrice } from "@/lib/format";

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">الطلبات</h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        سجل طلباتك التجريبية المحفوظة على هذا الجهاز
      </p>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-muted">لا توجد طلبات بعد</p>
          <Link
            href="/restaurants"
            className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-hover"
          >
            اطلب الآن
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground" dir="ltr">
                    {order.id}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <p className="font-bold text-accent">
                  {formatPrice(order.total)}
                </p>
              </div>
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted">
                {order.items.map((item) => (
                  <li key={item.mealId}>
                    {item.mealName} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">
                {order.name} — {order.phone}
              </p>
              <p className="text-sm text-muted">{order.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
