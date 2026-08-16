import { flushSync } from "react-dom";
import type { RpcInvocationData } from "livekit-client";
import type { CartItem } from "@/lib/types";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

export type SetCartQuantityDeps = {
  getItems: () => CartItem[];
  setQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
};

type SetCartQuantityPayload = {
  mealId?: string;
  meal_id?: string;
  quantity?: number;
  spicy?: boolean;
  addonIds?: string[];
  addon_ids?: string[];
  lineId?: string;
  line_id?: string;
  v?: number;
};

function addonKey(ids: string[]) {
  return [...ids].sort().join(",");
}

function findCartLine(
  items: CartItem[],
  mealId: string,
  spicy: boolean,
  addonIds: string[],
  lineId?: string,
): CartItem | null {
  if (lineId) {
    const byLine = items.find((i) => i.lineId === lineId);
    if (byLine) return byLine;
  }

  const forMeal = items.filter((i) => i.mealId === mealId);
  if (forMeal.length === 0) return null;
  if (forMeal.length === 1) return forMeal[0];

  const wantAddons = addonKey(addonIds);
  const matched = forMeal.filter((i) => {
    const key = addonKey(i.addons.map((a) => a.id));
    return Boolean(i.spicy) === spicy && key === wantAddons;
  });
  if (matched.length === 1) return matched[0];

  if (addonIds.length === 0) {
    const bySpicy = forMeal.filter((i) => Boolean(i.spicy) === spicy);
    if (bySpicy.length === 1) return bySpicy[0];
  }

  return matched[0] ?? null;
}

/**
 * Handler for luqma.setCartQuantity.
 * Absolute quantity; 0 removes the line.
 * Payload: { mealId, quantity, spicy?, addonIds?, lineId?, v: 1 }
 */
export function createSetCartQuantityHandler(deps: SetCartQuantityDeps) {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as SetCartQuantityPayload;

      const mealId = (payload.mealId ?? payload.meal_id)?.trim();
      if (!mealId) {
        return rpcFail("bad_meal");
      }

      const rawQty = Number(payload.quantity);
      if (!Number.isFinite(rawQty) || rawQty < 0) {
        return rpcFail("bad_quantity");
      }
      const quantity = Math.floor(rawQty);
      const spicy = Boolean(payload.spicy);
      const addonIds = Array.isArray(payload.addonIds)
        ? payload.addonIds
        : Array.isArray(payload.addon_ids)
          ? payload.addon_ids
          : [];
      const lineIdHint = (payload.lineId ?? payload.line_id)?.trim();

      const prev = deps.getItems();
      const line = findCartLine(prev, mealId, spicy, addonIds, lineIdHint);
      if (!line) {
        return rpcFail(`not_in_cart:${mealId}`);
      }

      const removed = quantity <= 0;

      flushSync(() => {
        if (removed) {
          deps.removeItem(line.lineId);
        } else {
          deps.setQuantity(line.lineId, quantity);
        }
      });

      const itemsNow = deps.getItems().length;
      return rpcOk({
        mealId,
        quantity: removed ? 0 : quantity,
        removed,
        itemsNow,
        cartCount: itemsNow,
      });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
