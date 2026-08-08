import type { Room } from "livekit-client";
import { LUQMA_RPC } from "@/lib/voice-rpc/constants";
import { createNavigateHandler } from "@/lib/voice-rpc/navigate";
import { createShowMealHandler } from "@/lib/voice-rpc/show-meal";

export type LuqmaRpcDeps = {
  push: (path: string) => void;
};

const ACTIVE_METHODS = [LUQMA_RPC.navigate, LUQMA_RPC.showMeal] as const;

/**
 * Register frontend RPC handlers the agent calls via perform_rpc.
 * Call after room.connect(); unregister on disconnect.
 */
export function registerLuqmaRpcs(room: Room, deps: LuqmaRpcDeps) {
  room.localParticipant.registerRpcMethod(
    LUQMA_RPC.navigate,
    createNavigateHandler(deps),
  );
  room.localParticipant.registerRpcMethod(
    LUQMA_RPC.showMeal,
    createShowMealHandler(deps),
  );
}

export function unregisterLuqmaRpcs(room: Room) {
  for (const method of ACTIVE_METHODS) {
    room.localParticipant.unregisterRpcMethod(method);
  }
}
