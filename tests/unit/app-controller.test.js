/**
 * Unit tests for App Controller
 * Tests app initialization and component coordination
 */

const { App, GreetingDisplay, FocusTimer, TaskList, QuickLinksManager } = require('../../js/app.js');

describe('App Controller', () => {
  let container;

  beforeEach(() => {
    // Create DOM structure
    container = document.createElement('div');
    container.innerHTML = `
      <div id="greeting-display"></div>
      <div id="focus-timer"></div>
      <div id="task-list"></div>
      <div id="quick-links-manager"></div>
    `;
    document.body.appendChild(container);

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    localStorage.clear();
  });

  describe('Constructor', () => {
    test('initializes with empty components array', () => {
      const app = new App();
      expect(app.components).toEqual([]);
    });
  });

  describe('Initialization', () => {
    test('initializes all components when containers exist', () => {
      const app = new App();
      app.init();

      // Verify all 4 components are initialized
      expect(app.components).toHaveLength(4);
    });

    test('initializes GreetingDisplay component', () => {
      const app = new App();
      app.init();

      const greetingComponent = app.components.find(c => c instanceof GreetingDisplay);
      expect(greetingComponent).toBeDefined();
    });

    test('initializes FocusTimer component', () => {
      const app = new App();
      app.init();

      const timerComponent = app.components.find(c => c instanceof FocusTimer);
      expect(timerComponent).toBeDefined();
    });

    test('initializes TaskList component', () => {
      const app = new App();
      app.init();

      const taskListComponent = app.components.find(c => c instanceof TaskList);
      expect(taskListComponent).toBeDefined();
    });

    test('initializes QuickLinksManager component', () => {
      const app = new App();
      app.init();

      const quickLinksComponent = app.components.find(c => c instanceof QuickLinksManager);
      expect(quickLinksComponent).toBeDefined();
    });

    test('handles missing greeting container gracefully', () => {
      document.getElementById('greeting-display').remove();
      
      const app = new App();
      expect(() => app.init()).not.toThrow();
      expect(app.components).toHaveLength(3);
    });

    test('handles missing timer container gracefully', () => {
      document.getElementById('focus-timer').remove();
      
      const app = new App();
      expect(() => app.init()).not.toThrow();
      expect(app.components).toHaveLength(3);
    });

    test('handles missing task list container gracefully', () => {
      document.getElementById('task-list').remove();
      
      const app = new App();
      expect(() => app.init()).not.toThrow();
      expect(app.components).toHaveLength(3);
    });

    test('handles missing quick links container gracefully', () => {
      document.getElementById('quick-links-manager').remove();
      
      const app = new App();
      expect(() => app.init()).not.toThrow();
      expect(app.components).toHaveLength(3);
    });

    test('handles all missing containers gracefully', () => {
      document.getElementById('greeting-display').remove();
      document.getElementById('focus-timer').remove();
      document.getElementById('task-list').remove();
      document.getElementById('quick-links-manager').remove();
      
      const app = new App();
      expect(() => app.init()).not.toThrow();
      expect(app.components).toHaveLength(0);
    });
  });

  describe('Component Integration', () => {
    test('components load data from Local Storage on init', () => {
      // Pre-populate localStorage with test data
      localStorage.setItem('productivity-dashboard-tasks', JSON.stringify([
        { id: '1', text: 'Test task', completed: false, createdAt: Date.now() }
      ]));
      localStorage.setItem('productivity-dashboard-links', JSON.stringify([
        { id: '1', name: 'Test', url: 'https://test.com', createdAt: Date.now() }
      ]));

      const app = new App();
      app.init();

      // Verify data was loaded (components should have initialized with stored data)
      const taskListComponent = app.components.find(c => c instanceof TaskList);
      const quickLinksComponent = app.components.find(c => c instanceof QuickLinksManager);

      expect(taskListComponent.tasks).toHaveLength(1);
      expect(quickLinksComponent.links).toHaveLength(1);
    });

    test('components render initial state after init', () => {
      const app = new App();
      app.init();

      // Verify greeting display is rendered
      const greetingContainer = document.getElementById('greeting-display');
      expect(greetingContainer.querySelector('.greeting-text')).toBeTruthy();
      expect(greetingContainer.querySelector('.current-time')).toBeTruthy();
      expect(greetingContainer.querySelector('.current-date')).toBeTruthy();

      // Verify timer is rendered
      const timerContainer = document.getElementById('focus-timer');
      expect(timerContainer.querySelector('.timer-display')).toBeTruthy();
      expect(timerContainer.querySelector('.timer-controls')).toBeTruthy();

      // Verify task list is rendered
      const taskListContainer = document.getElementById('task-list');
      expect(taskListContainer.querySelector('.task-input-container')).toBeTruthy();
      expect(taskListContainer.querySelector('.tasks')).toBeTruthy();

      // Verify quick links is rendered
      const quickLinksContainer = document.getElementById('quick-links-manager');
      expect(quickLinksContainer.querySelector('.link-input-container')).toBeTruthy();
      expect(quickLinksContainer.querySelector('.links')).toBeTruthy();
    });
  });
});
