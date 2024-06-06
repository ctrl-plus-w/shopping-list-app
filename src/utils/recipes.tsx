import { Session } from '@supabase/auth-js';

import supabase from '@/instance/supabase';

import { TCartRecipe, TRecipeIngredient, TRecipeKind } from '@/type/database';

export type CreateRecipeHandler<T extends TRecipeKind> = (
  session: Session,
  { title, servings }: { title: string; servings: number },
) => Promise<T>;

export type UpdateRecipeHandler<T extends TRecipeKind> = (
  recipeId: string,
  { title, servings }: { title: string; servings: number },
) => Promise<T>;

export const createRecipe: CreateRecipeHandler<TRecipeKind> = async (session, { title, servings }) => {
  const { data, error } = await supabase
    .from('recipes')
    .insert({ title, servings, user_id: session.user.id })
    .select('*')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create the recipe.');

  return { ...data, ingredients: [] as TRecipeIngredient[] } satisfies TRecipeKind;
};

export const updateRecipe: UpdateRecipeHandler<TRecipeKind> = async (recipeId, { title, servings }) => {
  const { data, error } = await supabase
    .from('recipes')
    .update({ title, servings })
    .eq('id', recipeId)
    .select('*')
    .single();

  if (error) throw error;

  return { ...data, ingredients: [] as TRecipeIngredient[] } satisfies TRecipeKind;
};

export const updateCartRecipe: UpdateRecipeHandler<TCartRecipe> = async (recipeId, { servings }) => {
  const { data, error } = await supabase
    .from('cart__recipes')
    .update({ servings })
    .eq('recipe_id', recipeId)
    .select('*, recipes(*)')
    .single();

  if (error) throw error;
  if (!data.recipes) throw new Error('Failed to update the recipe.');

  return {
    ...data.recipes,
    cart_servings: data.servings ?? undefined,
    ingredients: [] as TRecipeIngredient[],
  } satisfies TCartRecipe;
};
