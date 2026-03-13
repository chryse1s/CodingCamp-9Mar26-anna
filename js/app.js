/**
 * Productivity Dashboard - Main Application
 * A standalone web application for managing time and tasks
 */

// Local Storage Service
class LocalStorageService {
  static TASKS_KEY = 'productivity-dashboard-tasks';
  static LINKS_KEY = 'productivity-dashboard-links';
  static THEME_KEY = 'dashboard-theme';
  static USER_NAME_KEY = 'dashboard-user-name';
  static TIMER_DURATION_KEY = 'dashboard-timer-duration';

  static get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Failed to parse stored data:', error);
      localStorage.removeItem(key);
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Local Storage error:', error);
      // Could show user-friendly error message here
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Local Storage error:', error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Local Storage error:', error);
    }
  }

  // Theme preference methods
  static getThemePreference() {
    try {
      const theme = localStorage.getItem(this.THEME_KEY);
      return theme === 'dark' ? 'dark' : 'light'; // Default to light if invalid or missing
    } catch (error) {
      console.error('Failed to get theme preference:', error);
      return 'light'; // Fallback to default
    }
  }

  static setThemePreference(theme) {
    try {
      if (theme === 'light' || theme === 'dark') {
        localStorage.setItem(this.THEME_KEY, theme);
      } else {
        console.warn('Invalid theme preference:', theme);
      }
    } catch (error) {
      console.error('Failed to set theme preference:', error);
    }
  }

  // User name methods
  static getUserName() {
    try {
      const name = localStorage.getItem(this.USER_NAME_KEY);
      return name ? name.trim() : null; // Return null if empty or missing
    } catch (error) {
      console.error('Failed to get user name:', error);
      return null; // Fallback to default
    }
  }

  static setUserName(name) {
    try {
      if (name && typeof name === 'string' && name.trim().length > 0) {
        localStorage.setItem(this.USER_NAME_KEY, name.trim());
      } else {
        console.warn('Invalid user name:', name);
      }
    } catch (error) {
      console.error('Failed to set user name:', error);
    }
  }

  // Timer duration methods
  static getTimerDuration() {
    try {
      const duration = localStorage.getItem(this.TIMER_DURATION_KEY);
      const parsedDuration = duration ? parseInt(duration, 10) : null;
      // Validate duration is one of the allowed options
      if (parsedDuration === 25 || parsedDuration === 30 || parsedDuration === 45) {
        return parsedDuration;
      }
      return 25; // Default to 25 minutes if invalid or missing
    } catch (error) {
      console.error('Failed to get timer duration:', error);
      return 25; // Fallback to default
    }
  }

  static setTimerDuration(minutes) {
    try {
      // Validate duration is one of the allowed options
      if (minutes === 25 || minutes === 30 || minutes === 45) {
        localStorage.setItem(this.TIMER_DURATION_KEY, minutes.toString());
      } else {
        console.warn('Invalid timer duration:', minutes);
      }
    } catch (error) {
      console.error('Failed to set timer duration:', error);
    }
  }
}

// Theme Manager Component
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.initializeTheme();
  }

  /**
   * Get the current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Set a specific theme
   * @param {string} theme - Theme to set ('light' or 'dark')
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(`Invalid theme: ${theme}. Defaulting to light.`);
      theme = 'light';
    }

    this.currentTheme = theme;
    this.applyTheme(theme);
    LocalStorageService.setThemePreference(theme);
    
    // Emit theme change event
    document.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme: theme } 
    }));
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Initialize theme from localStorage or default to light
   */
  initializeTheme() {
    const savedTheme = LocalStorageService.getThemePreference();
    this.setTheme(savedTheme);
  }

  /**
   * Apply theme by adding/removing CSS classes on document body
   * @param {string} theme - Theme to apply
   */
  applyTheme(theme) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    body.classList.add(`theme-${theme}`);
  }
}

