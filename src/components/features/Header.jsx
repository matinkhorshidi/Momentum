import React from 'react';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import MomentumLogo from '../ui/MomentumLogo';

const Header = () => {
  const handleLogout = () => supabase.auth.signOut();
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <MomentumLogo />
        <h1 className="text-accent text-3xl font-bold">Momentum</h1>
      </div>
      <button
        onClick={handleLogout}
        className="border border-border-default px-4 py-2 rounded-md cursor-pointer transition-colors text-secondary-text hover:bg-input-bg flex items-center gap-2"
      >
        <Lock size={16} /> Lock
      </button>
    </header>
  );
};

export default Header;
