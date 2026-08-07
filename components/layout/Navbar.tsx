"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const desktopLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/restaurants", label: "المطاعم" },
  { href: "/offers", label: "العروض" },
  { href: "/saved", label: "المحفوظات" },
  { href: "/orders", label: "الطلبات" },
  { href: "/cart", label: "السلة" },
  { href: "/account", label: "الحساب" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-lg items-center justify-between gap-3 px-4 sm:h-14 md:max-w-6xl sm:px-6">
        <Link href="/" className="text-lg font-bold text-accent sm:text-xl">
          لقمة
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {desktopLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-foreground hover:bg-background"
                }`}
              >
                {link.label}
                {link.href === "/cart" && totalItems > 0
                  ? ` (${totalItems})`
                  : ""}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
