/**
 * Browser Compatibility Test Script
 * Run this script in the browser console to verify basic functionality
 * across different browsers for the Productivity Dashboard
 */

console.log('🌐 Browser Compatibility Test Starting...');
console.log('Browser:', navigator.userAgent);

// Test results storage
const testResults = {
  browser: navigator.userAgent,
  timestamp: new Date().toISOString(),
  tests: []
};

// Test utility functions
function logTest(name, passed, details = '') {
  const result = { name, passed, details };
  testResults.tests.push(result);
  
  if (passed) {
    console.log(`✅ ${name}${details ? ` - ${details}` : ''}`);
  } else {
    console.error(`❌ ${name}${details ? ` - ${details}` : ''}`);
  }
  
  return passed;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test function
async function runBrowserCompatibilityTests() {
  let allPassed = true;
  
  console.log('\n📋 Testing Web API Compatibility...');
  
  // Test 1: Local Storage API
  try {
    const testKey = 'browser-compat-test';
    const testData = { test: true, timestamp: Date.now() };
    
    localStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    const storageWorks = retrieved && retrieved.test === true;
    
    localStorage.removeItem(testKey);
    
    allPassed &= logTest('Local Storage API', storageWorks, 
      storageWorks ? 'get/set/remove operations work' : 'Local Storage operations failed');
  } catch (error) {
    allPassed &= logTest('Local Storage API', false, `Error: ${error.message}`);
  }
  
  // Test 2: setInterval API
  try {
    let intervalCount = 0;
    const intervalId = setInterval(() => {
      intervalCount++;
    }, 100);
    
    await wait(350);
    clearInterval(intervalId);
    
    const intervalWorks = intervalCount >= 2 && intervalCount <= 4;
    allPassed &= logTest('setInterval API', intervalWorks, 
      intervalWorks ? `Fired ${intervalCount} times in 350ms` : `Unexpected count: ${intervalCount}`);
  } catch (error) {
    allPassed &= logTest('setInterval API', false, `Error: ${error.message}`);
  }
  
  // Test 3: Date API
  try {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    
    const dateWorks = timeString && dateString && !isNaN(now.getTime());
    allPassed &= logTest('Date API', dateWorks, 
      dateWorks ? 'Date operations work correctly' : 'Date API issues detected');
  } catch (error) {
    allPassed &= logTest('Date API', false, `Error: ${error.message}`);
  }
  
  // Test 4: JSON API
  try {
    const testObj = { name: 'test', value: 123, nested: { prop: true } };
    const jsonString = JSON.stringify(testObj);
    const parsed = JSON.parse(jsonString);
    
    const jsonWorks = parsed.name === 'test' && parsed.value === 123 && parsed.nested.prop === true;
    allPassed &= logTest('JSON API', jsonWorks, 
      jsonWorks ? 'stringify/parse operations work' : 'JSON operations failed');
  } catch (error) {
    allPassed &= logTest('JSON API', false, `Error: ${error.message}`);
  }
  
  console.log('\n🏗️ Testing DOM API Compatibility...');
  
  // Test 5: DOM Query Methods
  try {
    const body = document.querySelector('body');
    const allDivs = document.querySelectorAll('div');
    const byId = document.getElementById('greeting-display');
    
    const domWorks = body && allDivs && (byId || true); // byId might be null, that's ok
    allPassed &= logTest('DOM Query Methods', domWorks, 
      domWorks ? 'querySelector/querySelectorAll/getElementById work' : 'DOM query methods failed');
  } catch (error) {
    allPassed &= logTest('DOM Query Methods', false, `Error: ${error.message}`);
  }
  
  // Test 6: Event Listeners
  try {
    let eventFired = false;
    const testElement = document.createElement('div');
    
    const handler = () => { eventFired = true; };
    testElement.addEventListener('click', handler);
    
    // Simulate click
    const clickEvent = new Event('click');
    testElement.dispatchEvent(clickEvent);
    
    testElement.removeEventListener('click', handler);
    
    allPassed &= logTest('Event Listeners', eventFired, 
      eventFired ? 'addEventListener/removeEventListener work' : 'Event listener system failed');
  } catch (error) {
    allPassed &= logTest('Event Listeners', false, `Error: ${error.message}`);
  }
  
  console.log('\n🎨 Testing CSS and Layout...');
  
  // Test 7: CSS Support
  try {
    const testDiv = document.createElement('div');
    testDiv.style.display = 'flex';
    testDiv.style.gridTemplateColumns = '1fr 1fr';
    testDiv.style.transform = 'translateX(10px)';
    
    const cssWorks = testDiv.style.display === 'flex' && 
                     testDiv.style.gridTemplateColumns === '1fr 1fr' &&
                     testDiv.style.transform === 'translateX(10px)';
    
    allPassed &= logTest('CSS Support', cssWorks, 
      cssWorks ? 'Flexbox, Grid, and Transform supported' : 'Some CSS features not supported');
  } catch (error) {
    allPassed &= logTest('CSS Support', false, `Error: ${error.message}`);
  }
  
  console.log('\n🔧 Testing Application Components...');
  
  // Test 8: Component Initialization
  try {
    const greetingDisplay = document.querySelector('#greeting-display .greeting-display');
    const focusTimer = document.querySelector('#focus-timer .focus-timer');
    const taskList = document.querySelector('#task-list .task-list');
    const quickLinks = document.querySelector('#quick-links-manager .quick-links-manager');
    
    const componentsLoaded = greetingDisplay && focusTimer && taskList && quickLinks;
    allPassed &= logTest('Component Initialization', componentsLoaded, 
      componentsLoaded ? 'All components initialized' : 'Some components missing');
  } catch (error) {
    allPassed &= logTest('Component Initialization', false, `Error: ${error.message}`);
  }
  
  // Test 9: Form Elements
  try {
    const taskInput = document.querySelector('.task-input');
    const linkNameInput = document.querySelector('.link-name-input');
    const linkUrlInput = document.querySelector('.link-url-input');
    
    const formsWork = taskInput && linkNameInput && linkUrlInput &&
                      taskInput.type === 'text' && linkUrlInput.type === 'url';
    
    allPassed &= logTest('Form Elements', formsWork, 
      formsWork ? 'Input elements work correctly' : 'Form element issues detected');
  } catch (error) {
    allPassed &= logTest('Form Elements', false, `Error: ${error.message}`);
  }
  
  // Test 10: Button Interactions
  try {
    const startBtn = document.querySelector('.btn-start');
    const addTaskBtn = document.querySelector('.btn-add-task');
    const addLinkBtn = document.querySelector('.btn-add-link');
    
    const buttonsWork = startBtn && addTaskBtn && addLinkBtn;
    allPassed &= logTest('Button Elements', buttonsWork, 
      buttonsWork ? 'All buttons present' : 'Some buttons missing');
  } catch (error) {
    allPassed &= logTest('Button Elements', false, `Error: ${error.message}`);
  }
  
  console.log('\n📊 Test Summary');
  console.log('='.repeat(50));
  
  const passedTests = testResults.tests.filter(t => t.passed).length;
  const totalTests = testResults.tests.length;
  
  console.log(`Browser: ${navigator.userAgent.split(' ')[0]}`);
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
  
  if (allPassed) {
    console.log('🎉 ALL COMPATIBILITY TESTS PASSED!');
    console.log('✅ This browser is fully compatible with the Productivity Dashboard');
  } else {
    console.log('⚠️ Some compatibility issues detected');
    console.log('❌ Check the failed tests above for details');
  }
  
  // Store results for reporting
  window.browserCompatibilityResults = testResults;
  
  return { allPassed, results: testResults };
}

// Auto-run tests
runBrowserCompatibilityTests().then(({ allPassed, results }) => {
  console.log('\n📋 Test Results Available:');
  console.log('Access detailed results: window.browserCompatibilityResults');
  console.log('Copy results: copy(JSON.stringify(window.browserCompatibilityResults, null, 2))');
});

// Export test function for manual execution
window.runBrowserCompatibilityTests = runBrowserCompatibilityTests;