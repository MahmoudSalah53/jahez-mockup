/** LiveKit RPC method names — contract with Digital_Asset_live_kit/src/ui_bridge.py */
export const LUQMA_RPC = {
  navigate: "luqma.navigate",
  showMeal: "luqma.showMeal",
  setMealOptions: "luqma.setMealOptions",
  addToCart: "luqma.addToCart",
  getCart: "luqma.getCart",
} as const;

export type LuqmaRpcMethod = (typeof LUQMA_RPC)[keyof typeof LUQMA_RPC];

/** Paths the agent may open via luqma.navigate (agent.py open_page tool). */
export const NAVIGATE_PATHS = new Set([
  "/",
  "/cart",
  "/orders",
  "/offers",
  "/search",
  "/saved",
  "/restaurants",
]);
