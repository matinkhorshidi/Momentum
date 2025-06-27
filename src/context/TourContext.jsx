// src/context/TourContext.jsx

import React, { createContext, useState, useContext } from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

const TourContext = createContext();

// --- MODIFIED STEPS WITH AUTO PLACEMENT ---
const TOUR_STEPS = [
  {
    target: '#tour-step-1-logging-focus',
    content:
      'Your first quest: When you crush a task, hit its button here to celebrate the win. Each click builds your momentum!',
    placement: 'auto', // Changed to auto
    title: 'Your Mission Control',
  },
  {
    target: '#tour-step-2-managing-areas',
    content:
      "This is your command center for customization. Hit 'Edit' to rename, recolor, or invent new focus areas. Make this space truly yours.",
    placement: 'auto', // Changed to auto
    title: 'Customize Your Arsenal',
  },
  {
    target: '#tour-step-routines-card',
    content:
      'Consistency is your new superpower. Set recurring goals here and check them off daily to build unstoppable habits.',
    placement: 'auto', // Changed to auto
    title: 'Power-Up Your Habits',
  },
  {
    target: '#tour-step-3-grand-tally',
    content:
      "This is your trophy room. Watch your total effort grow and keep that 'Day Streak' fiery. You're building a legacy!",
    placement: 'auto', // Changed to auto
    title: 'Behold! Your Epic Stats',
  },
  {
    target: '#tour-step-4-activity-chart',
    content:
      'Become a data detective. This chart reveals your unique work patterns, helping you understand where your genius flows.',
    placement: 'auto', // Changed to auto
    title: 'Discover Your Rhythm',
  },
  {
    target: '#tour-step-5-focus-timer',
    content:
      "It's time for deep work. Silence the noise, pick a duration, and enter a state of pure, uninterrupted flow. Let's do this.",
    placement: 'auto', // Changed to auto
    title: 'Enter the Focus Zone',
  },
];

export const TourProvider = ({ children }) => {
  const [runTour, setRunTour] = useState(false);
  const highlightedElementRef = React.useRef(null);

  const handleJoyrideCallback = (data) => {
    const { status, type, step } = data;
    const HIGHLIGHT_CLASSES = [
      'ring-2',
      'ring-accent',
      'ring-offset-2',
      'ring-offset-bg-color',
      'transition-all',
      'duration-300',
      'rounded-xl',
    ];

    const cleanupHighlight = () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove(...HIGHLIGHT_CLASSES);
        highlightedElementRef.current = null;
      }
    };

    if (type === EVENTS.STEP_BEFORE) {
      cleanupHighlight();

      const currentElement = document.querySelector(step.target);
      if (currentElement) {
        currentElement.classList.add(...HIGHLIGHT_CLASSES);
        highlightedElementRef.current = currentElement;
      }
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      cleanupHighlight();
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
        showProgress={false}
        showSkipButton
        disableBeacon={true}
        styles={{
          options: {
            arrowColor: '#1e1e1e',
            backgroundColor: '#1e1e1e',
            primaryColor: '#bb86fc',
            textColor: '#e0e0e0',
            zIndex: 10000,
          },
          tooltip: {
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
            textAlign: 'left',
          },
          footer: {
            marginTop: '20px',
            textAlign: 'right',
          },
          spotlight: {
            padding: 0,
            borderRadius: '12px',
          },
          buttonClose: {
            color: '#a0a0a0',
          },
          buttonBack: {
            color: '#a0a0a0',
          },
          buttonSkip: {
            color: '#a0a0a0',
          },
        }}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'Start My Momentum',
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
