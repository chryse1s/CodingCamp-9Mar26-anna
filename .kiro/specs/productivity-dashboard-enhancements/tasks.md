# Implementation Plan: Productivity Dashboard Enhancements

## Overview

This implementation plan enhances the existing Productivity Dashboard with three key features: Light/Dark Mode toggle, Custom Name in Greeting, and Customizable Pomodoro Timer Duration. The enhancements integrate with the existing component-based architecture and LocalStorageService while maintaining the single CSS and JavaScript file constraints.

## Tasks

- [x] 1. Extend LocalStorageService with new preference methods
  - Add theme preference methods (getThemePreference, setThemePreference)
  - Add user name methods (getUserName, setUserName) 
  - Add timer duration methods (getTimerDuration, setTimerDuration)
  - Implement error handling with fallback to defaults
  - _Requirements: 1.4, 1.5, 2.3, 2.4, 3.4, 3.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 1.1 Write property test for LocalStorage preference persistence
  - **Property 3: Theme Persistence**
  - **Property 6: Name Persistence** 
  - **Property 11: Timer Duration Persistence**
  - **Validates: Requirements 1.4, 2.3, 3.4, 5.1, 5.2, 5.3**

- [ ]* 1.2 Write property test for LocalStorage preference restoration
  - **Property 4: Theme Restoration**
  - **Property 7: Name Restoration**
  - **Property 12: Timer Duration Restoration**
  - **Validates: Requirements 1.5, 2.4, 3.5**

- [x] 2. Implement ThemeManager component
  - [x] 2.1 Create ThemeManager class with theme switching logic
    - Implement getCurrentTheme, setTheme, toggleTheme methods
    - Add theme initialization with localStorage integration
    - Apply CSS classes to document body for theme switching
    - _Requirements: 1.2, 1.3, 1.5, 1.6_

  - [ ]* 2.2 Write property test for theme toggle behavior
    - **Property 1: Theme Toggle Behavior**
    - **Validates: Requirements 1.2**

  - [ ]* 2.3 Write property test for CSS class application
    - **Property 2: Theme CSS Class Application**
    - **Validates: Requirements 1.3**

  - [x] 2.4 Add theme toggle button to dashboard header
    - Create toggle button UI element in existing header
    - Wire button click events to ThemeManager.toggleTheme()
    - Provide visual feedback for current theme state
    - _Requirements: 1.1, 1.7_

- [x] 3. Enhance GreetingDisplay component with personalization
  - [x] 3.1 Extend GreetingDisplay class with name functionality
    - Add getUserName, setUserName, promptForName methods
    - Modify updateTime method to include personalized greeting
    - Integrate with LocalStorageService for name persistence
    - _Requirements: 2.2, 2.3, 2.4, 2.6_

  - [ ]* 3.2 Write property test for greeting format with name
    - **Property 5: Greeting Format with Name**
    - **Validates: Requirements 2.2**

  - [ ]* 3.3 Write property test for name validation
    - **Property 8: Name Validation**
    - **Validates: Requirements 2.7**

  - [x] 3.4 Create name input dialog for first-time users
    - Implement modal dialog for name collection
    - Add name change functionality for existing users
    - Handle empty/invalid name validation with user feedback
    - _Requirements: 2.1, 2.5, 2.7_

- [x] 4. Checkpoint - Ensure theme and greeting features work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Enhance FocusTimer component with customizable duration
  - [x] 5.1 Extend FocusTimer class with duration selection
    - Add getDuration, setDuration methods
    - Modify timer logic to use selected duration instead of hardcoded 25 minutes
    - Update reset method to use currently selected duration
    - Integrate with LocalStorageService for duration persistence
    - _Requirements: 3.2, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 5.2 Write property test for timer display update
    - **Property 9: Timer Display Update**
    - **Validates: Requirements 3.2**

  - [ ]* 5.3 Write property test for timer button functionality
    - **Property 10: Timer Button Functionality**
    - **Validates: Requirements 3.3**

  - [ ]* 5.4 Write property test for timer reset behavior
    - **Property 13: Timer Reset Behavior**
    - **Validates: Requirements 3.7**

  - [x] 5.5 Add duration selector UI to timer component
    - Create duration selection buttons/dropdown (25, 30, 45 minutes)
    - Wire selection events to FocusTimer.setDuration()
    - Provide visual indication of currently selected duration
    - Ensure accessibility with proper ARIA labels
    - _Requirements: 3.1, 3.8_

- [x] 6. Add CSS styles for light and dark themes
  - [x] 6.1 Create CSS custom properties for theme variables
    - Define color variables for light and dark themes
    - Ensure all existing components work with both themes
    - Maintain existing responsive design patterns
    - _Requirements: 1.3, 1.7, 4.5_

  - [x] 6.2 Style new UI elements (theme toggle, name dialog, duration selector)
    - Style theme toggle button to match existing design
    - Style name input dialog with proper modal appearance
    - Style duration selector to integrate with timer component
    - Ensure all new elements are responsive and accessible
    - _Requirements: 1.1, 2.1, 2.5, 3.1, 3.8, 4.1, 4.5_

- [-] 7. Integrate all components in main App class
  - [x] 7.1 Initialize new components in App.init()
    - Instantiate ThemeManager and initialize theme
    - Initialize enhanced GreetingDisplay with name functionality
    - Initialize enhanced FocusTimer with duration selection
    - Ensure proper component lifecycle management
    - _Requirements: 4.3, 4.4, 4.6_

  - [ ]* 7.2 Write integration tests for component interaction
    - Test theme changes don't break other components
    - Test localStorage errors are handled gracefully
    - Test component initialization with various stored preferences
    - _Requirements: 5.4, 5.5, 5.6_

- [x] 8. Final checkpoint - Ensure all enhancements work together
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- All enhancements must maintain existing functionality without breaking changes
- Single CSS and JavaScript file constraints must be preserved
- Property tests validate universal correctness properties from the design document
- Integration tests ensure components work together seamlessly