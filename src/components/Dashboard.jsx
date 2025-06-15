import React from 'react';
import Header from './features/Header';
import DailyTracker from './features/DailyTracker';
import CategoryManager from './features/CategoryManager';
import FocusSession from './features/FocusSession';
import StatsOverview from './features/StatsOverview';
import History from './features/History';

const Dashboard = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-8">
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 items-start">
        <div className="lg:sticky lg:top-8 flex flex-col gap-8">
          <DailyTracker />
          <CategoryManager />
        </div>
        <div className="flex flex-col gap-8">
          <FocusSession />
          <StatsOverview />
          <History />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
