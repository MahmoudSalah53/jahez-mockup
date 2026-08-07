"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Package,
  ShoppingCart,
  UserCircle,
} from "@phosphor-icons/react";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/orders-context";
import { useSaved } from "@/lib/saved-context";
import { formatPrice } from "@/lib/format";

export default function AccountPage() {
  const { orders } = useOrders();
  const { savedIds } = useSaved();
  const { totalItems, subtotal } = useCart();

  const links = [
    {
      href: "/orders",
      label: "طلباتي",
      desc: orders.length
        ? `${orders.length} طلب سابق`
        : "لا توجد طلبات بعد",
      Icon: Package,
    },
    {
      href: "/saved",
      label: "المحفوظات",
      desc: savedIds.length
        ? `${savedIds.length} وجبة محفوظة`
        : "احفظ وجباتك المفضلة",
      Icon: Heart,
    },
    {
      href: "/cart",
      label: "السلة",
      desc: totalItems
        ? `${totalItems} عنصر · ${formatPrice(subtotal)}`
        : "سلتك فارغة",
      Icon: ShoppingCart,
    },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 md:max-w-7xl md:px-8 md:py-10">
      {/* Mobile — compact (unchanged feel) */}
      <div className="md:hidden">
        <h1 className="text-2xl font-bold">الحساب</h1>
        <p className="mt-2 text-sm text-muted">
          حساب تجريبي للعرض — بدون تسجيل دخول حقيقي
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-xl font-bold text-accent">
              ز
            </div>
            <div>
              <p className="font-semibold text-foreground">زائر لقمة</p>
              <p className="text-sm text-muted" dir="ltr">
                guest@luqma.demo
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-1 border-t border-border pt-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop — full marketplace profile */}
      <div className="hidden md:block">
        <div className="relative overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40" />
          <div className="relative flex flex-wrap items-end justify-between gap-6 px-10 py-14">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-accent shadow-lg">
                ز
              </div>
              <div>
                <p className="text-sm font-medium text-white/75">حساب تجريبي</p>
                <h1 className="mt-1 text-4xl font-bold text-white">زائر لقمة</h1>
                <p className="mt-1 text-sm text-white/80" dir="ltr">
                  guest@luqma.demo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur">
              <UserCircle size={20} weight="fill" />
              بدون تسجيل دخول حقيقي
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-5">
          <StatCard label="الطلبات" value={String(orders.length)} />
          <StatCard label="المحفوظات" value={String(savedIds.length)} />
          <StatCard
            label="عناصر السلة"
            value={String(totalItems)}
            hint={totalItems ? formatPrice(subtotal) : undefined}
          />
        </div>

        <h2 className="mt-10 text-xl font-bold">اختصارات سريعة</h2>
        <div className="mt-4 grid grid-cols-3 gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent transition group-hover:scale-105">
                <l.Icon size={24} weight="duotone" />
              </span>
              <span className="mt-4 flex items-center justify-between gap-2">
                <span className="text-lg font-bold">{l.label}</span>
                <ArrowLeft
                  size={18}
                  className="text-muted transition group-hover:text-accent"
                />
              </span>
              <span className="mt-1 text-sm text-muted">{l.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface px-6 py-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-sm font-medium text-accent">{hint}</p> : null}
    </div>
  );
}
