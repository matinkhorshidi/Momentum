import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const RoutineControls = ({ initialRoutine, onChange }) => {
  const [type, setType] = useState(initialRoutine?.type || 'daily');
  const [selectedDays, setSelectedDays] = useState(initialRoutine?.days || []);

  useEffect(() => {
    setType(initialRoutine?.type || 'daily');
    setSelectedDays(initialRoutine?.days || []);
  }, [initialRoutine]);

  const handleTypeChange = (newType) => {
    setType(newType);
    const newRoutine =
      newType === 'daily'
        ? { type: 'daily' }
        : { type: 'weekly', days: selectedDays };
    onChange(newRoutine);
  };

  const handleDayToggle = (dayIndex) => {
    const newDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((d) => d !== dayIndex)
      : [...selectedDays, dayIndex].sort();
    setSelectedDays(newDays);
    onChange({ type: 'weekly', days: newDays });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full pt-4 border-t border-white/10 space-y-4"
    >
      {/* --- New Segmented Control for Frequency --- */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-primary-text">Frequency</p>
        <div className="flex items-center bg-input-bg p-1 rounded-md">
          <button
            type="button"
            onClick={() => handleTypeChange('daily')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              type === 'daily'
                ? 'bg-accent text-bg-color'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('weekly')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              type === 'weekly'
                ? 'bg-accent text-bg-color'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* --- New Layout for Weekly Controls --- */}
      <AnimatePresence>
        {type === 'weekly' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-between items-center"
          >
            <p className="text-sm font-medium text-primary-text">
              On these days
            </p>
            {/* This container ensures the buttons stay grouped together */}
            <div className="flex items-center justify-end gap-1">
              {daysOfWeek.map((day, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleDayToggle(index)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                    selectedDays.includes(index)
                      ? 'bg-accent text-bg-color'
                      : 'bg-input-bg hover:bg-white/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoutineControls;
