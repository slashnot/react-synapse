import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createSignalStore } from '../hooks/useSignalStore'
import { globalStore } from '../hooks/globalStore'

describe('createSignalStore', () => {
  beforeEach(() => {
    globalStore.clearStore()
  })

  it('should return object with store and useStore', () => {
    const initialStates = {
      user: { name: 'Alice', age: 30 },
      theme: 'light'
    }

    const result = createSignalStore(initialStates)

    expect(result).toHaveProperty('store')
    expect(result).toHaveProperty('useStore')
    expect(typeof result.useStore).toBe('function')
  })

  it('should create multiple signals from initial states object', () => {
    const initialStates = {
      user: { name: 'Alice', age: 30 },
      theme: 'light',
      notifications: []
    }

    const { store } = createSignalStore(initialStates)

    expect(store.user.value).toEqual({ name: 'Alice', age: 30 })
    expect(store.theme.value).toBe('light')
    expect(store.notifications.value).toEqual([])
    expect(store.user.id).toBe('user')
    expect(store.theme.id).toBe('theme')
  })

  it('should handle object with nested properties', () => {
    const initialStates = {
      config: {
        api: { url: 'https://api.example.com', timeout: 5000 },
        features: { darkMode: true, notifications: false }
      }
    }

    const { store } = createSignalStore(initialStates)

    expect(store.config.value).toEqual({
      api: { url: 'https://api.example.com', timeout: 5000 },
      features: { darkMode: true, notifications: false }
    })
  })

  it('should throw error for non-object initialStates', () => {
    expect(() => {
      createSignalStore(null)
    }).toThrow('createSignalStore expects an object as initialStates')

    expect(() => {
      createSignalStore('not an object')
    }).toThrow('createSignalStore expects an object as initialStates')

    expect(() => {
      createSignalStore(123)
    }).toThrow('createSignalStore expects an object as initialStates')
  })

  it('should work with empty objects', () => {
    const initialStates = {
      emptyObj: {},
      emptyArr: []
    }

    const { store } = createSignalStore(initialStates)

    expect(store.emptyObj.value).toEqual({})
    expect(store.emptyArr.value).toEqual([])
  })
})

describe('useStore from createSignalStore', () => {
  beforeEach(() => {
    globalStore.clearStore()
  })

  it('should access store values by key using useStore hook', () => {
    const { useStore } = createSignalStore({
      user: { name: 'John', age: 25 },
      theme: 'light'
    })

    const { result: userResult } = renderHook(() => useStore('user'))
    const { result: themeResult } = renderHook(() => useStore('theme'))

    expect(userResult.current[0]).toEqual({ name: 'John', age: 25 })
    expect(themeResult.current[0]).toBe('light')
  })

  it('should update values using the setter from useStore', () => {
    const { useStore } = createSignalStore({
      counter: 0
    })

    const { result } = renderHook(() => useStore('counter'))

    expect(result.current[0]).toBe(0)

    act(() => {
      const [, setCounter] = result.current
      setCounter(10)
    })

    expect(result.current[0]).toBe(10)
  })

  it('should work with draft mutations for objects', () => {
    const { useStore } = createSignalStore({
      user: { name: 'John', age: 25, preferences: { theme: 'light' } }
    })

    const { result } = renderHook(() => useStore('user'))

    act(() => {
      const [, setUser] = result.current
      setUser(draft => {
        draft.age = 26
        draft.preferences.theme = 'dark'
      })
    })

    expect(result.current[0]).toEqual({
      name: 'John',
      age: 26,
      preferences: { theme: 'dark' }
    })
  })

  it('should throw error for non-existent key', () => {
    const { useStore } = createSignalStore({
      user: { name: 'John' }
    })

    expect(() => {
      renderHook(() => useStore('nonExistent'))
    }).toThrow('Store key "nonExistent" does not exist')
  })

  it('should share state between multiple useStore instances', () => {
    const { useStore } = createSignalStore({
      counter: 0
    })

    const { result: result1 } = renderHook(() => useStore('counter'))
    const { result: result2 } = renderHook(() => useStore('counter'))

    expect(result1.current[0]).toBe(0)
    expect(result2.current[0]).toBe(0)

    // Update from one instance
    act(() => {
      const [, setCounter] = result1.current
      setCounter(100)
    })

    // Both instances should reflect the update
    expect(result1.current[0]).toBe(100)
    expect(result2.current[0]).toBe(100)
  })

  it('should maintain stable setter reference from useStore', () => {
    const { useStore } = createSignalStore({
      value: 'test'
    })

    const { result, rerender } = renderHook(() => useStore('value'))

    const [, firstSetter] = result.current

    rerender()

    const [, secondSetter] = result.current
    expect(firstSetter).toBe(secondSetter)
  })

  it('should work with array values', () => {
    const { useStore } = createSignalStore({
      items: ['a', 'b', 'c']
    })

    const { result } = renderHook(() => useStore('items'))

    expect(result.current[0]).toEqual(['a', 'b', 'c'])

    act(() => {
      const [, setItems] = result.current
      setItems(draft => {
        draft.push('d')
      })
    })

    expect(result.current[0]).toEqual(['a', 'b', 'c', 'd'])
  })

  it('should throw error for non-string key', () => {
    const { useStore } = createSignalStore({
      user: { name: 'John' }
    })

    expect(() => {
      renderHook(() => useStore(123))
    }).toThrow('useStore expects a string key')
  })
})

