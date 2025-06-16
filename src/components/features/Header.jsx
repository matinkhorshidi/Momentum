import React from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../context/AppContext';
import MomentumLogo from '../ui/MomentumLogo';

const Header = () => {
  const { session } = useAppContext();
  const handleLogout = () => {
    localStorage.removeItem('momentumUserData');
    localStorage.removeItem('focusSessionEndTime');
    supabase.auth.signOut();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    // 1. Add `relative` to the header to create a positioning context for its children.
    <header className="relative bg-surface rounded-xl p-4 sm:p-5 flex justify-between items-center mb-8 border border-white/5 shadow-[0_0_30px_rgba(187,134,252,0.05)]">
      {/* Left side: The brand mark */}
      <div className="flex items-center gap-4">
        <MomentumLogo className="text-accent" />
        <h1 className="text-2xl font-semibold text-primary-text tracking-tight">
          Momentum
        </h1>
      </div>

      {/* Center section: The personalized greeting */}
      {/* 2. Add absolute positioning classes to perfectly center this div. */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        {session?.user?.email && (
          <>
            <p className="text-sm text-primary-text">{getGreeting()},</p>
            <p className="text-xs text-secondary-text truncate max-w-xs">
              {session.user.email}
            </p>
          </>
        )}
      </div>

      {/* Right side: The sign out button */}
      <button
        onClick={handleLogout}
        title="Sign Out"
        className="p-2 rounded-full text-secondary-text hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <LogOut size={20} />
      </button>
    </header>
  );
};

export default Header;
