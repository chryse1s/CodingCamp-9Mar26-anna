/**
 * Unit tests for QuickLinksManager component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Set up DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = localStorageMock;

// Import components after setting up globals
const { QuickLinksManager, LocalStorageService } = await import('../../js/app.js');

describe('QuickLinksManager - Link Deletion', () => {
  let container;
  let manager;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Create fresh container
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Create and initialize manager
    manager = new QuickLinksManager(container);
    manager.init();
  });

  it('should provide a delete button for each link', () => {
    // Add a link
    manager.addLink('Test Link', 'https://example.com');
    
    // Verify delete button exists
    const deleteButton = container.querySelector('.btn-delete-link');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent).toBe('Delete');
  });

  it('should remove link from array when delete button is clicked', () => {
    // Add two links
    manager.addLink('Link 1', 'https://example1.com');
    manager.addLink('Link 2', 'https://example2.com');
    
    expect(manager.links.length).toBe(2);
    
    // Get the first link's ID and delete it
    const firstLinkId = manager.links[0].id;
    manager.deleteLink(firstLinkId);
    
    // Verify link was removed
    expect(manager.links.length).toBe(1);
    expect(manager.links.find(l => l.id === firstLinkId)).toBeUndefined();
    expect(manager.links[0].name).toBe('Link 2');
  });

  it('should update display to hide removed link', () => {
    // Add two links
    manager.addLink('Link 1', 'https://example1.com');
    manager.addLink('Link 2', 'https://example2.com');
    
    // Verify both links are displayed
    let linkItems = container.querySelectorAll('.link-item');
    expect(linkItems.length).toBe(2);
    
    // Delete the first link
    const firstLinkId = manager.links[0].id;
    manager.deleteLink(firstLinkId);
    
    // Verify only one link is displayed
    linkItems = container.querySelectorAll('.link-item');
    expect(linkItems.length).toBe(1);
    expect(linkItems[0].querySelector('.link-button').textContent).toBe('Link 2');
  });

  it('should save links to Local Storage after deletion', () => {
    // Add two links
    manager.addLink('Link 1', 'https://example1.com');
    manager.addLink('Link 2', 'https://example2.com');
    
    // Delete the first link
    const firstLinkId = manager.links[0].id;
    manager.deleteLink(firstLinkId);
    
    // Verify saved to localStorage
    const savedLinks = LocalStorageService.get(LocalStorageService.LINKS_KEY);
    expect(savedLinks).toBeTruthy();
    expect(savedLinks.length).toBe(1);
    expect(savedLinks[0].name).toBe('Link 2');
  });

  it('should handle deleting the only link in list', () => {
    // Add one link
    manager.addLink('Only Link', 'https://example.com');
    expect(manager.links.length).toBe(1);
    
    // Delete it
    const linkId = manager.links[0].id;
    manager.deleteLink(linkId);
    
    // Verify empty list
    expect(manager.links.length).toBe(0);
    const linkItems = container.querySelectorAll('.link-item');
    expect(linkItems.length).toBe(0);
  });

  it('should handle deleting from middle of list', () => {
    // Add three links
    manager.addLink('Link 1', 'https://example1.com');
    manager.addLink('Link 2', 'https://example2.com');
    manager.addLink('Link 3', 'https://example3.com');
    
    // Delete the middle link
    const middleLinkId = manager.links[1].id;
    manager.deleteLink(middleLinkId);
    
    // Verify correct link was removed
    expect(manager.links.length).toBe(2);
    expect(manager.links[0].name).toBe('Link 1');
    expect(manager.links[1].name).toBe('Link 3');
  });

  it('should handle deleting non-existent link gracefully', () => {
    // Add one link
    manager.addLink('Test Link', 'https://example.com');
    const originalLength = manager.links.length;
    
    // Try to delete non-existent link
    manager.deleteLink('non-existent-id');
    
    // Verify list unchanged
    expect(manager.links.length).toBe(originalLength);
  });
});

describe('QuickLinksManager - Persistence Integration', () => {
  let container;
  let manager;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Create fresh container
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Create and initialize manager
    manager = new QuickLinksManager(container);
  });

  it('should call loadLinks() on component initialization', () => {
    // Spy on loadLinks method
    const loadLinksSpy = vi.spyOn(manager, 'loadLinks');
    
    // Initialize component
    manager.init();
    
    // Verify loadLinks was called
    expect(loadLinksSpy).toHaveBeenCalled();
  });

  it('should handle empty Local Storage gracefully', () => {
    // Ensure localStorage is empty
    localStorage.clear();
    
    // Initialize component
    manager.init();
    
    // Verify empty array is used
    expect(manager.links).toEqual([]);
    expect(manager.links.length).toBe(0);
    
    // Verify display shows empty list
    const linkItems = container.querySelectorAll('.link-item');
    expect(linkItems.length).toBe(0);
  });

  it('should call saveLinks() after adding a link', () => {
    manager.init();
    
    // Spy on saveLinks method
    const saveLinksSpy = vi.spyOn(manager, 'saveLinks');
    
    // Add a link
    manager.addLink('Test Link', 'https://example.com');
    
    // Verify saveLinks was called
    expect(saveLinksSpy).toHaveBeenCalled();
  });

  it('should call saveLinks() after deleting a link', () => {
    manager.init();
    
    // Add a link first
    manager.addLink('Test Link', 'https://example.com');
    
    // Spy on saveLinks method
    const saveLinksSpy = vi.spyOn(manager, 'saveLinks');
    
    // Delete the link
    const linkId = manager.links[0].id;
    manager.deleteLink(linkId);
    
    // Verify saveLinks was called
    expect(saveLinksSpy).toHaveBeenCalled();
  });

  it('should persist links across component instances', () => {
    manager.init();
    
    // Add links
    manager.addLink('Link 1', 'https://example1.com');
    manager.addLink('Link 2', 'https://example2.com');
    
    // Create new manager instance
    const newContainer = document.createElement('div');
    document.body.appendChild(newContainer);
    const newManager = new QuickLinksManager(newContainer);
    newManager.init();
    
    // Verify links were loaded
    expect(newManager.links.length).toBe(2);
    expect(newManager.links[0].name).toBe('Link 1');
    expect(newManager.links[1].name).toBe('Link 2');
  });

  it('should load and display links from Local Storage on init', () => {
    // Pre-populate localStorage with links
    const testLinks = [
      { id: '1', name: 'Link 1', url: 'https://example1.com', createdAt: Date.now() },
      { id: '2', name: 'Link 2', url: 'https://example2.com', createdAt: Date.now() }
    ];
    LocalStorageService.set(LocalStorageService.LINKS_KEY, testLinks);
    
    // Initialize component
    manager.init();
    
    // Verify links were loaded
    expect(manager.links.length).toBe(2);
    expect(manager.links[0].name).toBe('Link 1');
    expect(manager.links[1].name).toBe('Link 2');
    
    // Verify links are displayed
    const linkItems = container.querySelectorAll('.link-item');
    expect(linkItems.length).toBe(2);
  });

  it('should handle corrupted data in Local Storage gracefully', () => {
    // Put invalid JSON in localStorage
    localStorage.setItem(LocalStorageService.LINKS_KEY, 'invalid-json{');
    
    // Initialize component (should not throw)
    expect(() => manager.init()).not.toThrow();
    
    // Verify empty array is used as fallback
    expect(manager.links).toEqual([]);
  });

  it('should handle non-array data in Local Storage gracefully', () => {
    // Put non-array data in localStorage
    LocalStorageService.set(LocalStorageService.LINKS_KEY, { not: 'an array' });
    
    // Initialize component
    manager.init();
    
    // Verify empty array is used as fallback
    expect(manager.links).toEqual([]);
  });

  it('should save all link properties to Local Storage', () => {
    manager.init();
    
    // Add a link
    manager.addLink('Test Link', 'https://example.com');
    
    // Retrieve from localStorage
    const savedLinks = LocalStorageService.get(LocalStorageService.LINKS_KEY);
    
    // Verify all properties are saved
    expect(savedLinks[0]).toHaveProperty('id');
    expect(savedLinks[0]).toHaveProperty('name', 'Test Link');
    expect(savedLinks[0]).toHaveProperty('url', 'https://example.com');
    expect(savedLinks[0]).toHaveProperty('createdAt');
  });

  it('should maintain link order after save and load', () => {
    manager.init();
    
    // Add links in specific order
    manager.addLink('First', 'https://first.com');
    manager.addLink('Second', 'https://second.com');
    manager.addLink('Third', 'https://third.com');
    
    // Create new manager instance
    const newContainer = document.createElement('div');
    document.body.appendChild(newContainer);
    const newManager = new QuickLinksManager(newContainer);
    newManager.init();
    
    // Verify order is preserved
    expect(newManager.links[0].name).toBe('First');
    expect(newManager.links[1].name).toBe('Second');
    expect(newManager.links[2].name).toBe('Third');
  });
});
