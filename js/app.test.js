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
// Since we're testing a class in a file that's not a module, we'll need to evaluate it
const fs = await import('fs');
const path = await import('path');
const appCode = fs.readFileSync(path.resolve('js/app.js'), 'utf-8');

// Extract just the LocalStorageService class for testing
const localStorageServiceCode = appCode.match(/class LocalStorageService \{[\s\S]*?\n\}/)[0];

// Extract the ThemeManager class for testing
const themeManagerCode = appCode.match(/class ThemeManager \{[\s\S]*?\n\}/)[0];

// Create a test environment
global.localStorage = localStorageMock;
global.console = { ...console, ...consoleMock };

// Mock document and DOM methods
const documentMock = {
  body: {
    classList: {
      remove: vi.fn(),
      add: vi.fn()
    }
  },
  dispatchEvent: vi.fn()
};
global.document = documentMock;
global.CustomEvent = vi.fn((type, options) => ({ type, detail: options?.detail }));

// Evaluate the classes
eval(localStorageServiceCode);
eval(themeManagerCode);

describe('LocalStorageService Extensions', () => {
  beforeEach(() => {
    // Clear all mocks and storage before each test
    vi.clearAllMocks();
    localStorageMock.store = {};
    consoleMock.error.mockClear();
    consoleMock.warn.mockClear();
  });

  describe('Theme Preference Methods', () => {
    describe('getThemePreference', () => {
      it('should return light theme by default when no preference is stored', () => {
        const theme = LocalStorageService.getThemePreference();
        expect(theme).toBe('light');
      });

      it('should return stored theme preference when valid', () => {
        localStorageMock.store[LocalStorageService.THEME_KEY] = 'dark';
        const theme = LocalStorageService.getThemePreference();
        expect(theme).toBe('dark');
      });

      it('should return light theme when stored preference is invalid', () => {
        localStorageMock.store[LocalStorageService.THEME_KEY] = 'invalid';
        const theme = LocalStorageService.getThemePreference();
        expect(theme).toBe('light');
      });

      it('should handle localStorage errors gracefully', () => {
        localStorageMock.getItem.mockImplementation(() => {
          throw new Error('localStorage error');
        });
        const theme = LocalStorageService.getThemePreference();
        expect(theme).toBe('light');
        expect(consoleMock.error).toHaveBeenCalledWith('Failed to get theme preference:', expect.any(Error));
      });
    });

    describe('setThemePreference', () => {
      it('should store valid theme preferences', () => {
        LocalStorageService.setThemePreference('dark');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.THEME_KEY, 'dark');
        
        LocalStorageService.setThemePreference('light');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.THEME_KEY, 'light');
      });

      it('should reject invalid theme preferences', () => {
        LocalStorageService.setThemePreference('invalid');
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(consoleMock.warn).toHaveBeenCalledWith('Invalid theme preference:', 'invalid');
      });

      it('should handle localStorage errors gracefully', () => {
        localStorageMock.setItem.mockImplementation(() => {
          throw new Error('localStorage error');
        });
        LocalStorageService.setThemePreference('dark');
        expect(consoleMock.error).toHaveBeenCalledWith('Failed to set theme preference:', expect.any(Error));
      });
    });
  });

  describe('User Name Methods', () => {
    describe('getUserName', () => {
      it('should return null when no name is stored', () => {
        const name = LocalStorageService.getUserName();
        expect(name).toBeNull();
      });

      it('should return stored user name when present', () => {
        localStorageMock.store[LocalStorageService.USER_NAME_KEY] = 'John Doe';
        const name = LocalStorageService.getUserName();
        expect(name).toBe('John Doe');
      });

      it('should trim whitespace from stored names', () => {
        localStorageMock.store[LocalStorageService.USER_NAME_KEY] = '  John Doe  ';
        const name = LocalStorageService.getUserName();
        expect(name).toBe('John Doe');
      });

      it('should handle localStorage errors gracefully', () => {
        localStorageMock.getItem.mockImplementation(() => {
          throw new Error('localStorage error');
        });
        const name = LocalStorageService.getUserName();
        expect(name).toBeNull();
        expect(consoleMock.error).toHaveBeenCalledWith('Failed to get user name:', expect.any(Error));
      });
    });

    describe('setUserName', () => {
      it('should store valid user names', () => {
        LocalStorageService.setUserName('John Doe');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.USER_NAME_KEY, 'John Doe');
      });

      it('should trim whitespace before storing', () => {
        LocalStorageService.setUserName('  John Doe  ');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.USER_NAME_KEY, 'John Doe');
      });

      it('should reject empty or whitespace-only names', () => {
        LocalStorageService.setUserName('');
        LocalStorageService.setUserName('   ');
        LocalStorageService.setUserName(null);
        LocalStorageService.setUserName(undefined);
        
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(consoleMock.warn).toHaveBeenCalledTimes(4);
      });

      it('should reject non-string values', () => {
        LocalStorageService.setUserName(123);
        LocalStorageService.setUserName({});
        
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(consoleMock.warn).toHaveBeenCalledTimes(2);
      });

      it('should handle localStorage errors gracefully', () => {
        localStorageMock.setItem.mockImplementation(() => {
          throw new Error('localStorage error');
        });
        LocalStorageService.setUserName('John Doe');
        expect(consoleMock.error).toHaveBeenCalledWith('Failed to set user name:', expect.any(Error));
      });
    });
  });

  describe('Timer Duration Methods', () => {
    describe('getTimerDuration', () => {
      it('should return 25 minutes by default when no duration is stored', () => {
        const duration = LocalStorageService.getTimerDuration();
        expect(duration).toBe(25);
      });

      it('should return stored duration when valid', () => {
        localStorageMock.store[LocalStorageService.TIMER_DURATION_KEY] = '30';
        const duration = LocalStorageService.getTimerDuration();
        expect(duration).toBe(30);
      });

      it('should return default duration when stored value is invalid', () => {
        localStorageMock.store[LocalStorageService.TIMER_DURATION_KEY] = '60'; // Invalid option
        const duration = LocalStorageService.getTimerDuration();
        expect(duration).toBe(25);
      });

      it('should handle non-numeric stored values', () => {
        localStorageMock.store[LocalStorageService.TIMER_DURATION_KEY] = 'invalid';
        const duration = LocalStorageService.getTimerDuration();
        expect(duration).toBe(25);
      });

      it('should handle localStorage errors gracefully', () => {
        localStorageMock.getItem.mockImplementation(() => {
          throw new Error('localStorage error');
        });
        const duration = LocalStorageService.getTimerDuration();
        expect(duration).toBe(25);
        expect(consoleMock.error).toHaveBeenCalledWith('Failed to get timer duration:', expect.any(Error));
      });
    });

    describe('setTimerDuration', () => {
      it('should store valid timer durations', () => {
        LocalStorageService.setTimerDuration(25);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.TIMER_DURATION_KEY, '25');
        
        LocalStorageService.setTimerDuration(30);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.TIMER_DURATION_KEY, '30');
        
        LocalStorageService.setTimerDuration(45);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.TIMER_DURATION_KEY, '45');
      });

      it('should reject invalid timer durations', () => {
        LocalStorageService.setTimerDuration(60);
        LocalStorageService.setTimerDuration(15);
        LocalStorageService.setTimerDuration(0);
        
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
        expect(consoleMock.warn).toHaveBeenCalledTimes(3);
      });

      it('should handle localStorage errors gracefully', () => {
        localStorageMock.setItem.mockImplementation(() => {
          throw new Error('localStorage error');
        });
        LocalStorageService.setTimerDuration(30);
        expect(consoleMock.error).toHaveBeenCalledWith('Failed to set timer duration:', expect.any(Error));
      });
    });
  });
});