describe('createUseSelectorHook (useSelector)', () => {
  beforeEach(() => {
    globalStore.clearStore()
  })

  describe('basic usage', () => {
    it('should select multiple signals and return their unwrapped values', () => {
      const { useSelector } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light',
        counter: 42
      })

      const { result } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme,
        counter: s.counter
      })))

      expect(result.current).toEqual({
        user: { name: 'John', age: 30 },
        theme: 'light',
        counter: 42
      })
    })

    it('should select a subset of signals from the store', () => {
      const { useSelector } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light',
        notifications: [{ id: 1, text: 'Hello' }],
        settings: { darkMode: true }
      })

      const { result } = renderHook(() => useSelector(s => ({
        name: s.user,
        mode: s.theme
      })))

      expect(result.current).toEqual({
        name: { name: 'John', age: 30 },
        mode: 'light'
      })
    })

    it('should work with primitive values', () => {
      const { useSelector } = createSignalStore({
        count: 0,
        message: 'hello',
        isActive: true
      })

      const { result } = renderHook(() => useSelector(s => ({
        count: s.count,
        message: s.message,
        isActive: s.isActive
      })))

      expect(result.current).toEqual({
        count: 0,
        message: 'hello',
        isActive: true
      })
    })

    it('should work with complex nested objects', () => {
      const { useSelector } = createSignalStore({
        config: {
          api: { url: 'https://api.example.com', timeout: 5000 },
          features: { darkMode: true, notifications: false }
        }
      })

      const { result } = renderHook(() => useSelector(s => ({
        config: s.config
      })))

      expect(result.current.config).toEqual({
        api: { url: 'https://api.example.com', timeout: 5000 },
        features: { darkMode: true, notifications: false }
      })
    })
  })

  describe('reactivity', () => {
    it('should update when a selected signal changes', () => {
      const { store, useSelector } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light'
      })

      const { result } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme
      })))

      expect(result.current).toEqual({
        user: { name: 'John', age: 30 },
        theme: 'light'
      })

      // Update user
      act(() => {
        store.user.set({ name: 'Jane', age: 25 })
      })

      expect(result.current).toEqual({
        user: { name: 'Jane', age: 25 },
        theme: 'light'
      })
    })

    it('should update when multiple signals change sequentially', () => {
      const { store, useSelector } = createSignalStore({
        counter: 0,
        theme: 'light',
        status: 'idle'
      })

      const { result } = renderHook(() => useSelector(s => ({
        counter: s.counter,
        theme: s.theme,
        status: s.status
      })))

      expect(result.current).toEqual({
        counter: 0,
        theme: 'light',
        status: 'idle'
      })

      // First update
      act(() => {
        store.counter.set(10)
      })
      expect(result.current.counter).toBe(10)
      expect(result.current.theme).toBe('light')

      // Second update
      act(() => {
        store.theme.set('dark')
      })
      expect(result.current.counter).toBe(10)
      expect(result.current.theme).toBe('dark')

      // Third update
      act(() => {
        store.status.set('loading')
      })
      expect(result.current.status).toBe('loading')
    })

    it('should not re-render when non-selected signal changes', () => {
      const { store, useSelector } = createSignalStore({
        selected: 'initial',
        notSelected: 'initial'
      })

      const { result } = renderHook(() => useSelector(s => ({
        selected: s.selected
      })))

      const initialResult = result.current

      // Update the non-selected signal
      act(() => {
        store.notSelected.set('changed')
      })

      // Result should remain the same reference since selected didn't change
      expect(result.current).toBe(initialResult)
      expect(result.current.selected).toBe('initial')
    })

    it('should react to changes when using draft mutations via useStore', () => {
      const { store, useStore, useSelector } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light'
      })

      // Use useSelector to subscribe
      const { result: selectorResult } = renderHook(() => useSelector(s => ({
        user: s.user
      })))

      // Use useStore to update
      const { result: storeResult } = renderHook(() => useStore('user'))

      expect(selectorResult.current.user).toEqual({ name: 'John', age: 30 })

      // Update via useStore setter
      act(() => {
        const [, setUser] = storeResult.current
        setUser(draft => {
          draft.age = 31
        })
      })

      expect(selectorResult.current.user).toEqual({ name: 'John', age: 31 })
    })
  })

  describe('error handling', () => {
    it('should throw error when selector is not a function', () => {
      const { useSelector } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSelector('not a function'))
      }).toThrow('useSelector expects a function as the selector argument')
    })

    it('should throw error when selector returns non-Signal value', () => {
      const { useSelector } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSelector(s => ({
          value: 'not a signal'
        })))
      }).toThrow('Selector function must return an object of Signals. Key "value" is not a Signal.')
    })

    it('should throw error when selector returns null value in object', () => {
      const { useSelector } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSelector(s => ({
          value: null
        })))
      }).toThrow('Selector function must return an object of Signals. Key "value" is not a Signal.')
    })

    it('should throw error when selector returns undefined value in object', () => {
      const { useSelector } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSelector(s => ({
          value: undefined
        })))
      }).toThrow('Selector function must return an object of Signals. Key "value" is not a Signal.')
    })

    it('should throw error when selector returns number in object', () => {
      const { useSelector } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSelector(s => ({
          count: 42
        })))
      }).toThrow('Selector function must return an object of Signals. Key "count" is not a Signal.')
    })
  })

  describe('multiple selectors', () => {
    it('should allow using different selectors with the same store', () => {
      const { store, useSelector } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light',
        counter: 0
      })

      // First selector - user and theme
      const { result: result1 } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme
      })))

      // Second selector - counter only
      const { result: result2 } = renderHook(() => useSelector(s => ({
        counter: s.counter
      })))

      expect(result1.current).toEqual({
        user: { name: 'John', age: 30 },
        theme: 'light'
      })
      expect(result2.current).toEqual({
        counter: 0
      })

      // Update counter
      act(() => {
        store.counter.set(100)
      })

      // Only result2 should update
      expect(result1.current).toEqual({
        user: { name: 'John', age: 30 },
        theme: 'light'
      })
      expect(result2.current).toEqual({
        counter: 100
      })
    })

    it('should allow overlapping selectors on the same store', () => {
      const { store, useSelector } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light'
      })

      // Both selectors select the same user signal
      const { result: result1 } = renderHook(() => useSelector(s => ({
        user: s.user
      })))

      const { result: result2 } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme
      })))

      expect(result1.current.user).toEqual({ name: 'John', age: 30 })
      expect(result2.current.user).toEqual({ name: 'John', age: 30 })

      // Update user
      act(() => {
        store.user.set({ name: 'Jane', age: 25 })
      })

      // Both should reflect the update
      expect(result1.current.user).toEqual({ name: 'Jane', age: 25 })
      expect(result2.current.user).toEqual({ name: 'Jane', age: 25 })
    })

    it('should work with selector that selects all store signals', () => {
      const { store, useSelector } = createSignalStore({
        user: { name: 'John' },
        theme: 'light',
        counter: 0
      })

      const { result } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme,
        counter: s.counter
      })))

      expect(result.current).toEqual({
        user: { name: 'John' },
        theme: 'light',
        counter: 0
      })

      // Update all values
      act(() => {
        store.user.set({ name: 'Jane' })
        store.theme.set('dark')
        store.counter.set(10)
      })

      expect(result.current).toEqual({
        user: { name: 'Jane' },
        theme: 'dark',
        counter: 10
      })
    })
  })

  describe('selector returning signals from different parts of store', () => {
    it('should select nested signal values', () => {
      const { store, useSelector } = createSignalStore({
        config: {
          api: { url: 'https://api.example.com', timeout: 5000 },
          features: { darkMode: true }
        },
        user: { name: 'John' }
      })

      const { result } = renderHook(() => useSelector(s => ({
        config: s.config,
        user: s.user
      })))

      expect(result.current.config).toEqual({
        api: { url: 'https://api.example.com', timeout: 5000 },
        features: { darkMode: true }
      })

      act(() => {
        store.config.set({
          api: { url: 'https://newapi.example.com', timeout: 3000 },
          features: { darkMode: false }
        })
      })

      expect(result.current.config).toEqual({
        api: { url: 'https://newapi.example.com', timeout: 3000 },
        features: { darkMode: false }
      })
    })

    it('should select signals with renamed keys', () => {
      const { useSelector } = createSignalStore({
        userProfile: { name: 'John', age: 30 },
        appTheme: 'light',
        notificationCount: 5
      })

      const { result } = renderHook(() => useSelector(s => ({
        profile: s.userProfile,
        theme: s.appTheme,
        unreadCount: s.notificationCount
      })))

      expect(result.current).toEqual({
        profile: { name: 'John', age: 30 },
        theme: 'light',
        unreadCount: 5
      })
    })

    it('should handle empty store with selector', () => {
      const { useSelector } = createSignalStore({})

      // Empty selector should work
      const { result } = renderHook(() => useSelector(s => ({})))

      expect(result.current).toEqual({})
    })

    it('should select single signal from store', () => {
      const { store, useSelector } = createSignalStore({
        user: { name: 'John' },
        theme: 'light'
      })

      const { result } = renderHook(() => useSelector(s => ({
        user: s.user
      })))

      expect(result.current).toEqual({
        user: { name: 'John' }
      })

      act(() => {
        store.user.set({ name: 'Jane' })
      })

      expect(result.current).toEqual({
        user: { name: 'Jane' }
      })
    })
  })

  describe('integration with useStore', () => {
    it('should work alongside useStore hook', () => {
      const { store, useStore, useSelector } = createSignalStore({
        user: { name: 'John' },
        theme: 'light'
      })

      // Use useSelector for reading multiple values
      const { result: selectorResult } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme
      })))

      // Use useStore for reading and writing
      const { result: storeResult } = renderHook(() => useStore('user'))

      expect(selectorResult.current.user).toEqual({ name: 'John' })
      expect(storeResult.current[0]).toEqual({ name: 'John' })

      // Update via useStore
      act(() => {
        const [, setUser] = storeResult.current
        setUser({ name: 'Jane' })
      })

      // Both should reflect the change
      expect(selectorResult.current.user).toEqual({ name: 'Jane' })
      expect(storeResult.current[0]).toEqual({ name: 'Jane' })
    })

    it('should reflect changes made directly to store signals', () => {
      const { store, useSelector } = createSignalStore({
        counter: 0,
        user: { name: 'John' }
      })

      const { result } = renderHook(() => useSelector(s => ({
        counter: s.counter,
        user: s.user
      })))

      expect(result.current.counter).toBe(0)

      // Update directly via store
      act(() => {
        store.counter.set(100)
      })

      expect(result.current.counter).toBe(100)
    })
  })
})

