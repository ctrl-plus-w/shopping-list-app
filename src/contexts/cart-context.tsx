import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';

import supabase from '@/instance/supabase';

import { isDefined } from '@/util/array';

import { Tables } from '@/type/database';

interface IContext {
  cart?: Tables<'cart'>;
  ingredients: Tables<'ingredients'>[];
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

  const [cart, setCart] = useState<Tables<'cart'> | undefined>(undefined);
  const [ingredients, setIngredients] = useState<Tables<'ingredients'>[]>([]);

  const refreshCart = async () => {
    const userId = session?.user.id;
    if (!userId) return;

    const { data } = await supabase
      .from('cart')
      .select('*, cart__ingredients ( ingredients(*) )')
      .eq('user_id', userId)
      .single();

    if (!data) {
      const { data } = await supabase.from('cart').insert({ user_id: userId }).select('*').single();

      setCart(data ?? undefined);
      setIngredients([]);

      return;
    }

    const { cart__ingredients, ...cart } = data;

    const ingredients = cart__ingredients.map(({ ingredients }) => ingredients).filter(isDefined);

    setCart(cart);
    setIngredients(ingredients);
  };

  useEffect(() => {
    refreshCart().then();
  }, [session]);

  return <CartContext.Provider value={{ cart, ingredients, refreshCart }}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
