import type { RpcInvocationData } from "livekit-client";
import { getUiState } from "@/lib/ui-state";
import { rpcOk } from "@/lib/voice-rpc/response";

export function createGetUiStateHandler() {
  return async (_data: RpcInvocationData) => {
    const state = getUiState();
    return rpcOk({
      path: state.path,
      page: state.page,
      mealId: state.mealId,
      restaurantId: state.restaurantId,
      titleAr: state.titleAr,
      updatedAt: state.updatedAt,
    });
  };
}
