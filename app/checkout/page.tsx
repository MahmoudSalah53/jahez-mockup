"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getMealById, getMealPrice } from "@/data/meals";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/orders-context";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold sm:text-3xl">إتمام الطلب</h1>
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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("يرجى تعبئة جميع الحقول");
      return;
    }

    if (!/^05\d{8}$/.test(phone.trim()) && !/^\+9665\d{8}$/.test(phone.trim())) {
      setError("أدخل رقم جوال سعودي صالح (مثال: 05XXXXXXXX)");
      return;
    }

    setSubmitting(true);

    const orderItems = items
      .map((item) => {
        const meal = getMealById(item.mealId);
        if (!meal) return null;
        return {
          mealId: meal.id,
          mealName: meal.name,
          price: getMealPrice(meal),
          quantity: item.quantity,
        };
      })
      .filter((i): i is NonNullable<typeof i> => Boolean(i));

    const order = addOrder({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: orderItems,
      total: subtotal,
    });

    clearCart();
    router.push(`/order-success?id=${order.id}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">إتمام الطلب</h1>
      <p className="mt-2 text-sm text-muted">
        دفع تجريبي فقط — لن يتم خصم أي مبلغ حقيقي
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8"
      >
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <Field label="الاسم" htmlFor="name">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="الاسم الكامل"
              autoComplete="name"
            />
          </Field>
          <Field label="رقم الجوال" htmlFor="phone">
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="05XXXXXXXX"
              dir="ltr"
              autoComplete="tel"
            />
          </Field>
          <Field label="العنوان" htmlFor="address">
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="الحي، الشارع، رقم المبنى"
              autoComplete="street-address"
            />
          </Field>
          {error && (
            <p className="text-sm text-accent" role="alert">
              {error}
            </p>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-bold">ملخص الطلب</h2>
          <ul className="mt-4 space-y-2 border-b border-border pb-4">
            {items.map((item) => {
              const meal = getMealById(item.mealId);
              if (!meal) return null;
              return (
                <li
                  key={item.mealId}
                  className="flex justify-between gap-2 text-sm"
                >
                  <span className="text-muted">
                    {meal.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(getMealPrice(meal) * item.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-between font-semibold">
            <span>الإجمالي</span>
            <span className="text-accent">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "جاري التأكيد..." : "تأكيد الطلب"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
