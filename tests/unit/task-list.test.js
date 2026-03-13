/**
 * Unit tests for TaskList component
 */

const { TaskList, LocalStorageService } = require('../../js/app.js');

describe('TaskList Component', () => {
  let container;
  let taskList;

  beforeEach(() => {
    // Create a container element
    container = document.createElement('div');
    document.body.appendChild(container);

    // Clear localStorage before each test
    localStorage.clear();

    // Create TaskList instance
    taskList = new TaskList(container);
  });

  afterEach(() => {
    // Clean up
    if (taskList) {
      taskList.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    localStorage.clear();
  });

  describe('Task 6.1: Core Structure', () => {
    test('constructor initializes with empty tasks array', () => {
      expect(taskList.tasks).toEqual([]);
      expect(taskList.container).toBe(container);
    });

    test('generateId creates unique IDs', () => {
      const id1 = taskList.generateId();
      const id2 = taskList.generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    test('loadTasks retrieves tasks from Local Storage', () => {
      const testTasks = [
        { id: '1', text: 'Test task 1', completed: false, createdAt: Date.now() },
        { id: '2', text: 'Test task 2', completed: true, createdAt: Date.now() }
      ];

      LocalStorageService.set(LocalStorageService.TASKS_KEY, testTasks);
      taskList.loadTasks();

      expect(taskList.tasks).toEqual(testTasks);
    });

    test('loadTasks handles empty Local Storage', () => {
      taskList.loadTasks();
      expect(taskList.tasks).toEqual([]);
    });

    test('saveTasks persists tasks to Local Storage', () => {
      const testTasks = [
        { id: '1', text: 'Test task', completed: false, createdAt: Date.now() }
      ];

      taskList.tasks = testTasks;
      taskList.saveTasks();

      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored).toEqual(testTasks);
    });

    test('init creates DOM structure', () => {
      taskList.init();

      expect(container.querySelector('.task-list')).toBeTruthy();
      expect(container.querySelector('.task-input')).toBeTruthy();
      expect(container.querySelector('.btn-add-task')).toBeTruthy();
      expect(container.querySelector('.tasks')).toBeTruthy();
    });

    test('render updates DOM with current tasks', () => {
      taskList.init();
      taskList.tasks = [
        { id: '1', text: 'Test task 1', completed: false, createdAt: Date.now() },
        { id: '2', text: 'Test task 2', completed: true, createdAt: Date.now() }
      ];
      taskList.render();

      const taskItems = container.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(2);
      expect(taskItems[0].querySelector('.task-text').textContent).toBe('Test task 1');
      expect(taskItems[1].querySelector('.task-text').textContent).toBe('Test task 2');
    });
  });

  describe('Task 6.2: Task Creation', () => {
    beforeEach(() => {
      taskList.init();
    });

    test('addTask creates a new task with valid text', () => {
      const taskText = 'New test task';
      taskList.addTask(taskText);

      expect(taskList.tasks.length).toBe(1);
      expect(taskList.tasks[0].text).toBe(taskText);
      expect(taskList.tasks[0].completed).toBe(false);
      expect(taskList.tasks[0].id).toBeTruthy();
      expect(taskList.tasks[0].createdAt).toBeTruthy();
    });

    test('addTask trims whitespace from input', () => {
      taskList.addTask('  Task with spaces  ');

      expect(taskList.tasks.length).toBe(1);
      expect(taskList.tasks[0].text).toBe('Task with spaces');
    });

    test('addTask rejects empty string', () => {
      taskList.addTask('');
      expect(taskList.tasks.length).toBe(0);
    });

    test('addTask rejects whitespace-only string', () => {
      taskList.addTask('   ');
      expect(taskList.tasks.length).toBe(0);
    });

    test('addTask clears input field after creation', () => {
      const input = container.querySelector('.task-input');
      input.value = 'Test task';
      
      taskList.handleAddTask();

      expect(input.value).toBe('');
    });

    test('addTask calls saveTasks after creation', () => {
      const saveSpy = jest.spyOn(taskList, 'saveTasks');
      
      taskList.addTask('Test task');

      expect(saveSpy).toHaveBeenCalled();
    });

    test('addTask calls render after creation', () => {
      const renderSpy = jest.spyOn(taskList, 'render');
      
      taskList.addTask('Test task');

      expect(renderSpy).toHaveBeenCalled();
    });

    test('handleAddTask adds task when input has text', () => {
      const input = container.querySelector('.task-input');
      input.value = 'Test task';
      
      taskList.handleAddTask();

      expect(taskList.tasks.length).toBe(1);
      expect(taskList.tasks[0].text).toBe('Test task');
    });

    test('handleAddTask does nothing when input is empty', () => {
      const input = container.querySelector('.task-input');
      input.value = '';
      
      taskList.handleAddTask();

      expect(taskList.tasks.length).toBe(0);
    });

    test('add button click triggers task creation', () => {
      const input = container.querySelector('.task-input');
      const addButton = container.querySelector('.btn-add-task');
      
      input.value = 'Test task';
      addButton.click();

      expect(taskList.tasks.length).toBe(1);
      expect(taskList.tasks[0].text).toBe('Test task');
    });

    test('Enter key in input field triggers task creation', () => {
      const input = container.querySelector('.task-input');
      
      input.value = 'Test task';
      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      input.dispatchEvent(event);

      expect(taskList.tasks.length).toBe(1);
      expect(taskList.tasks[0].text).toBe('Test task');
    });

    test('task persists to Local Storage after creation', () => {
      taskList.addTask('Test task');

      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored.length).toBe(1);
      expect(stored[0].text).toBe('Test task');
    });

    test('render displays newly created task', () => {
      taskList.addTask('Test task');

      const taskItems = container.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(1);
      expect(taskItems[0].querySelector('.task-text').textContent).toBe('Test task');
    });
  });

  describe('Requirement Validation', () => {
    beforeEach(() => {
      taskList.init();
    });

    test('Requirement 4.1: Provides input field for task text', () => {
      const input = container.querySelector('.task-input');
      expect(input).toBeTruthy();
      expect(input.tagName).toBe('INPUT');
      expect(input.type).toBe('text');
    });

    test('Requirement 4.2: Creates task with non-empty text', () => {
      taskList.addTask('Valid task');
      expect(taskList.tasks.length).toBe(1);
      expect(taskList.tasks[0].text).toBe('Valid task');
    });

    test('Requirement 4.3: Does not create task with empty text', () => {
      taskList.addTask('');
      taskList.addTask('   ');
      expect(taskList.tasks.length).toBe(0);
    });

    test('Requirement 4.4: Clears input field after creation', () => {
      const input = container.querySelector('.task-input');
      input.value = 'Test task';
      taskList.handleAddTask();
      expect(input.value).toBe('');
    });

    test('Requirement 4.5: Displays task in list after creation', () => {
      taskList.addTask('Test task');
      const taskItems = container.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(1);
    });

    test('Requirement 4.6: Saves tasks to Local Storage after creation', () => {
      taskList.addTask('Test task');
      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored.length).toBe(1);
    });

    test('Requirement 8.1: Retrieves saved tasks from Local Storage on load', () => {
      const testTasks = [
        { id: '1', text: 'Saved task', completed: false, createdAt: Date.now() }
      ];
      LocalStorageService.set(LocalStorageService.TASKS_KEY, testTasks);
      
      taskList.loadTasks();
      expect(taskList.tasks).toEqual(testTasks);
    });

    test('Requirement 8.2: Displays retrieved tasks', () => {
      const testTasks = [
        { id: '1', text: 'Saved task', completed: false, createdAt: Date.now() }
      ];
      taskList.tasks = testTasks;
      taskList.render();
      
      const taskItems = container.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(1);
      expect(taskItems[0].querySelector('.task-text').textContent).toBe('Saved task');
    });

    test('Requirement 8.3: Displays empty list when no saved tasks', () => {
      taskList.loadTasks();
      taskList.render();
      
      const taskItems = container.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(0);
    });
  });
});
