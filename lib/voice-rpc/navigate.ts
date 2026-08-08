import type { RpcInvocationData } from "livekit-client";
import { NAVIGATE_PATHS } from "@/lib/voice-rpc/constants";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

type NavigateDeps = {
  push: (path: string) => void;
};

/**
 * Handler for luqma.navigate — agent payload: { path, v: 1 }
 */
export function createNavigateHandler(deps: NavigateDeps) {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as {
        path?: string;
        v?: number;
      };

      const path = payload.path?.trim();
      if (!path || !path.startsWith("/")) {
        return rpcFail("bad_path");
      }
      if (!NAVIGATE_PATHS.has(path)) {
        return rpcFail("unsupported_path");
      }

      deps.push(path);
      return rpcOk({ path });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
