import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';

import supabase from '@/instance/supabase';

import { Tables } from '@/type/database-generated';

interface IContext {
  recipes: Tables<'recipes'>[];
  refreshRecipes: () => Promise<void>;
}

const defaultContext = {
  recipes: [],
  refreshRecipes: () => Promise.reject(),
} satisfies IContext;

export const RecipesContext = createContext<IContext>(defaultContext);

export const useRecipes = () => useContext(RecipesContext);

interface IProps {
  children?: ReactNode;
}

const RecipesContextProvider = ({ children }: IProps) => {
  const { session } = useAuth();

  const [recipes, setRecipes] = useState<Tables<'recipes'>[]>([]);

  const refreshRecipes = async () => {
    if (!session) return;

    const { data } = await supabase.from('recipes').select('*').eq('user_id', session.user.id);
    setRecipes(data ?? []);
  };

  useEffect(() => {
    if (!session) return;
    refreshRecipes().then();
  }, [session]);

  return <RecipesContext.Provider value={{ recipes, refreshRecipes }}>{children}</RecipesContext.Provider>;
};

export default RecipesContextProvider;
