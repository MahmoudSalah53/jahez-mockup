"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getMealById } from "@/data/meals";
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
      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-6xl sm:px-6">
        <h1 className="text-xl font-bold md:text-3xl">إتمام الطلب</h1>
        <div className="mt-8 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
          <p className="text-muted">سلتك فارغة</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-accent">
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
          price: item.unitPrice,
          quantity: item.quantity,
          spicy: item.spicy,
          addons: item.addons,
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
    <div className="mx-auto max-w-lg px-4 py-6 md:max-w-6xl sm:px-6 md:py-8">
      <h1 className="text-xl font-bold md:text-3xl">إتمام الطلب</h1>
      <p className="mt-1 text-sm text-muted">دفع تجريبي فقط</p>

      <form
        onSubmit={onSubmit}
        className="mt-4 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-8"
      >
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
          <Field label="الاسم" htmlFor="name">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="الاسم الكامل"
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
            />
          </Field>
          {error && (
            <p className="text-sm text-accent" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 lg:sticky lg:top-20 lg:mt-0">
          <h2 className="font-bold">ملخص الطلب</h2>
          <ul className="mt-3 space-y-2 border-b border-border pb-3">
            {items.map((item) => {
              const meal = getMealById(item.mealId);
              if (!meal) return null;
              return (
                <li key={item.lineId} className="flex justify-between gap-2 text-sm">
                  <span className="text-muted">
                    {meal.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex justify-between font-semibold">
            <span>الإجمالي</span>
            <span className="text-accent">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "جاري التأكيد..." : "تأكيد الطلب"}
          </button>
        </div>
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
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
