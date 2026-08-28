import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'http://31.220.93.65:9000';
const DEFAULT_KEY = typeof window !== 'undefined'
  ? atob('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=')
  : Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    })
  : null;
