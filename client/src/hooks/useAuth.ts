import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { login as authLogin, register as authRegister, logout as authLogout, onAuthStateChange, getSession } from '../lib/auth/auth';
import type { LoginInput, RegisterInput } from '../lib/auth/auth';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初期セッションの取得
    getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = onAuthStateChange((session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (input: LoginInput) => {
    try {
      const { session } = await authLogin(input);
      setSession(session);
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { session } = await authRegister(input);
      setSession(session);
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setSession(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    session,
    user: session?.user ?? null,
    loading,
    login,
    register,
    logout,
  };
}
