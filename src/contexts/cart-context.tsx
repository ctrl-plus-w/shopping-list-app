import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { useCategories } from '@/context/categories-context';

import supabase from '@/instance/supabase';

import { isDefined } from '@/util/array';

import { CartIngredient } from '@/type/database';
import { Tables } from '@/type/database-generated';

interface IContext {
  cart?: Tables<'cart'>;
  ingredients: CartIngredient[];
  refreshCart: () => Promise<void>;
}

const defaultContext = {
  ingredients: [],
  refreshCart: () => Promise.resolve(),
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
  const [ingredients, setIngredients] = useState<CartIngredient[]>([]);

  const refreshCart = async () => {
    const userId = session?.user.id;
    if (!userId) return;

    const { data } = await supabase
      .from('cart')
      .select('*, cart__ingredients ( *, units(*), ingredients(*))')
      .eq('user_id', userId)
      .single();

    if (!data) {
      const { data } = await supabase.from('cart').insert({ user_id: userId }).select('*').single();

      setCart(data ?? undefined);
      setIngredients([]);

      return;
    }

    const { cart__ingredients, ...cart } = data;

    const ingredients = cart__ingredients
      .map(({ ingredients, units, quantity }) =>
        ingredients && units
          ? ({ ...ingredients, unit: units, quantity: quantity ?? undefined } satisfies CartIngredient)
          : undefined,
      )
      .filter(isDefined);

    setCart(cart);
    setIngredients(ingredients);

    await refreshCategories();
  };

  useEffect(() => {
    refreshCart().then();
  }, [session]);

  return <CartContext.Provider value={{ cart, ingredients, refreshCart }}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
