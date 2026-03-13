/**
 * Unit Tests for FocusTimer Component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FocusTimer } from '../../js/app.js';

describe('FocusTimer', () => {
  let container;
  let focusTimer;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (focusTimer) {
      focusTimer.destroy();
    }
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with 1500 seconds (25 minutes)', () => {
      focusTimer = new FocusTimer(container);
      expect(focusTimer.remainingSeconds).toBe(1500);
    });

    it('should initialize with isRunning as false', () => {
      focusTimer = new FocusTimer(container);
      expect(focusTimer.isRunning).toBe(false);
    });

    it('should initialize with intervalId as null', () => {
      focusTimer = new FocusTimer(container);
      expect(focusTimer.intervalId).toBeNull();
    });
  });

  describe('formatTime', () => {
    beforeEach(() => {
      focusTimer = new FocusTimer(container);
    });

    it('should format 1500 seconds as 25:00', () => {
      expect(focusTimer.formatTime(1500)).toBe('25:00');
    });

    it('should format 0 seconds as 00:00', () => {
      expect(focusTimer.formatTime(0)).toBe('00:00');
    });

    it('should format 60 seconds as 01:00', () => {
      expect(focusTimer.formatTime(60)).toBe('01:00');
    });

    it('should format 599 seconds as 09:59', () => {
      expect(focusTimer.formatTime(599)).toBe('09:59');
    });

    it('should format 5 seconds as 00:05', () => {
      expect(focusTimer.formatTime(5)).toBe('00:05');
    });

    it('should format 125 seconds as 02:05', () => {
      expect(focusTimer.formatTime(125)).toBe('02:05');
    });
  });

  describe('init', () => {
    it('should create the correct DOM structure', () => {
      focusTimer = new FocusTimer(container);
      focusTimer.init();

      const timerDiv = container.querySelector('.focus-timer');
      expect(timerDiv).toBeTruthy();

      const display = container.querySelector('.timer-display');
      expect(display).toBeTruthy();

      const controls = container.querySelector('.timer-controls');
      expect(controls).toBeTruthy();

      const startBtn = container.querySelector('.btn-start');
      expect(startBtn).toBeTruthy();

      const stopBtn = container.querySelector('.btn-stop');
      expect(stopBtn).toBeTruthy();

      const resetBtn = container.querySelector('.btn-reset');
      expect(resetBtn).toBeTruthy();
    });

    it('should display 25:00 initially', () => {
      focusTimer = new FocusTimer(container);
      focusTimer.init();

      const display = container.querySelector('.timer-display');
      expect(display.textContent).toBe('25:00');
    });
  });

  describe('start', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      focusTimer = new FocusTimer(container);
      focusTimer.init();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should set isRunning to true', () => {
      focusTimer.start();
      expect(focusTimer.isRunning).toBe(true);
    });

    it('should create an interval', () => {
      focusTimer.start();
      expect(focusTimer.intervalId).toBeTruthy();
    });

    it('should not create multiple intervals if already running', () => {
      focusTimer.start();
      const firstIntervalId = focusTimer.intervalId;
      focusTimer.start();
      expect(focusTimer.intervalId).toBe(firstIntervalId);
    });

    it('should begin countdown from current remaining time', () => {
      focusTimer.remainingSeconds = 100;
      focusTimer.render();
      focusTimer.start();
      
      vi.advanceTimersByTime(1000);
      expect(focusTimer.remainingSeconds).toBe(99);
    });
  });

  describe('stop', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      focusTimer = new FocusTimer(container);
      focusTimer.init();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should set isRunning to false', () => {
      focusTimer.start();
      focusTimer.stop();
      expect(focusTimer.isRunning).toBe(false);
    });

    it('should clear the interval', () => {
      focusTimer.start();
      focusTimer.stop();
      expect(focusTimer.intervalId).toBeNull();
    });

    it('should preserve remaining seconds', () => {
      focusTimer.start();
      vi.advanceTimersByTime(3000);
      const remainingBeforeStop = focusTimer.remainingSeconds;
      focusTimer.stop();
      expect(focusTimer.remainingSeconds).toBe(remainingBeforeStop);
    });

    it('should do nothing if already stopped', () => {
      focusTimer.stop();
      expect(focusTimer.isRunning).toBe(false);
      expect(focusTimer.intervalId).toBeNull();
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      focusTimer = new FocusTimer(container);
      focusTimer.init();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return to 1500 seconds', () => {
      focusTimer.remainingSeconds = 500;
      focusTimer.reset();
      expect(focusTimer.remainingSeconds).toBe(1500);
    });

    it('should stop the timer if running', () => {
      focusTimer.start();
      focusTimer.reset();
      expect(focusTimer.isRunning).toBe(false);
      expect(focusTimer.intervalId).toBeNull();
    });

    it('should update the display to 25:00', () => {
      focusTimer.remainingSeconds = 100;
      focusTimer.render();
      focusTimer.reset();
      const display = container.querySelector('.timer-display');
      expect(display.textContent).toBe('25:00');
    });
  });

  describe('tick', () => {
    beforeEach(() => {
      focusTimer = new FocusTimer(container);
      focusTimer.init();
    });

    it('should decrement remainingSeconds by 1', () => {
      focusTimer.remainingSeconds = 100;
      focusTimer.tick();
      expect(focusTimer.remainingSeconds).toBe(99);
    });

    it('should update the display', () => {
      focusTimer.remainingSeconds = 100;
      focusTimer.tick();
      const display = container.querySelector('.timer-display');
      expect(display.textContent).toBe('01:39');
    });

    it('should stop the timer when reaching zero', () => {
      vi.useFakeTimers();
      focusTimer.remainingSeconds = 1;
      focusTimer.isRunning = true;
      focusTimer.intervalId = setInterval(() => focusTimer.tick(), 1000);
      
      focusTimer.tick();
      
      expect(focusTimer.remainingSeconds).toBe(0);
      expect(focusTimer.isRunning).toBe(false);
      expect(focusTimer.intervalId).toBeNull();
      
      vi.useRealTimers();
    });

    it('should not decrement below zero', () => {
      focusTimer.remainingSeconds = 0;
      focusTimer.tick();
      expect(focusTimer.remainingSeconds).toBe(0);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      focusTimer = new FocusTimer(container);
      focusTimer.init();
    });

    it('should update display element with formatted time', () => {
      focusTimer.remainingSeconds = 500;
      focusTimer.render();
      const display = container.querySelector('.timer-display');
      expect(display.textContent).toBe('08:20');
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      focusTimer = new FocusTimer(container);
      focusTimer.init();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should stop the timer', () => {
      focusTimer.start();
      focusTimer.destroy();
      expect(focusTimer.isRunning).toBe(false);
      expect(focusTimer.intervalId).toBeNull();
    });
  });
});
