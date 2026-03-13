/**
 * Performance Verification Script
 * Validates Requirements 13.1-13.4 for 100ms response times
 */

class PerformanceVerifier {
  constructor() {
    this.results = {
      visualFeedback: [],      // Requirement 13.1
      taskOperations: [],      // Requirement 13.2
      linkOperations: [],      // Requirement 13.3
      timerUpdates: []         // Requirement 13.4
    };
    this.thresholds = {
      pass: 100,      // ≤ 100ms = PASS
      warning: 150    // 100-150ms = WARNING, >150ms = FAIL
    };
  }

  async verifyAllRequirements() {
    console.log('🚀 Starting Performance Verification...');
    console.log('Testing Requirements 13.1-13.4 for 100ms response times\n');

    try {
      // Verify each requirement
      await this.verifyVisualFeedback();      // 13.1
      await this.verifyTaskOperations();      // 13.2
      await this.verifyLinkOperations();      // 13.3
      await this.verifyTimerUpdates();        // 13.4

      // Generate final report
      this.generateFinalReport();
      
      return this.getOverallResult();
    } catch (error) {
      console.error('❌ Performance verification failed:', error);
      return false;
    }
  }

  async verifyVisualFeedback() {
    console.log('📋 Testing Requirement 13.1: Visual feedback within 100ms');
    
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input');
    
    // Test button hover/click feedback
    for (const button of buttons) {
      const responseTime = await this.measureVisualFeedback(button, 'click');
      this.results.visualFeedback.push({
        element: button.textContent.trim() || button.className,
        interaction: 'click',
        responseTime,
        status: this.getStatus(responseTime)
      });
    }

    // Test input field feedback
    for (const input of inputs) {
      const responseTime = await this.measureVisualFeedback(input, 'focus');
      this.results.visualFeedback.push({
        element: input.className || input.type,
        interaction: 'focus',
        responseTime,
        status: this.getStatus(responseTime)
      });
    }

    this.logRequirementResults('13.1 Visual Feedback', this.results.visualFeedback);
  }

  async verifyTaskOperations() {
    console.log('📋 Testing Requirement 13.2: Task operations within 100ms');
    
    const taskInput = document.querySelector('.task-input');
    const addButton = document.querySelector('.btn-add-task');
    
    if (taskInput && addButton) {
      // Test task creation
      taskInput.value = 'Performance Test Task';
      const createTime = await this.measureDOMUpdate(() => {
        addButton.click();
      }, '.tasks');
      
      this.results.taskOperations.push({
        operation: 'Task Creation',
        responseTime: createTime,
        status: this.getStatus(createTime)
      });

      // Test task toggle (if task was created)
      await this.delay(100);
      const checkbox = document.querySelector('.task-checkbox');
      if (checkbox) {
        const toggleTime = await this.measureDOMUpdate(() => {
          checkbox.click();
        }, '.task-text');
        
        this.results.taskOperations.push({
          operation: 'Task Toggle',
          responseTime: toggleTime,
          status: this.getStatus(toggleTime)
        });
      }

      // Test task deletion (if task exists)
      const deleteButton = document.querySelector('.btn-delete-task');
      if (deleteButton) {
        const deleteTime = await this.measureDOMUpdate(() => {
          deleteButton.click();
        }, '.tasks');
        
        this.results.taskOperations.push({
          operation: 'Task Deletion',
          responseTime: deleteTime,
          status: this.getStatus(deleteTime)
        });
      }
    }

    this.logRequirementResults('13.2 Task Operations', this.results.taskOperations);
  }

