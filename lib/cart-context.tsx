"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartAddon, CartItem } from "@/lib/types";

const STORAGE_KEY = "luqma-cart-v2";

type AddToCartInput = {
  mealId: string;
  quantity?: number;
  spicy?: boolean;
  addons?: CartAddon[];
  unitPrice: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (input: AddToCartInput) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function makeLineId(
  mealId: string,
  spicy: boolean,
  addons: CartAddon[],
): string {
  const addonKey = addons
    .map((a) => a.id)
    .sort()
    .join(",");
  return `${mealId}__${spicy ? "s" : "n"}__${addonKey}`;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function upsertItem(prev: CartItem[], input: AddToCartInput): CartItem[] {
  const spicy = Boolean(input.spicy);
  const addons = input.addons ?? [];
  const quantity = input.quantity ?? 1;
  const lineId = makeLineId(input.mealId, spicy, addons);

  const existing = prev.find((i) => i.lineId === lineId);
  if (existing) {
    return prev.map((i) =>
      i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i,
    );
  }
  return [
    ...prev,
    {
      lineId,
      mealId: input.mealId,
      quantity,
      spicy,
      addons,
      unitPrice: input.unitPrice,
    },
  ];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((input: AddToCartInput) => {
    console.log(
      "%c[luqma-cart:FRONTEND] addItem",
      "color:#6a1b9a;font-weight:bold",
      input,
    );
    setItems((prev) => {
      // If RPC fires before hydrate, merge into localStorage base
      const base = ready ? prev : loadCart();
      const next = upsertItem(base, input);
      console.log("%c[luqma-cart:FRONTEND] cart after add", "color:#6a1b9a", {
        lines: next.length,
        totalQty: next.reduce((s, i) => s + i.quantity, 0),
        items: next,
      });
      return next;
    });
    setReady(true);
  }, [ready]);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      totalItems,
      subtotal,
    }),
    [items, addItem, removeItem, setQuantity, clearCart, totalItems, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
