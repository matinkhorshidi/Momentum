import { useRef } from 'react';
import Header from './features/Header';
import DailyTracker from './features/DailyTracker';
import CategoryManager from './features/CategoryManager';
import FocusSession from './features/FocusSession';
import StatsOverview from './features/StatsOverview';
import History from './features/History';
import TodaysRoutinesCard from './features/TodaysRoutinesCard';
import ActivityChart from './features/ActivityChart';
import Skeleton from './ui/Skeleton';
import { useAppContext } from '../context/AppContext';
import FirstTimeSetupModal from './features/FirstTimeSetupModal'; // --- NEW: Import the modal

const Dashboard = () => {
  const categoryManagerRef = useRef(null);
  // --- MODIFIED: Get isFirstLogin from context
  const { loading, userData, isFirstLogin } = useAppContext();

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-8">
      {/* --- NEW: Conditionally render the modal --- */}
      {isFirstLogin && <FirstTimeSetupModal />}

      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 items-start">
        <div className="flex flex-col gap-8">
          {loading ? <Skeleton height={120} /> : <DailyTracker />}
          {loading ? <Skeleton height={200} /> : <ActivityChart />}
          <div ref={categoryManagerRef}>
            {loading ? <Skeleton height={180} /> : <CategoryManager />}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {loading ? (
            <Skeleton height={150} />
          ) : (
            <TodaysRoutinesCard categoryManagerRef={categoryManagerRef} />
          )}
          {loading ? <Skeleton height={180} /> : <FocusSession />}
          {loading ? <Skeleton height={180} /> : <StatsOverview />}
          {loading ? <Skeleton height={150} /> : <History />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