// Greeting Display Component
class GreetingDisplay {
  constructor(container) {
    this.container = container;
    this.intervalId = null;
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="greeting-display">
        <div class="greeting-text"></div>
        <div class="current-time"></div>
        <div class="current-date"></div>
        <button class="change-name-btn" title="Change your name" style="display: none;">✏️</button>
      </div>
    `;

    // Check if user needs to provide name on first visit
    if (!this.getUserName()) {
      this.promptForName();
    }

    // Setup change name button
    const changeNameBtn = this.container.querySelector('.change-name-btn');
    if (changeNameBtn) {
      changeNameBtn.addEventListener('click', () => this.promptForName());
    }

    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  getUserName() {
    return LocalStorageService.getUserName();
  }

  setUserName(name) {
    if (name && typeof name === 'string' && name.trim().length > 0) {
      LocalStorageService.setUserName(name.trim());
      this.updateTime(); // Refresh greeting display
      return true;
    }
    return false;
  }

  promptForName() {
    // Create and show name input dialog
    const dialog = document.createElement('div');
    dialog.className = 'name-input-dialog';
    const isFirstTime = !this.getUserName();
    const currentName = this.getUserName() || '';
    
    dialog.innerHTML = `
      <div class="dialog-overlay">
        <div class="dialog-content">
          <h3>${isFirstTime ? 'Welcome to Your Productivity Dashboard!' : 'Change Your Name'}</h3>
          <p>${isFirstTime ? 'What would you like to be called?' : 'Enter your new name:'}</p>
          <div class="input-group">
            <input type="text" id="name-input" placeholder="Enter your name" maxlength="50" value="${currentName}" />
            <div class="error-message" id="name-error"></div>
          </div>
          <div class="dialog-buttons">
            <button id="save-name-btn" class="btn-primary">Save</button>
            ${isFirstTime ? '<button id="skip-name-btn" class="btn-secondary">Skip</button>' : '<button id="cancel-name-btn" class="btn-secondary">Cancel</button>'}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    const nameInput = dialog.querySelector('#name-input');
    const saveBtn = dialog.querySelector('#save-name-btn');
    const skipBtn = dialog.querySelector('#skip-name-btn');
    const cancelBtn = dialog.querySelector('#cancel-name-btn');
    const errorMsg = dialog.querySelector('#name-error');

    // Focus on input and select existing text if any
    nameInput.focus();
    if (currentName) {
      nameInput.select();
    }

    // Handle save button click
    const handleSave = () => {
      const name = nameInput.value.trim();
      if (name.length === 0) {
        errorMsg.textContent = isFirstTime ? 'Please enter a name or click Skip' : 'Please enter a name or click Cancel';
        errorMsg.style.display = 'block';
        return;
      }

      if (this.setUserName(name)) {
        document.body.removeChild(dialog);
      } else {
        errorMsg.textContent = 'Please enter a valid name';
        errorMsg.style.display = 'block';
      }
    };

    // Handle skip/cancel button click
    const handleSkipOrCancel = () => {
      document.body.removeChild(dialog);
    };

    // Event listeners
    saveBtn.addEventListener('click', handleSave);
    if (skipBtn) skipBtn.addEventListener('click', handleSkipOrCancel);
    if (cancelBtn) cancelBtn.addEventListener('click', handleSkipOrCancel);

    // Handle Enter key
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSave();
      }
    });

    // Handle Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escapeHandler);
        handleSkipOrCancel();
      }
    });
  }

  updateTime() {
    const now = new Date();
    const greetingText = this.container.querySelector('.greeting-text');
    const currentTime = this.container.querySelector('.current-time');
    const currentDate = this.container.querySelector('.current-date');
    const changeNameBtn = this.container.querySelector('.change-name-btn');

    if (greetingText) {
      const userName = this.getUserName();
      const baseGreeting = this.getGreeting(now.getHours());
      greetingText.textContent = userName ? `${baseGreeting}, ${userName}` : baseGreeting;
      
      // Show/hide change name button based on whether name exists
      if (changeNameBtn) {
        changeNameBtn.style.display = userName ? 'inline-block' : 'none';
      }
    }
    if (currentTime) currentTime.textContent = this.formatTime(now);
    if (currentDate) currentDate.textContent = this.formatDate(now);
  }

  formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr} ${ampm}`;
  }

  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNumber = date.getDate();

    return `${dayName}, ${monthName} ${dayNumber}`;
  }

  getGreeting(hour) {
    if (hour >= 5 && hour <= 11) {
      return '🌻 Good Morning';
    } else if (hour >= 12 && hour <= 16) {
      return '🌷 Good Afternoon';
    } else if (hour >= 17 && hour <= 20) {
      return '🌼 Good Evening';
    } else {
      return '🌙 Good Night';
    }
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}


// Focus Timer Component
class FocusTimer {
  constructor(container) {
    this.container = container;
    this.duration = LocalStorageService.getTimerDuration(); // Get saved duration or default to 25
    this.remainingSeconds = this.duration * 60; // Convert minutes to seconds
    this.isRunning = false;
    this.intervalId = null;
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="focus-timer">
        <div class="timer-display">${this.formatTime(this.remainingSeconds)}</div>
        <div class="duration-selector">
          <label for="duration-select">Duration:</label>
          <select id="duration-select" class="duration-select" aria-label="Select timer duration">
            <option value="25" ${this.duration === 25 ? 'selected' : ''}>25 minutes</option>
            <option value="30" ${this.duration === 30 ? 'selected' : ''}>30 minutes</option>
            <option value="45" ${this.duration === 45 ? 'selected' : ''}>45 minutes</option>
          </select>
        </div>
        <div class="timer-controls">
          <button class="btn-start">Start</button>
          <button class="btn-stop">Stop</button>
          <button class="btn-reset">Reset</button>
        </div>
      </div>
    `;

    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const startBtn = this.container.querySelector('.btn-start');
    const stopBtn = this.container.querySelector('.btn-stop');
    const resetBtn = this.container.querySelector('.btn-reset');
    const durationSelect = this.container.querySelector('.duration-select');

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stop());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    if (durationSelect) durationSelect.addEventListener('change', (e) => this.setDuration(parseInt(e.target.value)));
  }

  getDuration() {
    return this.duration;
  }

  setDuration(minutes) {
    // Validate duration is one of the allowed options
    if (minutes === 25 || minutes === 30 || minutes === 45) {
      this.duration = minutes;
      LocalStorageService.setTimerDuration(minutes);

      // If timer is not running, update the remaining seconds to new duration
      if (!this.isRunning) {
        this.remainingSeconds = this.duration * 60;
        this.render();
      }

      // Update the dropdown selection
      const durationSelect = this.container.querySelector('.duration-select');
      if (durationSelect) {
        durationSelect.value = minutes.toString();
      }
    }
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.duration * 60; // Reset to currently selected duration
    this.render();
  }

  tick() {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      this.render();
    }

    if (this.remainingSeconds === 0) {
      this.stop();
    }
  }

  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  render() {
    const display = this.container.querySelector('.timer-display');
    if (display) {
      display.textContent = this.formatTime(this.remainingSeconds);
    }
  }

  destroy() {
    this.stop();
  }
}


