import { createClient } from '@supabase/supabase-js';
import type { User } from "@db/schema";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .envファイルを読み込む（絶対パスで指定）
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  const { data: user, error } = await supabase
    .from('users')
    .insert({ 
      id: authData.user?.id,
      name,
      email 
    })
    .select()
    .single();

  if (error) throw error;
  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single();

  if (error) return null;
  return user;
}

export async function verifyToken(token: string): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser(token);
  
  if (!authUser) return null;

  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('id', authUser.id)
    .single();
    
  if (error) return null;
  return user;
}
