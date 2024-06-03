import { Tables } from '@/type/database-generated';

export type TCartIngredient = Tables<'ingredients'> & { unit?: Tables<'units'>; quantity?: number };
