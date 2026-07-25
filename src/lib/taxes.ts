import type { CartItem, Taxes } from "../types";

export const PHYSICAL_TAX_RATE = 0.12;
export const DIGITAL_TAX_RATE = 0.05;

export function calculateTaxes(items: CartItem[]): Taxes {
  const bases = items.reduce(
    (total, item) => {
      const value = item.price * item.quantity;
      if (item.type === "ebook") total.digital += value;
      else total.physical += value;
      return total;
    },
    { physical: 0, digital: 0 },
  );

  const physical = bases.physical * PHYSICAL_TAX_RATE;
  const digital = bases.digital * DIGITAL_TAX_RATE;

  return {
    physical,
    digital,
    total: physical + digital,
  };
}

export function hasPhysicalItems(items: CartItem[]) {
  return items.some((item) => item.type !== "ebook");
}
