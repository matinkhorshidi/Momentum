// src/features/Header.jsx

import React from 'react';
import { LogOut, HelpCircle } from 'lucide-react'; // 1. Import HelpCircle icon
import { supabase } from '../../lib/supabaseClient';
import { useAppContext } from '../../context/AppContext';
import { useTour } from '../../context/TourContext'; // 2. Import the useTour hook
import MomentumLogo from '../ui/MomentumLogo';

const Header = () => {
  const { session } = useAppContext();
  const { startTour } = useTour(); // 3. Get the startTour function

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      window.location.reload();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="relative bg-surface rounded-xl p-4 sm:p-5 flex justify-between items-center mb-8 border border-white/5 ">
      {/* Left side: The brand mark */}
      <div className="flex items-center gap-4">
        <MomentumLogo className="text-accent" isAnimated={true} />
      </div>

      {/* Center section: The personalized greeting */}
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

      {/* Right side: Action buttons */}
      {/* 4. Group buttons together for better layout */}
      <div className="flex items-center gap-2">
        <button
          onClick={startTour}
          title="Restart the guided tour"
          className="p-2 rounded-full text-secondary-text hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <HelpCircle size={20} />
        </button>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 rounded-full text-secondary-text hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
