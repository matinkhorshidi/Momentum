document.addEventListener('DOMContentLoaded', () => {
  // --- AUTHENTICATION & DATA MODEL ---
  const DEFAULT_USER_DATA = {
    settings: {
      categories: {
        work: { label: 'Work', color: '#4a90e2' },
        study: { label: 'University', color: '#50e3c2' },
        'side-project': { label: 'Side Project', color: '#f5a623' },
      },
    },
    log: {},
  };

  // --- DOM ELEMENTS ---
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-button');
  const exportButton = document.getElementById('export-button');
  const importFile = document.getElementById('import-file');
  const categoryListContainer = document.getElementById('category-list');
  const addCategoryForm = document.getElementById('add-category-form');

  // --- STATE MANAGEMENT ---
  let currentUserEmail = null;
  let allUsersData = {};
  let currentUserData = {}; // A reference to the current user's data object

  // --- UTILITY FUNCTIONS ---
  const getTodayDateString = () => new Date().toISOString().slice(0, 10);

  const getTextColorForBg = (hexColor) => {
    if (!hexColor || hexColor.length < 7) return '#FFFFFF'; // Default to white for invalid colors
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  };

  const loadAllUsersData = () => {
    const savedData = localStorage.getItem('momentumUsers');
    allUsersData = savedData ? JSON.parse(savedData) : {};
  };

  const saveAllUsersData = () => {
    localStorage.setItem('momentumUsers', JSON.stringify(allUsersData));
  };

  const loadCurrentUser = () => {
    currentUserEmail = sessionStorage.getItem('momentumCurrentUser');
    if (currentUserEmail && allUsersData[currentUserEmail]) {
      currentUserData = allUsersData[currentUserEmail];
      return true;
    }
    return false;
  };

  // --- RENDER FUNCTIONS ---
  const renderAll = () => {
    if (!currentUserData) return;
    renderTotalStats();
    renderCategories();
    renderUnitControls();
    renderDailyLog();
    renderHistory();
  };

  const renderTotalStats = () => {
    const totalUnits = Object.values(currentUserData.log || {}).reduce(
      (total, dailyData) => {
        return (
          total +
          Object.values(dailyData).reduce((sum, count) => sum + count, 0)
        );
      },
      0
    );
    document.getElementById('total-units').textContent = totalUnits;
  };

  const renderCategories = () => {
    categoryListContainer.innerHTML = '';
    for (const [key, cat] of Object.entries(
      currentUserData.settings.categories
    )) {
      const item = document.createElement('div');
      item.className = 'category-item';
      item.innerHTML = `
                <input type="color" value="${cat.color}" data-key="${key}">
                <input type="text" value="${cat.label}" data-key="${key}">
                <button class="delete-cat-btn" data-key="${key}">🗑️</button>
            `;
      categoryListContainer.appendChild(item);
    }
  };

  const renderUnitControls = () => {
    const controlsContainer = document.getElementById('add-unit-controls');
    controlsContainer.innerHTML = '';
    for (const [key, value] of Object.entries(
      currentUserData.settings.categories
    )) {
      const button = document.createElement('button');
      button.className = 'control-button';
      button.style.backgroundColor = value.color;
      button.style.color = getTextColorForBg(value.color);
      button.textContent = `+ ${value.label}`;
      button.onclick = () => addUnit(key);
      controlsContainer.appendChild(button);
    }
  };

  const renderDailyLog = () => {
    const todayStr = getTodayDateString();
    document.getElementById('current-date').textContent =
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    const todayLogContainer = document.getElementById('today-log');
    todayLogContainer.innerHTML = '';

    if (currentUserData.log && currentUserData.log[todayStr]) {
      for (const [categoryKey, count] of Object.entries(
        currentUserData.log[todayStr]
      )) {
        const categoryInfo = currentUserData.settings.categories[categoryKey];
        if (!categoryInfo) continue;

        for (let i = 0; i < count; i++) {
          const unitBlock = document.createElement('div');
          unitBlock.className = 'unit-block';
          unitBlock.style.backgroundColor = categoryInfo.color;
          unitBlock.title = `Click to remove one unit of "${categoryInfo.label}"`;

          unitBlock.innerHTML = `
                        <span class="initial-letter" style="color: ${getTextColorForBg(
                          categoryInfo.color
                        )};">${categoryInfo.label
            .charAt(0)
            .toUpperCase()}</span>
                        <span class="delete-icon">&times;</span>
                    `;

          unitBlock.onclick = () => removeUnit(categoryKey);
          todayLogContainer.appendChild(unitBlock);
        }
      }
    }
  };

  const renderHistory = () => {
    const historyLogContainer = document.getElementById('history-log');
    historyLogContainer.innerHTML = '';
    const todayStr = getTodayDateString();
    const sortedDates = Object.keys(currentUserData.log || {})
      .sort()
      .reverse();

    for (const date of sortedDates) {
      if (date === todayStr) continue;
      const dailyTotal = Object.values(currentUserData.log[date]).reduce(
        (sum, count) => sum + count,
        0
      );
      if (dailyTotal === 0) continue;

      const historyEntry = document.createElement('div');
      historyEntry.className = 'history-entry';
      historyEntry.innerHTML = `<span class="history-date">${date}</span><span class="history-total">${dailyTotal} units</span>`;
      historyLogContainer.appendChild(historyEntry);
    }
  };

  // --- ACTION FUNCTIONS ---
  const addUnit = (categoryKey) => {
    const todayStr = getTodayDateString();
    if (!currentUserData.log[todayStr]) currentUserData.log[todayStr] = {};
    currentUserData.log[todayStr][categoryKey] =
      (currentUserData.log[todayStr][categoryKey] || 0) + 1;
    saveAllUsersData();
    renderAll();
  };

  const removeUnit = (categoryKey) => {
    const todayStr = getTodayDateString();
    if (
      currentUserData.log[todayStr] &&
      currentUserData.log[todayStr][categoryKey]
    ) {
      currentUserData.log[todayStr][categoryKey]--;
      if (currentUserData.log[todayStr][categoryKey] <= 0) {
        delete currentUserData.log[todayStr][categoryKey];
      }
      saveAllUsersData();
      renderAll();
    }
  };

  // --- EVENT HANDLERS ---
  addCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newLabelInput = document.getElementById('new-category-label');
    const newColorInput = document.getElementById('new-category-color');
    const newLabel = newLabelInput.value.trim();
    if (newLabel) {
      const newKey = `custom_${Date.now()}`;
      currentUserData.settings.categories[newKey] = {
        label: newLabel,
        color: newColorInput.value,
      };
      newLabelInput.value = '';
      saveAllUsersData();
      renderAll();
    }
  });

  categoryListContainer.addEventListener('change', (e) => {
    if (e.target.matches('input')) {
      const key = e.target.dataset.key;
      const property = e.target.type === 'text' ? 'label' : 'color';
      currentUserData.settings.categories[key][property] = e.target.value;
      saveAllUsersData();
      renderAll();
    }
  });

  categoryListContainer.addEventListener('click', (e) => {
    if (e.target.matches('.delete-cat-btn')) {
      const key = e.target.dataset.key;
      const categoryLabel = currentUserData.settings.categories[key]?.label;
      if (
        confirm(
          `Are you sure you want to delete the category "${categoryLabel}"? This cannot be undone.`
        )
      ) {
        delete currentUserData.settings.categories[key];
        saveAllUsersData();
        renderAll();
      }
    }
  });

  const handleExport = () => {
    if (!currentUserData.log || Object.keys(currentUserData.log).length === 0) {
      alert('No data to export.');
      return;
    }
    const dataStr = JSON.stringify(currentUserData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `momentum-backup-${currentUserEmail}-${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (
          confirm(
            'Are you sure you want to overwrite your current data with the imported file?'
          )
        ) {
          allUsersData[currentUserEmail] = importedData;
          currentUserData = importedData;
          saveAllUsersData();
          renderAll();
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Invalid file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  // --- APP INITIALIZATION & LOGIN ---
  const initApp = () => {
    loginScreen.style.display = 'none';
    appContainer.style.display = 'block';
    renderAll();
  };

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');

    // Login
    if (allUsersData[email]) {
      if (allUsersData[email].password === password) {
        sessionStorage.setItem('momentumCurrentUser', email);
        currentUserData = allUsersData[email];
        initApp();
      } else {
        errorEl.textContent = 'Incorrect password.';
      }
    }
    // Sign Up
    else {
      allUsersData[email] = {
        password: password,
        ...JSON.parse(JSON.stringify(DEFAULT_USER_DATA)), // Deep copy
      };
      sessionStorage.setItem('momentumCurrentUser', email);
      currentUserData = allUsersData[email];
      saveAllUsersData();
      initApp();
    }
  });

  logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('momentumCurrentUser');
    location.reload();
  });

  exportButton.addEventListener('click', handleExport);
  importFile.addEventListener('change', handleImport);

  // --- Initial Load ---
  loadAllUsersData();
  if (loadCurrentUser()) {
    initApp();
  } else {
    loginScreen.style.display = 'flex';
  }
});
