import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/helpers';
import Card from '../ui/Card';

const StatsOverview = () => {
  const { userData, saveData } = useAppContext();
  const importInputRef = useRef(null);

  const { totalsMap, grandTotal } = React.useMemo(() => {
    const totals = {};
    let total = 0;
    if (userData?.log) {
      for (const dailyData of Object.values(userData.log)) {
        for (const [catId, count] of Object.entries(dailyData)) {
          totals[catId] = (totals[catId] || 0) + count;
          total += count;
        }
      }
    }
    return { totalsMap: totals, grandTotal: total };
  }, [userData?.log]);

  const handleExport = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const url = URL.createObjectURL(
      new Blob([dataStr], { type: 'application/json' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `momentum-backup-${getTodayDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (
        window.confirm('Are you sure you want to overwrite your current data?')
      ) {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.settings && importedData.log) {
            saveData(importedData);
          } else {
            alert('Invalid data format.');
          }
        } catch (error) {
          alert('Error reading the import file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card title="Your Grand Tally" className="text-center">
      <div className="pb-6 mb-6 border-b border-border-default">
        <div className="text-6xl font-bold leading-none text-accent">
          {grandTotal}
        </div>
        <p className="text-sm text-secondary-text mt-1">
          Total units of awesomeness
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
        {(userData?.settings?.categories || []).map((cat) => (
          <div key={cat.id}>
            <div className="text-3xl font-bold shadow-sm">
              {totalsMap[cat.id] || 0}
            </div>
            <div className="text-xs text-secondary-text">{cat.label}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-8 border-t border-input-bg pt-6">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 text-sm border border-input-border text-secondary-text rounded-md hover:bg-input-bg hover:text-white transition-colors"
        >
          <Download size={14} /> Export
        </button>
        <button
          onClick={() => importInputRef.current.click()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm border border-input-border text-secondary-text rounded-md hover:bg-input-bg hover:text-white transition-colors"
        >
          <Upload size={14} /> Import
        </button>
        <input
          type="file"
          ref={importInputRef}
          onChange={handleImport}
          accept=".json"
          className="hidden"
        />
      </div>
    </Card>
  );
};

export default StatsOverview;
