import { Tables } from '@/type/database-generated';

export type IngredientKind = Tables<'ingredients'> & { unit?: Tables<'units'>; quantity?: number };

export type TCartIngredient = Tables<'ingredients'> & { unit?: Tables<'units'>; quantity?: number };
export type TRecipeIngredient = Tables<'ingredients'> & { unit?: Tables<'units'>; quantity?: number };

export type TRecipe = Tables<'recipes'> & { ingredients: TRecipeIngredient[] };
