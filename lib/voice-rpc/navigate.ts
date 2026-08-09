import type { RpcInvocationData } from "livekit-client";
import { isNavigatePathAllowed } from "@/lib/voice-rpc/path-allowed";
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
      if (!isNavigatePathAllowed(path)) {
        return rpcFail("unsupported_path");
      }

      deps.push(path);
      return rpcOk({ path });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
