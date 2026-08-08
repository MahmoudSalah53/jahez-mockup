import { flushSync } from "react-dom";
import type { RpcInvocationData } from "livekit-client";
import {
  applyMealOptionsFromRpc,
  type MealOptionsApplyResult,
} from "@/lib/meal-options-bridge";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

type Payload = {
  mealId?: string;
  meal_id?: string;
  quantity?: number;
  spicy?: boolean;
  addonIds?: string[];
  addon_ids?: string[];
  v?: number;
};

/**
 * Handler for luqma.setMealOptions.
 * Updates checkboxes/qty on the open meal page — does NOT touch the cart.
 */
export function createSetMealOptionsHandler() {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as Payload;
      const mealId = (payload.mealId ?? payload.meal_id)?.trim();
      if (!mealId) return rpcFail("bad_meal");

      const quantity = Math.max(1, Math.floor(Number(payload.quantity) || 1));
      const spicy = Boolean(payload.spicy);
      const addonIds = Array.isArray(payload.addonIds)
        ? payload.addonIds
        : Array.isArray(payload.addon_ids)
          ? payload.addon_ids
          : [];

      // Object wrapper: TS can't track reassignment inside flushSync's closure
      const box: { result: MealOptionsApplyResult } = {
        result: { ok: false, error: "not_on_meal_page" },
      };
      flushSync(() => {
        box.result = applyMealOptionsFromRpc(mealId, {
          quantity,
          spicy,
          addonIds: addonIds.map(String),
        });
      });

      const result = box.result;
      if (!result.ok) {
        return rpcFail(result.error);
      }
      return rpcOk({ selected: result.selected });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
