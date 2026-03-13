/**
 * Unit Tests for GreetingDisplay Component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GreetingDisplay } from '../../js/app.js';

describe('GreetingDisplay', () => {
  let container;
  let greetingDisplay;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (greetingDisplay) {
      greetingDisplay.destroy();
    }
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should accept a container element', () => {
      greetingDisplay = new GreetingDisplay(container);
      expect(greetingDisplay.container).toBe(container);
    });
  });

  describe('formatTime', () => {
    beforeEach(() => {
      greetingDisplay = new GreetingDisplay(container);
    });

    it('should format time in 12-hour format with AM/PM', () => {
      const date = new Date('2024-01-15T09:45:00');
      expect(greetingDisplay.formatTime(date)).toBe('09:45 AM');
    });

    it('should format time with leading zeros for single-digit hours', () => {
      const date = new Date('2024-01-15T03:05:00');
      expect(greetingDisplay.formatTime(date)).toBe('03:05 AM');
    });

    it('should format time with leading zeros for single-digit minutes', () => {
      const date = new Date('2024-01-15T10:05:00');
      expect(greetingDisplay.formatTime(date)).toBe('10:05 AM');
    });

    it('should convert midnight (00:00) to 12:00 AM', () => {
      const date = new Date('2024-01-15T00:00:00');
      expect(greetingDisplay.formatTime(date)).toBe('12:00 AM');
    });

    it('should convert noon (12:00) to 12:00 PM', () => {
      const date = new Date('2024-01-15T12:00:00');
      expect(greetingDisplay.formatTime(date)).toBe('12:00 PM');
    });

    it('should convert 13:00 to 01:00 PM', () => {
      const date = new Date('2024-01-15T13:00:00');
      expect(greetingDisplay.formatTime(date)).toBe('01:00 PM');
    });

    it('should convert 23:59 to 11:59 PM', () => {
      const date = new Date('2024-01-15T23:59:00');
      expect(greetingDisplay.formatTime(date)).toBe('11:59 PM');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      greetingDisplay = new GreetingDisplay(container);
    });

    it('should format date with day of week, month, and day', () => {
      const date = new Date('2024-01-15T12:00:00');
      expect(greetingDisplay.formatDate(date)).toBe('Monday, January 15');
    });

    it('should handle different months correctly', () => {
      const date = new Date('2024-12-25T12:00:00');
      expect(greetingDisplay.formatDate(date)).toBe('Wednesday, December 25');
    });

    it('should handle different days of week correctly', () => {
      const date = new Date('2024-01-14T12:00:00');
      expect(greetingDisplay.formatDate(date)).toBe('Sunday, January 14');
    });
  });

  describe('getGreeting', () => {
    beforeEach(() => {
      greetingDisplay = new GreetingDisplay(container);
    });

    it('should return "Good Morning" for 5 AM', () => {
      expect(greetingDisplay.getGreeting(5)).toBe('Good Morning');
    });

    it('should return "Good Morning" for 11 AM', () => {
      expect(greetingDisplay.getGreeting(11)).toBe('Good Morning');
    });

    it('should return "Good Afternoon" for 12 PM', () => {
      expect(greetingDisplay.getGreeting(12)).toBe('Good Afternoon');
    });

    it('should return "Good Afternoon" for 4 PM', () => {
      expect(greetingDisplay.getGreeting(16)).toBe('Good Afternoon');
    });

    it('should return "Good Evening" for 5 PM', () => {
      expect(greetingDisplay.getGreeting(17)).toBe('Good Evening');
    });

    it('should return "Good Evening" for 8 PM', () => {
      expect(greetingDisplay.getGreeting(20)).toBe('Good Evening');
    });

    it('should return "Good Night" for 9 PM', () => {
      expect(greetingDisplay.getGreeting(21)).toBe('Good Night');
    });

    it('should return "Good Night" for 4 AM', () => {
      expect(greetingDisplay.getGreeting(4)).toBe('Good Night');
    });

    it('should return "Good Night" for midnight', () => {
      expect(greetingDisplay.getGreeting(0)).toBe('Good Night');
    });
  });

  describe('init', () => {
    it('should create the correct DOM structure', () => {
      greetingDisplay = new GreetingDisplay(container);
      greetingDisplay.init();

      const greetingDisplayDiv = container.querySelector('.greeting-display');
      expect(greetingDisplayDiv).toBeTruthy();

      const greetingText = container.querySelector('.greeting-text');
      expect(greetingText).toBeTruthy();

      const currentTime = container.querySelector('.current-time');
      expect(currentTime).toBeTruthy();

      const currentDate = container.querySelector('.current-date');
      expect(currentDate).toBeTruthy();
    });

    it('should populate greeting, time, and date on init', () => {
      greetingDisplay = new GreetingDisplay(container);
      greetingDisplay.init();

      const greetingText = container.querySelector('.greeting-text');
      const currentTime = container.querySelector('.current-time');
      const currentDate = container.querySelector('.current-date');

      expect(greetingText.textContent).toBeTruthy();
      expect(currentTime.textContent).toBeTruthy();
      expect(currentDate.textContent).toBeTruthy();
    });

    it('should set up interval to update every second', () => {
      vi.useFakeTimers();
      greetingDisplay = new GreetingDisplay(container);
      greetingDisplay.init();

      const initialTime = container.querySelector('.current-time').textContent;
      
      vi.advanceTimersByTime(1000);
      
      expect(greetingDisplay.intervalId).toBeTruthy();
      
      vi.useRealTimers();
    });
  });

  describe('destroy', () => {
    it('should clear the interval', () => {
      greetingDisplay = new GreetingDisplay(container);
      greetingDisplay.init();

      const intervalId = greetingDisplay.intervalId;
      expect(intervalId).toBeTruthy();

      greetingDisplay.destroy();
      expect(greetingDisplay.intervalId).toBeNull();
    });
  });
});
