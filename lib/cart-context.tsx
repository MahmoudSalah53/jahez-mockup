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
import { getMealById, getMealPrice } from "@/data/meals";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "luqma-cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (mealId: string, quantity?: number) => void;
  removeItem: (mealId: string) => void;
  setQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

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

  const addItem = useCallback((mealId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.mealId === mealId);
      if (existing) {
        return prev.map((i) =>
          i.mealId === mealId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { mealId, quantity }];
    });
  }, []);

  const removeItem = useCallback((mealId: string) => {
    setItems((prev) => prev.filter((i) => i.mealId !== mealId));
  }, []);

  const setQuantity = useCallback((mealId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.mealId !== mealId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.mealId === mealId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => {
      const meal = getMealById(i.mealId);
      if (!meal) return sum;
      return sum + getMealPrice(meal) * i.quantity;
    }, 0);
  }, [items]);

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
