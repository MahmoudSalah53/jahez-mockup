import type { Room, RpcInvocationData } from "livekit-client";
import type { CartAddon, CartItem } from "@/lib/types";
import { LUQMA_RPC } from "@/lib/voice-rpc/constants";
import { createAddToCartHandler } from "@/lib/voice-rpc/add-to-cart";
import {
  rpcFailLog,
  rpcOkLog,
  rpcRecv,
  rpcRegisteredLog,
  rpcThrowLog,
} from "@/lib/voice-rpc/debug";
import { createGetCartHandler } from "@/lib/voice-rpc/get-cart";
import { createNavigateHandler } from "@/lib/voice-rpc/navigate";
import { createSetMealOptionsHandler } from "@/lib/voice-rpc/set-meal-options";
import { createSetSavedHandler } from "@/lib/voice-rpc/set-saved";
import { createShowMealHandler } from "@/lib/voice-rpc/show-meal";

export type LuqmaRpcDeps = {
  push: (path: string) => void;
  getItems: () => CartItem[];
  addItem: (input: {
    mealId: string;
    quantity?: number;
    spicy?: boolean;
    addons?: CartAddon[];
    unitPrice: number;
  }) => void;
  isSaved: (mealId: string) => boolean;
  toggleSaved: (mealId: string) => void;
};

const ACTIVE_METHODS = [
  LUQMA_RPC.navigate,
  LUQMA_RPC.showMeal,
  LUQMA_RPC.setMealOptions,
  LUQMA_RPC.addToCart,
  LUQMA_RPC.setSaved,
  LUQMA_RPC.getCart,
] as const;

type Handler = (data: RpcInvocationData) => Promise<string>;

function withDebug(method: string, handler: Handler): Handler {
  return async (data) => {
    rpcRecv(method, data);
    try {
      const response = await handler(data);
      let ok = false;
      try {
        ok = Boolean((JSON.parse(response) as { ok?: boolean }).ok);
      } catch {
        ok = false;
      }
      if (ok) rpcOkLog(method, response);
      else rpcFailLog(method, response);
      return response;
    } catch (err) {
      rpcThrowLog(method, err);
      throw err;
    }
  };
}

/**
 * Register frontend RPC handlers the agent calls via perform_rpc.
 * Prefer registering on the Room (current LiveKit API) before connect.
 */
export function registerLuqmaRpcs(room: Room, deps: LuqmaRpcDeps) {
  unregisterLuqmaRpcs(room);

  room.registerRpcMethod(
    LUQMA_RPC.navigate,
    withDebug(LUQMA_RPC.navigate, createNavigateHandler(deps)),
  );
  room.registerRpcMethod(
    LUQMA_RPC.showMeal,
    withDebug(LUQMA_RPC.showMeal, createShowMealHandler(deps)),
  );
  room.registerRpcMethod(
    LUQMA_RPC.setMealOptions,
    withDebug(LUQMA_RPC.setMealOptions, createSetMealOptionsHandler()),
  );
  room.registerRpcMethod(
    LUQMA_RPC.addToCart,
    withDebug(LUQMA_RPC.addToCart, createAddToCartHandler(deps)),
  );
  room.registerRpcMethod(
    LUQMA_RPC.setSaved,
    withDebug(LUQMA_RPC.setSaved, createSetSavedHandler(deps)),
  );
  room.registerRpcMethod(
    LUQMA_RPC.getCart,
    withDebug(LUQMA_RPC.getCart, createGetCartHandler(deps)),
  );

  rpcRegisteredLog(ACTIVE_METHODS);
}

export function unregisterLuqmaRpcs(room: Room) {
  for (const method of ACTIVE_METHODS) {
    room.unregisterRpcMethod(method);
  }
}
