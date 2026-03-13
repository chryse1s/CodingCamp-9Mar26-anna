import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';

// Mock localStorage for testing
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  })
};

// Mock console methods to avoid noise in tests
const consoleMock = {
  error: vi.fn(),
  warn: vi.fn()
};

// Import the LocalStorageService class
const fs = await import('fs');
const path = await import('path');
const appCode = fs.readFileSync(path.resolve('js/app.js'), 'utf-8');

// Extract just the LocalStorageService class for testing
const localStorageServiceCode = appCode.match(/class LocalStorageService \{[\s\S]*?\n\}/)[0];

// Create a test environment
global.localStorage = localStorageMock;
global.console = { ...console, ...consoleMock };

// Evaluate the LocalStorageService class
eval(localStorageServiceCode);

describe('LocalStorageService Property-Based Tests', () => {
  beforeEach(() => {
    // Clear all mocks and storage before each test
    vi.clearAllMocks();
    localStorageMock.store = {};
    consoleMock.error.mockClear();
    consoleMock.warn.mockClear();
  });

  describe('Property 3: Theme Persistence', () => {
    it('**Validates: Requirements 1.4, 5.1** - For any theme selection, the LocalStorage Service should immediately save the theme preference to localStorage', () => {
      fc.assert(fc.property(
        fc.constantFrom('light', 'dark'),
        (theme) => {
          // Clear previous calls
          localStorageMock.setItem.mockClear();
          
          // Set theme preference
          LocalStorageService.setThemePreference(theme);
          
          // Verify it was saved to localStorage
          expect(localStorageMock.setItem).toHaveBeenCalledWith(
            LocalStorageService.THEME_KEY, 
            theme
          );
        }
      ), { numRuns: 100 });
    });
  });

  describe('Property 4: Theme Restoration', () => {
    it('**Validates: Requirements 1.5** - For any saved theme preference, when the Theme Manager initializes, it should restore and apply the previously saved theme', () => {
      fc.assert(fc.property(
        fc.constantFrom('light', 'dark'),
        (savedTheme) => {
          // Store theme in mock localStorage
          localStorageMock.store[LocalStorageService.THEME_KEY] = savedTheme;
          
          // Get theme preference
          const retrievedTheme = LocalStorageService.getThemePreference();
          
          // Verify the saved theme is restored
          expect(retrievedTheme).toBe(savedTheme);
        }
      ), { numRuns: 100 });
    });
  });

  describe('Property 6: Name Persistence', () => {
    it('**Validates: Requirements 2.3, 5.2** - For any valid user name, the LocalStorage Service should immediately save the name to localStorage when set', () => {
      fc.assert(fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (userName) => {
          // Clear previous calls
          localStorageMock.setItem.mockClear();
          
          // Set user name
          LocalStorageService.setUserName(userName);
          
          // Verify it was saved to localStorage
          expect(localStorageMock.setItem).toHaveBeenCalledWith(
            LocalStorageService.USER_NAME_KEY, 
            userName.trim()
          );
        }
      ), { numRuns: 100 });
    });
  });

  describe('Property 7: Name Restoration', () => {
    it('**Validates: Requirements 2.4** - For any saved user name, when the Greeting Component initializes, it should load and display the stored name', () => {
      fc.assert(fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (savedName) => {
          // Store name in mock localStorage
          localStorageMock.store[LocalStorageService.USER_NAME_KEY] = savedName;
          
          // Get user name
          const retrievedName = LocalStorageService.getUserName();
          
          // Verify the saved name is restored (trimmed)
          expect(retrievedName).toBe(savedName.trim());
        }
      ), { numRuns: 100 });
    });
  });

  describe('Property 8: Name Validation', () => {
    it('**Validates: Requirements 2.7** - For any string composed entirely of whitespace or empty string, the Greeting Component should reject the input and not save it to localStorage', () => {
      fc.assert(fc.property(
        fc.oneof(
          fc.constant(''),
          fc.string().filter(s => s.trim().length === 0 && s.length > 0) // whitespace-only strings
        ),
        (invalidName) => {
          // Clear previous calls
          localStorageMock.setItem.mockClear();
          consoleMock.warn.mockClear();
          
          // Try to set invalid name
          LocalStorageService.setUserName(invalidName);
          
          // Verify it was NOT saved to localStorage
          expect(localStorageMock.setItem).not.toHaveBeenCalled();
          // Verify warning was logged
          expect(consoleMock.warn).toHaveBeenCalledWith('Invalid user name:', invalidName);
        }
      ), { numRuns: 100 });
    });
  });

  describe('Property 11: Timer Duration Persistence', () => {
    it('**Validates: Requirements 3.4, 5.3** - For any duration selection, the LocalStorage Service should immediately save the duration preference to localStorage', () => {
      fc.assert(fc.property(
        fc.constantFrom(25, 30, 45),
        (duration) => {
          // Clear previous calls
          localStorageMock.setItem.mockClear();
          
          // Set timer duration
          LocalStorageService.setTimerDuration(duration);
          
          // Verify it was saved to localStorage
          expect(localStorageMock.setItem).toHaveBeenCalledWith(
            LocalStorageService.TIMER_DURATION_KEY, 
            duration.toString()
          );
        }
      ), { numRuns: 100 });
    });
  });

  describe('Property 12: Timer Duration Restoration', () => {
    it('**Validates: Requirements 3.5** - For any saved timer duration, when the Timer Component initializes, it should restore and display the previously saved duration', () => {
      fc.assert(fc.property(
        fc.constantFrom(25, 30, 45),
        (savedDuration) => {
          // Store duration in mock localStorage
          localStorageMock.store[LocalStorageService.TIMER_DURATION_KEY] = savedDuration.toString();
          
          // Get timer duration
          const retrievedDuration = LocalStorageService.getTimerDuration();
          
          // Verify the saved duration is restored
          expect(retrievedDuration).toBe(savedDuration);
        }
      ), { numRuns: 100 });
    });
  });

  describe('Error Handling Properties', () => {
    it('**Validates: Requirements 5.4, 5.5** - LocalStorage errors should not break functionality and should fallback to defaults', () => {
      fc.assert(fc.property(
        fc.constantFrom('getThemePreference', 'getUserName', 'getTimerDuration'),
        (methodName) => {
          // Mock localStorage to throw errors
          localStorageMock.getItem.mockImplementation(() => {
            throw new Error('localStorage unavailable');
          });
          
          let result;
          switch (methodName) {
            case 'getThemePreference':
              result = LocalStorageService.getThemePreference();
              expect(result).toBe('light'); // Default theme
              break;
            case 'getUserName':
              result = LocalStorageService.getUserName();
              expect(result).toBeNull(); // Default name
              break;
            case 'getTimerDuration':
              result = LocalStorageService.getTimerDuration();
              expect(result).toBe(25); // Default duration
              break;
          }
          
          // Verify error was logged
          expect(consoleMock.error).toHaveBeenCalled();
        }
      ), { numRuns: 100 });
    });

    it('should handle localStorage write errors gracefully', () => {
      fc.assert(fc.property(
        fc.record({
          theme: fc.constantFrom('light', 'dark'),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          duration: fc.constantFrom(25, 30, 45)
        }),
        ({ theme, name, duration }) => {
          // Mock localStorage to throw errors on write
          localStorageMock.setItem.mockImplementation(() => {
            throw new Error('localStorage write failed');
          });
          consoleMock.error.mockClear();
          
          // Try to set preferences - should not throw
          expect(() => {
            LocalStorageService.setThemePreference(theme);
            LocalStorageService.setUserName(name);
            LocalStorageService.setTimerDuration(duration);
          }).not.toThrow();
          
          // Verify errors were logged
          expect(consoleMock.error).toHaveBeenCalledTimes(3);
        }
      ), { numRuns: 50 });
    });
  });

  describe('Round-trip Persistence Properties', () => {
    it('should maintain data integrity through save-load cycles for all preference types', () => {
      fc.assert(fc.property(
        fc.record({
          theme: fc.constantFrom('light', 'dark'),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          duration: fc.constantFrom(25, 30, 45)
        }),
        ({ theme, name, duration }) => {
          // Save all preferences
          LocalStorageService.setThemePreference(theme);
          LocalStorageService.setUserName(name);
          LocalStorageService.setTimerDuration(duration);
          
          // Load all preferences
          const retrievedTheme = LocalStorageService.getThemePreference();
          const retrievedName = LocalStorageService.getUserName();
          const retrievedDuration = LocalStorageService.getTimerDuration();
          
          // Verify data integrity
          expect(retrievedTheme).toBe(theme);
          expect(retrievedName).toBe(name.trim());
          expect(retrievedDuration).toBe(duration);
        }
      ), { numRuns: 100 });
    });
  });
});