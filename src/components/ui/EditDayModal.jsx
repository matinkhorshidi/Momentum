import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserProvider';
import { Plus, Minus } from 'lucide-react';

const EditDayModal = ({ isOpen, onClose, dayData, onSave }) => {
  const { userData } = useUser();
  const [log, setLog] = useState({});
  const [selectedDate, setSelectedDate] = useState('');

  const isAddMode = !dayData?.date;

  useEffect(() => {
    if (dayData) {
      setLog(dayData.log || {});
      setSelectedDate(dayData.date);
    } else {
      // Reset for "Add Day" mode
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setLog({});
    }
  }, [dayData, isOpen]);

  if (!isOpen) return null;

  const handleCountChange = (catId, delta) => {
    setLog((prevLog) => {
      const currentCount = prevLog[catId] || 0;
      const newCount = Math.max(0, currentCount + delta); // Cannot go below 0
      return { ...prevLog, [catId]: newCount };
    });
  };

  const handleSave = () => {
    onSave(selectedDate, log);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-bg-color/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-surface p-6 sm:p-8 rounded-2xl w-full max-w-lg border border-border-default animate-pop-in shadow-xl">
        <h2 className="text-xl font-bold text-primary-text mb-1">
          {isAddMode ? 'Add a Past Entry' : 'Alter History'}
        </h2>
        <p className="text-sm text-secondary-text mb-6">
          {isAddMode
            ? 'Select a date and log the units you completed.'
            : `Editing log for ${new Date(
                selectedDate + 'T00:00:00'
              ).toLocaleDateString('en-US', { dateStyle: 'full' })}`}
        </p>

        {isAddMode && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-text mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-input-bg border border-input-border rounded-lg p-2 text-primary-text"
            />
          </div>
        )}

        <div className="max-h-64 overflow-y-auto pr-2 flex flex-col gap-3">
          {(userData?.settings?.categories || []).map((cat) => (
            <div key={cat.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></div>
                <span className="text-primary-text">{cat.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleCountChange(cat.id, -1)}
                  className="p-1 rounded-full bg-input-bg text-secondary-text hover:text-primary-text"
                >
                  <Minus size={16} />
                </button>
                <span className="font-mono text-lg w-8 text-center">
                  {log[cat.id] || 0}
                </span>
                <button
                  onClick={() => handleCountChange(cat.id, 1)}
                  className="p-1 rounded-full bg-input-bg text-secondary-text hover:text-primary-text"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg text-sm font-medium text-secondary-text hover:text-primary-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-6 rounded-lg text-sm font-medium bg-accent text-bg-color hover:bg-button-hover transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDayModal;
