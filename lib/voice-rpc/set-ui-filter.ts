import type { RpcInvocationData } from "livekit-client";
import { isNavigatePathAllowed } from "@/lib/voice-rpc/path-allowed";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

type Payload = {
  page?: string;
  offersKind?: string;
  query?: string;
  restaurantsFilter?: string;
  cuisine?: string;
  cashback?: boolean;
  menuTab?: string;
  path?: string;
  v?: number;
};

type NavigateDeps = {
  push: (path: string) => void;
};

function buildPath(payload: Payload): string | null {
  const given = payload.path?.trim();
  if (given && given.startsWith("/")) return given;

  const kind = (payload.offersKind || "").trim();
  const query = (payload.query || "").trim();
  const cuisine = (payload.cuisine || "").trim();
  const restFilter = (payload.restaurantsFilter || "").trim();
  const tab = (payload.menuTab || "").trim();
  const cashback = Boolean(payload.cashback);

  if (kind && kind !== "all") {
    const params = new URLSearchParams();
    params.set("kind", kind);
    if (cashback) params.set("cashback", "1");
    if (cuisine) params.set("cuisine", cuisine);
    if (query) params.set("q", query);
    return `/offers?${params.toString()}`;
  }
  if (cashback) {
    const params = new URLSearchParams({ cashback: "1" });
    if (cuisine) params.set("cuisine", cuisine);
    return `/offers?${params.toString()}`;
  }
  if (restFilter) {
    const params = new URLSearchParams({ filter: restFilter });
    if (cuisine) params.set("cuisine", cuisine);
    return `/restaurants?${params.toString()}`;
  }
  if (query) {
    return `/search?q=${encodeURIComponent(query)}`;
  }
  if (cuisine) {
    return `/?cuisine=${encodeURIComponent(cuisine)}`;
  }
  if (tab) {
    return null;
  }
  return "/offers";
}

/**
 * Handler for luqma.setUiFilter.
 * Applies offer/search chips by navigating to the matching URL.
 */
export function createSetUiFilterHandler(deps: NavigateDeps) {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as Payload;
      const path = buildPath(payload);
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
