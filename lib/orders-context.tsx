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
import type { Order } from "@/lib/types";

const STORAGE_KEY = "luqma-orders";

type OrdersContextValue = {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Order;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(loadOrders());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, ready]);

  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt">) => {
    const full: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [full, ...prev]);
    return full;
  }, []);

  const value = useMemo(() => ({ orders, addOrder }), [orders, addOrder]);

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
