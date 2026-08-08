/** Clear console breadcrumbs so we know if failure is FRONTEND vs AGENT. */

const STYLE_RECV = "color:#1565c0;font-weight:bold";
const STYLE_OK = "color:#2e7d32;font-weight:bold";
const STYLE_FAIL = "color:#c62828;font-weight:bold";
const STYLE_HINT = "color:#6d4c41;font-weight:bold";

export function rpcRecv(method: string, data: { callerIdentity: string; payload: string }) {
  console.log(
    "%c[luqma-rpc:FRONTEND] RECV",
    STYLE_RECV,
    method,
    {
      from: data.callerIdentity,
      payload: safeParse(data.payload),
      raw: data.payload,
    },
  );
}

export function rpcOkLog(method: string, response: string) {
  console.log("%c[luqma-rpc:FRONTEND] OK", STYLE_OK, method, safeParse(response));
}

export function rpcFailLog(method: string, response: string) {
  console.warn(
    "%c[luqma-rpc:FRONTEND] FAIL — الفرونت رفض الطلب",
    STYLE_FAIL,
    method,
    safeParse(response),
  );
}

export function rpcThrowLog(method: string, err: unknown) {
  console.error(
    "%c[luqma-rpc:FRONTEND] THROW — استثناء في الفرونت",
    STYLE_FAIL,
    method,
    err,
  );
}

export function rpcRegisteredLog(methods: readonly string[]) {
  console.log(
    "%c[luqma-rpc:FRONTEND] REGISTERED",
    STYLE_OK,
    methods.join(", "),
  );
  console.log(
    "%c[luqma-rpc:HINT]",
    STYLE_HINT,
    [
      "لو الـ AI قال «أضفتها للسلة» و مفيش سطر RECV لـ luqma.addToCart → المشكلة من الـ AGENT/BACKEND (مناداش RPC أو وصلت لمشارك تاني).",
      "لو فيه RECV وبعدين FAIL → المشكلة من الفرونت (شوف error في اللوج).",
      "لو فيه RECV + OK والسلة فاضية → مشكلة state/UI في الفرونت بعد النجاح.",
    ].join("\n"),
  );
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}
