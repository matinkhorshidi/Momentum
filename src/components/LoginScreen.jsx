import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import MomentumLogo from './ui/MomentumLogo';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message || signInError.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen text-center">
      <div className="bg-surface p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[90%] max-w-[380px]">
        <div className="flex justify-center items-center gap-2 mb-2">
          <MomentumLogo className="text-accent" />
          <h1 className="text-accent text-3xl font-bold">Momentum</h1>
        </div>
        <p className="text-secondary-text mb-6">
          Your journey to consistent effort starts here.
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-border-default bg-input-bg text-primary-text rounded-md text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-border-default bg-input-bg text-primary-text rounded-md text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 border-none rounded-md font-medium text-base cursor-pointer transition-colors bg-accent text-bg-color hover:bg-button-hover min-h-[44px] flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-[3px] border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              "Let's Go"
            )}
          </button>
        </form>
        {error && <p className="text-error text-sm mt-2 h-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginScreen;
