import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';

import supabase from '@/instance/supabase';

interface IContext {
  categories: string[];
  refreshCategories: () => Promise<void>;
}

const defaultContext = {
  categories: [],
  refreshCategories: () => Promise.reject(),
} satisfies IContext;

export const CategoriesContext = createContext<IContext>(defaultContext);

export const useCategories = () => useContext(CategoriesContext);

interface IProps {
  children?: ReactNode;
}

const CategoriesContextProvider = ({ children }: IProps) => {
  const { session } = useAuth();

  const [categories, setCategories] = useState<string[]>([]);

  const refreshCategories = async () => {
    if (!session) return;

    const { data } = await supabase.rpc('get_user_categories', { uid: session.user.id });
    if (data) setCategories(data);
  };

  useEffect(() => {
    if (!session) return;

    refreshCategories().then();
  }, [session]);

  return <CategoriesContext.Provider value={{ categories, refreshCategories }}>{children}</CategoriesContext.Provider>;
};

export default CategoriesContextProvider;
