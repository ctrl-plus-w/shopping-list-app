import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import supabase from '@/instance/supabase';

import { Tables } from '@/type/database';

interface IContext {
  units: Tables<'units'>[];
}

const defaultContext = {
  units: [],
} satisfies IContext;

export const UnitsContext = createContext<IContext>(defaultContext);

export const useUnits = () => useContext(UnitsContext);

interface IProps {
  children: ReactNode;
}

const UnitsContextProvider = ({ children }: IProps) => {
  const [units, setUnits] = useState<Tables<'units'>[]>([]);

  const fetchUnits = async () => {
    const { data } = await supabase.from('units').select('*');
    setUnits(data || []);
  };

  useEffect(() => {
    fetchUnits().then();
  }, []);

  return <UnitsContext.Provider value={{ units }}>{children}</UnitsContext.Provider>;
};

export default UnitsContextProvider;
