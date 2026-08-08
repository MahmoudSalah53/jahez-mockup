import type { RpcInvocationData } from "livekit-client";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

type ShowMealDeps = {
  push: (path: string) => void;
};

/**
 * Handler for luqma.showMeal.
 * Agent payload: { mealId, path, reason?, v: 1 }
 * Opens the meal detail page while لقمة explains the recommendation.
 */
export function createShowMealHandler(deps: ShowMealDeps) {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as {
        mealId?: string;
        path?: string;
        reason?: string;
        v?: number;
      };

      const mealId = payload.mealId?.trim();
      const rawPath = payload.path?.trim();

      const path =
        rawPath && rawPath.startsWith("/meals/")
          ? rawPath
          : mealId
            ? `/meals/${mealId}`
            : null;

      if (!path) {
        return rpcFail("bad_meal");
      }

      deps.push(path);
      // reason is optional UI hint — ignored for now (toast later if needed)
      return rpcOk({ path, mealId: mealId ?? null });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
