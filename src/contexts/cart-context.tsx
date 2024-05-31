import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';

import supabase from '@/instance/supabase';

import { Tables } from '@/type/database';

interface IContext {
  cart?: Tables<'cart'>;
}

const defaultContext = {} satisfies IContext;

export const CartContext = createContext<IContext>(defaultContext);

export const useCart = () => useContext(CartContext);

interface IProps {
  children?: ReactNode;
}

const CartContextProvider = ({ children }: IProps) => {
  const { session } = useAuth();

  const [cart, setCart] = useState<Tables<'cart'> | undefined>(undefined);

  const fetchCart = async (userId: string) => {
    const { data } = await supabase.from('cart').upsert({ user_id: userId }).select('*').single();
    setCart(data ?? undefined);
  };

  useEffect(() => {
    if (!session) return;
    fetchCart(session.user.id).then();
  }, [session]);

  return <CartContext.Provider value={{ cart }}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
