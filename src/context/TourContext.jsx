// src/context/TourContext.jsx

import React, { createContext, useState, useContext } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const TourContext = createContext();

const TOUR_STEPS = [
  {
    target: '#tour-step-1-logging-focus',
    content:
      "This is Mission Control! Just finished a task? Smash one of these buttons to log your victory and tell procrastination who's boss.",
    placement: 'bottom',
    title: 'Log Your Wins! (1/5)',
  },
  {
    target: '#tour-step-2-managing-areas',
    content:
      "This is your creative sandbox. Don't like our categories? No problem! Hit 'Edit' to rename, recolor, reorder, or invent your own focus areas. Go wild!",
    placement: 'right',
    title: 'Customize Your Arsenal (2/5)',
  },
  {
    target: '#tour-step-3-grand-tally',
    content:
      "Watch the numbers go UP! Every click fuels your 'Grand Tally.' Keep that 'Day Streak' alive and build a monument to your own awesomeness.",
    placement: 'bottom',
    title: 'Behold! Your Epic Stats (3/5)',
  },
  {
    target: '#tour-step-4-activity-chart',
    content:
      'Ever wonder where your time *really* goes? This chart is your personal data detective, revealing your unique work patterns. Are you a marathon coder or a multitasking wizard?',
    placement: 'top',
    title: 'Discover Your Rhythm (4/5)',
  },
  {
    target: '#tour-step-5-focus-timer',
    content:
      "Time to go deep! Banish all distractions with this Pomodoro-style timer. Pick your battle duration, hit 'Start,' and enter a glorious state of flow.",
    placement: 'right',
    title: 'Enter the Focus Zone (5/5)',
  },
];

export const TourProvider = ({ children }) => {
  const [runTour, setRunTour] = useState(false);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.setItem('momentumTourCompleted', 'true');
    }
  };

  const startTour = () => {
    localStorage.removeItem('momentumTourCompleted');
    setRunTour(true);
  };

  return (
    <TourContext.Provider value={{ startTour, setRunTour }}>
      {children}
      <Joyride
        callback={handleJoyrideCallback}
        steps={TOUR_STEPS}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        disableBeacon={true}
        styles={{
          // === UPDATED STYLES TO MATCH YOUR THEME ===
          options: {
            arrowColor: '#1e1e1e', // Matches 'surface'
            backgroundColor: '#1e1e1e', // Matches 'surface'
            primaryColor: '#bb86fc', // Matches 'accent'
            textColor: '#e0e0e0', // Matches 'primary-text'
            zIndex: 10000,
          },
          // Make the close button more subtle and theme-aligned
          buttonClose: {
            color: '#a0a0a0', // Matches 'secondary-text'
          },
          // Style the back/skip buttons to be less prominent
          buttonBack: {
            color: '#a0a0a0', // Matches 'secondary-text'
          },
          buttonSkip: {
            color: '#a0a0a0', // Matches 'secondary-text'
          },
        }}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: "Let's Go!",
          next: 'Next',
          skip: 'Skip',
        }}
      />
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
