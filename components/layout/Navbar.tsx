"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/lib/cart-context";

const links = [
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
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sidebar =
    mounted &&
    open &&
    createPortal(
      <div className="lg:hidden" role="dialog" aria-modal="true" aria-label="القائمة">
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className="fixed inset-0 z-[100] bg-black/40"
          onClick={() => setOpen(false)}
        />
        <aside className="fixed inset-y-0 start-0 z-[110] flex w-[min(100%,18rem)] flex-col bg-surface shadow-xl">
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <Link
              href="/"
              className="text-xl font-bold text-accent"
              onClick={() => setOpen(false)}
            >
              لقمة
            </Link>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg transition-colors hover:bg-background"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <ul className="flex flex-col gap-1">
              {links.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                        active
                          ? "bg-accent-soft text-accent"
                          : "text-foreground hover:bg-background"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.href === "/cart" && totalItems > 0 && (
                        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold leading-6 text-white">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>,
      document.body,
    );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="فتح القائمة"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg transition-colors hover:bg-background lg:hidden"
            >
              ☰
            </button>
            <Link
              href="/"
              className="shrink-0 text-xl font-bold tracking-tight text-accent sm:text-2xl"
            >
              لقمة
            </Link>
          </div>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const isCart = link.href === "/cart";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-foreground hover:bg-background"
                  }`}
                >
                  {link.label}
                  {isCart && totalItems > 0 && (
                    <span className="ms-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold leading-5 text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/cart"
            className="relative flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background lg:hidden"
          >
            السلة
            {totalItems > 0 && (
              <span className="ms-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold leading-5 text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>
      {sidebar}
    </>
  );
}
