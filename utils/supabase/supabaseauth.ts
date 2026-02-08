'use client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createBrowserClient } from './client';

// Returns a function that fetches the current access token from the browser client
export async function getSessionToken(): Promise<string | null> {
  // createBrowserClient returns a Supabase client tied to the browser runtime
  const client: SupabaseClient = createBrowserClient();
  const { data } = await client.auth.getSession();
  return data?.session?.access_token ?? null;
}