import React, { useState, useEffect, useMemo } from 'react';
import { X, PlusSquare, Flame } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { getTodayDateString, getTextColorForBg } from '../../utils/helpers';
import Card from '../ui/Card';
import Modal from '../ui/Modal'; // Import Modal
import AddCategoryForm from './AddCategoryForm'; // Import Form
import { updateStreak, getTodaysRoutines } from '../../utils/routineManager';

const DailyTracker = () => {
  const { userData, saveData } = useAppContext();
  // --- Animation Hook: To control the container pulse ---
  const logContainerControls = useAnimation();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false); // State for modal
  const todaysRoutines = useMemo(() => {
    return getTodaysRoutines(userData?.settings?.categories, userData?.log);
  }, [userData]);

  const pendingRoutineIds = todaysRoutines
    .filter((r) => r.status === 'pending')
    .map((r) => r.id);

  const addUnit = (catId) => {
    logContainerControls.start({
      scale: [1, 1.03, 1],
      borderColor: ['#3a3a3a', '#bb86fc', '#3a3a3a'],
      transition: { duration: 0.4, ease: 'easeInOut' },
    });

    // Create a deep copy of userData to modify
    const updatedData = JSON.parse(JSON.stringify(userData));

    // 1. Update the log
    const todayStr = getTodayDateString();
    if (!updatedData.log[todayStr]) {
      updatedData.log[todayStr] = {};
    }
    updatedData.log[todayStr][catId] =
      (updatedData.log[todayStr][catId] || 0) + 1;

    // 2. Check for and update the streak for the completed routine
    const categoryIndex = updatedData.settings.categories.findIndex(
      (c) => c.id === catId
    );
    if (categoryIndex !== -1) {
      const category = updatedData.settings.categories[categoryIndex];
      const isRoutine = !!category.routine;

      const todaysRoutines = getTodaysRoutines(
        userData.settings.categories,
        userData.log
      );
      const isAlreadyCompleted =
        todaysRoutines.find((r) => r.id === catId)?.status === 'completed';

      // Only update streak if it's a routine and wasn't already completed today
      if (isRoutine && !isAlreadyCompleted) {
        const newStreak = updateStreak(category);
        updatedData.settings.categories[categoryIndex].streak = newStreak;
      }
    }

    // 3. Save the single, fully updated payload to Supabase
    saveData(updatedData);
  };

  const removeUnit = (catId) => {
    const todayStr = getTodayDateString();
    const newLog = JSON.parse(JSON.stringify(userData.log));
    if (newLog[todayStr] && newLog[todayStr][catId]) {
      newLog[todayStr][catId]--;
      if (newLog[todayStr][catId] <= 0) delete newLog[todayStr][catId];
      saveData({ ...userData, log: newLog });
    }
  };

  const todayLogEntries = React.useMemo(() => {
    const todayStr = getTodayDateString();
    const entries = [];
    if (userData?.log && userData.log[todayStr]) {
      const categoryMap = new Map(
        (userData.settings?.categories || []).map((cat) => [cat.id, cat])
      );
      Object.entries(userData.log[todayStr]).forEach(([catId, count]) => {
        const categoryInfo = categoryMap.get(catId);
        if (categoryInfo) {
          for (let i = 0; i < count; i++) {
            entries.push({ key: `${catId}-${i}`, ...categoryInfo });
          }
        }
      });
    }
    return entries;
  }, [userData?.log, userData?.settings?.categories]);

  // Animation properties for the log items
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 250, damping: 18 }, // A more professional spring
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  const AddButton = (
    <button
      onClick={() => setIsAddCategoryOpen(true)}
      title="Add a new category"
      className="p-2 rounded-lg text-secondary-text hover:text-white hover:bg-white/10 transition-colors"
    >
      <PlusSquare size={20} />
    </button>
  );

  return (
    <>
      {/* The Modal for adding a new category */}
      <Modal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        title="Create a New Focus Area"
        headerAction={AddButton}
      >
        <AddCategoryForm onCategoryAdded={() => setIsAddCategoryOpen(false)} />
      </Modal>
      <Card
        title="Alright, what's the mission for today?"
        description="Add a block of pure, uninterrupted focus."
        headerAction={AddButton}
      >
        <div className="flex flex-wrap gap-3 mb-6">
          {(userData?.settings?.categories || []).map((cat) => {
            const isPendingRoutine = pendingRoutineIds.includes(cat.id);
            return (
              <motion.button
                key={cat.id}
                onClick={() => addUnit(cat.id)}
                style={{
                  backgroundColor: cat.color,
                  color: getTextColorForBg(cat.color),
                }}
                // Add `relative` to allow absolute positioning of children
                className={`relative border-none px-5 py-3 rounded-md text-sm font-medium cursor-pointer shadow-sm ${
                  isPendingRoutine
                    ? 'ring-2 ring-offset-2 ring-offset-surface ring-accent'
                    : ''
                }`}
                whileTap={{
                  scale: 0.9,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
                whileHover={{ y: -2 }}
              >
                {/* Position the star absolutely in the top-right corner */}
                {isPendingRoutine && (
                  <Flame
                    size={12}
                    className="absolute top-1 right-1"
                    fill="currentColor"
                  />
                )}
                + {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* The log container now has animation controls */}
        <motion.div
          animate={logContainerControls}
          className="flex flex-wrap gap-3 min-h-[64px] mt-6 bg-black/10 p-3 rounded-lg border border-border-default"
        >
          <AnimatePresence>
            {todayLogEntries.map((entry) => (
              <motion.div
                layout
                key={entry.key}
                onClick={() => removeUnit(entry.id)}
                title={`Click to remove one unit of "${entry.label}"`}
                style={{
                  backgroundColor: entry.color,
                  '--glow-color': entry.color,
                }}
                className="group relative w-[38px] h-[38px] rounded-md cursor-pointer inline-flex justify-center items-center font-bold shadow-lg shadow-black/20 hover:shadow-glow"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{
                  scale: 1.1,
                  transition: { type: 'spring', stiffness: 300 },
                }}
              >
                <span
                  className="text-lg transition-opacity group-hover:opacity-0"
                  style={{ color: getTextColorForBg(entry.color) }}
                >
                  {entry.label.charAt(0).toUpperCase()}
                </span>
                <X
                  size={28}
                  className="absolute text-error opacity-0 transition-opacity group-hover:opacity-100"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Card>
    </>
  );
};

export default DailyTracker;
