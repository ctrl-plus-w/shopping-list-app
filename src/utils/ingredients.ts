import { Session } from '@supabase/auth-js';

import supabase from '@/instance/supabase';

import { TCartIngredient, TIngredientKind, TRecipeIngredient } from '@/type/database';
import { Tables } from '@/type/database-generated';

export type CreateIngredientHandler<T extends TIngredientKind> = (
  cart: Tables<'cart'>,
  session: Session,
  { name, quantity, unitId, category }: { name: string; quantity: number; unitId: string; category: string },
) => Promise<T>;

export type UpdateIngredientHandler<T extends TIngredientKind> = (
  cart: Tables<'cart'>,
  ingredientId: string,
  { name, quantity, unitId, category }: { name: string; quantity: number; unitId: string; category: string },
) => Promise<T>;

export const createCartIngredient: CreateIngredientHandler<TCartIngredient> = async (
  cart,
  session,
  { name, quantity, unitId, category },
) => {
  const { data: createdIngredient, error: createIngredientError } = await supabase
    .from('ingredients')
    .insert({ name, category, user_id: session.user.id })
    .select('id')
    .single();

  if (createIngredientError) throw createIngredientError;
  if (!createdIngredient) throw new Error('Ingredient failed to be created.');

  const { error, data } = await supabase
    .from('cart__ingredients')
    .insert({
      unit_id: unitId,
      quantity: quantity,
      ingredient_id: createdIngredient.id,
      cart_id: cart.id,
    })
    .select('*, units(*), ingredients (*)')
    .single();

  if (error) throw error;
  if (!data.ingredients || !data.ingredients) throw new Error('Failed to create the ingredient.');

  return {
    ...data.ingredients,
    unit: data.units ?? undefined,
    quantity: data.quantity ?? undefined,
  } satisfies TCartIngredient;
};

export const createRecipeIngredient = (recipeId: string): CreateIngredientHandler<TRecipeIngredient> => {
  return async (cart, session, { name, quantity, unitId, category }) => {
    const { data: createdIngredient, error: createIngredientError } = await supabase
      .from('ingredients')
      .insert({ name, category, user_id: session.user.id })
      .select('id')
      .single();

    if (createIngredientError) throw createIngredientError;
    if (!createdIngredient) throw new Error('Ingredient failed to be created.');

    const { error, data } = await supabase
      .from('recipes__ingredients')
      .insert({
        unit_id: unitId,
        quantity: quantity,
        ingredient_id: createdIngredient.id,
        recipe_id: recipeId,
      })
      .select('*, units(*), ingredients (*)')
      .single();

    if (error) throw error;
    if (!data.ingredients || !data.ingredients) throw new Error('Failed to create the ingredient.');

    return {
      ...data.ingredients,
      unit: data.units ?? undefined,
      quantity: data.quantity ?? undefined,
    } satisfies TCartIngredient;
  };
};

export const updateCartIngredient: UpdateIngredientHandler<TCartIngredient> = async (
  cart,
  ingredientId,
  { name, quantity, unitId, category },
) => {
  const { data: updatedIngredient, error: updateIngredientError } = await supabase
    .from('ingredients')
    .update({ name, category })
    .eq('id', ingredientId)
    .select('id')
    .single();

  if (updateIngredientError) throw updateIngredientError;
  if (!updatedIngredient) throw new Error('Ingredient failed to be updated.');

  const { data, error } = await supabase
    .from('cart__ingredients')
    .update({
      unit_id: unitId,
      quantity: quantity,
    })
    .eq('ingredient_id', updatedIngredient.id)
    .eq('cart_id', cart.id)
    .select('*, units(*), ingredients (*)')
    .single();

  if (error) throw error;
  if (!data.ingredients || !data.ingredients) throw new Error('Failed to create the ingredient.');

  return {
    ...data.ingredients,
    unit: data.units ?? undefined,
    quantity: data.quantity ?? undefined,
  } satisfies TCartIngredient;
};

export const updateRecipeIngredient = (recipeId: string): UpdateIngredientHandler<TRecipeIngredient> => {
  return async (cart, ingredientId, { name, quantity, unitId, category }) => {
    const { data: updatedIngredient, error: updateIngredientError } = await supabase
      .from('ingredients')
      .update({ name, category })
      .eq('id', ingredientId)
      .select('id')
      .single();

    if (updateIngredientError) throw updateIngredientError;
    if (!updatedIngredient) throw new Error('Ingredient failed to be updated.');

    const { data, error } = await supabase
      .from('recipes__ingredients')
      .update({
        unit_id: unitId,
        quantity: quantity,
      })
      .eq('ingredient_id', updatedIngredient.id)
      .eq('recipe_id', recipeId)
      .select('*, units(*), ingredients (*)')
      .single();

    if (error) throw error;
    if (!data.ingredients || !data.ingredients) throw new Error('Failed to create the ingredient.');

    return {
      ...data.ingredients,
      unit: data.units ?? undefined,
      quantity: data.quantity ?? undefined,
    } satisfies TCartIngredient;
  };
};
