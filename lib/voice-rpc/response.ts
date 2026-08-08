/** JSON string responses expected by UIBridge._parse_response */
export function rpcOk(data: Record<string, unknown> = {}) {
  return JSON.stringify({ ok: true, ...data });
}

export function rpcFail(error: string) {
  return JSON.stringify({ ok: false, error });
}
