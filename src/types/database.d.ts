export { Tables, Database } from '@/type/database-generated';

export type CartIngredient = Tables<'ingredients'> & { unit: Tables<'units'>; quantity: number };
