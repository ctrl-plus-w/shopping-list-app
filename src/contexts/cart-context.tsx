import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { useCategories } from '@/context/categories-context';

import supabase from '@/instance/supabase';

import { isDefined } from '@/util/array';

import { TCartIngredient, TCartRecipe, TRecipe, TRecipeIngredient } from '@/type/database';
import { Tables } from '@/type/database-generated';

interface IContext {
  cart?: Tables<'cart'>;
  ingredients: TCartIngredient[];
  recipes: TCartRecipe[];

  refreshCart: () => Promise<void>;

  setCart: Dispatch<SetStateAction<Tables<'cart'> | undefined>>;
  setIngredients: Dispatch<SetStateAction<TCartIngredient[]>>;
  setRecipes: Dispatch<SetStateAction<TCartRecipe[]>>;
}

const defaultContext = {
  ingredients: [],
  recipes: [],

  refreshCart: () => Promise.resolve(),

  setCart: () => undefined,
  setRecipes: () => [],
  setIngredients: () => [],
} satisfies IContext;

export const CartContext = createContext<IContext>(defaultContext);

export const useCart = () => useContext(CartContext);

interface IProps {
  children?: ReactNode;
}

const CartContextProvider = ({ children }: IProps) => {
  const { session } = useAuth();

  const { refreshCategories } = useCategories();

  const [cart, setCart] = useState<Tables<'cart'> | undefined>(undefined);
  const [ingredients, setIngredients] = useState<TCartIngredient[]>([]);
  const [recipes, setRecipes] = useState<TRecipe[]>([]);

  const refreshCart = async () => {
    const userId = session?.user.id;
    if (!userId) return;

    // const { data } = await supabase
    //   .from('cart')
    //   .select('*, cart__ingredients(*, units(*), ingredients(*)), cart__recipes(*, recipes(*, ingredients(*)))')
    //   .eq('user_id', userId)
    //   .single();

    const { data } = await supabase
      .from('cart')
      .select(
        `*,
        cart__ingredients(
          *,
          units(*),
          ingredients(*)
        ),
        cart__recipes(
          *,
          recipes(
            *,
            recipes__ingredients(
              *,
              ingredients(*),
              units(*)
            )
          )
        )`,
      )
      .eq('user_id', userId)
      .single();

    if (!data) {
      const { data } = await supabase.from('cart').insert({ user_id: userId }).select('*').single();

      setCart(data ?? undefined);
      setIngredients([]);
      setRecipes([]);

      return;
    }

    const { cart__ingredients, cart__recipes, ...cart } = data;

    const ingredients = cart__ingredients
      .map(({ ingredients, units, quantity }) =>
        ingredients && units
          ? ({ ...ingredients, unit: units, quantity: quantity ?? undefined } satisfies TCartIngredient)
          : undefined,
      )
      .filter(isDefined);

    const recipes = cart__recipes
      .map(({ recipes, servings }) => {
        if (!recipes) return recipes;

        const _ingredients = recipes.recipes__ingredients
          .map(({ ingredients, units, quantity }) => {
            if (!ingredients) return ingredients;

            return { ...ingredients, unit: units ?? undefined, quantity: quantity ?? undefined };
          })
          .filter(isDefined) satisfies TRecipeIngredient[];

        return { ...recipes, cart_servings: servings ?? undefined, ingredients: _ingredients } satisfies TCartRecipe;
      })
      .filter(isDefined);

    setCart(cart);
    setIngredients(ingredients);
    setRecipes(recipes);

    await refreshCategories();
  };

  useEffect(() => {
    refreshCart().then();
  }, [session]);

  return (
    <CartContext.Provider
      value={{
        cart,
        ingredients,
        recipes,

        refreshCart,

        setCart,
        setIngredients,
        setRecipes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
