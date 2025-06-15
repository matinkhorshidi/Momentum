import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Card from '../ui/Card';

const FocusSession = () => {
  const { userData, saveData } = useAppContext();
  const duration = userData?.settings?.focusDuration || 45;
  const [totalSeconds, setTotalSeconds] = useState(duration * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const newTotal = duration * 60;
    setTotalSeconds(newTotal);
    if (!isRunning) {
      setRemainingSeconds(newTotal);
    }
  }, [duration, isRunning]);

  useEffect(() => {
    let interval;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(
        () => setRemainingSeconds((prev) => prev - 1),
        1000
      );
    } else if (remainingSeconds <= 0 && isRunning) {
      setIsRunning(false);
      // Optionally, you could play a sound here or show a notification
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10);
    if (newDuration > 0) {
      saveData({
        ...userData,
        settings: { ...userData.settings, focusDuration: newDuration },
      });
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const progress =
    totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const angle = progress * 360;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <Card title="Focus Session" className="text-center">
      <div className="relative w-[200px] h-[200px] mx-auto my-6 grid place-items-center">
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="#444"
            strokeWidth="2"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
        </svg>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#bb86fc ${angle}deg, transparent ${angle}deg)`,
          }}
        ></div>
        <div className="relative z-10 w-[85%] h-[85%] rounded-full grid place-items-center bg-surface shadow-[0_5px_25px_rgba(0,0,0,0.3)]">
          <span className="text-[2.2rem] font-bold text-white shadow-sm">
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={toggleTimer}
          className="px-6 h-12 font-medium rounded-full transition-colors bg-accent text-bg-color hover:bg-button-hover"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 h-12 bg-[#333] rounded-full flex justify-center items-center transition-colors hover:bg-[#444]"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      <div className="text-center">
        <p className="text-xs text-secondary-text mb-3">
          A 45-minute session is great for deep work, but you can change it.
        </p>
        <label htmlFor="duration" className="text-sm mr-2">
          Duration (minutes):
        </label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={handleDurationChange}
          min="1"
          className="w-16 p-1 border rounded-md text-center bg-input-bg border-input-border"
        />
      </div>
    </Card>
  );
};

export default FocusSession;
