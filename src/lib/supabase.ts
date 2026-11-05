import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Supabase의 최신 Publishable Key(sb_pub_... 또는 pk_...) 및 기존 Anon Key(eyJ...)를 모두 지원
const supabaseKey = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

// 환경변수가 없으면 더미 클라이언트로 안전하게 처리하여 비로그인 게스트 모드가 항상 작동하도록 함
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

