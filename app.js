document.addEventListener('DOMContentLoaded', () => {
  // =================================================================
  // Supabase Configuration
  // =================================================================
  const SUPABASE_URL = 'https://mkusvmrjvvsnmamnoxfl.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdXN2bXJqdnZzbm1hbW5veGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODQzODMsImV4cCI6MjA2NTI2MDM4M30.1PIV03KBMIcLVG0oSIoggE6TjVSesTVhJ70IZB60Rpo'; // <<<< جایگزین شود

  const { createClient } = supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // =================================================================
  // Constants and Default Data
  // =================================================================
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
        { id: 'work', label: 'Work (Smartory)', color: '#3b82f6' },
        { id: 'study', label: 'University', color: '#22c55e' },
        { id: 'side-project', label: 'Side Project', color: '#f97316' },
      ],
    },
    log: {},
  };

  // --- DOM ELEMENTS ---
  const loadingOverlay = document.getElementById('loading-overlay');
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-button');
  const exportButton = document.getElementById('export-button');
  const importFile = document.getElementById('import-file');
  const categoryListContainer = document.getElementById('category-list');
  const addCategoryForm = document.getElementById('add-category-form');
  const newCategoryColorPickerPlaceholder = document.getElementById(
    'new-category-color-picker-placeholder'
  );
  const timerDisplay = document.getElementById('timer-time');
  const timerProgressRing = document.getElementById('timer-progress-ring');
  const startPauseBtn = document.getElementById('timer-start-pause-btn');
  const resetBtn = document.getElementById('timer-reset-btn');
  const durationInput = document.getElementById('timer-duration-input');

  // --- STATE MANAGEMENT ---
  let currentUser = null;
  let currentUserData = null;
  let newCategoryColor = COLOR_PALETTE.Vibrant[0];
  let animationFrameId = null;
  let isTimerRunning = false;
  let timeRemainingInSeconds =
    (DEFAULT_USER_DATA.settings.focusDuration || 45) * 60;
  let totalDurationInSeconds =
    (DEFAULT_USER_DATA.settings.focusDuration || 45) * 60;
  let timerEndTime = 0;
  let audioContext;

  // --- UTILITY FUNCTIONS ---
  const getTodayDateString = () => new Date().toISOString().slice(0, 10);
  const getTextColorForBg = (hexColor) => {
    if (!hexColor || hexColor.length < 7) return '#FFFFFF';
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  };

  // --- DATA HANDLING (Supabase) ---
  const saveData = async () => {
    if (currentUser && currentUserData) {
      const { error } = await db
        .from('profiles')
        .update({ data: currentUserData })
        .eq('id', currentUser.id);
      if (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  // --- RENDER FUNCTIONS (unchanged) ---
  const renderAll = () => {
    if (!currentUserData) return;
    renderStats();
    renderCategories();
    renderUnitControls();
    renderDailyLog();
    renderHistory();
    initializeAddFormColorPicker();
    initializeTimer();
  };

  const createColorPickerHTML = (selectedColor) => {
    let paletteHTML = '';
    for (const [groupName, colors] of Object.entries(COLOR_PALETTE)) {
      paletteHTML += `<div class="palette-group"><div class="palette-group-title">${groupName}</div>`;
      paletteHTML += colors
        .map(
          (color) =>
            `<div class="color-option" data-color="${color}" style="background-color: ${color};"></div>`
        )
        .join('');
      paletteHTML += `</div>`;
    }
    return `<div class="custom-color-picker"><div class="current-color-swatch" style="background-color: ${selectedColor};"></div><div class="color-palette">${paletteHTML}</div></div>`;
  };

  const initializeAddFormColorPicker = () => {
    newCategoryColorPickerPlaceholder.innerHTML =
      createColorPickerHTML(newCategoryColor);
  };

  const renderStats = () => {
    const log = currentUserData.log || {};
    const categories = currentUserData.settings?.categories || [];
    const cumulativeTotals = {};
    let overallTotal = 0;
    for (const dailyData of Object.values(log)) {
      for (const [catId, count] of Object.entries(dailyData)) {
        cumulativeTotals[catId] = (cumulativeTotals[catId] || 0) + count;
        overallTotal += count;
      }
    }
    document.getElementById('total-units').textContent = overallTotal;
    const cumulativeContainer = document.getElementById(
      'cumulative-stats-container'
    );
    cumulativeContainer.innerHTML = '';
    categories.forEach((category) => {
      const total = cumulativeTotals[category.id] || 0;
      const item = document.createElement('div');
      item.className = 'cumulative-stat-item';
      item.innerHTML = `<div class="count">${total}</div><div class="label">${category.label}</div>`;
      cumulativeContainer.appendChild(item);
    });
  };

  const renderCategories = () => {
    categoryListContainer.innerHTML = '';
    const categories = currentUserData.settings?.categories || [];
    categories.forEach((cat) => {
      const item = document.createElement('div');
      item.className = 'category-item';
      item.draggable = true;
      item.dataset.id = cat.id;
      item.innerHTML = `<span class="drag-handle">::</span><div class="custom-color-picker-container">${createColorPickerHTML(
        cat.color
      )}</div><input type="text" value="${cat.label}" data-id="${
        cat.id
      }"><button class="delete-cat-btn" data-id="${cat.id}">&times;</button>`;
      categoryListContainer.appendChild(item);
    });
  };

  const renderUnitControls = () => {
    const controlsContainer = document.getElementById('add-unit-controls');
    controlsContainer.innerHTML = '';
    const categories = currentUserData.settings?.categories || [];
    categories.forEach((category) => {
      const button = document.createElement('button');
      button.className = 'control-button';
      button.style.backgroundColor = category.color;
      button.style.color = getTextColorForBg(category.color);
      button.textContent = `+ ${category.label}`;
      button.onclick = () => addUnit(category.id);
      controlsContainer.appendChild(button);
    });
  };

  const renderDailyLog = () => {
    const todayStr = getTodayDateString();
    const todayLogContainer = document.getElementById('today-log');
    todayLogContainer.innerHTML = '';
    if (currentUserData.log && currentUserData.log[todayStr]) {
      const categoryMap = new Map(
        (currentUserData.settings.categories || []).map((cat) => [cat.id, cat])
      );
      for (const [catId, count] of Object.entries(
        currentUserData.log[todayStr]
      )) {
        const categoryInfo = categoryMap.get(catId);
        if (!categoryInfo) continue;
        for (let i = 0; i < count; i++) {
          const unitBlock = document.createElement('div');
          unitBlock.className = 'unit-block';
          unitBlock.style.backgroundColor = categoryInfo.color;
          unitBlock.title = `Click to remove one unit of "${categoryInfo.label}"`;
          unitBlock.innerHTML = `<span class="initial-letter" style="color: ${getTextColorForBg(
            categoryInfo.color
          )};">${categoryInfo.label
            .charAt(0)
            .toUpperCase()}</span><span class="delete-icon">&times;</span>`;
          unitBlock.onclick = () => removeUnit(catId);
          todayLogContainer.appendChild(unitBlock);
        }
      }
    }
  };

  const renderHistory = () => {
    const historyLogContainer = document.getElementById('history-log');
    historyLogContainer.innerHTML = '';
    const todayStr = getTodayDateString();
    const log = currentUserData.log || {};
    const categoryMap = new Map(
      (currentUserData.settings.categories || []).map((cat) => [cat.id, cat])
    );
    const sortedDates = Object.keys(log).sort().reverse();
    for (const date of sortedDates) {
      if (date === todayStr) continue;
      const dailyData = log[date];
      const dailyTotal = Object.values(dailyData).reduce(
        (sum, count) => sum + count,
        0
      );
      if (dailyTotal === 0) continue;
      const historyEntry = document.createElement('div');
      historyEntry.className = 'history-entry';
      let detailsHtml = '';
      for (const [catId, count] of Object.entries(dailyData)) {
        const category = categoryMap.get(catId);
        if (category) {
          detailsHtml += `<div class="detail-item"><div class="detail-color-dot" style="background-color: ${category.color};"></div>${category.label}: <strong>${count}</strong> units</div>`;
        }
      }
      historyEntry.innerHTML = `<div class="history-summary"><span class="history-date">${date}</span><span class="history-total">${dailyTotal} units</span></div><div class="history-details">${detailsHtml}</div>`;
      historyEntry
        .querySelector('.history-summary')
        .addEventListener('click', (e) => {
          e.currentTarget.nextElementSibling.classList.toggle('visible');
        });
      historyLogContainer.appendChild(historyEntry);
    }
  };

  // --- FOCUS TIMER FUNCTIONS (unchanged) ---
  const initializeTimer = () => {
    const savedDuration = currentUserData.settings.focusDuration || 45;
    durationInput.value = savedDuration;
    totalDurationInSeconds = savedDuration * 60;
    timeRemainingInSeconds = totalDurationInSeconds;
    updateTimerDisplay();
  };

  const updateTimerDisplay = () => {
    const minutes = Math.floor(timeRemainingInSeconds / 60);
    const seconds = Math.floor(timeRemainingInSeconds % 60);
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
    const progress =
      (totalDurationInSeconds - timeRemainingInSeconds) /
      totalDurationInSeconds;
    const angle = progress * 360;
    timerProgressRing.style.background = `conic-gradient(var(--accent-color) ${angle}deg, transparent ${angle}deg)`;
  };

  const playAlarm = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 1
    );
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  const startTimer = () => {
    if (isTimerRunning) return;
    isTimerRunning = true;
    startPauseBtn.textContent = 'Pause';
    timerEndTime = Date.now() + timeRemainingInSeconds * 1000;
    function timerLoop() {
      const now = Date.now();
      timeRemainingInSeconds = Math.max(0, (timerEndTime - now) / 1000);
      updateTimerDisplay();
      if (timeRemainingInSeconds > 0) {
        animationFrameId = requestAnimationFrame(timerLoop);
      } else {
        isTimerRunning = false;
        startPauseBtn.textContent = 'Start';
        playAlarm();
        resetTimer();
      }
    }
    animationFrameId = requestAnimationFrame(timerLoop);
  };

  const pauseTimer = () => {
    if (!isTimerRunning) return;
    isTimerRunning = false;
    startPauseBtn.textContent = 'Start';
    cancelAnimationFrame(animationFrameId);
  };

  const resetTimer = () => {
    cancelAnimationFrame(animationFrameId);
    isTimerRunning = false;
    startPauseBtn.textContent = 'Start';
    timeRemainingInSeconds = totalDurationInSeconds;
    updateTimerDisplay();
  };

  // --- ACTION FUNCTIONS (unchanged) ---
  const addUnit = async (catId) => {
    const todayStr = getTodayDateString();
    if (!currentUserData.log) currentUserData.log = {};
    if (!currentUserData.log[todayStr]) currentUserData.log[todayStr] = {};
    currentUserData.log[todayStr][catId] =
      (currentUserData.log[todayStr][catId] || 0) + 1;
    renderAll();
    await saveData();
  };

  const removeUnit = async (catId) => {
    const todayStr = getTodayDateString();
    if (
      currentUserData.log &&
      currentUserData.log[todayStr] &&
      currentUserData.log[todayStr][catId]
    ) {
      currentUserData.log[todayStr][catId]--;
      if (currentUserData.log[todayStr][catId] <= 0) {
        delete currentUserData.log[todayStr][catId];
      }
      renderAll();
      await saveData();
    }
  };

  // --- EVENT HANDLERS (unchanged, minor async changes) ---
  addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newLabelInput = document.getElementById('new-category-label');
    const newLabel = newLabelInput.value.trim();
    if (newLabel) {
      const newCategory = {
        id: `custom_${Date.now()}`,
        label: newLabel,
        color: newCategoryColor,
      };
      if (!currentUserData.settings.categories)
        currentUserData.settings.categories = [];
      currentUserData.settings.categories.push(newCategory);
      newLabelInput.value = '';
      newCategoryColor = COLOR_PALETTE.Vibrant[0];
      renderAll();
      await saveData();
    }
  });

  document.body.addEventListener('click', async (e) => {
    const target = e.target;
    const swatch = target.closest('.current-color-swatch');
    if (swatch) {
      const palette = swatch.nextElementSibling;
      const isVisible = palette.classList.contains('visible');
      document
        .querySelectorAll('.color-palette.visible')
        .forEach((p) => p.classList.remove('visible'));
      if (!isVisible) palette.classList.add('visible');
      return;
    }
    if (!target.closest('.custom-color-picker')) {
      document
        .querySelectorAll('.color-palette.visible')
        .forEach((p) => p.classList.remove('visible'));
    }
    const option = target.closest('.color-option');
    if (option) {
      const selectedColor = option.dataset.color;
      const pickerContainer = option.closest('.custom-color-picker-container');
      if (pickerContainer.id === 'new-category-color-picker-placeholder') {
        newCategoryColor = selectedColor;
        pickerContainer.querySelector(
          '.current-color-swatch'
        ).style.backgroundColor = selectedColor;
      } else {
        const categoryItem = option.closest('.category-item');
        const id = categoryItem.dataset.id;
        const category = currentUserData.settings.categories.find(
          (cat) => cat.id === id
        );
        if (category) {
          category.color = selectedColor;
          categoryItem.querySelector(
            '.current-color-swatch'
          ).style.backgroundColor = selectedColor;
          renderUnitControls();
          await saveData();
        }
      }
      option.closest('.color-palette').classList.remove('visible');
      return;
    }
    if (target.matches('.delete-cat-btn')) {
      const id = target.dataset.id;
      const category = currentUserData.settings.categories.find(
        (cat) => cat.id === id
      );
      if (
        category &&
        confirm(
          `Are you sure you want to delete the category "${category.label}"?`
        )
      ) {
        currentUserData.settings.categories =
          currentUserData.settings.categories.filter((cat) => cat.id !== id);
        renderAll();
        await saveData();
      }
      return;
    }
  });

  startPauseBtn.addEventListener('click', () => {
    isTimerRunning ? pauseTimer() : startTimer();
  });
  resetBtn.addEventListener('click', resetTimer);
  durationInput.addEventListener('change', async () => {
    const newDuration = parseInt(durationInput.value, 10);
    if (newDuration > 0) {
      currentUserData.settings.focusDuration = newDuration;
      totalDurationInSeconds = newDuration * 60;
      if (!isTimerRunning) resetTimer();
      await saveData();
    }
  });

  let draggedItem = null;
  categoryListContainer.addEventListener('dragstart', (e) => {
    /* ... unchanged ... */
  });
  categoryListContainer.addEventListener('dragend', async (e) => {
    /* ... unchanged ... */
  });
  categoryListContainer.addEventListener('dragover', (e) => {
    /* ... unchanged ... */
  });
  function getDragAfterElement(container, y) {
    /* ... unchanged ... */
  }
  const handleExport = () => {
    /* ... unchanged ... */
  };
  const handleImport = async (event) => {
    /* ... unchanged ... */
  };
  exportButton.addEventListener('click', handleExport);
  importFile.addEventListener('change', handleImport);

  // --- AUTHENTICATION LOGIC (Supabase) ---
  db.auth.onAuthStateChange(async (event, session) => {
    if (session && session.user) {
      currentUser = session.user;
      const { data: profileData, error } = await db
        .from('profiles')
        .select('data')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = 'no rows found'
        console.error('Error fetching profile:', error);
      } else if (profileData && profileData.data) {
        currentUserData = profileData.data;
        if (!currentUserData.settings.focusDuration) {
          currentUserData.settings.focusDuration =
            DEFAULT_USER_DATA.settings.focusDuration;
        }
      } else {
        // New user, create a profile.
        currentUserData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
        const { error: insertError } = await db
          .from('profiles')
          .insert({ id: currentUser.id, data: currentUserData });
        if (insertError) console.error('Error creating profile:', insertError);
      }

      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        loginScreen.style.display = 'none';
        appContainer.style.display = 'block';
      }, 300);
      renderAll();
    } else {
      currentUser = null;
      currentUserData = null;
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        loginScreen.style.display = 'flex';
        appContainer.style.display = 'none';
      }, 300);
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const loginButton = loginForm.querySelector('button');

    const startLoading = () => {
      errorEl.textContent = '';
      loginButton.disabled = true;
      loginButton.innerHTML = '<div class="button-spinner"></div>';
      loginButton.classList.add('loading');
    };

    const stopLoading = (errorMessage) => {
      loginButton.disabled = false;
      loginButton.innerHTML = "Let's Go";
      loginButton.classList.remove('loading');
      if (errorMessage) errorEl.textContent = errorMessage;
    };

    startLoading();

    // First, try to sign in
    const { error: signInError } = await db.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If sign-in fails, try to sign up (create a new account)
      if (signInError.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await db.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          stopLoading(signUpError.message);
        } else {
          // Sign up successful, onAuthStateChange will handle the rest
          stopLoading();
        }
      } else {
        stopLoading(signInError.message);
      }
    } else {
      // Sign in successful, onAuthStateChange will handle the rest
      stopLoading();
    }
  });

  logoutButton.addEventListener('click', () => {
    db.auth.signOut();
  });
});
