// src/hooks/useAuth.js

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * این هوک فقط یک مسئولیت دارد: مدیریت وضعیت احراز هویت کاربر
 * و برگرداندن session فعلی.
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. در ابتدای کار، یکبار session فعلی را می‌گیریم
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. به تمام تغییرات وضعیت احراز هویت در آینده گوش می‌دهیم
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. در زمان unmount شدن کامپوننت، listener را پاک می‌کنیم
    return () => subscription.unsubscribe();
  }, []);

  return { session, loadingAuth: loading };
}
