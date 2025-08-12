// src/context/UserProvider.jsx

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { EMPTY_USER_DATA } from '../utils/constants';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { session } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (user) => {
    setLoading(true);
    console.log(`👤 Fetching profile for user: ${user.id}`);

    const { data, error } = await supabase
      .from('profiles')
      .select('data, is_first_login')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setIsFirstLogin(data.is_first_login);
      if (!data.data) {
        setUserData(JSON.parse(JSON.stringify(EMPTY_USER_DATA)));
      } else {
        const settings = {
          ...EMPTY_USER_DATA.settings,
          ...(data.data.settings || {}),
        };
        const log = data.data.log || EMPTY_USER_DATA.log;
        setUserData({ settings, log });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session?.user && !userData) {
      fetchUserProfile(session.user);
    } else if (!session?.user) {
      setUserData(null);
      setIsFirstLogin(false);
    }
  }, [session, userData, fetchUserProfile]);

  const saveData = useCallback(
    async (newUserData) => {
      if (session?.user && newUserData) {
        setUserData(newUserData);
        await supabase
          .from('profiles')
          .update({ data: newUserData })
          .eq('id', session.user.id);
      }
    },
    [session]
  );

  const completeOnboarding = useCallback(async () => {
    if (session?.user) {
      setIsFirstLogin(false);
      await supabase
        .from('profiles')
        .update({ is_first_login: false })
        .eq('id', session.user.id);
    }
  }, [session]);

  const value = {
    session,
    userData,
    saveData,
    loading,
    isFirstLogin,
    completeOnboarding,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
