import type { RpcInvocationData } from "livekit-client";
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
  return async (_data: RpcInvocationData) => {
    const items = deps.getItems();
    return rpcOk({
      count: items.length,
      items: items.map((i) => ({
        mealId: i.mealId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    });
  };
}
