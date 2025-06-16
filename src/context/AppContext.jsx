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

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && !userData) {
        fetchUserProfile(session.user);
      } else if (!session) {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_OUT') {
        setSession(null);
        setUserData(null);
        localStorage.removeItem('supabaseSession');
        localStorage.removeItem('momentumUserData');
      } else if (session) {
        setSession(session);
        localStorage.setItem('supabaseSession', JSON.stringify(session));
        if (!userData) {
          fetchUserProfile(session.user);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, userData]);

  const saveData = useCallback(
    async (newUserData) => {
      if (session?.user && newUserData) {
        setUserData(newUserData);
        localStorage.setItem('momentumUserData', JSON.stringify(newUserData));
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
