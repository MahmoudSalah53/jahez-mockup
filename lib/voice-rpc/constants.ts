/** LiveKit RPC method names — contract with coda-jahez-agent-backend/src/ui_bridge.py */
export const LUQMA_RPC = {
  navigate: "luqma.navigate",
  showMeal: "luqma.showMeal",
  setMealOptions: "luqma.setMealOptions",
  addToCart: "luqma.addToCart",
  setCartQuantity: "luqma.setCartQuantity",
  setSaved: "luqma.setSaved",
  getCart: "luqma.getCart",
  getUiState: "luqma.getUiState",
  fillCheckout: "luqma.fillCheckout",
  completeOrder: "luqma.completeOrder",
} as const;

export type LuqmaRpcMethod = (typeof LUQMA_RPC)[keyof typeof LUQMA_RPC];

/**
 * @deprecated Use isNavigatePathAllowed from path-allowed.ts — kept for
 * imports that still expect a Set of the main static pages.
 */
export const NAVIGATE_PATHS = new Set([
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
