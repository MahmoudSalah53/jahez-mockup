import type { CartItem } from "@/lib/types";
import { rpcOk } from "@/lib/voice-rpc/response";

export type GetCartDeps = {
  getItems: () => CartItem[];
};

/**
 * Handler for luqma.getCart.
 * Payload: { v: 1 }
 */
export function createGetCartHandler(deps: GetCartDeps) {
  return async () => {
    const items = deps.getItems();
    return rpcOk({
      count: items.length,
      items: items.map((i) => ({
        lineId: i.lineId,
        mealId: i.mealId,
        quantity: i.quantity,
        spicy: i.spicy,
        addonIds: i.addons.map((addon) => addon.id),
        unitPrice: i.unitPrice,
      })),
    });
  };
}
