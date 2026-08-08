/**
 * Bridge between LiveKit RPC (VoiceWidget) and the open meal page UI state.
 * Only one meal page can be active at a time.
 */

export type MealOptionsApplyInput = {
  quantity: number;
  spicy: boolean;
  addonIds: string[];
};

export type MealOptionsApplyResult =
  | { ok: true; selected: string[] }
  | { ok: false; error: string };

export type MealOptionsController = {
  mealId: string;
  apply: (input: MealOptionsApplyInput) => MealOptionsApplyResult;
};

let controller: MealOptionsController | null = null;

export function registerMealOptionsController(next: MealOptionsController) {
  controller = next;
  return () => {
    if (controller === next) controller = null;
  };
}

export function applyMealOptionsFromRpc(
  mealId: string,
  input: MealOptionsApplyInput,
): MealOptionsApplyResult {
  if (!controller) {
    return { ok: false, error: "not_on_meal_page" };
  }
  if (controller.mealId !== mealId) {
    return { ok: false, error: "not_on_meal_page" };
  }
  return controller.apply(input);
}
