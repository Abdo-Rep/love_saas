import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env?.VITE_DATABASE_URL ||
    import.meta.env?.VITE_SUPABASE_URL ||
    'http://31.220.93.65:8000').replace(/\/$/, '');

const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      db: { schema: 'romantic-new-version' },
      global: {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Accept-Profile': 'romantic-new-version',
          'Content-Profile': 'romantic-new-version',
        },
      },
    })
  : null;