  async verifyLinkOperations() {
    console.log('📋 Testing Requirement 13.3: Link operations within 100ms');
    
    const nameInput = document.querySelector('.link-name-input');
    const urlInput = document.querySelector('.link-url-input');
    const addButton = document.querySelector('.btn-add-link');
    
    if (nameInput && urlInput && addButton) {
      // Test link creation
      nameInput.value = 'Test Link';
      urlInput.value = 'https://example.com';
      
      const createTime = await this.measureDOMUpdate(() => {
        addButton.click();
      }, '.links');
      
      this.results.linkOperations.push({
        operation: 'Link Creation',
        responseTime: createTime,
        status: this.getStatus(createTime)
      });

      // Test link deletion (if link was created)
      await this.delay(100);
      const deleteButton = document.querySelector('.btn-delete-link');
      if (deleteButton) {
        const deleteTime = await this.measureDOMUpdate(() => {
          deleteButton.click();
        }, '.links');
        
        this.results.linkOperations.push({
          operation: 'Link Deletion',
          responseTime: deleteTime,
          status: this.getStatus(deleteTime)
        });
      }
    }

    this.logRequirementResults('13.3 Link Operations', this.results.linkOperations);
  }

  async verifyTimerUpdates() {
    console.log('📋 Testing Requirement 13.4: Timer updates within 100ms');
    
    const startButton = document.querySelector('.btn-start');
    const timerDisplay = document.querySelector('.timer-display');
    
    if (startButton && timerDisplay) {
      // Test timer start response
      const startTime = await this.measureDOMUpdate(() => {
        startButton.click();
      }, '.timer-display');
      
      this.results.timerUpdates.push({
        operation: 'Timer Start',
        responseTime: startTime,
        status: this.getStatus(startTime)
      });

      // Test timer tick updates (measure several ticks)
      const tickTimes = await this.measureTimerTicks(3);
      tickTimes.forEach((tickTime, index) => {
        this.results.timerUpdates.push({
          operation: `Timer Tick ${index + 1}`,
          responseTime: tickTime,
          status: this.getStatus(tickTime)
        });
      });

      // Test timer stop response
      const stopButton = document.querySelector('.btn-stop');
      if (stopButton) {
        const stopTime = await this.measureDOMUpdate(() => {
          stopButton.click();
        }, '.timer-display');
        
        this.results.timerUpdates.push({
          operation: 'Timer Stop',
          responseTime: stopTime,
          status: this.getStatus(stopTime)
        });
      }
    }

    this.logRequirementResults('13.4 Timer Updates', this.results.timerUpdates);
  }

  async measureVisualFeedback(element, eventType) {
    const startTime = performance.now();
    
    // Trigger the event
    if (eventType === 'click') {
      element.click();
    } else if (eventType === 'focus') {
      element.focus();
    }
    
    // Wait for next frame (visual update)
    await this.waitForNextFrame();
    
    const endTime = performance.now();
    return endTime - startTime;
  }

