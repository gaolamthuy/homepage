/**
 * Supabase client configuration
 * Sử dụng để query dữ liệu từ Supabase database
 * Theo tài liệu Astro: https://docs.astro.build/en/guides/backend/supabase/
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Tạo Supabase client với anon key (public)
 * Dùng cho server-side queries trong Astro
 * 
 * @returns Supabase client instance
 */
export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'PUBLIC_SUPABASE_URL và PUBLIC_SUPABASE_ANON_KEY phải được cấu hình trong .env.local'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

