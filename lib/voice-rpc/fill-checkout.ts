import type { RpcInvocationData } from "livekit-client";
import { applyCheckoutFieldsFromRpc } from "@/lib/checkout-bridge";
import { plainArabic } from "@/lib/voice-rpc/plain-arabic";
import { rpcFail, rpcOk } from "@/lib/voice-rpc/response";

/**
 * Handler for luqma.fillCheckout — { name?, phone?, address?, v: 1 }
 * Requires the checkout page to be open (controller registered).
 */
export function createFillCheckoutHandler() {
  return async (data: RpcInvocationData) => {
    try {
      const payload = JSON.parse(data.payload || "{}") as {
        name?: string;
        phone?: string;
        address?: string;
      };
      const partial = {
        ...(payload.name != null ? { name: plainArabic(String(payload.name)) } : {}),
        ...(payload.phone != null
          ? { phone: plainArabic(String(payload.phone)).replace(/[^\d+]/g, "") }
          : {}),
        ...(payload.address != null
          ? { address: plainArabic(String(payload.address)) }
          : {}),
      };
      if (!Object.keys(partial).length) {
        return rpcFail("empty_fields");
      }
      const result = applyCheckoutFieldsFromRpc(partial);
      if (!result.ok) return rpcFail(result.error);
      return rpcOk({ fields: result.fields });
    } catch {
      return rpcFail("invalid_payload");
    }
  };
}
