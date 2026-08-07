"use client";

import { CartProvider } from "@/lib/cart-context";
import { OrdersProvider } from "@/lib/orders-context";
import { SavedProvider } from "@/lib/saved-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SavedProvider>
        <OrdersProvider>{children}</OrdersProvider>
      </SavedProvider>
    </CartProvider>
  );
}