// Task List Component
class TaskList {
  constructor(container) {
    this.container = container;
    this.tasks = [];
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="task-list">
        <div class="task-input-container">
          <input type="text" class="task-input" placeholder="Add a new task...">
          <button class="btn-add-task">Add</button>
        </div>
        <ul class="tasks">
        </ul>
      </div>
    `;

    this.setupEventListeners();
    this.loadTasks();
    this.render();
  }

  setupEventListeners() {
    const addBtn = this.container.querySelector('.btn-add-task');
    const input = this.container.querySelector('.task-input');

    if (addBtn) addBtn.addEventListener('click', () => this.handleAddTask());
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleAddTask();
      });
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11);
  }

  loadTasks() {
    const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
    this.tasks = Array.isArray(stored) ? stored : [];
  }

  saveTasks() {
    LocalStorageService.set(LocalStorageService.TASKS_KEY, this.tasks);
  }

  handleAddTask() {
    const input = this.container.querySelector('.task-input');
    if (input) {
      const text = input.value.trim();
      if (text) {
        this.addTask(text);
        input.value = '';
      }
    }
  }

  addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const task = {
      id: this.generateId(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now()
    };

    this.tasks.push(task);
    this.saveTasks();
    this.render();
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
    }
  }

  editTask(taskId, newText) {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.text = trimmedText;
      this.saveTasks();
      this.render();
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    this.render();
  }

  render() {
    const tasksList = this.container.querySelector('.tasks');
    if (!tasksList) return;

    tasksList.innerHTML = '';

    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.taskId = task.id;

      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
        <button class="btn-edit-task">Edit</button>
        <button class="btn-delete-task">Delete</button>
      `;

      // Add event listeners
      const checkbox = li.querySelector('.task-checkbox');
      const editBtn = li.querySelector('.btn-edit-task');
      const deleteBtn = li.querySelector('.btn-delete-task');

      if (checkbox) {
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
      }
      if (editBtn) {
        editBtn.addEventListener('click', () => this.handleEditTask(task.id));
      }
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
      }

      tasksList.appendChild(li);
    });
  }

  handleEditTask(taskId) {
    const taskItem = this.container.querySelector(`[data-task-id="${taskId}"]`);
    const taskText = taskItem.querySelector('.task-text');
    const currentText = taskText.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'task-edit-input';

    const handleSave = () => {
      const newText = input.value.trim();
      if (newText) {
        this.editTask(taskId, newText);
      } else {
        taskText.textContent = currentText;
        taskItem.replaceChild(taskText, input);
      }
    };

    const handleCancel = () => {
      taskItem.replaceChild(taskText, input);
    };

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') handleCancel();
    });

    input.addEventListener('blur', handleSave);

    taskItem.replaceChild(input, taskText);
    input.focus();
    input.select();
  }

  destroy() {
    // Clean up any event listeners if needed
  }
}

