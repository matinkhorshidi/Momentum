import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserProvider';
import { getTodayDateString } from '../../utils/helpers';
import Card from '../ui/Card';
import { Edit, Plus } from 'lucide-react';
import EditAttemptModal from '../ui/EditAttemptModal';
import toast from 'react-hot-toast';
import EditDayModal from '../ui/EditDayModal';

const History = () => {
  const { userData, saveData } = useUser();
  const [openEntry, setOpenEntry] = useState(null);

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningModalData, setWarningModalData] = useState({ attemptsLeft: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDay, setEditingDay] = useState(null);

  const { categoryMap, sortedDates } = React.useMemo(() => {
    const catMap = new Map(
      (userData?.settings?.categories || []).map((cat) => [cat.id, cat])
    );
    const dates = Object.keys(userData?.log || {})
      .filter((date) => date !== getTodayDateString())
      .sort((a, b) => new Date(b) - new Date(a));
    return { categoryMap: catMap, sortedDates: dates };
  }, [userData]);

  // --- MODIFIED: Edit click handler with new 4-step logic ---
  const handleEditClick = (date) => {
    const storageKey = `editAttempts_${date}`;
    const attempts = parseInt(localStorage.getItem(storageKey) || '0', 10);
    const maxAttempts = 3; // 3 clicks AFTER the initial modal warning

    if (attempts === 0) {
      // 1st click
      localStorage.setItem(storageKey, '1');
      setWarningModalData({ attemptsLeft: maxAttempts });
      setShowWarningModal(true);
    } else if (attempts < maxAttempts) {
      // 2nd and 3rd clicks
      const newAttempts = attempts + 1;
      localStorage.setItem(storageKey, newAttempts.toString());
      const attemptsLeft = maxAttempts - attempts;
      toast(
        `The past is set. ${attemptsLeft} attempt(s) left to edit this day.`,
        {
          icon: '⏳',
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        }
      );
    } else {
      // 4th click (attempts >= 3)
      localStorage.removeItem(storageKey);
      setEditingDay({ date, log: userData.log[date] });
      setShowEditModal(true);
    }
  };

  // --- MODIFIED: Add Day handler with new 4-step logic ---
  const handleAddDayClick = () => {
    const storageKey = 'addDayAttempts';
    const attempts = parseInt(localStorage.getItem(storageKey) || '0', 10);
    const maxAttempts = 3; // 3 clicks AFTER the initial modal warning

    if (attempts === 0) {
      // 1st click
      localStorage.setItem(storageKey, '1');
      setWarningModalData({ attemptsLeft: maxAttempts });
      setShowWarningModal(true);
    } else if (attempts < maxAttempts) {
      // 2nd and 3rd clicks
      const newAttempts = attempts + 1;
      localStorage.setItem(storageKey, newAttempts.toString());
      const attemptsLeft = maxAttempts - attempts;
      toast(
        `Focus on today! ${attemptsLeft} attempt(s) left to add a past day.`,
        {
          icon: '✍️',
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        }
      );
    } else {
      // 4th click (attempts >= 3)
      localStorage.removeItem(storageKey);
      setEditingDay(null);
      setShowEditModal(true);
    }
  };

  const handleSaveLog = (date, newLog) => {
    if (!date || !newLog) return;
    const updatedLog = {
      ...userData.log,
      [date]: newLog,
    };
    const newUserData = { ...userData, log: updatedLog };
    saveData(newUserData);
    toast.success('Logbook updated successfully!');
  };

  const addDayButton = (
    <button
      onClick={handleAddDayClick}
      title="Add a past entry"
      className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
    >
      <Plus size={16} className="text-secondary-text hover:text-primary-text" />
    </button>
  );

  return (
    <>
      <Card
        title="The Logbook"
        description="A record of your past victories. Click any day to review the details of your hard work."
        headerAction={addDayButton}
      >
        <div className="flex flex-col">
          {sortedDates.map((date) => {
            const dailyData = userData.log[date];
            const dailyTotal = Object.values(dailyData).reduce(
              (sum, count) => sum + count,
              0
            );
            if (dailyTotal === 0) return null;
            const isOpen = openEntry === date;
            const dailyVisuals = [];
            Object.entries(dailyData).forEach(([catId, count]) => {
              const category = categoryMap.get(catId);
              if (category) {
                for (let i = 0; i < count; i++) {
                  dailyVisuals.push(category);
                }
              }
            });

            return (
              <div
                key={date}
                className="border-b border-input-bg last:border-b-0 py-4"
              >
                <div
                  className="flex justify-between items-center cursor-pointer group"
                  onClick={() => setOpenEntry(isOpen ? null : date)}
                >
                  <span className="font-medium group-hover:text-accent transition-colors text-sm">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <div
                    className="flex justify-end items-center gap-1.5"
                    title={`${dailyTotal} units`}
                  >
                    {dailyVisuals.slice(0, 10).map((vis, index) => (
                      <div
                        key={index}
                        className="w-3.5 h-3.5 rounded-sm"
                        style={{ backgroundColor: vis.color }}
                        title={vis.label}
                      />
                    ))}
                    {dailyVisuals.length > 10 && (
                      <span className="text-xs text-secondary-text ml-1">
                        {' '}
                        +{dailyVisuals.length - 10} more{' '}
                      </span>
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        marginTop: '1rem',
                      }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 border-l-2 border-border-default flex flex-col gap-2">
                        {Object.entries(dailyData).map(([catId, count]) => {
                          const category = categoryMap.get(catId);
                          return category ? (
                            <div
                              key={catId}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span>
                                {' '}
                                {category.label}: <strong>{count}</strong> units{' '}
                              </span>
                            </div>
                          ) : null;
                        })}
                        <button
                          onClick={() => handleEditClick(date)}
                          className="flex items-center gap-2 text-xs text-secondary-text hover:text-accent transition-colors mt-2 self-start"
                        >
                          <Edit size={12} />
                          <span>Alter History</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Card>

      <EditAttemptModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        attemptsLeft={warningModalData.attemptsLeft}
      />
      <EditDayModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        dayData={editingDay}
        onSave={handleSaveLog}
      />
    </>
  );
};

export default History;
