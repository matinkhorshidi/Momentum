import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import MomentumLogo from './ui/MomentumLogo';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import dashboardBackground from '../assets/dashboard.png';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If sign-in fails, try to sign up the user instead
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message || signInError.message);
      }
    }
    // setLoading(false) will be handled by the session change in AppContext
  };

  return (
    <div className="min-h-screen w-full bg-bg-color flex items-center justify-center relative overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 opacity-50">
        <img
          src={dashboardBackground}
          alt="Momentum App Background"
          className="absolute -right-[20%] top-1/2 -translate-y-1/3 w-[90vw] max-w-[1000px] h-auto object-contain transform scale-110 -rotate-[10deg] blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-color via-bg-color/80 to-transparent"></div>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 flex flex-col justify-center items-start w-full max-w-md px-8">
        <div className="flex items-center gap-3 mb-4">
          <MomentumLogo className="text-accent h-9 w-9" />
          <h1 className="text-primary-text text-4xl font-bold">Momentum</h1>
        </div>
        <p className="text-secondary-text text-lg mb-8">
          Your journey to consistent effort starts here.
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
              size={20}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 pl-10 border-2 border-border-default bg-input-bg/50 text-primary-text rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
              size={20}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pl-10 border-2 border-border-default bg-input-bg/50 text-primary-text rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 mt-2 border-none rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 bg-accent text-bg-color hover:bg-button-hover flex justify-center items-center gap-2 min-h-[48px] disabled:bg-gray-500 disabled:cursor-wait"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Let's Go <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        {error && (
          <p className="text-error text-sm mt-4 text-center w-full h-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
