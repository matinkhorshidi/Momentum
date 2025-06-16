import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const RoutineCreator = ({ category, onRoutineChange, onRemove, close }) => {
  const hasRoutine = !!category.routine;
  const [isEnabled, setIsEnabled] = useState(hasRoutine);
  const [type, setType] = useState(category.routine?.type || 'daily');
  const [selectedDays, setSelectedDays] = useState(
    category.routine?.days || []
  );

  const handleToggleEnable = () => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState);
    if (!newEnabledState) {
      onRemove();
    } else {
      const defaultRoutine = { type: 'daily' };
      setType('daily');
      onRoutineChange(defaultRoutine);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    const newRoutine =
      newType === 'daily'
        ? { type: 'daily' }
        : { type: 'weekly', days: selectedDays };
    onRoutineChange(newRoutine);
  };

  const handleDayToggle = (dayIndex) => {
    const newDays = selectedDays.includes(dayIndex)
      ? selectedDays.filter((d) => d !== dayIndex)
      : [...selectedDays, dayIndex].sort();
    setSelectedDays(newDays);
    onRoutineChange({ type: 'weekly', days: newDays });
  };

  return (
    <div className="p-4 w-64">
      <header className="mb-4">
        <h3 className="font-bold text-primary-text">
          Routine for '{category.label}'
        </h3>
        <p className="text-xs text-secondary-text">
          Set a recurring goal for this category.
        </p>
      </header>

      <div className="flex items-center justify-between py-2">
        <label className="text-sm font-medium text-primary-text">
          Enable Routine
        </label>
        <button
          onClick={handleToggleEnable}
          className={`transition-colors ${
            isEnabled ? 'text-accent' : 'text-secondary-text'
          }`}
        >
          {isEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
        </button>
      </div>

      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-secondary-text mb-2">Frequency</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTypeChange('daily')}
                className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
                  type === 'daily' ? 'bg-accent text-bg-color' : 'bg-white/10'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => handleTypeChange('weekly')}
                className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
                  type === 'weekly' ? 'bg-accent text-bg-color' : 'bg-white/10'
                }`}
              >
                Weekly
              </button>
            </div>
            {type === 'weekly' && (
              <div className="flex items-center justify-between gap-1 mt-3">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDayToggle(index)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                      selectedDays.includes(index)
                        ? 'bg-accent text-bg-color'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
      <button
        onClick={close}
        className="w-full mt-4 bg-accent text-bg-color font-medium py-2 rounded-lg text-sm transition-colors hover:bg-button-hover"
      >
        Done
      </button>
    </div>
  );
};

export default RoutineCreator;
