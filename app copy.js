document.addEventListener('DOMContentLoaded', () => {
  // =================================================================
  // Firebase Configuration
  // =================================================================
  const firebaseConfig = {
    apiKey: 'AIzaSyCb-tEfuqrG-u6ZOxidOwrZxltY9gVpRfM',
    authDomain: 'momentum-tracker-app.firebaseapp.com',
    projectId: 'momentum-tracker-app',
    storageBucket: 'momentum-tracker-app.firebasestorage.app',
    messagingSenderId: '1097773148217',
    appId: '1:1097773148217:web:7fc7864f505ddf55d505e8',
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // =================================================================
  // Default Data for New Users (Categories are now an array)
  // =================================================================
  const DEFAULT_USER_DATA = {
    settings: {
      // Data structure changed from object to array to preserve order
      categories: [
        { id: 'work', label: 'Work (Smartory)', color: '#4a90e2' },
        { id: 'study', label: 'University', color: '#50e3c2' },
        { id: 'side-project', label: 'Side Project', color: '#f5a623' },
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

  // --- STATE MANAGEMENT ---
  let currentUser = null;
  let currentUserData = null;

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

  // --- DATA HANDLING ---
  const saveData = async () => {
    if (currentUser && currentUserData) {
      const userRef = db.collection('users').doc(currentUser.uid);
      try {
        await userRef.set(currentUserData);
      } catch (error) {
        console.error('Error saving data: ', error);
      }
    }
  };

  // --- RENDER FUNCTIONS (Heavily updated) ---
  const renderAll = () => {
    if (!currentUserData) return;
    renderStats();
    renderCategories();
    renderUnitControls();
    renderDailyLog();
    renderHistory();
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
      item.innerHTML = `
                <div class="count" style="color: ${category.color};">${total}</div>
                <div class="label">${category.label}</div>
            `;
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
      item.innerHTML = `
                <span class="drag-handle">::</span>
                <input type="color" value="${cat.color}" data-id="${cat.id}">
                <input type="text" value="${cat.label}" data-id="${cat.id}">
                <button class="delete-cat-btn" data-id="${cat.id}">🗑️</button>
            `;
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
    document.getElementById('current-date').textContent =
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
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
          unitBlock.innerHTML = `
                        <span class="initial-letter" style="color: ${getTextColorForBg(
                          categoryInfo.color
                        )};">${categoryInfo.label
            .charAt(0)
            .toUpperCase()}</span>
                        <span class="delete-icon">&times;</span>
                    `;
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
          detailsHtml += `
                        <div class="detail-item">
                            <div class="detail-color-dot" style="background-color: ${category.color};"></div>
                            ${category.label}: <strong>${count}</strong> units
                        </div>
                    `;
        }
      }

      historyEntry.innerHTML = `
                <div class="history-summary">
                    <span class="history-date">${date}</span>
                    <span class="history-total">${dailyTotal} units</span>
                </div>
                <div class="history-details">${detailsHtml}</div>
            `;

      historyEntry
        .querySelector('.history-summary')
        .addEventListener('click', (e) => {
          e.currentTarget.nextElementSibling.classList.toggle('visible');
        });

      historyLogContainer.appendChild(historyEntry);
    }
  };

  // --- ACTION FUNCTIONS ---
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

  // --- EVENT HANDLERS ---
  addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newLabelInput = document.getElementById('new-category-label');
    const newColorInput = document.getElementById('new-category-color');
    const newLabel = newLabelInput.value.trim();
    if (newLabel) {
      const newCategory = {
        id: `custom_${Date.now()}`,
        label: newLabel,
        color: newColorInput.value,
      };
      if (!currentUserData.settings.categories)
        currentUserData.settings.categories = [];
      currentUserData.settings.categories.push(newCategory);
      newLabelInput.value = '';
      renderAll();
      await saveData();
    }
  });

  categoryListContainer.addEventListener('change', async (e) => {
    if (e.target.matches('input')) {
      const id = e.target.dataset.id;
      const property = e.target.type === 'text' ? 'label' : 'color';
      const category = currentUserData.settings.categories.find(
        (cat) => cat.id === id
      );
      if (category) {
        category[property] = e.target.value;
        renderAll();
        await saveData();
      }
    }
  });

  categoryListContainer.addEventListener('click', async (e) => {
    if (e.target.matches('.delete-cat-btn')) {
      const id = e.target.dataset.id;
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
    }
  });

  // --- Drag and Drop Logic ---
  let draggedItem = null;

  categoryListContainer.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('category-item')) {
      draggedItem = e.target;
      setTimeout(() => {
        e.target.classList.add('dragging');
      }, 0);
    }
  });

  categoryListContainer.addEventListener('dragend', async (e) => {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
      draggedItem = null;

      const newOrderedIds = [
        ...categoryListContainer.querySelectorAll('.category-item'),
      ].map((item) => item.dataset.id);
      currentUserData.settings.categories.sort(
        (a, b) => newOrderedIds.indexOf(a.id) - newOrderedIds.indexOf(b.id)
      );

      await saveData();
      renderAll();
    }
  });

  categoryListContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(categoryListContainer, e.clientY);
    if (draggedItem) {
      if (afterElement == null) {
        categoryListContainer.appendChild(draggedItem);
      } else {
        categoryListContainer.insertBefore(draggedItem, afterElement);
      }
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll('.category-item:not(.dragging)'),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  const handleExport = () => {
    /* Remains the same */
  };
  const handleImport = async (event) => {
    /* Remains the same */
  };

  exportButton.addEventListener('click', handleExport);
  importFile.addEventListener('change', handleImport);

  // --- AUTHENTICATION LOGIC ---
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      const userRef = db.collection('users').doc(user.uid);
      const doc = await userRef.get();

      if (doc.exists) {
        currentUserData = doc.data();
        if (!Array.isArray(currentUserData.settings.categories)) {
          currentUserData.settings.categories = Object.entries(
            currentUserData.settings.categories || {}
          ).map(([id, value]) => ({ id, ...value }));
        }
      } else {
        currentUserData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
        await userRef.set(currentUserData);
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

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';

    auth.signInWithEmailAndPassword(email, password).catch((signInError) => {
      if (
        signInError.code === 'auth/user-not-found' ||
        signInError.code === 'auth/invalid-login-credentials' ||
        signInError.code === 'auth/wrong-password'
      ) {
        auth
          .createUserWithEmailAndPassword(email, password)
          .catch((signUpError) => {
            errorEl.textContent =
              'Incorrect password or this email is already in use.';
          });
      } else {
        errorEl.textContent = signInError.message;
      }
    });
  });

  logoutButton.addEventListener('click', () => {
    auth.signOut();
  });
});
