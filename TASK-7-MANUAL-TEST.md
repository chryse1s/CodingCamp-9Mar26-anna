# Task 7 Manual Testing Guide

## Task 7.1: Task Completion Toggle

### Test Steps:
1. Open `index.html` in a browser
2. Add a new task (e.g., "Buy groceries")
3. Click the checkbox next to the task
4. **Expected Result**: 
   - Checkbox becomes checked
   - Task text gets strikethrough styling
   - Task text color becomes gray (#95a5a6)
5. Click the checkbox again
6. **Expected Result**:
   - Checkbox becomes unchecked
   - Task text strikethrough is removed
   - Task text returns to normal color
7. Refresh the page
8. **Expected Result**: Task completion state persists (remains checked/unchecked as it was)

## Task 7.2: Task Editing

### Test Steps:
1. Add a new task (e.g., "Read book")
2. Click the "Edit" button next to the task
3. **Expected Result**:
   - Task text is replaced with an input field
   - Input field contains the current task text
   - Input field is focused and text is selected
4. Type new text (e.g., "Read chapter 5")
5. Press Enter
6. **Expected Result**:
   - Input field is replaced with updated task text
   - Task displays "Read chapter 5"
7. Click "Edit" again
8. Clear all text and press Enter
9. **Expected Result**:
   - Task text remains unchanged (empty edits are rejected)
10. Click "Edit" again
11. Type "   " (only spaces) and press Enter
12. **Expected Result**:
    - Task text remains unchanged (whitespace-only edits are rejected)
13. Click "Edit" again
14. Type new text and press Escape
15. **Expected Result**:
    - Edit is cancelled, original text is restored
16. Click "Edit" again
17. Type new text and click outside the input field
18. **Expected Result**:
    - Edit is saved with the new text
19. Refresh the page
20. **Expected Result**: Edited task text persists

## Task 7.3: Task Deletion

### Test Steps:
1. Add multiple tasks (e.g., "Task 1", "Task 2", "Task 3")
2. Click the "Delete" button next to "Task 2"
3. **Expected Result**:
   - "Task 2" is removed from the list
   - "Task 1" and "Task 3" remain
   - List shows only 2 tasks
4. Refresh the page
5. **Expected Result**: 
   - Only "Task 1" and "Task 3" are displayed
   - "Task 2" is permanently deleted

## Integration Test

### Test Steps:
1. Add a task "Complete project"
2. Click the checkbox to mark it complete
3. Click "Edit" and change text to "Complete project documentation"
4. Press Enter to save
5. **Expected Result**:
   - Task text is updated
   - Task remains marked as complete (checkbox still checked)
   - Task text still has strikethrough
6. Click "Delete" button
7. **Expected Result**:
   - Task is removed from the list
8. Refresh the page
9. **Expected Result**:
   - Task list is empty (deletion persisted)

## Requirements Validation

### Requirement 5.1-5.5 (Task Completion):
- ✓ Each task displays a checkbox (completion indicator)
- ✓ Clicking checkbox on incomplete task marks it complete
- ✓ Clicking checkbox on complete task marks it incomplete
- ✓ Visual display updates (strikethrough, color change)
- ✓ Changes persist to Local Storage

### Requirement 6.1-6.5 (Task Editing):
- ✓ Each task has an "Edit" button (edit control)
- ✓ Clicking edit shows input field with current text
- ✓ Submitting valid text updates the task
- ✓ Submitting empty text does not update the task
- ✓ Changes persist to Local Storage

### Requirement 7.1-7.4 (Task Deletion):
- ✓ Each task has a "Delete" button (delete control)
- ✓ Clicking delete removes the task
- ✓ Display updates to hide removed task
- ✓ Changes persist to Local Storage

## Notes

- All operations should feel responsive (< 100ms)
- No console errors should appear
- Local Storage should update after each operation
- Page refreshes should preserve all changes
