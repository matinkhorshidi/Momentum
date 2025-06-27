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

  // --- DEBUG --- Monitor changes to the loading state
  useEffect(() => {
    console.log(`⏳ LOADING STATE CHANGED: ${loading}`);
  }, [loading]);

  const fetchUserProfile = useCallback(
    async (user, isBackgroundRefresh = false) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      // ONLY set loading to true if it's NOT a background refresh
      if (!isBackgroundRefresh) {
        setLoading(true);
      }

      // --- DEBUG --- Add a log to see which mode it's in
      console.log(
        `👤 fetchUserProfile called (background: ${isBackgroundRefresh})`
      );

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
        // --- DEBUG --- Log when profile fetch is complete
        console.log('✅ fetchUserProfile complete');

        setLoading(false);
      } else {
        setLoading(false);
      }
    },
    []
  );

  const initializedRef = useRef(false);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        supabase.auth.getSession().then(({ data: { session: newSession } }) => {
          if (!newSession?.user) return;
          if (!session?.user || session.user.id !== newSession.user.id) {
            setSession(newSession);
            fetchUserProfile(newSession.user);
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, [session, fetchUserProfile]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // ✅ فقط یکبار لودینگ رو true کن
    const localSession = supabase.auth.getSessionSync?.();
    if (localSession) {
      setSession(localSession);
      fetchUserProfile(localSession.user); // fetchUserProfile خودش setLoading(false) می‌کنه
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session) {
          fetchUserProfile(session.user); // باز هم در fetchUserProfile لودینگ مدیریت میشه
        } else {
          setLoading(false); // اگر session نداشتیم، لودینگ رو همینجا false کن
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // --- DEBUG --- This is the most important log!
      console.log(
        `🔄 onAuthStateChange Fired! Event: ${_event}`,
        'Session:',
        newSession
      );
      setSession(newSession);
      if (_event === 'SIGNED_IN') {
        fetchUserProfile(newSession.user);
      } else if (_event === 'SIGNED_OUT') {
        setUserData(null);
        setIsFirstLogin(false);
        setLoading(false); // مهم
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
