// src/pages/Dashboard.jsx

import { useRef, useState, useEffect } from 'react';
import Header from './features/Header';
import DailyTracker from './features/DailyTracker';
import CategoryManager from './features/CategoryManager';
import FocusSession from './features/FocusSession';
import StatsOverview from './features/StatsOverview';
import History from './features/History';
import TodaysRoutinesCard from './features/TodaysRoutinesCard';
import ActivityChart from './features/ActivityChart';
import Skeleton from './ui/Skeleton';
import { useUser } from '../context/UserProvider';
import { useTour } from '../context/TourContext';
import FirstTimeSetupModal from './features/FirstTimeSetupModal';
// WelcomeTourModal is no longer needed here as Joyride handles the UI

// A helper hook to get the previous value of a state or prop
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Dashboard = () => {
  const categoryManagerRef = useRef(null);
  const { loading, isFirstLogin } = useUser();
  const { setRunTour } = useTour();

  // Track the previous value of isFirstLogin
  const prevIsFirstLogin = usePrevious(isFirstLogin);

  useEffect(() => {
    // Check if the user has just finished the setup modal
    // This happens when isFirstLogin transitions from true to false
    if (prevIsFirstLogin && !isFirstLogin) {
      const tourCompleted = localStorage.getItem('momentumTourCompleted');
      if (!tourCompleted) {
        // Wait for 2 seconds for the modal to close and UI to settle
        const timer = setTimeout(() => {
          setRunTour(true);
        }, 2000);

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
      }
    }
  }, [isFirstLogin, prevIsFirstLogin, setRunTour]);

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-8">
      {/* This now works as originally intended */}
      {isFirstLogin && <FirstTimeSetupModal />}

      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 items-start">
        <div className="flex flex-col gap-8">
          <div id="tour-step-1-logging-focus">
            {loading ? <Skeleton height={120} /> : <DailyTracker />}
          </div>
          <div id="tour-step-4-activity-chart">
            {loading ? <Skeleton height={200} /> : <ActivityChart />}
          </div>
          <div id="tour-step-2-managing-areas" ref={categoryManagerRef}>
            {loading ? <Skeleton height={180} /> : <CategoryManager />}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {loading ? (
            <Skeleton height={150} />
          ) : (
            <div id="tour-step-routines-card">
              <TodaysRoutinesCard categoryManagerRef={categoryManagerRef} />
            </div>
          )}
          <div id="tour-step-5-focus-timer">
            {loading ? <Skeleton height={180} /> : <FocusSession />}
          </div>
          <div id="tour-step-3-grand-tally">
            {loading ? <Skeleton height={180} /> : <StatsOverview />}
          </div>
          {loading ? <Skeleton height={150} /> : <History />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
