import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import { EMPTY_USER_DATA } from '../utils/constants';

// 1. Context Creation
const AppContext = createContext();

// 2. Custom Hook for easy context access
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// 3. The Provider Component
export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true

  // This ref helps distinguish the very first load from subsequent auth events
  const isInitialAuthHandled = useRef(false);

  /**
   * Fetches user profile from the database.
   * Can run in two modes:
   * - Normal mode (shows a loader).
   * - Background refresh mode (updates data silently).
   */
  const fetchUserProfile = useCallback(
    async (user, isBackgroundRefresh = false) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      if (!isBackgroundRefresh) {
        setLoading(true);
      }

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
      } else if (data) {
        setIsFirstLogin(data.is_first_login);
        if (!data.data) {
          const emptyData = JSON.parse(JSON.stringify(EMPTY_USER_DATA));
          setUserData(emptyData);
        } else {
          const settings = {
            ...EMPTY_USER_DATA.settings,
            ...(data.data.settings || {}),
          };
          const log = data.data.log || EMPTY_USER_DATA.log;
          setUserData({ settings, log });
        }
      }
      // Always set loading to false after the fetch is complete.
      setLoading(false);
    },
    []
  );

  // This is now the SINGLE source of truth for handling authentication.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log(`🔄 onAuthStateChange Fired! Event: ${_event}`);
      setSession(newSession);

      // A user session exists
      if (newSession) {
        // If this is the very first auth event, fetch with a loader.
        if (!isInitialAuthHandled.current) {
          fetchUserProfile(newSession.user, false); // false = show loader
          isInitialAuthHandled.current = true; // Mark as handled
        } else if (_event === 'TOKEN_REFRESHED') {
          // For subsequent token refreshes (like tab focus), update silently.
          fetchUserProfile(newSession.user, true); // true = background refresh
        }
      }
      // User has signed out
      else if (_event === 'SIGNED_OUT') {
        setUserData(null);
        setIsFirstLogin(false);
        setLoading(false);
        isInitialAuthHandled.current = false; // Reset for the next login
      }
    });

    // On initial app load, if there's no session after a moment, stop loading.
    // This handles the case where a user is not logged in at all.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  // The value provided to all consuming components
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
