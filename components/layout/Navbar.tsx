"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "@phosphor-icons/react";
import { useCart } from "@/lib/cart-context";
import { SearchBox } from "@/components/SearchBox";

const desktopLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/restaurants", label: "المطاعم" },
  { href: "/offers", label: "العروض" },
  { href: "/orders", label: "الطلبات" },
  { href: "/account", label: "الحساب" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      {/* Mobile: logo only — unchanged */}
      <div className="mx-auto flex h-12 max-w-lg items-center justify-between gap-3 px-4 sm:h-14 sm:px-6 md:hidden">
        <Link href="/" className="text-lg font-bold text-accent sm:text-xl">
          لقمة
        </Link>
      </div>

      {/* Desktop marketplace header */}
      <div className="mx-auto hidden h-16 max-w-7xl items-center gap-6 px-8 md:flex">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold tracking-tight text-accent"
        >
          لقمة
        </Link>

        {!isHome ? (
          <div className="min-w-0 flex-1 max-w-md">
            <SearchBox inputId="nav-search" variant="compact" />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <nav className="flex items-center gap-1">
          {desktopLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-foreground/80 hover:bg-background hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className={`relative ms-1 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              pathname.startsWith("/cart")
                ? "bg-accent text-white"
                : "bg-background text-foreground hover:bg-accent-soft hover:text-accent"
            }`}
          >
            <ShoppingCart size={18} weight="bold" />
            السلة
            {totalItems > 0 ? (
              <span className="absolute -top-1 -start-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-surface">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
