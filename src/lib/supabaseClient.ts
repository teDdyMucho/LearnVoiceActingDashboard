import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  // Prefer Vite env vars
  let url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  let key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  // Try dynamic runtime sources if not defined
  if (!url || !key) {
    const w = (typeof window !== 'undefined' ? (window as any) : ({} as any));
    url = url || w.__SUPABASE_URL || (typeof localStorage !== 'undefined' ? localStorage.getItem('SUPABASE_URL') ?? undefined : undefined);
    key = key || w.__SUPABASE_ANON_KEY || (typeof localStorage !== 'undefined' ? localStorage.getItem('SUPABASE_ANON_KEY') ?? undefined : undefined);
  }

  // Final fallback to provided values (anon public) to keep app functional in dev
  if (!url || !key) {
    console.warn('[Supabase] Falling back to provided URL/key because env vars are missing. For dev only.');
    url = 'https://gtcpojezigwbvczxmvtl.supabase.co';
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Y3BvamV6aWd3YnZjenhtdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDU5NjcsImV4cCI6MjA3NDIyMTk2N30.VrbRGdfcPoB16fwPpXQOJBqGZXWo8oWn_-gKt-uQd6k';
  }

  client = createClient(url, key);
  return client;
}
