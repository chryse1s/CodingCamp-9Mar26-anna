/**
 * Unit tests for TaskList component - Task Operations (Task 7)
 */

const { TaskList, LocalStorageService } = require('../../js/app.js');

describe('TaskList Component - Task Operations', () => {
  let container;
  let taskList;

  beforeEach(() => {
    // Create a container element
    container = document.createElement('div');
    document.body.appendChild(container);

    // Clear localStorage before each test
    localStorage.clear();

    // Create and initialize TaskList instance
    taskList = new TaskList(container);
    taskList.init();
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

  describe('Task 7.1: Task Completion Toggle', () => {
    test('toggleTask flips completed status from false to true', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      
      expect(taskList.tasks[0].completed).toBe(false);
      
      taskList.toggleTask(taskId);
      
      expect(taskList.tasks[0].completed).toBe(true);
    });

    test('toggleTask flips completed status from true to false', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      taskList.tasks[0].completed = true;
      
      taskList.toggleTask(taskId);
      
      expect(taskList.tasks[0].completed).toBe(false);
    });

    test('toggleTask updates checkbox state in DOM', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      
      const checkbox = container.querySelector('.task-checkbox');
      expect(checkbox.checked).toBe(false);
      
      taskList.toggleTask(taskId);
      
      const updatedCheckbox = container.querySelector('.task-checkbox');
      expect(updatedCheckbox.checked).toBe(true);
    });

    test('toggleTask applies completed class to task text', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      
      let taskText = container.querySelector('.task-text');
      expect(taskText.classList.contains('completed')).toBe(false);
      
      taskList.toggleTask(taskId);
      
      taskText = container.querySelector('.task-text');
      expect(taskText.classList.contains('completed')).toBe(true);
    });

    test('toggleTask calls saveTasks', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      const saveSpy = jest.spyOn(taskList, 'saveTasks');
      
      taskList.toggleTask(taskId);
      
      expect(saveSpy).toHaveBeenCalled();
    });

    test('toggleTask calls render', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      const renderSpy = jest.spyOn(taskList, 'render');
      
      taskList.toggleTask(taskId);
      
      expect(renderSpy).toHaveBeenCalled();
    });

    test('checkbox click triggers toggleTask', () => {
      taskList.addTask('Test task');
      const checkbox = container.querySelector('.task-checkbox');
      
      expect(taskList.tasks[0].completed).toBe(false);
      
      checkbox.click();
      
      expect(taskList.tasks[0].completed).toBe(true);
    });

    test('toggleTask persists to Local Storage', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      
      taskList.toggleTask(taskId);
      
      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored[0].completed).toBe(true);
    });

    test('toggleTask handles non-existent task ID gracefully', () => {
      taskList.addTask('Test task');
      const originalLength = taskList.tasks.length;
      
      taskList.toggleTask('non-existent-id');
      
      expect(taskList.tasks.length).toBe(originalLength);
    });
  });

  describe('Task 7.2: Task Editing', () => {
    test('editTask updates task text with valid input', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, 'Updated text');
      
      expect(taskList.tasks[0].text).toBe('Updated text');
    });

    test('editTask trims whitespace from new text', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, '  Updated text  ');
      
      expect(taskList.tasks[0].text).toBe('Updated text');
    });

    test('editTask rejects empty string', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, '');
      
      expect(taskList.tasks[0].text).toBe('Original text');
    });

    test('editTask rejects whitespace-only string', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, '   ');
      
      expect(taskList.tasks[0].text).toBe('Original text');
    });

    test('editTask calls saveTasks after valid edit', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      const saveSpy = jest.spyOn(taskList, 'saveTasks');
      
      taskList.editTask(taskId, 'Updated text');
      
      expect(saveSpy).toHaveBeenCalled();
    });

    test('editTask calls render after valid edit', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      const renderSpy = jest.spyOn(taskList, 'render');
      
      taskList.editTask(taskId, 'Updated text');
      
      expect(renderSpy).toHaveBeenCalled();
    });

    test('editTask persists to Local Storage', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, 'Updated text');
      
      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored[0].text).toBe('Updated text');
    });

    test('editTask handles non-existent task ID gracefully', () => {
      taskList.addTask('Original text');
      
      taskList.editTask('non-existent-id', 'Updated text');
      
      expect(taskList.tasks[0].text).toBe('Original text');
    });

    test('edit button click triggers handleEditTask', () => {
      taskList.addTask('Test task');
      const editButton = container.querySelector('.btn-edit-task');
      
      editButton.click();
      
      // Should replace task text with input field
      const editInput = container.querySelector('.task-edit-input');
      expect(editInput).toBeTruthy();
      expect(editInput.value).toBe('Test task');
    });

    test('handleEditTask replaces text with input field', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      const taskItem = container.querySelector('.task-item');
      
      taskList.handleEditTask(taskId, taskItem);
      
      const editInput = container.querySelector('.task-edit-input');
      expect(editInput).toBeTruthy();
      expect(editInput.value).toBe('Test task');
    });

    test('handleEditTask focuses and selects input', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      const taskItem = container.querySelector('.task-item');
      
      taskList.handleEditTask(taskId, taskItem);
      
      const editInput = container.querySelector('.task-edit-input');
      expect(document.activeElement).toBe(editInput);
    });
  });

  describe('Task 7.3: Task Deletion', () => {
    test('deleteTask removes task from array', () => {
      taskList.addTask('Task to delete');
      const taskId = taskList.tasks[0].id;
      
      expect(taskList.tasks.length).toBe(1);
      
      taskList.deleteTask(taskId);
      
      expect(taskList.tasks.length).toBe(0);
    });

    test('deleteTask removes correct task from multiple tasks', () => {
      taskList.addTask('Task 1');
      taskList.addTask('Task 2');
      taskList.addTask('Task 3');
      const taskIdToDelete = taskList.tasks[1].id;
      
      taskList.deleteTask(taskIdToDelete);
      
      expect(taskList.tasks.length).toBe(2);
      expect(taskList.tasks[0].text).toBe('Task 1');
      expect(taskList.tasks[1].text).toBe('Task 3');
    });

    test('deleteTask updates DOM to hide removed task', () => {
      taskList.addTask('Task to delete');
      
      expect(container.querySelectorAll('.task-item').length).toBe(1);
      
      const taskId = taskList.tasks[0].id;
      taskList.deleteTask(taskId);
      
      expect(container.querySelectorAll('.task-item').length).toBe(0);
    });

    test('deleteTask calls saveTasks', () => {
      taskList.addTask('Task to delete');
      const taskId = taskList.tasks[0].id;
      const saveSpy = jest.spyOn(taskList, 'saveTasks');
      
      taskList.deleteTask(taskId);
      
      expect(saveSpy).toHaveBeenCalled();
    });

    test('deleteTask calls render', () => {
      taskList.addTask('Task to delete');
      const taskId = taskList.tasks[0].id;
      const renderSpy = jest.spyOn(taskList, 'render');
      
      taskList.deleteTask(taskId);
      
      expect(renderSpy).toHaveBeenCalled();
    });

    test('delete button click triggers deleteTask', () => {
      taskList.addTask('Task to delete');
      const deleteButton = container.querySelector('.btn-delete-task');
      
      expect(taskList.tasks.length).toBe(1);
      
      deleteButton.click();
      
      expect(taskList.tasks.length).toBe(0);
    });

    test('deleteTask persists to Local Storage', () => {
      taskList.addTask('Task to delete');
      const taskId = taskList.tasks[0].id;
      
      taskList.deleteTask(taskId);
      
      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored.length).toBe(0);
    });

    test('deleteTask handles non-existent task ID gracefully', () => {
      taskList.addTask('Test task');
      const originalLength = taskList.tasks.length;
      
      taskList.deleteTask('non-existent-id');
      
      expect(taskList.tasks.length).toBe(originalLength);
    });
  });

  describe('Requirement Validation', () => {
    test('Requirement 5.1: Displays completion indicator for each task', () => {
      taskList.addTask('Test task');
      
      const checkbox = container.querySelector('.task-checkbox');
      expect(checkbox).toBeTruthy();
      expect(checkbox.type).toBe('checkbox');
    });

    test('Requirement 5.2: Marks incomplete task as complete', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      
      expect(taskList.tasks[0].completed).toBe(false);
      taskList.toggleTask(taskId);
      expect(taskList.tasks[0].completed).toBe(true);
    });

    test('Requirement 5.3: Marks complete task as incomplete', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      taskList.tasks[0].completed = true;
      
      taskList.toggleTask(taskId);
      
      expect(taskList.tasks[0].completed).toBe(false);
    });

    test('Requirement 5.4: Updates visual display when completion status changes', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      
      taskList.toggleTask(taskId);
      
      const taskText = container.querySelector('.task-text');
      expect(taskText.classList.contains('completed')).toBe(true);
    });

    test('Requirement 5.5: Saves to Local Storage when completion status changes', () => {
      taskList.addTask('Test task');
      const taskId = taskList.tasks[0].id;
      
      taskList.toggleTask(taskId);
      
      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored[0].completed).toBe(true);
    });

    test('Requirement 6.1: Provides edit control for each task', () => {
      taskList.addTask('Test task');
      
      const editButton = container.querySelector('.btn-edit-task');
      expect(editButton).toBeTruthy();
      expect(editButton.textContent).toBe('Edit');
    });

    test('Requirement 6.2: Displays editable input field when edit control activated', () => {
      taskList.addTask('Test task');
      const editButton = container.querySelector('.btn-edit-task');
      
      editButton.click();
      
      const editInput = container.querySelector('.task-edit-input');
      expect(editInput).toBeTruthy();
      expect(editInput.value).toBe('Test task');
    });

    test('Requirement 6.3: Updates task with new text when submitted', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, 'Updated text');
      
      expect(taskList.tasks[0].text).toBe('Updated text');
    });

    test('Requirement 6.4: Does not update task with empty text', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, '');
      
      expect(taskList.tasks[0].text).toBe('Original text');
    });

    test('Requirement 6.5: Saves to Local Storage when task updated', () => {
      taskList.addTask('Original text');
      const taskId = taskList.tasks[0].id;
      
      taskList.editTask(taskId, 'Updated text');
      
      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored[0].text).toBe('Updated text');
    });

    test('Requirement 7.1: Provides delete control for each task', () => {
      taskList.addTask('Test task');
      
      const deleteButton = container.querySelector('.btn-delete-task');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.textContent).toBe('Delete');
    });

    test('Requirement 7.2: Removes task when delete control activated', () => {
      taskList.addTask('Task to delete');
      const taskId = taskList.tasks[0].id;
      
      taskList.deleteTask(taskId);
      
      expect(taskList.tasks.length).toBe(0);
    });

    test('Requirement 7.3: Updates display to hide removed task', () => {
      taskList.addTask('Task to delete');
      const taskId = taskList.tasks[0].id;
      
      taskList.deleteTask(taskId);
      
      const taskItems = container.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(0);
    });

    test('Requirement 7.4: Saves to Local Storage when task removed', () => {
      taskList.addTask('Task to delete');
      const taskId = taskList.tasks[0].id;
      
      taskList.deleteTask(taskId);
      
      const stored = LocalStorageService.get(LocalStorageService.TASKS_KEY);
      expect(stored.length).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    test('complete workflow: create, toggle, edit, delete', () => {
      // Create
      taskList.addTask('Initial task');
      expect(taskList.tasks.length).toBe(1);
      expect(taskList.tasks[0].text).toBe('Initial task');
      expect(taskList.tasks[0].completed).toBe(false);
      
      const taskId = taskList.tasks[0].id;
      
      // Toggle
      taskList.toggleTask(taskId);
      expect(taskList.tasks[0].completed).toBe(true);
      
      // Edit
      taskList.editTask(taskId, 'Updated task');
      expect(taskList.tasks[0].text).toBe('Updated task');
      
      // Delete
      taskList.deleteTask(taskId);
      expect(taskList.tasks.length).toBe(0);
    });

    test('multiple tasks can be operated independently', () => {
      taskList.addTask('Task 1');
      taskList.addTask('Task 2');
      taskList.addTask('Task 3');
      
      const task1Id = taskList.tasks[0].id;
      const task2Id = taskList.tasks[1].id;
      const task3Id = taskList.tasks[2].id;
      
      // Toggle task 2
      taskList.toggleTask(task2Id);
      expect(taskList.tasks[1].completed).toBe(true);
      expect(taskList.tasks[0].completed).toBe(false);
      expect(taskList.tasks[2].completed).toBe(false);
      
      // Edit task 1
      taskList.editTask(task1Id, 'Updated Task 1');
      expect(taskList.tasks[0].text).toBe('Updated Task 1');
      expect(taskList.tasks[1].text).toBe('Task 2');
      
      // Delete task 3
      taskList.deleteTask(task3Id);
      expect(taskList.tasks.length).toBe(2);
      expect(taskList.tasks[0].text).toBe('Updated Task 1');
      expect(taskList.tasks[1].text).toBe('Task 2');
    });

    test('all operations persist across page reload simulation', () => {
      // Create tasks
      taskList.addTask('Task 1');
      taskList.addTask('Task 2');
      
      // Toggle first task
      taskList.toggleTask(taskList.tasks[0].id);
      
      // Edit second task
      taskList.editTask(taskList.tasks[1].id, 'Updated Task 2');
      
      // Simulate page reload by creating new instance
      const newTaskList = new TaskList(container);
      newTaskList.init();
      
      // Verify persisted state
      expect(newTaskList.tasks.length).toBe(2);
      expect(newTaskList.tasks[0].completed).toBe(true);
      expect(newTaskList.tasks[1].text).toBe('Updated Task 2');
    });
  });
});
