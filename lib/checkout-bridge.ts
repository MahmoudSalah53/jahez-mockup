/**
 * Bridge between LiveKit RPC and the open checkout page form.
 *
 * Fields may arrive before the checkout page mounts (navigate → fill race),
 * so pending values are buffered and applied when the controller registers.
 */

export type CheckoutFields = {
  name: string;
  phone: string;
  address: string;
};

export type CheckoutController = {
  getFields: () => CheckoutFields;
  setFields: (partial: Partial<CheckoutFields>) => CheckoutFields;
};

let controller: CheckoutController | null = null;
let pending: Partial<CheckoutFields> = {};

export function registerCheckoutController(next: CheckoutController) {
  controller = next;
  if (Object.keys(pending).length) {
    controller.setFields(pending);
    pending = {};
  }
  return () => {
    if (controller === next) controller = null;
  };
}

export function getCheckoutController() {
  return controller;
}

export function applyCheckoutFieldsFromRpc(
  partial: Partial<CheckoutFields>,
): { ok: true; fields: CheckoutFields; buffered: boolean } | { ok: false; error: string } {
  const cleaned: Partial<CheckoutFields> = {};
  if (partial.name != null) cleaned.name = String(partial.name);
  if (partial.phone != null) cleaned.phone = String(partial.phone);
  if (partial.address != null) cleaned.address = String(partial.address);
  if (!Object.keys(cleaned).length) {
    return { ok: false, error: "empty_fields" };
  }

  if (!controller) {
    pending = { ...pending, ...cleaned };
    return {
      ok: true,
      buffered: true,
      fields: {
        name: pending.name || "",
        phone: pending.phone || "",
        address: pending.address || "",
      },
    };
  }

  return { ok: true, buffered: false, fields: controller.setFields(cleaned) };
}
