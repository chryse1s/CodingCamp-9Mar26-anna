# Productivity Dashboard - Setup Instructions

## Prerequisites

This project requires Node.js and npm to be installed on your system.

### Installing Node.js

1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Install the LTS (Long Term Support) version
3. Verify installation by running:
   ```bash
   node --version
   npm --version
   ```

## Installation

Once Node.js is installed, run the following command in the project directory:

```bash
npm install
```

This will install all required dependencies:
- **vitest**: Fast unit testing framework with jsdom support
- **fast-check**: Property-based testing library
- **jsdom**: DOM implementation for Node.js testing
- **@vitest/ui**: Optional UI for test visualization

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (during development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests with UI
```bash
npm run test:ui
```

## Project Structure

```
productivity-dashboard/
├── index.html              # Main entry point
├── css/
│   └── styles.css          # All application styles
├── js/
│   └── app.js              # All application logic
├── tests/
│   ├── setup.test.js       # Testing framework verification
│   ├── unit/               # Unit tests directory
│   └── properties/         # Property-based tests directory
├── package.json            # Project configuration and dependencies
└── vitest.config.js        # Vitest configuration
```

## Testing Configuration

The project is configured with:
- **jsdom environment**: Provides DOM APIs for testing
- **Minimum 100 iterations**: All property-based tests run at least 100 times
- **Coverage reporting**: Tracks code coverage with v8 provider

## Opening the Dashboard

To view the dashboard in your browser:

1. Open `index.html` in a modern web browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
2. Or use a local development server:
   ```bash
   npx serve .
   ```

## Next Steps

After completing the setup:
1. Run `npm test` to verify the testing framework is working
2. Open `index.html` in a browser to see the basic structure
3. Proceed with implementing the dashboard components

## Requirements Validated

This setup satisfies the following requirements:
- **Requirement 15.1**: Single CSS file in css/ directory ✓
- **Requirement 15.2**: Single JavaScript file in js/ directory ✓
- **Requirement 15.3**: Single HTML file as main entry point ✓
