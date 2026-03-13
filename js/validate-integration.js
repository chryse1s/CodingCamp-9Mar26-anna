// Comprehensive integration validation script
// This script validates all three enhancements work together

class IntegrationValidator {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    this.results.push({ message, type, timestamp: new Date().toISOString() });
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  error(message, error) {
    this.errors.push({ message, error: error.toString(), timestamp: new Date().toISOString() });
    console.error(`[ERROR] ${message}:`, error);
  }

  async runAllTests() {
    this.log('Starting comprehensive integration validation...', 'info');
    
    try {
      await this.testLocalStorageService();
      await this.testThemeManager();
      await this.testGreetingComponent();
      await this.testTimerComponent();
      await this.testIntegration();
      await this.testErrorHandling();
      
      this.generateReport();
    } catch (error) {
      this.error('Critical error during validation', error);
    }
  }

  async testLocalStorageService() {
    this.log('Testing LocalStorageService...', 'info');
    
    try {
      // Test theme preference methods
      LocalStorageService.setThemePreference('dark');
      const theme = LocalStorageService.getThemePreference();
      if (theme === 'dark') {
        this.log('✓ Theme preference persistence works', 'pass');
      } else {
        this.log('✗ Theme preference persistence failed', 'fail');
      }

      // Test user name methods
      LocalStorageService.setUserName('Test User');
      const name = LocalStorageService.getUserName();
      if (name === 'Test User') {
        this.log('✓ User name persistence works', 'pass');
      } else {
        this.log('✗ User name persistence failed', 'fail');
      }

      // Test timer duration methods
      LocalStorageService.setTimerDuration(30);
      const duration = LocalStorageService.getTimerDuration();
      if (duration === 30) {
        this.log('✓ Timer duration persistence works', 'pass');
      } else {
        this.log('✗ Timer duration persistence failed', 'fail');
      }

      // Test invalid inputs
      LocalStorageService.setThemePreference('invalid');
      const invalidTheme = LocalStorageService.getThemePreference();
      if (invalidTheme === 'light') {
        this.log('✓ Invalid theme preference rejected correctly', 'pass');
      } else {
        this.log('✗ Invalid theme preference not handled', 'fail');
      }

      LocalStorageService.setUserName('   ');
      const emptyName = LocalStorageService.getUserName();
      if (emptyName === 'Test User') { // Should remain unchanged
        this.log('✓ Empty user name rejected correctly', 'pass');
      } else {
        this.log('✗ Empty user name not handled', 'fail');
      }

      LocalStorageService.setTimerDuration(60);
      const invalidDuration = LocalStorageService.getTimerDuration();
      if (invalidDuration === 30) { // Should remain unchanged
        this.log('✓ Invalid timer duration rejected correctly', 'pass');
      } else {
        this.log('✗ Invalid timer duration not handled', 'fail');
      }

    } catch (error) {
      this.error('LocalStorageService test failed', error);
    }
  }

  async testThemeManager() {
    this.log('Testing ThemeManager...', 'info');
    
    try {
      const themeManager = new ThemeManager();
      
      // Test initial theme
      const initialTheme = themeManager.getCurrentTheme();
      if (initialTheme === 'dark') { // From previous test
        this.log('✓ Theme manager initialized with saved theme', 'pass');
      } else {
        this.log('✗ Theme manager initialization failed', 'fail');
      }

      // Test theme toggle
      themeManager.toggleTheme();
      const toggledTheme = themeManager.getCurrentTheme();
      if (toggledTheme === 'light') {
        this.log('✓ Theme toggle works', 'pass');
      } else {
        this.log('✗ Theme toggle failed', 'fail');
      }

      // Test theme setting
      themeManager.setTheme('dark');
      const setTheme = themeManager.getCurrentTheme();
      if (setTheme === 'dark') {
        this.log('✓ Theme setting works', 'pass');
      } else {
        this.log('✗ Theme setting failed', 'fail');
      }

      // Test CSS class application
      const hasThemeClass = document.body.classList.contains('theme-dark');
      if (hasThemeClass) {
        this.log('✓ CSS theme classes applied correctly', 'pass');
      } else {
        this.log('✗ CSS theme classes not applied', 'fail');
      }

    } catch (error) {
      this.error('ThemeManager test failed', error);
    }
  }

  async testGreetingComponent() {
    this.log('Testing GreetingDisplay component...', 'info');
    
    try {
      const container = document.querySelector('#greeting-display');
      if (!container) {
        this.log('✗ Greeting container not found', 'fail');
        return;
      }

      const greeting = new GreetingDisplay(container);
      greeting.init();

      // Test name setting
      greeting.setUserName('Integration Test');
      const storedName = greeting.getUserName();
      if (storedName === 'Integration Test') {
        this.log('✓ Greeting name setting works', 'pass');
      } else {
        this.log('✗ Greeting name setting failed', 'fail');
      }

      // Test greeting format
      const greetingText = container.querySelector('.greeting-text');
      if (greetingText && greetingText.textContent.includes('Integration Test')) {
        this.log('✓ Greeting displays user name', 'pass');
      } else {
        this.log('✗ Greeting does not display user name', 'fail');
      }

      // Test time display
      const timeDisplay = container.querySelector('.current-time');
      if (timeDisplay && timeDisplay.textContent.match(/\d{1,2}:\d{2}/)) {
        this.log('✓ Time display format is correct', 'pass');
      } else {
        this.log('✗ Time display format is incorrect', 'fail');
      }

    } catch (error) {
      this.error('GreetingDisplay test failed', error);
    }
  }

