import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import MainLoader from './components/ui/MainLoader';

// This component uses the context to decide which screen to show.
const AppContent = () => {
  const { session, loading } = useAppContext();

  if (loading) {
    return <MainLoader />;
  }

  return !session ? <LoginScreen /> : <Dashboard />;
};

// The root component wraps everything in the Provider.
export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-bg-color text-primary-text font-sans">
        <AppContent />
      </div>
    </AppProvider>
  );
}
