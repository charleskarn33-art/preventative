import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// createBrowserClient stores the session in cookies so the proxy can read it
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

export function getSupabaseClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
