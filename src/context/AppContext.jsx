import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import { DEFAULT_USER_DATA } from '../utils/constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (user) => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    } else if (data && data.data) {
      const settings = {
        ...DEFAULT_USER_DATA.settings,
        ...(data.data.settings || {}),
      };
      const log = data.data.log || DEFAULT_USER_DATA.log;
      setUserData({ settings, log });
    } else {
      const defaultData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
      setUserData(defaultData);
      await supabase
        .from('profiles')
        .upsert({ id: user.id, data: defaultData });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const saveData = useCallback(
    async (newUserData) => {
      if (session?.user && newUserData) {
        setUserData(newUserData);
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: session.user.id, data: newUserData });
        if (error) {
          console.error('Error saving data:', error);
        }
      }
    },
    [session]
  );

  const value = { userData, saveData, session, loading };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
