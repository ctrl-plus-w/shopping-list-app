import { z } from 'zod';

const SupabaseSchema = z.object({
  URL: z.string().url(),
  ANON_KEY: z.string(),
});

const SUPABASE = SupabaseSchema.parse({
  URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

export default SUPABASE;
