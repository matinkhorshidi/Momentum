import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Lock,
  RefreshCw,
  GripVertical,
  X,
  Download,
  Upload,
} from 'lucide-react';

// --- Supabase Client Setup ---
const supabaseUrl = 'https://tjdhpagvtbrcdwfvhoyc.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZGhwYWd2dGJyY2R3ZnZob3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODI1NjksImV4cCI6MjA2NTU1ODU2OX0.OFylOtQvkNXGdblGjmUlmenX_tonZbaqwxO2Kjjf7HQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Constants ---
const COLOR_PALETTE = {
  Vibrant: [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ],
  Pastel: [
    '#fca5a5',
    '#fdba74',
    '#fde047',
    '#86efac',
    '#93c5fd',
    '#c4b5fd',
    '#f9a8d4',
  ],
};

const DEFAULT_USER_DATA = {
  settings: {
    focusDuration: 45,
    categories: [
      { id: 'work', label: 'Work', color: '#3b82f6' },
      { id: 'study', label: 'University', color: '#22c55e' },
      { id: 'side-project', label: 'Side Project', color: '#f97316' },
    ],
  },
  log: {},
};

// --- Global State (Context API) ---
const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

// --- Helper Functions ---
const getTodayDateString = () => new Date().toISOString().slice(0, 10);
const getTextColorForBg = (hexColor) => {
  if (!hexColor || hexColor.length < 7) return '#FFFFFF';
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};

// --- Reusable UI Components ---

const MomentumLogo = ({ className = '' }) => (
  // Using inline style for fill as a workaround. For a pure Tailwind approach,
  // you would need to extend the 'fill' theme property in tailwind.config.js.
  <svg
    width="40"
    height="40"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <title>Momentum Logo</title>
    <rect
      style={{ fill: '#bb86fc' }}
      x="15"
      y="55"
      width="20"
      height="35"
      rx="4"
    ></rect>
    <rect
      style={{ fill: '#bb86fc' }}
      x="40"
      y="35"
      width="20"
      height="55"
      rx="4"
    ></rect>
    <rect
      style={{ fill: '#bb86fc' }}
      x="65"
      y="15"
      width="20"
      height="75"
      rx="4"
    ></rect>
  </svg>
);

const Card = ({ title, description, children, className }) => (
  <section className={`bg-surface rounded-xl p-6 sm:p-8 ${className}`}>
    <h2 className="text-2xl font-bold mb-2 text-primary-text">{title}</h2>
    {description && (
      <p className="text-sm mb-6 text-secondary-text">{description}</p>
    )}
    {children}
  </section>
);

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-bg-color z-[9999]">
    <div className="w-10 h-10 border-4 border-border-default rounded-full border-t-accent animate-spin"></div>
  </div>
);

// --- Feature Components ---

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message || signInError.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen text-center">
      <div className="bg-surface p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[90%] max-w-[380px]">
        <div className="flex justify-center items-center gap-2 mb-2">
          <MomentumLogo />
          <h1 className="text-accent text-3xl font-bold">Momentum</h1>
        </div>
        <p className="text-secondary-text mb-6">
          Your journey to consistent effort starts here.
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-border-default bg-input-bg text-primary-text rounded-md text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-border-default bg-input-bg text-primary-text rounded-md text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 border-none rounded-md font-medium text-base cursor-pointer transition-colors bg-accent text-bg-color hover:bg-button-hover min-h-[44px] flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-[3px] border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              "Let's Go"
            )}
          </button>
        </form>
        {error && <p className="text-error text-sm mt-2 h-4">{error}</p>}
      </div>
    </div>
  );
};

const Header = () => {
  const handleLogout = () => supabase.auth.signOut();
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <MomentumLogo />
        <h1 className="text-accent text-3xl font-bold">Momentum</h1>
      </div>
      <button
        onClick={handleLogout}
        className="border border-border-default px-4 py-2 rounded-md cursor-pointer transition-colors text-secondary-text hover:bg-input-bg flex items-center gap-2"
      >
        <Lock size={16} /> Lock
      </button>
    </header>
  );
};

