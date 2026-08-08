import { flushSync } from "react-dom";
import type { RpcInvocationData } from "livekit-client";
import { getMealById } from "@/data/meals";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

export type SetSavedDeps = {
  isSaved: (mealId: string) => boolean;
  toggleSaved: (mealId: string) => void;
};

type SetSavedPayload = {
  mealId?: string;
  meal_id?: string;
  saved?: boolean;
  v?: number;
};

/**
 * Handler for luqma.setSaved.
 * Payload: { mealId, saved, v: 1 } — `saved` is the desired end state, not a flip.
 */
export function createSetSavedHandler(deps: SetSavedDeps) {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as SetSavedPayload;

      const mealId = (payload.mealId ?? payload.meal_id)?.trim();
      if (!mealId) {
        return rpcFail("bad_meal");
      }

      if (!getMealById(mealId)) {
        return rpcFail(`unknown_meal:${mealId}`);
      }

      if (typeof payload.saved !== "boolean") {
        return rpcFail("bad_saved");
      }

      const desired = payload.saved;

      flushSync(() => {
        if (desired !== deps.isSaved(mealId)) {
          deps.toggleSaved(mealId);
        }
      });

      return rpcOk({ saved: desired, mealId });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
