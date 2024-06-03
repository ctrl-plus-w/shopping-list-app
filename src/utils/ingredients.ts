import { Session } from '@supabase/auth-js';

import supabase from '@/instance/supabase';

import { Tables } from '@/type/database-generated';

export type CreateIngredientHandler = (
  cart: Tables<'cart'>,
  session: Session,
  { name, quantity, unitId, category }: { name: string; quantity: number; unitId: string; category: string },
) => Promise<void>;

export type UpdateIngredientHandler = (
  cart: Tables<'cart'>,
  ingredientId: string,
  { name, quantity, unitId, category }: { name: string; quantity: number; unitId: string; category: string },
) => Promise<void>;

export const createCartIngredient: CreateIngredientHandler = async (
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

  const { error } = await supabase
    .from('cart__ingredients')
    .insert({
      unit_id: unitId,
      quantity: quantity,
      ingredient_id: createdIngredient.id,
      cart_id: cart.id,
    })
    .select('*');

  if (error) throw error;
};

export const createRecipeIngredient = (recipeId: string): CreateIngredientHandler => {
  return async (cart, session, { name, quantity, unitId, category }) => {
    const { data: createdIngredient, error: createIngredientError } = await supabase
      .from('ingredients')
      .insert({ name, category, user_id: session.user.id })
      .select('id')
      .single();

    if (createIngredientError) throw createIngredientError;
    if (!createdIngredient) throw new Error('Ingredient failed to be created.');

    const { error } = await supabase
      .from('recipes__ingredients')
      .insert({
        unit_id: unitId,
        quantity: quantity,
        ingredient_id: createdIngredient.id,
        recipe_id: recipeId,
      })
      .select('*');

    if (error) throw error;
  };
};

export const updateCartIngredient: UpdateIngredientHandler = async (
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

  const { error } = await supabase
    .from('cart__ingredients')
    .update({
      unit_id: unitId,
      quantity: quantity,
    })
    .eq('ingredient_id', updatedIngredient.id)
    .eq('cart_id', cart.id)
    .select('*');

  if (error) throw error;
};

export const updateRecipeIngredient = (recipeId: string): UpdateIngredientHandler => {
  return async (cart, ingredientId, { name, quantity, unitId, category }) => {
    const { data: updatedIngredient, error: updateIngredientError } = await supabase
      .from('ingredients')
      .update({ name, category })
      .eq('id', ingredientId)
      .select('id')
      .single();

    if (updateIngredientError) throw updateIngredientError;
    if (!updatedIngredient) throw new Error('Ingredient failed to be updated.');

    const { error } = await supabase
      .from('recipes__ingredients')
      .update({
        unit_id: unitId,
        quantity: quantity,
      })
      .eq('ingredient_id', updatedIngredient.id)
      .eq('recipe_id', recipeId)
      .select('*');

    if (error) throw error;
  };
};
