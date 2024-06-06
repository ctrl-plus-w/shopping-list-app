import { Tables } from '@/type/database-generated';

export type TIngredientKind = Tables<'ingredients'> & { unit?: Tables<'units'>; quantity?: number };

export type TCartIngredient = Tables<'ingredients'> & { unit?: Tables<'units'>; quantity?: number };
export type TRecipeIngredient = Tables<'ingredients'> & { unit?: Tables<'units'>; quantity?: number };

export type TRecipeKind = Tables<'recipes'> & { ingredients: TRecipeIngredient[] };

export type TCartRecipe = Tables<'recipes'> & { cart_servings?: number; ingredients: TRecipeIngredient[] };
export type TRecipe = Tables<'recipes'> & { ingredients: TRecipeIngredient[] };
