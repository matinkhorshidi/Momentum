import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useUser } from '../../context/UserProvider';
import { COLOR_PALETTE } from '../../utils/constants';
import ColorPicker from '../ui/ColorPicker';
import RoutineControls from './RoutineControls';

const AddCategoryForm = ({ onCategoryAdded }) => {
  const { userData, saveData } = useUser();
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(COLOR_PALETTE.Vibrant[0]);
  const [isRoutineEnabled, setIsRoutineEnabled] = useState(false);
  const [routine, setRoutine] = useState(null);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newLabel.trim()) {
      const newCategory = {
        id: `custom_${Date.now()}`,
        label: newLabel.trim(),
        color: newColor,
        // Conditionally add the routine object if it's enabled
        ...(isRoutineEnabled && routine ? { routine } : {}),
      };

      const newCategories = [
        ...(userData.settings.categories || []),
        newCategory,
      ];

      saveData({
        ...userData,
        settings: { ...userData.settings, categories: newCategories },
      });

      // Reset all state after adding
      setNewLabel('');
      setNewColor(COLOR_PALETTE.Vibrant[0]);
      setIsRoutineEnabled(false);
      setRoutine(null);
      if (onCategoryAdded) {
        onCategoryAdded();
      }
    }
  };

  const toggleRoutine = () => {
    const newEnabledState = !isRoutineEnabled;
    setIsRoutineEnabled(newEnabledState);
    if (newEnabledState) {
      // When enabling, set a default routine
      setRoutine({ type: 'daily' });
    } else {
      // When disabling, clear the routine
      setRoutine(null);
    }
  };

  return (
    <form
      onSubmit={handleAddCategory}
      className="flex flex-col gap-4 p-3 border border-dashed border-border-default rounded-lg mt-4"
    >
      {/* Primary Action Row */}
      <div className="flex items-center gap-3">
        <ColorPicker selectedColor={newColor} onColorChange={setNewColor} />
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="New focus area name..."
          required
          className="flex-grow bg-transparent border-none text-base focus:outline-none p-1 text-primary-text"
        />
        <button
          type="submit"
          className="px-4 py-2 font-medium rounded-md transition-colors bg-accent text-bg-color hover:bg-button-hover"
        >
          Add
        </button>
      </div>

      {/* Secondary Action Area for Routines */}
      <div className="flex flex-col items-start">
        <AnimatePresence>
          {isRoutineEnabled && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <RoutineControls initialRoutine={routine} onChange={setRoutine} />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggleRoutine}
          className="flex items-center gap-2 text-xs text-secondary-text hover:text-accent transition-colors self-start p-1 mt-2"
        >
          {isRoutineEnabled ? <X size={12} /> : <Plus size={12} />}
          {isRoutineEnabled ? 'Remove Routine' : 'Add Routine'}
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;
