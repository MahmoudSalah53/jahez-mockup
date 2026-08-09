/** Exact pages plus dynamic meal/restaurant/order-success routes. */
const EXACT = new Set([
  "/",
  "/cart",
  "/checkout",
  "/orders",
  "/offers",
  "/search",
  "/saved",
  "/account",
  "/restaurants",
]);

export function isNavigatePathAllowed(path: string): boolean {
  const clean = (path.split("?")[0] || "").trim();
  if (!clean.startsWith("/")) return false;
  if (EXACT.has(clean)) return true;
  if (/^\/meals\/[^/]+$/.test(clean)) return true;
  if (/^\/restaurants\/[^/]+$/.test(clean)) return true;
  if (/^\/order-success(\?.*)?$/.test(path.trim())) return true;
  return false;
}