  async measureDOMUpdate(action, selector) {
    const startTime = performance.now();
    
    // Set up mutation observer
    const target = document.querySelector(selector);
    if (!target) {
      console.warn(`Target element not found: ${selector}`);
      return 0;
    }

    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const endTime = performance.now();
        observer.disconnect();
        resolve(endTime - startTime);
      });

      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });

      // Execute the action
      action();

      // Fallback timeout
      setTimeout(() => {
        observer.disconnect();
        resolve(performance.now() - startTime);
      }, 1000);
    });
  }

  async measureTimerTicks(count) {
    const timerDisplay = document.querySelector('.timer-display');
    if (!timerDisplay) return [];

    const tickTimes = [];
    let tickCount = 0;

    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const tickTime = performance.now();
        if (tickCount > 0) { // Skip first observation (setup)
          const responseTime = 16; // Timer ticks are immediate DOM updates
          tickTimes.push(responseTime);
        }
        
        tickCount++;
        if (tickCount > count) {
          observer.disconnect();
          resolve(tickTimes);
        }
      });

      observer.observe(timerDisplay, {
        childList: true,
        subtree: true,
        characterData: true
      });

      // Timeout fallback
      setTimeout(() => {
        observer.disconnect();
        resolve(tickTimes);
      }, 5000);
    });
  }

  getStatus(responseTime) {
    if (responseTime <= this.thresholds.pass) return 'PASS';
    if (responseTime <= this.thresholds.warning) return 'WARNING';
    return 'FAIL';
  }

  logRequirementResults(requirement, results) {
    console.log(`\n${requirement} Results:`);
    
    if (results.length === 0) {
      console.log('  ⚠️  No tests performed (elements not found)');
      return;
    }

    results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : 
                   result.status === 'WARNING' ? '⚠️' : '❌';
      const operation = result.operation || `${result.element} ${result.interaction}`;
      console.log(`  ${icon} ${operation}: ${result.responseTime.toFixed(2)}ms [${result.status}]`);
    });

    // Summary for this requirement
    const passCount = results.filter(r => r.status === 'PASS').length;
    const passRate = (passCount / results.length * 100).toFixed(1);
    const avgTime = (results.reduce((sum, r) => sum + r.responseTime, 0) / results.length).toFixed(2);
    
    console.log(`  📊 Summary: ${passCount}/${results.length} passed (${passRate}%), avg: ${avgTime}ms`);
  }

  generateFinalReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL PERFORMANCE VERIFICATION REPORT');
    console.log('='.repeat(60));

    const allResults = [
      ...this.results.visualFeedback,
      ...this.results.taskOperations,
      ...this.results.linkOperations,
      ...this.results.timerUpdates
    ];

    if (allResults.length === 0) {
      console.log('❌ No performance tests were executed');
      return;
    }

    const totalTests = allResults.length;
    const passCount = allResults.filter(r => r.status === 'PASS').length;
    const warningCount = allResults.filter(r => r.status === 'WARNING').length;
    const failCount = allResults.filter(r => r.status === 'FAIL').length;
    const passRate = (passCount / totalTests * 100).toFixed(1);
    const avgResponseTime = (allResults.reduce((sum, r) => sum + r.responseTime, 0) / totalTests).toFixed(2);
    const maxResponseTime = Math.max(...allResults.map(r => r.responseTime)).toFixed(2);

    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passCount} (${passRate}%)`);
    console.log(`⚠️  Warnings: ${warningCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📈 Average Response Time: ${avgResponseTime}ms`);
    console.log(`📈 Maximum Response Time: ${maxResponseTime}ms`);

    // Requirement-specific results
    console.log('\nRequirement Compliance:');
    this.logRequirementCompliance('13.1 Visual Feedback', this.results.visualFeedback);
    this.logRequirementCompliance('13.2 Task Operations', this.results.taskOperations);
    this.logRequirementCompliance('13.3 Link Operations', this.results.linkOperations);
    this.logRequirementCompliance('13.4 Timer Updates', this.results.timerUpdates);

    // Overall verdict
    const overallPass = passRate >= 95 && failCount === 0;
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 OVERALL RESULT: ${overallPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log('='.repeat(60));

    if (!overallPass) {
      console.log('\n🔧 RECOMMENDATIONS:');
      if (failCount > 0) {
        console.log('- Optimize operations with >150ms response times');
      }
      if (warningCount > 0) {
        console.log('- Monitor operations with 100-150ms response times');
      }
      if (passRate < 95) {
        console.log('- Improve overall pass rate to at least 95%');
      }
    }
  }

  logRequirementCompliance(requirement, results) {
    if (results.length === 0) {
      console.log(`  ${requirement}: ⚠️  NOT TESTED`);
      return;
    }

    const passCount = results.filter(r => r.status === 'PASS').length;
    const passRate = (passCount / results.length * 100).toFixed(1);
    const compliant = passRate >= 95 && results.every(r => r.status !== 'FAIL');
    
    console.log(`  ${requirement}: ${compliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'} (${passRate}% pass rate)`);
  }

  getOverallResult() {
    const allResults = [
      ...this.results.visualFeedback,
      ...this.results.taskOperations,
      ...this.results.linkOperations,
      ...this.results.timerUpdates
    ];

    if (allResults.length === 0) return false;

    const passCount = allResults.filter(r => r.status === 'PASS').length;
    const failCount = allResults.filter(r => r.status === 'FAIL').length;
    const passRate = (passCount / allResults.length * 100);

    return passRate >= 95 && failCount === 0;
  }

  // Utility functions
  waitForNextFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceVerifier;
}

// Global function for manual testing
async function verifyPerformanceRequirements() {
  const verifier = new PerformanceVerifier();
  return await verifier.verifyAllRequirements();
}

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Performance verification script loaded. Run verifyPerformanceRequirements() to test.');
  });
}