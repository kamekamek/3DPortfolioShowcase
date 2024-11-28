import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { login as authLogin, register as authRegister, logout as authLogout, onAuthStateChange, getSession } from '../lib/auth/auth';
import type { LoginInput, RegisterInput } from '../lib/auth/auth';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ユーザーの管理者権限を確認する関数
  const checkAdminStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('管理者権限の確認中にエラーが発生しました:', error);
      return false;
    }

    return data?.is_admin ?? false;
  };

  // セッション更新時の処理
  const handleSessionUpdate = async (newSession: Session | null) => {
    setSession(newSession);
    if (newSession?.user) {
      const adminStatus = await checkAdminStatus(newSession.user.id);
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // 初期セッションの取得
    getSession().then(({ data: { session } }) => {
      handleSessionUpdate(session);
      setLoading(false);
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = onAuthStateChange((session) => {
      handleSessionUpdate(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (input: LoginInput) => {
    try {
      const { session } = await authLogin(input);
      await handleSessionUpdate(session);
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const { session } = await authRegister(input);
      await handleSessionUpdate(session);
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setSession(null);
      setIsAdmin(false);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    session,
    user: session?.user ?? null,
    loading,
    isAdmin,
    login,
    register,
    logout,
  };
}