const DailyTracker = () => {
  const { userData, saveData } = useAppContext();

  const addUnit = (catId) => {
    const todayStr = getTodayDateString();
    const newLog = JSON.parse(JSON.stringify(userData.log || {}));
    if (!newLog[todayStr]) newLog[todayStr] = {};
    newLog[todayStr][catId] = (newLog[todayStr][catId] || 0) + 1;
    saveData({ ...userData, log: newLog });
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

  return (
    <Card
      title="Alright, what's the mission for today?"
      description="Add a block of pure, uninterrupted focus."
    >
      <div className="flex flex-wrap gap-3 mb-6">
        {(userData?.settings?.categories || []).map((cat) => (
          <button
            key={cat.id}
            onClick={() => addUnit(cat.id)}
            style={{
              backgroundColor: cat.color,
              color: getTextColorForBg(cat.color),
            }}
            className="border-none px-5 py-3 rounded-md text-sm font-medium cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
          >
            + {cat.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 min-h-[40px] mt-6">
        {todayLogEntries.map((entry) => (
          <div
            key={entry.key}
            onClick={() => removeUnit(entry.id)}
            title={`Click to remove one unit of "${entry.label}"`}
            style={{ backgroundColor: entry.color }}
            className="group relative w-[38px] h-[38px] rounded-md cursor-pointer transition-transform hover:scale-110 inline-flex justify-center items-center font-bold shadow-lg animate-pop-in"
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
          </div>
        ))}
      </div>
    </Card>
  );
};

const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className="w-6 h-6 rounded-full border-2 border-[#555] cursor-pointer transition-colors hover:border-primary-text"
        style={{ backgroundColor: selectedColor }}
        onClick={() => setIsOpen(!isOpen)}
      ></div>
      {isOpen && (
        <div className="absolute top-[120%] left-1/2 -translate-x-1/2 bg-input-bg p-2.5 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.4)] z-10 w-max">
          {Object.entries(COLOR_PALETTE).map(([name, colors]) => (
            <div key={name}>
              <p className="text-xs text-secondary-text mb-1 text-left">
                {name}
              </p>
              <div className="grid grid-cols-7 gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="w-[22px] h-[22px] rounded-full cursor-pointer transition-transform hover:scale-110 hover:ring-2 hover:ring-white"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onColorChange(color);
                      setIsOpen(false);
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryManager = () => {
  const { userData, saveData } = useAppContext();
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(COLOR_PALETTE.Vibrant[0]);
  const categories = userData?.settings?.categories || [];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newLabel.trim()) {
      const newCategory = {
        id: `custom_${Date.now()}`,
        label: newLabel.trim(),
        color: newColor,
      };
      const newCategories = [...categories, newCategory];
      saveData({
        ...userData,
        settings: { ...userData.settings, categories: newCategories },
      });
      setNewLabel('');
      setNewColor(COLOR_PALETTE.Vibrant[0]);
    }
  };

  const handleUpdateCategory = (id, field, value) => {
    const newCategories = categories.map((cat) =>
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const newCategories = categories.filter((cat) => cat.id !== id);
      saveData({
        ...userData,
        settings: { ...userData.settings, categories: newCategories },
      });
    }
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('draggedIndex', index);
    e.currentTarget.classList.add('opacity-50');
  };

  const onDragEnd = (e) => e.currentTarget.classList.remove('opacity-50');

  const onDrop = (e, dropIndex) => {
    const draggedIndex = e.dataTransfer.getData('draggedIndex');
    const newCategories = [...categories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };

  return (
    <Card
      title="Your Focus Areas"
      description="Drag 'em, drop 'em, change their colors. This is your command center."
    >
      <div
        className="flex flex-col gap-2 mb-6"
        onDragOver={(e) => e.preventDefault()}
      >
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDrop={(e) => onDrop(e, index)}
            className="flex items-center gap-3 p-2 rounded-lg bg-[#2a2a2a] transition-opacity"
          >
            <GripVertical
              size={20}
              className="cursor-grab active:cursor-grabbing text-secondary-text"
            />
            <ColorPicker
              selectedColor={cat.color}
              onColorChange={(color) =>
                handleUpdateCategory(cat.id, 'color', color)
              }
            />
            <input
              type="text"
              value={cat.label}
              onChange={(e) =>
                handleUpdateCategory(cat.id, 'label', e.target.value)
              }
              className="flex-grow p-2 border rounded text-base bg-input-bg border-input-border text-primary-text"
            />
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="bg-[#333] text-secondary-text rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors hover:bg-error hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleAddCategory}
        className="flex items-center gap-3 mt-6 p-2 border border-dashed border-border-default rounded-lg"
      >
        <ColorPicker selectedColor={newColor} onColorChange={setNewColor} />
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add a new focus area..."
          required
          className="flex-grow bg-transparent border-none text-base focus:outline-none p-1 text-primary-text"
        />
        <button
          type="submit"
          className="px-4 py-2 font-medium rounded-md transition-colors bg-accent text-bg-color hover:bg-button-hover"
        >
          Add
        </button>
      </form>
    </Card>
  );
};

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

const History = () => {
  const { userData } = useAppContext();
  const [openEntry, setOpenEntry] = useState(null);

  const { categoryMap, sortedDates } = React.useMemo(() => {
    const catMap = new Map(
      (userData?.settings?.categories || []).map((cat) => [cat.id, cat])
    );
    const dates = Object.keys(userData?.log || {})
      .filter((date) => date !== getTodayDateString())
      .sort((a, b) => new Date(b) - new Date(a));
    return { categoryMap: catMap, sortedDates: dates };
  }, [userData]);

  return (
    <Card
      title="The Logbook"
      description="A record of your past victories. Click any day to see the details."
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

          return (
            <div
              key={date}
              className="border-b border-input-bg last:border-b-0 py-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => setOpenEntry(isOpen ? null : date)}
              >
                <span className="font-medium group-hover:text-accent transition-colors">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-secondary-text">{dailyTotal} units</span>
              </div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-96 mt-4' : 'max-h-0'
                }`}
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
                          {category.label}: <strong>{count}</strong> units
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-8">
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 items-start">
        <div className="lg:sticky lg:top-8 flex flex-col gap-8">
          <DailyTracker />
          <CategoryManager />
        </div>
        <div className="flex flex-col gap-8">
          <FocusSession />
          <StatsOverview />
          <History />
        </div>
      </main>
    </div>
  );
};

// --- Root App Component ---
// This is the main component that orchestrates the entire application.
export default function App() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (user) => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    } else if (data && data.data) {
      const settings = {
        ...DEFAULT_USER_DATA.settings,
        ...(data.data.settings || {}),
      };
      const log = data.data.log || DEFAULT_USER_DATA.log;
      setUserData({ settings, log });
    } else {
      const defaultData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
      setUserData(defaultData);
      await supabase
        .from('profiles')
        .upsert({ id: user.id, data: defaultData });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const saveData = useCallback(
    async (newUserData) => {
      if (session?.user && newUserData) {
        setUserData(newUserData);
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: session.user.id, data: newUserData });
        if (error) {
          console.error('Error saving data:', error);
        }
      }
    },
    [session]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AppContext.Provider value={{ userData, saveData, session }}>
      <div className="min-h-screen bg-bg-color text-primary-text font-sans">
        {!session ? <LoginScreen /> : <Dashboard />}
      </div>
    </AppContext.Provider>
  );
}
