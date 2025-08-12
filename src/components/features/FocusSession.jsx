// src/features/FocusSession.jsx

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useUser } from '../../context/UserProvider';
import Card from '../ui/Card';

const FocusSession = () => {
  // --- Get settings from context ---
  const { userData, saveData } = useUser();
  const duration = userData?.settings?.focusDuration || 45;
  const activeSession = userData?.settings?.focusSession; // { isActive, endTime, remainingOnPause }

  // --- Local component states ---
  const [totalSeconds, setTotalSeconds] = useState(duration * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  const presetDurations = [25, 45, 60, 90];

  // ====================================================================================
  // === ✨ [MAJOR CHANGE 1] - Rewritten sync hook to handle different states          ===
  // ====================================================================================
  useEffect(() => {
    const newTotal = duration * 60;
    setTotalSeconds(newTotal);

    // Priority 1: Restore an active (running) session
    if (activeSession?.isActive && activeSession?.endTime) {
      const endTime = new Date(activeSession.endTime);
      const newRemaining = Math.max(
        0,
        Math.floor((endTime - new Date()) / 1000)
      );

      setRemainingSeconds(newRemaining);
      setIsRunning(newRemaining > 0);

      // Priority 2: Restore a paused session
    } else if (
      !activeSession?.isActive &&
      activeSession?.remainingOnPause != null
    ) {
      setRemainingSeconds(activeSession.remainingOnPause);
      setIsRunning(false);

      // Priority 3: Initialize (no session in the database)
    } else {
      setRemainingSeconds(newTotal);
      setIsRunning(false);
    }
  }, [activeSession, duration]);

  // --- Timer countdown logic (unchanged) ---
  useEffect(() => {
    let interval;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(
        () => setRemainingSeconds((prev) => Math.max(0, prev - 1)),
        1000
      );
    } else if (remainingSeconds <= 0 && isRunning) {
      setIsRunning(false);
      resetTimer(); // Reset the timer after it finishes
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const handleDurationChange = (newDuration) => {
    if (newDuration > 0 && !isRunning) {
      const newUserData = {
        ...userData,
        settings: { ...userData.settings, focusDuration: newDuration },
      };
      saveData(newUserData);
    }
  };

  // ========================================================================
  // === ✨ [MAJOR CHANGE 2] - New logic for start, pause, and resume      ===
  // ========================================================================
  const toggleTimer = () => {
    if (!userData || !saveData) return;

    const nextIsRunning = !isRunning;

    // For a better user experience, we update the UI immediately
    setIsRunning(nextIsRunning);

    if (nextIsRunning) {
      // --- Logic for starting or resuming ---
      const newEndTime = new Date(Date.now() + remainingSeconds * 1000);
      saveData({
        ...userData,
        settings: {
          ...userData.settings,
          focusSession: {
            isActive: true,
            endTime: newEndTime.toISOString(), // Save the end time
            remainingOnPause: null, // Clear the paused state
          },
        },
      });
    } else {
      // --- Logic for pausing ---
      saveData({
        ...userData,
        settings: {
          ...userData.settings,
          focusSession: {
            isActive: false,
            endTime: null, // Clear the end time
            remainingOnPause: remainingSeconds, // Save the remaining time at the moment of pausing
          },
        },
      });
    }
  };

  // ========================================================================
  // === ✨ [MAJOR CHANGE 3] - New logic for a full timer reset          ===
  // ========================================================================
  const resetTimer = () => {
    if (userData && saveData) {
      saveData({
        ...userData,
        settings: {
          ...userData.settings,
          focusSession: {
            // Completely clear the session data
            isActive: false,
            endTime: null,
            remainingOnPause: null,
          },
        },
      });
    }
  };

  // --- Display calculations (unchanged) ---
  const progress =
    totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const angle = progress * 360;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <Card
      title="Focus Session"
      description="Enter a state of deep work. Use this timer to eliminate distractions and focus intensely."
    >
      <div className="relative w-48 h-48 mx-auto my-6 grid place-items-center">
        {/* SVG and timer display elements remain the same */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="white"
            strokeOpacity="0.1"
            strokeWidth="8"
          />
        </svg>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#bb86fc ${angle}deg, transparent ${angle}deg)`,
            mask: 'radial-gradient(transparent 82px, black 83px)',
            WebkitMask: 'radial-gradient(transparent 82px, black 83px)',
          }}
        ></div>
        <div className="relative z-10">
          <span className="text-5xl font-light text-white tracking-wider">
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={toggleTimer}
          className="px-8 h-12 font-medium rounded-full transition-colors bg-accent text-bg-color hover:bg-button-hover text-lg"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 bg-white/5 rounded-full flex justify-center items-center transition-colors hover:bg-white/10"
        >
          <RefreshCw size={20} className="text-secondary-text" />
        </button>
      </div>
      <div className="flex justify-center items-center gap-2 mt-4 border-t border-white/5 pt-6">
        <span className="text-sm text-secondary-text mr-2">Duration:</span>
        {presetDurations.map((preset) => (
          <button
            key={preset}
            onClick={() => handleDurationChange(preset)}
            disabled={isRunning}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors font-medium ${
              duration === preset
                ? 'bg-accent text-bg-color'
                : 'bg-white/10 text-primary-text hover:bg-white/20'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {preset}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default FocusSession;
