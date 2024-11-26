import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// .envファイルを読み込む（絶対パスで指定）
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベース操作用のクライアント
export const db = supabase;