describe('createSetter (useSetter)', () => {
  beforeEach(() => {
    globalStore.clearStore()
  })

  describe('basic usage', () => {
    it('should return setter functions for multiple signals', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light',
        counter: 42
      })

      const { result } = renderHook(() => useSetter(s => ({
        setUser: s.user,
        setTheme: s.theme,
        setCounter: s.counter
      })))

      expect(typeof result.current.setUser).toBe('function')
      expect(typeof result.current.setTheme).toBe('function')
      expect(typeof result.current.setCounter).toBe('function')
    })

    it('should return a single setter function when selector returns a single signal', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John', age: 30 }
      })

      const { result } = renderHook(() => useSetter(s => s.user))

      expect(typeof result.current).toBe('function')
    })

    it('should return setters for a subset of signals', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light',
        notifications: [{ id: 1 }]
      })

      const { result } = renderHook(() => useSetter(s => ({
        setUser: s.user,
        setTheme: s.theme
      })))

      expect(typeof result.current.setUser).toBe('function')
      expect(typeof result.current.setTheme).toBe('function')
      expect(result.current.setNotifications).toBeUndefined()
    })
  })

  describe('updating values', () => {
    it('should update values using the returned setters', () => {
      const { store, useSetter } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light'
      })

      const { result } = renderHook(() => useSetter(s => ({
        setUser: s.user,
        setTheme: s.theme
      })))

      // Update user
      act(() => {
        result.current.setUser({ name: 'Jane', age: 25 })
      })

      expect(store.user.value).toEqual({ name: 'Jane', age: 25 })

      // Update theme
      act(() => {
        result.current.setTheme('dark')
      })

      expect(store.theme.value).toBe('dark')
    })

    it('should update values using draft mutations', () => {
      const { store, useSetter } = createSignalStore({
        user: { name: 'John', age: 30, preferences: { theme: 'light' } }
      })

      const { result } = renderHook(() => useSetter(s => ({
        setUser: s.user
      })))

      act(() => {
        result.current.setUser(draft => {
          draft.name = 'Jane'
          draft.preferences.theme = 'dark'
        })
      })

      expect(store.user.value).toEqual({
        name: 'Jane',
        age: 30,
        preferences: { theme: 'dark' }
      })
    })

    it('should update single signal using returned setter', () => {
      const { store, useSetter } = createSignalStore({
        counter: 0
      })

      const { result } = renderHook(() => useSetter(s => s.counter))

      act(() => {
        result.current(10)
      })

      expect(store.counter.value).toBe(10)
    })

    it('should work with primitive values', () => {
      const { store, useSetter } = createSignalStore({
        count: 0,
        message: 'hello',
        isActive: false
      })

      const { result } = renderHook(() => useSetter(s => ({
        setCount: s.count,
        setMessage: s.message,
        setIsActive: s.isActive
      })))

      act(() => {
        result.current.setCount(42)
        result.current.setMessage('world')
        result.current.setIsActive(true)
      })

      expect(store.count.value).toBe(42)
      expect(store.message.value).toBe('world')
      expect(store.isActive.value).toBe(true)
    })

    it('should work with array values', () => {
      const { store, useSetter } = createSignalStore({
        items: ['a', 'b', 'c']
      })

      const { result } = renderHook(() => useSetter(s => ({
        setItems: s.items
      })))

      act(() => {
        result.current.setItems(draft => {
          draft.push('d')
        })
      })

      expect(store.items.value).toEqual(['a', 'b', 'c', 'd'])
    })
  })

  describe('no re-renders', () => {
    it('should not cause re-render when values change', () => {
      const { store, useSetter } = createSignalStore({
        counter: 0
      })

      let renderCount = 0
      const { result } = renderHook(() => {
        renderCount++
        return useSetter(s => ({ setCounter: s.counter }))
      })

      expect(renderCount).toBe(1)

      // Update the store value
      act(() => {
        store.counter.set(100)
      })

      // Should not cause a re-render
      expect(renderCount).toBe(1)
      expect(store.counter.value).toBe(100)
    })

    it('should maintain stable setter references', () => {
      const { store, useSetter } = createSignalStore({
        user: { name: 'John' },
        theme: 'light'
      })

      const { result, rerender } = renderHook(() => useSetter(s => ({
        setUser: s.user,
        setTheme: s.theme
      })))

      const firstSetters = result.current

      rerender()

      // Setters should be the same reference
      expect(result.current.setUser).toBe(firstSetters.setUser)
      expect(result.current.setTheme).toBe(firstSetters.setTheme)
    })
  })

  describe('error handling', () => {
    it('should throw error when selector is not a function', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSetter('not a function'))
      }).toThrow('useSetter expects a function as the selector argument')
    })

    it('should throw error when selector returns non-Signal value in object', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSetter(s => ({
          value: 'not a signal'
        })))
      }).toThrow('Selector function must return an object of Signals. Key "value" is not a Signal.')
    })

    it('should throw error when selector returns null in object', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSetter(s => ({
          value: null
        })))
      }).toThrow('Selector function must return an object of Signals. Key "value" is not a Signal.')
    })

    it('should throw error when selector returns number in object', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useSetter(s => ({
          count: 42
        })))
      }).toThrow('Selector function must return an object of Signals. Key "count" is not a Signal.')
    })
  })

  describe('integration with other hooks', () => {
    it('should work alongside useStore', () => {
      const { store, useStore, useSetter } = createSignalStore({
        user: { name: 'John' },
        theme: 'light'
      })

      // Use useStore to read values
      const { result: storeResult } = renderHook(() => useStore('user'))

      // Use useSetter to get setters
      const { result: setterResult } = renderHook(() => useSetter(s => ({
        setUser: s.user
      })))

      expect(storeResult.current[0]).toEqual({ name: 'John' })

      // Update via useSetter
      act(() => {
        setterResult.current.setUser({ name: 'Jane' })
      })

      // useStore should reflect the change
      expect(storeResult.current[0]).toEqual({ name: 'Jane' })
    })

    it('should work alongside useSelector', () => {
      const { store, useSelector, useSetter } = createSignalStore({
        user: { name: 'John' },
        theme: 'light'
      })

      // Use useSelector to subscribe to values
      const { result: selectorResult } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme
      })))

      // Use useSetter to get setters
      const { result: setterResult } = renderHook(() => useSetter(s => ({
        setUser: s.user,
        setTheme: s.theme
      })))

      expect(selectorResult.current.user).toEqual({ name: 'John' })

      // Update via useSetter
      act(() => {
        setterResult.current.setUser({ name: 'Jane' })
        setterResult.current.setTheme('dark')
      })

      // useSelector should reflect the changes
      expect(selectorResult.current.user).toEqual({ name: 'Jane' })
      expect(selectorResult.current.theme).toBe('dark')
    })

    it('should work with all hooks together', () => {
      const { store, useStore, useSelector, useSetter } = createSignalStore({
        user: { name: 'John', age: 30 },
        theme: 'light',
        counter: 0
      })

      // useStore for reading/writing single value
      const { result: storeResult } = renderHook(() => useStore('counter'))

      // useSelector for reading multiple values
      const { result: selectorResult } = renderHook(() => useSelector(s => ({
        user: s.user,
        theme: s.theme
      })))

      // useSetter for updating without subscribing
      const { result: setterResult } = renderHook(() => useSetter(s => ({
        setUser: s.user,
        setTheme: s.theme
      })))

      // Initial state
      expect(storeResult.current[0]).toBe(0)
      expect(selectorResult.current.user).toEqual({ name: 'John', age: 30 })
      expect(selectorResult.current.theme).toBe('light')

      // Update via useStore
      act(() => {
        const [, setCounter] = storeResult.current
        setCounter(10)
      })

      expect(storeResult.current[0]).toBe(10)

      // Update via useSetter
      act(() => {
        setterResult.current.setUser({ name: 'Jane', age: 25 })
      })

      expect(selectorResult.current.user).toEqual({ name: 'Jane', age: 25 })
    })
  })

  describe('return value structure', () => {
    it('should return object with same keys as selector', () => {
      const { useSetter } = createSignalStore({
        user: { name: 'John' },
        theme: 'light',
        counter: 0
      })

      const { result } = renderHook(() => useSetter(s => ({
        customKey1: s.user,
        customKey2: s.theme
      })))

      expect(result.current).toHaveProperty('customKey1')
      expect(result.current).toHaveProperty('customKey2')
      expect(result.current).not.toHaveProperty('counter')
    })

    it('should return setters that can be called multiple times', () => {
      const { store, useSetter } = createSignalStore({
        counter: 0
      })

      const { result } = renderHook(() => useSetter(s => ({
        setCounter: s.counter
      })))

      act(() => {
        result.current.setCounter(1)
      })
      expect(store.counter.value).toBe(1)

      act(() => {
        result.current.setCounter(2)
      })
      expect(store.counter.value).toBe(2)

      act(() => {
        result.current.setCounter(draft => draft + 1)
      })
      expect(store.counter.value).toBe(3)
    })
  })
})

describe('Error scenarios', () => {
  beforeEach(() => {
    globalStore.clearStore()
  })

  describe('setter throws error', () => {
    it('should handle setter that throws error gracefully', () => {
      const { useStore } = createSignalStore({
        counter: 0
      })

      const { result } = renderHook(() => useStore('counter'))

      expect(result.current[0]).toBe(0)

      // Setter with a function that throws
      expect(() => {
        act(() => {
          const [, setCounter] = result.current
          setCounter(() => {
            throw new Error('Setter error')
          })
        })
      }).toThrow('Setter error')

      // Value should remain unchanged after error
      expect(result.current[0]).toBe(0)
    })
  })

  describe('corrupted store', () => {
    it('should throw error when accessing non-existent store key with useStore', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useStore('nonExistent'))
      }).toThrow('Store key "nonExistent" does not exist')
    })

    it('should throw error when useStore receives null', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useStore(null))
      }).toThrow('useStore expects a string key')
    })

    it('should throw error when useStore receives undefined', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useStore(undefined))
      }).toThrow('useStore expects a string key')
    })
  })
})