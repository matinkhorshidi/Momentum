import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import { DEFAULT_USER_DATA } from '../utils/constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('supabaseSession');
    return saved ? JSON.parse(saved) : null;
  });

  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('momentumUserData');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(() => {
    const hasCached =
      localStorage.getItem('supabaseSession') &&
      localStorage.getItem('momentumUserData');
    return hasCached ? false : true;
  });

  useEffect(() => {
    const savedData = localStorage.getItem('momentumUserData');
    const saved = localStorage.getItem('supabaseSession');
    if (!session && saved) {
      try {
        const cachedSession = JSON.parse(saved);
        setSession(cachedSession);
        fetchUserProfile(cachedSession.user);
      } catch {}
    }

    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

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

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //     if (userData === null) {
  //       fetchUserProfile(session?.user);
  //     }
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //     fetchUserProfile(session?.user);
  //   });

  //   return () => subscription.unsubscribe();
  // }, [fetchUserProfile]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session on first mount:', session);
      setSession(session);
      fetchUserProfile(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem('supabaseSession', JSON.stringify(session));
      }
      setSession(session);
      fetchUserProfile(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const saveData = useCallback(
    async (newUserData) => {
      if (session?.user && newUserData) {
        setUserData(newUserData);
        // --- NEW: Also save data to localStorage on every update ---
        localStorage.setItem('momentumUserData', JSON.stringify(newUserData));

        // The save to Supabase still happens in the background
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: session.user.id, data: newUserData });
        if (error) {
          console.error('Error saving data to Supabase:', error);
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
