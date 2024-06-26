import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import SUPABASE from '@/constant/supabase';

import { Database } from '@/type/database-generated';

const supabase = createClient<Database>(SUPABASE.URL, SUPABASE.ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
