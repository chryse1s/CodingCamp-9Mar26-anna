// Simple validation script for LocalStorageService extensions
// This can be run in a browser console to test the implementation

// Mock localStorage for testing if needed
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    store: {},
    getItem: function(key) { return this.store[key] || null; },
    setItem: function(key, value) { this.store[key] = value; },
    removeItem: function(key) { delete this.store[key]; },
    clear: function() { this.store = {}; }
  };
}

// Test LocalStorageService extensions
function validateLocalStorageService() {
  console.log('🧪 Testing LocalStorageService Extensions...\n');
  
  // Test Theme Preferences
  console.log('📱 Testing Theme Preferences:');
  
  // Test default theme
  let theme = LocalStorageService.getThemePreference();
  console.log(`Default theme: ${theme} (should be 'light')`);
  console.assert(theme === 'light', 'Default theme should be light');
  
  // Test setting and getting theme
  LocalStorageService.setThemePreference('dark');
  theme = LocalStorageService.getThemePreference();
  console.log(`After setting dark: ${theme} (should be 'dark')`);
  console.assert(theme === 'dark', 'Theme should be dark after setting');
  
  LocalStorageService.setThemePreference('light');
  theme = LocalStorageService.getThemePreference();
  console.log(`After setting light: ${theme} (should be 'light')`);
  console.assert(theme === 'light', 'Theme should be light after setting');
  
  // Test invalid theme (should be ignored)
  LocalStorageService.setThemePreference('invalid');
  theme = LocalStorageService.getThemePreference();
  console.log(`After setting invalid: ${theme} (should still be 'light')`);
  console.assert(theme === 'light', 'Invalid theme should be ignored');
  
  console.log('✅ Theme preferences tests passed\n');
  
  // Test User Name
  console.log('👤 Testing User Name:');
  
  // Test default name
  let name = LocalStorageService.getUserName();
  console.log(`Default name: ${name} (should be null)`);
  console.assert(name === null, 'Default name should be null');
  
  // Test setting and getting name
  LocalStorageService.setUserName('John Doe');
  name = LocalStorageService.getUserName();
  console.log(`After setting 'John Doe': ${name} (should be 'John Doe')`);
  console.assert(name === 'John Doe', 'Name should be John Doe after setting');
  
  // Test trimming whitespace
  LocalStorageService.setUserName('  Jane Smith  ');
  name = LocalStorageService.getUserName();
  console.log(`After setting '  Jane Smith  ': ${name} (should be 'Jane Smith')`);
  console.assert(name === 'Jane Smith', 'Name should be trimmed');
  
  // Test empty name (should be ignored)
  LocalStorageService.setUserName('');
  name = LocalStorageService.getUserName();
  console.log(`After setting empty string: ${name} (should still be 'Jane Smith')`);
  console.assert(name === 'Jane Smith', 'Empty name should be ignored');
  
  // Test whitespace-only name (should be ignored)
  LocalStorageService.setUserName('   ');
  name = LocalStorageService.getUserName();
  console.log(`After setting whitespace: ${name} (should still be 'Jane Smith')`);
  console.assert(name === 'Jane Smith', 'Whitespace-only name should be ignored');
  
  console.log('✅ User name tests passed\n');
  
  // Test Timer Duration
  console.log('⏱️ Testing Timer Duration:');
  
  // Test default duration
  let duration = LocalStorageService.getTimerDuration();
  console.log(`Default duration: ${duration} (should be 25)`);
  console.assert(duration === 25, 'Default duration should be 25');
  
  // Test setting valid durations
  LocalStorageService.setTimerDuration(30);
  duration = LocalStorageService.getTimerDuration();
  console.log(`After setting 30: ${duration} (should be 30)`);
  console.assert(duration === 30, 'Duration should be 30 after setting');
  
  LocalStorageService.setTimerDuration(45);
  duration = LocalStorageService.getTimerDuration();
  console.log(`After setting 45: ${duration} (should be 45)`);
  console.assert(duration === 45, 'Duration should be 45 after setting');
  
  LocalStorageService.setTimerDuration(25);
  duration = LocalStorageService.getTimerDuration();
  console.log(`After setting 25: ${duration} (should be 25)`);
  console.assert(duration === 25, 'Duration should be 25 after setting');
  
  // Test invalid duration (should be ignored)
  LocalStorageService.setTimerDuration(60);
  duration = LocalStorageService.getTimerDuration();
  console.log(`After setting invalid 60: ${duration} (should still be 25)`);
  console.assert(duration === 25, 'Invalid duration should be ignored');
  
  console.log('✅ Timer duration tests passed\n');
  
  // Test Storage Keys
  console.log('🔑 Testing Storage Keys:');
  console.log(`Theme key: ${LocalStorageService.THEME_KEY}`);
  console.log(`User name key: ${LocalStorageService.USER_NAME_KEY}`);
  console.log(`Timer duration key: ${LocalStorageService.TIMER_DURATION_KEY}`);
  
  console.log('✅ All LocalStorageService extension tests passed! 🎉');
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateLocalStorageService };
} else if (typeof window !== 'undefined') {
  window.validateLocalStorageService = validateLocalStorageService;
}

// Auto-run if this script is executed directly
if (typeof window === 'undefined' && typeof require !== 'undefined') {
  // Running in Node.js - would need to load the LocalStorageService class
  console.log('To test in Node.js, first load the LocalStorageService class from app.js');
} else if (typeof window !== 'undefined') {
  // Running in browser - can test immediately if LocalStorageService is available
  if (typeof LocalStorageService !== 'undefined') {
    validateLocalStorageService();
  } else {
    console.log('LocalStorageService not found. Make sure app.js is loaded first.');
  }
}