describe('ThemeManager', () => {
  let themeManager;

  beforeEach(() => {
    // Clear all mocks and storage before each test
    vi.clearAllMocks();
    localStorageMock.store = {};
    consoleMock.error.mockClear();
    consoleMock.warn.mockClear();
    documentMock.body.classList.remove.mockClear();
    documentMock.body.classList.add.mockClear();
    documentMock.dispatchEvent.mockClear();
    
    // Create fresh ThemeManager instance
    themeManager = new ThemeManager();
  });

  describe('constructor and initialization', () => {
    it('should initialize with light theme by default', () => {
      expect(themeManager.getCurrentTheme()).toBe('light');
    });

    it('should restore saved theme from localStorage', () => {
      localStorageMock.store[LocalStorageService.THEME_KEY] = 'dark';
      const newThemeManager = new ThemeManager();
      expect(newThemeManager.getCurrentTheme()).toBe('dark');
    });

    it('should apply theme classes to document body on initialization', () => {
      expect(documentMock.body.classList.remove).toHaveBeenCalledWith('theme-light', 'theme-dark');
      expect(documentMock.body.classList.add).toHaveBeenCalledWith('theme-light');
    });
  });

  describe('getCurrentTheme', () => {
    it('should return the current theme', () => {
      expect(themeManager.getCurrentTheme()).toBe('light');
      
      themeManager.setTheme('dark');
      expect(themeManager.getCurrentTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should set valid themes', () => {
      themeManager.setTheme('dark');
      expect(themeManager.getCurrentTheme()).toBe('dark');
      expect(documentMock.body.classList.add).toHaveBeenCalledWith('theme-dark');
      
      themeManager.setTheme('light');
      expect(themeManager.getCurrentTheme()).toBe('light');
      expect(documentMock.body.classList.add).toHaveBeenCalledWith('theme-light');
    });

    it('should reject invalid themes and default to light', () => {
      themeManager.setTheme('invalid');
      expect(themeManager.getCurrentTheme()).toBe('light');
      expect(consoleMock.warn).toHaveBeenCalledWith('Invalid theme: invalid. Defaulting to light.');
    });

    it('should save theme preference to localStorage', () => {
      themeManager.setTheme('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.THEME_KEY, 'dark');
    });

    it('should emit theme-changed event', () => {
      themeManager.setTheme('dark');
      expect(documentMock.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-changed',
          detail: { theme: 'dark' }
        })
      );
    });

    it('should remove old theme classes before adding new ones', () => {
      themeManager.setTheme('dark');
      expect(documentMock.body.classList.remove).toHaveBeenCalledWith('theme-light', 'theme-dark');
      expect(documentMock.body.classList.add).toHaveBeenCalledWith('theme-dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      expect(themeManager.getCurrentTheme()).toBe('light');
      themeManager.toggleTheme();
      expect(themeManager.getCurrentTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      themeManager.setTheme('dark');
      themeManager.toggleTheme();
      expect(themeManager.getCurrentTheme()).toBe('light');
    });

    it('should apply theme classes when toggling', () => {
      themeManager.toggleTheme(); // light -> dark
      expect(documentMock.body.classList.add).toHaveBeenCalledWith('theme-dark');
      
      themeManager.toggleTheme(); // dark -> light
      expect(documentMock.body.classList.add).toHaveBeenCalledWith('theme-light');
    });

    it('should save toggled theme to localStorage', () => {
      themeManager.toggleTheme();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(LocalStorageService.THEME_KEY, 'dark');
    });
  });

  describe('applyTheme', () => {
    it('should remove existing theme classes and add new one', () => {
      themeManager.applyTheme('dark');
      expect(documentMock.body.classList.remove).toHaveBeenCalledWith('theme-light', 'theme-dark');
      expect(documentMock.body.classList.add).toHaveBeenCalledWith('theme-dark');
    });
  });
});