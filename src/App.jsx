// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import MainLoader from './components/ui/MainLoader';

const AppContent = () => {
  const { session, loading } = useAppContext();
  const [isAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (session) {
      setAnimationComplete(false);
    }
  }, [session]);

  const handleAnimationEnd = () => {
    setAnimationComplete(true);
  };

  if (loading) {
    return null;
  }

  if (!session) {
    return <LoginScreen />;
  }

  if (session && !isAnimationComplete) {
    return <MainLoader onAnimationEnd={handleAnimationEnd} />;
  }

  return <Dashboard />;
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-bg-color text-primary-text font-sans">
        <AppContent />
      </div>
    </AppProvider>
  );
}