  async testTimerComponent() {
    this.log('Testing FocusTimer component...', 'info');
    
    try {
      const container = document.querySelector('#focus-timer');
      if (!container) {
        this.log('✗ Timer container not found', 'fail');
        return;
      }

      const timer = new FocusTimer(container);
      timer.init();

      // Test duration setting
      timer.setDuration(45);
      const duration = timer.getDuration();
      if (duration === 45) {
        this.log('✓ Timer duration setting works', 'pass');
      } else {
        this.log('✗ Timer duration setting failed', 'fail');
      }

      // Test timer display
      const timerDisplay = container.querySelector('.timer-display');
      if (timerDisplay && timerDisplay.textContent === '45:00') {
        this.log('✓ Timer display updates with duration', 'pass');
      } else {
        this.log('✗ Timer display does not update', 'fail');
      }

      // Test duration selector
      const durationSelect = container.querySelector('.duration-select');
      if (durationSelect && durationSelect.value === '45') {
        this.log('✓ Duration selector reflects current duration', 'pass');
      } else {
        this.log('✗ Duration selector not synchronized', 'fail');
      }

      // Test reset functionality
      timer.reset();
      const resetDisplay = timerDisplay.textContent;
      if (resetDisplay === '45:00') {
        this.log('✓ Timer reset works correctly', 'pass');
      } else {
        this.log('✗ Timer reset failed', 'fail');
      }

    } catch (error) {
      this.error('FocusTimer test failed', error);
    }
  }

  async testIntegration() {
    this.log('Testing component integration...', 'info');
    
    try {
      // Test that all components can coexist
      const greetingContainer = document.querySelector('#greeting-display');
      const timerContainer = document.querySelector('#focus-timer');
      const themeToggle = document.querySelector('#theme-toggle');

      if (greetingContainer && timerContainer && themeToggle) {
        this.log('✓ All UI components present', 'pass');
      } else {
        this.log('✗ Missing UI components', 'fail');
      }

      // Test theme switching affects all components
      const themeManager = new ThemeManager();
      themeManager.setTheme('light');
      
      // Check if CSS variables are updated
      const computedStyle = getComputedStyle(document.body);
      const textPrimary = computedStyle.getPropertyValue('--text-primary').trim();
      
      if (textPrimary === '#333' || textPrimary === 'rgb(51, 51, 51)') {
        this.log('✓ Theme switching updates CSS variables', 'pass');
      } else {
        this.log('✗ Theme switching does not update CSS variables', 'fail');
      }

      // Test localStorage integration across components
      const savedTheme = LocalStorageService.getThemePreference();
      const savedName = LocalStorageService.getUserName();
      const savedDuration = LocalStorageService.getTimerDuration();

      if (savedTheme && savedName && savedDuration) {
        this.log('✓ All preferences saved to localStorage', 'pass');
      } else {
        this.log('✗ Some preferences not saved', 'fail');
      }

    } catch (error) {
      this.error('Integration test failed', error);
    }
  }

  async testErrorHandling() {
    this.log('Testing error handling...', 'info');
    
    try {
      // Mock localStorage failure
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('localStorage unavailable');
      };

      // Test graceful degradation
      try {
        LocalStorageService.setThemePreference('dark');
        this.log('✓ localStorage errors handled gracefully', 'pass');
      } catch (error) {
        this.log('✗ localStorage errors not handled', 'fail');
      }

      // Restore localStorage
      localStorage.setItem = originalSetItem;

      // Test invalid component initialization
      try {
        const invalidGreeting = new GreetingDisplay(null);
        invalidGreeting.init();
        this.log('✓ Invalid component initialization handled', 'pass');
      } catch (error) {
        this.log('✗ Invalid component initialization not handled', 'fail');
      }

    } catch (error) {
      this.error('Error handling test failed', error);
    }
  }

  generateReport() {
    this.log('Generating validation report...', 'info');
    
    const passCount = this.results.filter(r => r.type === 'pass').length;
    const failCount = this.results.filter(r => r.type === 'fail').length;
    const totalTests = passCount + failCount;
    
    this.log(`\n=== INTEGRATION VALIDATION REPORT ===`, 'info');
    this.log(`Total Tests: ${totalTests}`, 'info');
    this.log(`Passed: ${passCount}`, 'pass');
    this.log(`Failed: ${failCount}`, failCount > 0 ? 'fail' : 'info');
    this.log(`Success Rate: ${((passCount / totalTests) * 100).toFixed(1)}%`, 'info');
    
    if (this.errors.length > 0) {
      this.log(`\nErrors encountered: ${this.errors.length}`, 'fail');
      this.errors.forEach(error => {
        this.log(`- ${error.message}: ${error.error}`, 'fail');
      });
    }
    
    if (failCount === 0 && this.errors.length === 0) {
      this.log('\n🎉 All enhancements working correctly!', 'pass');
    } else {
      this.log('\n⚠️  Some issues found - review failed tests', 'fail');
    }
    
    return {
      totalTests,
      passCount,
      failCount,
      successRate: (passCount / totalTests) * 100,
      errors: this.errors.length
    };
  }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntegrationValidator;
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
  window.IntegrationValidator = IntegrationValidator;
  
  // Run validation when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      const validator = new IntegrationValidator();
      validator.runAllTests();
    }, 1000);
  });
}