import React from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import MomentumLogo from '../ui/MomentumLogo';

const Header = () => {
  const handleLogout = () => supabase.auth.signOut();

  return (
    <header className="bg-surface rounded-xl p-6 sm:p-8 py-4 sm:py-5 flex justify-between items-center mb-8 border border-white/5">
      <div className="flex items-center gap-1">
        <MomentumLogo className="text-accent" />
        {/* <h1 className="text-2xl font-medium text-primary-text tracking-tight">
          omentum
        </h1> */}
      </div>

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
