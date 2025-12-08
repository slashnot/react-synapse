import { describe, it, expect, beforeEach } from 'vitest'
import { GlobalStore } from '../hooks/globalStore'
import { createSignal } from '../index'

describe('GlobalStore', () => {
  let store

  beforeEach(() => {
    store = new GlobalStore()
  })

  describe('getStore', () => {
    it('should return the raw store object', () => {
      const result = store.getStore()
      expect(typeof result).toBe('object')
      expect(result).toBe(store.store)
    })

    it('should return an empty object initially', () => {
      const result = store.getStore()
      expect(Object.keys(result)).toHaveLength(0)
    })
  })

  describe('getStoreValues', () => {
    it('should return empty object when store is empty', () => {
      const result = store.getStoreValues()
      expect(result).toEqual({})
    })

    it('should return current values from all signals', () => {
      store.setStoreState('count', 5)
      store.setStoreState('name', 'test')
      store.setStoreState('data', { key: 'value' })

      const result = store.getStoreValues()
      expect(result).toEqual({
        count: 5,
        name: 'test',
        data: { key: 'value' }
      })
    })
  })

  describe('getStoreState', () => {
    it('should return undefined for non-existent state', () => {
      const result = store.getStoreState('non-existent')
      expect(result).toBeUndefined()
    })

    it('should return the signal for existing state', () => {
      store.setStoreState('test', 'value')
      const result = store.getStoreState('test')
      
      expect(result).toBeDefined()
      expect(result.value).toBe('value')
      expect(result.id).toBe('test')
    })
  })

  describe('setStoreState', () => {
    it('should create new signal with primitive value', () => {
      const result = store.setStoreState('count', 42)
      
      expect(result).toBeDefined()
      expect(result.value).toBe(42)
      expect(result.id).toBe('count')
      expect(store.hasState('count')).toBe(true)
    })

    it('should create new signal with object value', () => {
      const userData = { name: 'John', age: 30 }
      const result = store.setStoreState('user', userData)
      
      expect(result.value).toEqual(userData)
      expect(result.id).toBe('user')
    })

    it('should create new signal with array value', () => {
      const items = [1, 2, 3]
      const result = store.setStoreState('items', items)
      
      expect(result.value).toEqual(items)
      expect(result.id).toBe('items')
    })

    it('should warn and skip when state already exists', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      store.setStoreState('existing', 'first')
      store.setStoreState('existing', 'second')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Signal with id "existing" already exists in the global store. Skipping creation.'
      )
      expect(store.getStoreState('existing').value).toBe('first')
      
      consoleSpy.mockRestore()
    })

    it('should log creation of new signal', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      store.setStoreState('new-signal', 'test-value')
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Created signal with id "new-signal" in the global store with value:',
        'test-value'
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('hasState', () => {
    it('should return false for non-existent state', () => {
      expect(store.hasState('non-existent')).toBe(false)
    })

    it('should return true for existing state', () => {
      store.setStoreState('existing', 'value')
      expect(store.hasState('existing')).toBe(true)
    })
  })

  describe('clearStore', () => {
    it('should clear all store states', () => {
      store.setStoreState('state1', 'value1')
      store.setStoreState('state2', 'value2')
      store.setStoreState('state3', 'value3')
      
      expect(Object.keys(store.getStore())).toHaveLength(3)
      
      store.clearStore()
      
      expect(Object.keys(store.getStore())).toHaveLength(0)
      expect(store.getStoreValues()).toEqual({})
    })

    it('should return the cleared store object', () => {
      store.setStoreState('test', 'value')
      const result = store.clearStore()
      
      expect(result).toBe(store.store)
      expect(Object.keys(result)).toHaveLength(0)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complex state management workflow', () => {
      // Create multiple signals using setStoreState
      store.setStoreState('user', { id: 1, name: 'John', preferences: { theme: 'light' } })
      store.setStoreState('settings', { notifications: true, language: 'en' })
      store.setStoreState('counter', 0)

      // Update values
      store.getStoreState('user').set(draft => {
        draft.preferences.theme = 'dark'
      })

      store.getStoreState('counter').set(10)

      // Verify all changes
      expect(store.getStoreValues()).toEqual({
        user: { id: 1, name: 'John', preferences: { theme: 'dark' } },
        settings: { notifications: true, language: 'en' },
        counter: 10
      })

      // Clear and verify
      store.clearStore()
      expect(store.getStoreValues()).toEqual({})
    })

    it('should maintain signal identity across operations', () => {
      store.setStoreState('test', 'initial')
      const signal1 = store.getStoreState('test')
      
      signal1.set('updated')
      const signal2 = store.getStoreState('test')
      
      expect(signal1).toBe(signal2)
      expect(signal1.value).toBe('updated')
      expect(signal2.value).toBe('updated')
    })

    it('should handle nested object updates with draft mutations', () => {
      store.setStoreState('config', {
        api: { url: 'https://example.com', timeout: 5000 },
        features: { darkMode: true }
      })
      
      const configSignal = store.getStoreState('config')
      
      // Update nested property using draft
      configSignal.set(draft => {
        draft.api.timeout = 10000
        draft.features.darkMode = false
      })
      
      expect(store.getStoreState('config').value).toEqual({
        api: { url: 'https://example.com', timeout: 10000 },
        features: { darkMode: false }
      })
    })

    it('should handle empty objects and arrays', () => {
      store.setStoreState('empty', {})
      store.setStoreState('array', [])
      
      expect(store.getStoreState('empty').value).toEqual({})
      expect(store.getStoreState('array').value).toEqual([])
      
      // Add items to array
      store.getStoreState('array').set(draft => {
        draft.push(1, 2, 3)
      })
      
      expect(store.getStoreState('array').value).toEqual([1, 2, 3])
    })
  })
})