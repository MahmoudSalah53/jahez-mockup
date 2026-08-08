import { flushSync } from "react-dom";
import type { RpcInvocationData } from "livekit-client";
import { getMealById, lineUnitPrice } from "@/data/meals";
import type { CartAddon, CartItem } from "@/lib/types";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

export type AddToCartDeps = {
  getItems: () => CartItem[];
  addItem: (input: {
    mealId: string;
    quantity?: number;
    spicy?: boolean;
    addons?: CartAddon[];
    unitPrice: number;
  }) => void;
};

type AddToCartPayload = {
  mealId?: string;
  meal_id?: string;
  quantity?: number;
  spicy?: boolean;
  addonIds?: string[];
  addon_ids?: string[];
  v?: number;
};

/**
 * Handler for luqma.addToCart.
 * Payload: { mealId, quantity, spicy, addonIds, v: 1 }
 * (also accepts snake_case keys from older agent builds)
 */
export function createAddToCartHandler(deps: AddToCartDeps) {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as AddToCartPayload;

      const mealId = (payload.mealId ?? payload.meal_id)?.trim();
      if (!mealId) {
        return rpcFail("bad_meal");
      }

      const meal = getMealById(mealId);
      if (!meal) {
        return rpcFail(`unknown_meal:${mealId}`);
      }

      const quantity = Math.max(1, Math.floor(Number(payload.quantity) || 1));
      const spicy = Boolean(payload.spicy) && meal.spicyOption;
      const addonIds = Array.isArray(payload.addonIds)
        ? payload.addonIds
        : Array.isArray(payload.addon_ids)
          ? payload.addon_ids
          : [];

      const addons: CartAddon[] = (meal.addons ?? []).filter((a) =>
        addonIds.includes(a.id),
      );

      const unitPrice = lineUnitPrice(meal, spicy, addons);
      const prev = deps.getItems();
      const addonKey = addons
        .map((a) => a.id)
        .sort()
        .join(",");
      const lineId = `${meal.id}__${spicy ? "s" : "n"}__${addonKey}`;
      const hadLine = prev.some((i) => i.lineId === lineId);

      // Commit React state before answering the agent
      flushSync(() => {
        deps.addItem({
          mealId: meal.id,
          quantity,
          spicy,
          addons,
          unitPrice,
        });
      });

      const cartCount = hadLine ? prev.length : prev.length + 1;
      return rpcOk({
        cartCount,
        mealId: meal.id,
        quantity,
        itemsNow: deps.getItems().length,
      });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
