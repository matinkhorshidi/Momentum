import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from 'react';
import { supabase } from '../lib/supabaseClient';
// --- MODIFIED: Import EMPTY_USER_DATA instead ---
import { EMPTY_USER_DATA } from '../utils/constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
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
      .select('data, is_first_login')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      setLoading(false);
    } else if (data) {
      setIsFirstLogin(data.is_first_login);

      // --- MODIFIED: Use EMPTY_USER_DATA for new users ---
      if (!data.data) {
        // If the user has no data in the DB, initialize with a blank slate.
        const emptyData = JSON.parse(JSON.stringify(EMPTY_USER_DATA));
        setUserData(emptyData);
        // We will save this initial empty state during onboarding.
      } else {
        // For existing users, merge their data with the base structure.
        const settings = {
          ...EMPTY_USER_DATA.settings,
          ...(data.data.settings || {}),
        };
        const log = data.data.log || EMPTY_USER_DATA.log;
        setUserData({ settings, log });
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (_event === 'SIGNED_IN') {
        fetchUserProfile(newSession.user);
      } else if (_event === 'SIGNED_OUT') {
        setUserData(null);
        setIsFirstLogin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const saveData = useCallback(
    async (newUserData) => {
      if (session?.user && newUserData) {
        setUserData(newUserData);
        const { error } = await supabase
          .from('profiles')
          .update({ data: newUserData })
          .eq('id', session.user.id);

        if (error) {
          console.error('Error saving data to Supabase:', error);
        }
      }
    },
    [session]
  );

  const completeOnboarding = useCallback(async () => {
    if (session?.user) {
      setIsFirstLogin(false);
      const { error } = await supabase
        .from('profiles')
        .update({ is_first_login: false })
        .eq('id', session.user.id);

      if (error) {
        console.error('Error updating is_first_login flag:', error);
      }
    }
  }, [session]);

  const value = {
    userData,
    saveData,
    session,
    loading,
    isFirstLogin,
    completeOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
