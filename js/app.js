/**
 * Productivity Dashboard - Main Application
 * A standalone web application for managing time and tasks
 */

// Local Storage Service
class LocalStorageService {
  static TASKS_KEY = 'productivity-dashboard-tasks';
  static LINKS_KEY = 'productivity-dashboard-links';

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
      </div>
    `;

    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    const greetingText = this.container.querySelector('.greeting-text');
    const currentTime = this.container.querySelector('.current-time');
    const currentDate = this.container.querySelector('.current-date');

    if (greetingText) greetingText.textContent = this.getGreeting(now.getHours());
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
      return 'Good Morning';
    } else if (hour >= 12 && hour <= 16) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour <= 20) {
      return 'Good Evening';
    } else {
      return 'Good Night';
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
    this.remainingSeconds = 1500; // 25 minutes
    this.isRunning = false;
    this.intervalId = null;
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="focus-timer">
        <div class="timer-display">25:00</div>
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

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stop());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
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
    this.remainingSeconds = 1500;
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
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
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
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
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
  }

  init() {
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

  destroy() {
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components = [];
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