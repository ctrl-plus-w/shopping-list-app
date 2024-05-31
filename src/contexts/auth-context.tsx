import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { Session } from '@supabase/auth-js';

import Auth from '@/page/login';

import supabase from '@/instance/supabase';

interface IContext {
  session?: Session;
}

const defaultContext = {} satisfies IContext;

export const AuthContext = createContext<IContext>(defaultContext);

export const useAuth = () => useContext(AuthContext);

interface IProps {
  children?: ReactNode;
}

const AuthContextProvider = ({ children }: IProps) => {
  const [session, setSession] = useState<Session | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? undefined);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session ?? undefined);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return <AuthContext.Provider value={{ session }}>{session ? children : <Auth />}</AuthContext.Provider>;
};

export default AuthContextProvider;
