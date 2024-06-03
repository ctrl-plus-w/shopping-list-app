import { TCartIngredient } from '@/type/database';

export const isDefined = <T>(el: T | undefined | null): el is T => {
  return !!el;
};

export const compareIngredientName = (a: TCartIngredient, b: TCartIngredient) => {
  return a.name.localeCompare(b.name);
};
