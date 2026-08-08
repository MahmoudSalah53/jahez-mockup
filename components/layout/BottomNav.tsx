"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookmarkSimple,
  House,
  ListBullets,
  ShoppingCart,
} from "@phosphor-icons/react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/", label: "الرئيسية", Icon: House },
  { href: "/saved", label: "المحفوظات", Icon: BookmarkSimple },
  { href: "/orders", label: "الطلبات", Icon: ListBullets },
];

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[9000] border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
      aria-label="التنقل السفلي"
    >
      <ul className="mx-auto flex h-14 max-w-lg items-stretch justify-around px-1">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <tab.Icon
                  size={22}
                  weight={active ? "fill" : "regular"}
                  aria-hidden
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <Link
            href="/cart"
            className={cn(
              "relative flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              pathname.startsWith("/cart") || pathname.startsWith("/checkout")
                ? "text-accent"
                : "text-muted",
            )}
          >
            <ShoppingCart
              size={22}
              weight={
                pathname.startsWith("/cart") || pathname.startsWith("/checkout")
                  ? "fill"
                  : "regular"
              }
              aria-hidden
            />
            السلة
            {totalItems > 0 && (
              <span className="absolute top-1 end-1/2 translate-x-3 rounded-full bg-accent px-1 text-[9px] font-bold leading-4 text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