// Quick Links Manager Component
class QuickLinksManager {
  constructor(container) {
    this.container = container;
    this.links = [];
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="quick-links-manager">
        <div class="link-input-container">
          <input type="text" class="link-name-input" placeholder="Link name">
          <input type="url" class="link-url-input" placeholder="https://example.com">
          <button class="btn-add-link">Add Link</button>
        </div>
        <div class="links">
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.loadLinks();
    this.render();
  }

  setupEventListeners() {
    const addBtn = this.container.querySelector('.btn-add-link');
    const nameInput = this.container.querySelector('.link-name-input');
    const urlInput = this.container.querySelector('.link-url-input');

    if (addBtn) addBtn.addEventListener('click', () => this.handleAddLink());
    if (nameInput) {
      nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleAddLink();
      });
    }
    if (urlInput) {
      urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleAddLink();
      });
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11);
  }

  loadLinks() {
    const stored = LocalStorageService.get(LocalStorageService.LINKS_KEY);
    this.links = Array.isArray(stored) ? stored : [];
  }

  saveLinks() {
    LocalStorageService.set(LocalStorageService.LINKS_KEY, this.links);
  }

  validateUrl(url) {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  handleAddLink() {
    const nameInput = this.container.querySelector('.link-name-input');
    const urlInput = this.container.querySelector('.link-url-input');

    if (nameInput && urlInput) {
      const name = nameInput.value.trim();
      const url = urlInput.value.trim();

      if (name && url && this.validateUrl(url)) {
        this.addLink(name, url);
        nameInput.value = '';
        urlInput.value = '';
      }
    }
  }

  addLink(name, url) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl || !this.validateUrl(trimmedUrl)) {
      return;
    }

    const link = {
      id: this.generateId(),
      name: trimmedName,
      url: trimmedUrl,
      createdAt: Date.now()
    };

    this.links.push(link);
    this.saveLinks();
    this.render();
  }

  deleteLink(linkId) {
    this.links = this.links.filter(l => l.id !== linkId);
    this.saveLinks();
    this.render();
  }

  render() {
    const linksContainer = this.container.querySelector('.links');
    if (!linksContainer) return;

    linksContainer.innerHTML = '';

    this.links.forEach(link => {
      const div = document.createElement('div');
      div.className = 'link-item';
      div.dataset.linkId = link.id;

      div.innerHTML = `
        <a href="${link.url}" target="_blank" class="link-button">${link.name}</a>
        <button class="btn-delete-link">Delete</button>
      `;

      // Add event listener for delete button
      const deleteBtn = div.querySelector('.btn-delete-link');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteLink(link.id));
      }

      linksContainer.appendChild(div);
    });
  }

  destroy() {
    // Clean up any event listeners if needed
  }
}

// App Controller
class App {
  constructor() {
    this.components = [];
    this.themeManager = null;
  }

  init() {
    // Initialize ThemeManager first
    this.themeManager = new ThemeManager();
    
    // Setup theme toggle button
    this.setupThemeToggle();
    
    // Initialize all components
    const greetingContainer = document.getElementById('greeting-display');
    const timerContainer = document.getElementById('focus-timer');
    const taskListContainer = document.getElementById('task-list');
    const quickLinksContainer = document.getElementById('quick-links-manager');

    if (greetingContainer) {
      const greeting = new GreetingDisplay(greetingContainer);
      greeting.init();
      this.components.push(greeting);
    }

    if (timerContainer) {
      const timer = new FocusTimer(timerContainer);
      timer.init();
      this.components.push(timer);
    }

    if (taskListContainer) {
      const taskList = new TaskList(taskListContainer);
      taskList.init();
      this.components.push(taskList);
    }

    if (quickLinksContainer) {
      const quickLinks = new QuickLinksManager(quickLinksContainer);
      quickLinks.init();
      this.components.push(quickLinks);
    }
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      // Set initial icon based on current theme
      this.updateThemeIcon();
      
      // Add click event listener
      themeToggle.addEventListener('click', () => {
        this.themeManager.toggleTheme();
      });
      
      // Listen for theme changes to update icon
      document.addEventListener('theme-changed', () => {
        this.updateThemeIcon();
      });
    }
  }

  updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    if (themeIcon) {
      const currentTheme = this.themeManager.getCurrentTheme();
      // Show moon for light theme (click to go dark), sun for dark theme (click to go light)
      themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', 
        currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
      );
    }
  }

  destroy() {
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components = [];
    this.themeManager = null;
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Export for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    App,
    GreetingDisplay,
    FocusTimer,
    TaskList,
    QuickLinksManager,
    LocalStorageService
  };
}

// Export for ES6 modules (if supported)
if (typeof window !== 'undefined') {
  window.ProductivityDashboard = {
    App,
    GreetingDisplay,
    FocusTimer,
    TaskList,
    QuickLinksManager,
    LocalStorageService
  };
}