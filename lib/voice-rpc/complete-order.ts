import type { RpcInvocationData } from "livekit-client";
import { getMealById } from "@/data/meals";
import type { CartItem } from "@/lib/types";
import type { Order } from "@/lib/types";
import { plainArabic } from "@/lib/voice-rpc/plain-arabic";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

type CompleteOrderDeps = {
  push: (path: string) => void;
  getItems: () => CartItem[];
  clearCart: () => void;
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Order;
};

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^05\d{8}$/.test(digits)) return digits;
  if (/^\+9665\d{8}$/.test(digits)) return digits;
  if (/^9665\d{8}$/.test(digits)) return `+${digits}`;
  return digits;
}

/**
 * Handler for luqma.completeOrder — places the order from the live cart.
 * Works from any page; does not require the checkout form to be mounted.
 */
export function createCompleteOrderHandler(deps: CompleteOrderDeps) {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as {
        name?: string;
        phone?: string;
        address?: string;
      };

      const name = plainArabic(String(payload.name || ""));
      const phone = normalizePhone(plainArabic(String(payload.phone || "")));
      const address = plainArabic(String(payload.address || ""));

      if (!name || !phone || !address) {
        return rpcFail("missing_fields");
      }
      if (!/^05\d{8}$/.test(phone) && !/^\+9665\d{8}$/.test(phone)) {
        return rpcFail("bad_phone");
      }

      const items = deps.getItems();
      if (!items.length) {
        return rpcFail("empty_cart");
      }

      const orderItems = items
        .map((item) => {
          const meal = getMealById(item.mealId);
          if (!meal) return null;
          return {
            mealId: meal.id,
            mealName: meal.name,
            price: item.unitPrice,
            quantity: item.quantity,
            spicy: item.spicy,
            addons: item.addons,
          };
        })
        .filter((i): i is NonNullable<typeof i> => Boolean(i));

      if (!orderItems.length) {
        return rpcFail("empty_cart");
      }

      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const order = deps.addOrder({
        name,
        phone,
        address,
        items: orderItems,
        total,
      });

      deps.clearCart();
      deps.push(`/order-success?id=${order.id}`);

      return rpcOk({
        orderId: order.id,
        total,
        itemCount: orderItems.length,
        path: `/order-success?id=${order.id}`,
      });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
