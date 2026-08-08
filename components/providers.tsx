"use client";

import { CartProvider } from "@/lib/cart-context";
import { OrdersProvider } from "@/lib/orders-context";
import { SavedProvider } from "@/lib/saved-context";
import { PrefsProvider } from "@/lib/prefs-context";
import { PrefsOnboarding } from "@/components/onboarding/PrefsOnboarding";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SavedProvider>
        <OrdersProvider>
          <PrefsProvider>
            <PrefsOnboarding />
            {children}
          </PrefsProvider>
        </OrdersProvider>
      </SavedProvider>
    </CartProvider>
  );
}
