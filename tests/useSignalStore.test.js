import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSignalStore, createSignalStore } from '../hooks/useSignalStore'
import { globalStore } from '../hooks/globalStore'

describe('useSignalStore', () => {
  beforeEach(() => {
    globalStore.clearStore()
  })

  it('should initialize with string ID and return state with setter', () => {
    const { result } = renderHook(() =>
      useSignalStore('counter', 0)
    )

    const [state, setState] = result.current
    expect(state).toBe(0)
    expect(typeof setState).toBe('function')
  })

  it('should create signal with initial state when ID does not exist', () => {
    const { result } = renderHook(() =>
      useSignalStore('user', { name: '', age: 0 })
    )

    const [user] = result.current
    expect(user).toEqual({ name: '', age: 0 })
  })

  it('should return existing signal when ID already exists', () => {
    // First call creates the signal
    const { result: result1 } = renderHook(() =>
      useSignalStore('theme', 'light')
    )

    // Second call should return the same signal
    const { result: result2 } = renderHook(() =>
      useSignalStore('theme', 'dark') // Should ignore the second initialState
    )

    expect(result1.current[0]).toBe('light')
    expect(result2.current[0]).toBe('light') // Should be the same as first
  })

  it('should update state using setter', () => {
    const { result } = renderHook(() =>
      useSignalStore('count', 0)
    )

    act(() => {
      const [, setCount] = result.current
      setCount(10)
    })

    const [count] = result.current
    expect(count).toBe(10)
  })

  it('should work with object updates using draft', () => {
    const { result } = renderHook(() =>
      useSignalStore('user', { name: 'John', age: 25 })
    )

    act(() => {
      const [, setUser] = result.current
      setUser(draft => {
        draft.age = 26
        draft.name = 'Jane'
      })
    })

    const [user] = result.current
    expect(user).toEqual({ name: 'Jane', age: 26 })
  })

  it('should work with function pattern', () => {
    // First create some store state
    globalStore.setStoreState('settings', { theme: 'dark' })

    const { result } = renderHook(() =>
      useSignalStore(store => store.settings)
    )

    const settings = result.current // Function pattern returns just the state
    expect(settings).toEqual({ theme: 'dark' })
  })

  it('should throw error for empty string ID', () => {
    expect(() => {
      renderHook(() => useSignalStore('', 'value'))
    }).toThrow('Store ID cannot be an empty string')
  })

  it('should throw error for invalid ID type', () => {
    expect(() => {
      renderHook(() => useSignalStore(123, 'value'))
    }).toThrow('useSignalStore expects either a string ID or a function')
  })

  it('should share state across multiple hook instances', () => {
    const { result: result1 } = renderHook(() =>
      useSignalStore('shared', { value: 0 })
    )

    const { result: result2 } = renderHook(() =>
      useSignalStore('shared', { value: 999 }) // Should be ignored
    )

    expect(result1.current[0]).toEqual({ value: 0 })
    expect(result2.current[0]).toEqual({ value: 0 })

    // Update from one instance should reflect in the other
    act(() => {
      const [, setShared] = result1.current
      setShared({ value: 100 })
    })

    expect(result1.current[0]).toEqual({ value: 100 })
    expect(result2.current[0]).toEqual({ value: 100 })
  })

  it('should maintain stable setter reference', () => {
    const { result, rerender } = renderHook(() =>
      useSignalStore('stable', 0)
    )

    const [, firstSetter] = result.current

    rerender()

    const [, secondSetter] = result.current
    expect(firstSetter).toBe(secondSetter)
  })
})

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

  it('should skip creation for existing signal IDs', () => {
    globalStore.setStoreState('existing', 'old value')

    const initialStates = {
      existing: 'new value', // Should be skipped
      new: 'new value'
    }

    const { store } = createSignalStore(initialStates)

    expect(store.existing.value).toBe('old value') // Original value preserved
    expect(store.new.value).toBe('new value')
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

  describe('function selector pattern', () => {
    it('should access store values using function selector', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John', age: 25 },
        theme: 'light'
      })

      // Function selector pattern returns just the value, not [value, setter]
      const { result } = renderHook(() => useStore(s => s.user))

      expect(result.current).toEqual({ name: 'John', age: 25 })
    })

    it('should access primitive values using function selector', () => {
      const { useStore } = createSignalStore({
        theme: 'dark',
        count: 42
      })

      const { result: themeResult } = renderHook(() => useStore(s => s.theme))
      const { result: countResult } = renderHook(() => useStore(s => s.count))

      expect(themeResult.current).toBe('dark')
      expect(countResult.current).toBe(42)
    })

    it('should react to updates when using function selector', () => {
      const { store, useStore } = createSignalStore({
        counter: 0
      })

      const { result } = renderHook(() => useStore(s => s.counter))

      expect(result.current).toBe(0)

      // Update the store directly
      act(() => {
        store.counter.set(100)
      })

      expect(result.current).toBe(100)
    })

    it('should throw error for invalid selector argument', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useStore(123))
      }).toThrow('useStore expects either a string key or a selector function')
    })

    it('should work alongside string key pattern', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John', age: 25 },
        theme: 'light'
      })

      // String key pattern returns [value, setter]
      const { result: stringResult } = renderHook(() => useStore('user'))

      // Function selector pattern returns just the value
      const { result: functionResult } = renderHook(() => useStore(s => s.theme))

      expect(stringResult.current[0]).toEqual({ name: 'John', age: 25 })
      expect(typeof stringResult.current[1]).toBe('function')
      expect(functionResult.current).toBe('light')
    })

    it('should share state between string key and function selector patterns', () => {
      const { store, useStore } = createSignalStore({
        counter: 0
      })

      const { result: stringResult } = renderHook(() => useStore('counter'))
      const { result: functionResult } = renderHook(() => useStore(s => s.counter))

      expect(stringResult.current[0]).toBe(0)
      expect(functionResult.current).toBe(0)

      // Update using string pattern setter
      act(() => {
        const [, setCounter] = stringResult.current
        setCounter(50)
      })

      // Both patterns should reflect the update
      expect(stringResult.current[0]).toBe(50)
      expect(functionResult.current).toBe(50)
    })

    describe('functional selector approach', () => {
      it('should use Signal directly when selector returns a Signal', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark'
        })

        // Selector returns a Signal directly (s.user is a Signal)
        const { result } = renderHook(() => useStore(s => s.user))

        expect(result.current).toEqual({ name: 'John', age: 25 })

        // Update the store directly and verify reactivity
        act(() => {
          store.user.set({ name: 'Jane', age: 30 })
        })

        expect(result.current).toEqual({ name: 'Jane', age: 30 })
      })

      it('should wrap Array in computed when selector returns an Array of Signals', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark',
          counter: 42
        })

        // Selector returns an Array of Signals
        const { result } = renderHook(() => useStore(s => [s.user, s.theme, s.counter]))

        // Should return array of unwrapped values
        expect(result.current).toEqual([
          { name: 'John', age: 25 },
          'dark',
          42
        ])

        // Update one of the store values and verify reactivity
        act(() => {
          store.user.set({ name: 'Jane', age: 30 })
        })

        expect(result.current).toEqual([
          { name: 'Jane', age: 30 },
          'dark',
          42
        ])

        // Update another store value
        act(() => {
          store.theme.set('light')
        })

        expect(result.current).toEqual([
          { name: 'Jane', age: 30 },
          'light',
          42
        ])
      })

      it('should wrap plain object in computed when selector returns an object of Signals', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark',
          counter: 42
        })

        // Selector returns a plain object containing Signals
        const { result } = renderHook(() => useStore(s => ({
          currentUser: s.user,
          currentTheme: s.theme
        })))

        // Should return object with unwrapped values
        expect(result.current).toEqual({
          currentUser: { name: 'John', age: 25 },
          currentTheme: 'dark'
        })

        // Update one of the store values and verify reactivity
        act(() => {
          store.user.set({ name: 'Jane', age: 30 })
        })

        expect(result.current).toEqual({
          currentUser: { name: 'Jane', age: 30 },
          currentTheme: 'dark'
        })

        // Update another store value
        act(() => {
          store.theme.set('light')
        })

        expect(result.current).toEqual({
          currentUser: { name: 'Jane', age: 30 },
          currentTheme: 'light'
        })
      })

      it('should maintain reactivity for Array selector across multiple updates', () => {
        const { store, useStore } = createSignalStore({
          itemA: 'A',
          itemB: 'B',
          itemC: 'C'
        })

        const { result } = renderHook(() => useStore(s => [s.itemA, s.itemB, s.itemC]))

        expect(result.current).toEqual(['A', 'B', 'C'])

        // Multiple sequential updates
        act(() => {
          store.itemA.set('A1')
        })
        expect(result.current).toEqual(['A1', 'B', 'C'])

        act(() => {
          store.itemB.set('B1')
        })
        expect(result.current).toEqual(['A1', 'B1', 'C'])

        act(() => {
          store.itemC.set('C1')
        })
        expect(result.current).toEqual(['A1', 'B1', 'C1'])
      })

      it('should maintain reactivity for object selector across multiple updates', () => {
        const { store, useStore } = createSignalStore({
          first: 1,
          second: 2,
          third: 3
        })

        const { result } = renderHook(() => useStore(s => ({
          a: s.first,
          b: s.second,
          c: s.third
        })))

        expect(result.current).toEqual({ a: 1, b: 2, c: 3 })

        // Multiple sequential updates
        act(() => {
          store.first.set(10)
        })
        expect(result.current).toEqual({ a: 10, b: 2, c: 3 })

        act(() => {
          store.second.set(20)
        })
        expect(result.current).toEqual({ a: 10, b: 20, c: 3 })

        act(() => {
          store.third.set(30)
        })
        expect(result.current).toEqual({ a: 10, b: 20, c: 30 })
      })
    })

    describe('unwrap option', () => {
      it('should return raw signals when unwrap is false for array selector', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark',
          counter: 42
        })

        // With unwrap: false, should return raw signals
        const { result } = renderHook(() => useStore(
          s => [s.user, s.theme, s.counter],
          { unwrap: false }
        ))

        // Should return array of signals, not unwrapped values
        expect(Array.isArray(result.current)).toBe(true)
        expect(result.current.length).toBe(3)
        // Each item should be a signal with .value
        expect(result.current[0].value).toEqual({ name: 'John', age: 25 })
        expect(result.current[1].value).toBe('dark')
        expect(result.current[2].value).toBe(42)
      })

      it('should return raw signals when unwrap is false for object selector', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark'
        })

        // With unwrap: false, should return raw signals
        const { result } = renderHook(() => useStore(
          s => ({ currentUser: s.user, currentTheme: s.theme }),
          { unwrap: false }
        ))

        // Should return object of signals, not unwrapped values
        expect(result.current.currentUser.value).toEqual({ name: 'John', age: 25 })
        expect(result.current.currentTheme.value).toBe('dark')
      })

      it('should allow fine-grained reactivity with unwrap: false', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark'
        })

        // With unwrap: false, signals are returned directly
        const { result } = renderHook(() => useStore(
          s => ({ user: s.user, theme: s.theme }),
          { unwrap: false }
        ))

        // Access .value on each signal
        const initialUserValue = result.current.user.value
        expect(initialUserValue).toEqual({ name: 'John', age: 25 })

        // Update one signal
        act(() => {
          store.user.set({ name: 'Jane', age: 30 })
        })

        // The signal itself should still be accessible
        expect(result.current.user.value).toEqual({ name: 'Jane', age: 30 })
        expect(result.current.theme.value).toBe('dark')
      })

      it('should default to unwrap: true when option not provided', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark'
        })

        // Without options, should unwrap by default
        const { result } = renderHook(() => useStore(
          s => ({ currentUser: s.user, currentTheme: s.theme })
        ))

        // Should return unwrapped values, not signals
        expect(result.current.currentUser).toEqual({ name: 'John', age: 25 })
        expect(result.current.currentTheme).toBe('dark')
        // Should not have .value property (already unwrapped)
        expect(result.current.currentUser.value).toBeUndefined()
      })

      it('should behave same as default when unwrap: true is explicit', () => {
        const { store, useStore } = createSignalStore({
          user: { name: 'John', age: 25 },
          theme: 'dark'
        })

        const { result: defaultResult } = renderHook(() => useStore(
          s => ({ currentUser: s.user, currentTheme: s.theme })
        ))

        const { result: explicitResult } = renderHook(() => useStore(
          s => ({ currentUser: s.user, currentTheme: s.theme }),
          { unwrap: true }
        ))

        expect(defaultResult.current).toEqual(explicitResult.current)
      })
    })

    describe('memoization', () => {
      it('should return same values for array when rerendered without changes', () => {
        const { store, useStore } = createSignalStore({
          itemA: 'A',
          itemB: 'B'
        })

        const { result, rerender } = renderHook(() => useStore(s => [s.itemA, s.itemB]))

        const firstResult = result.current
        expect(firstResult).toEqual(['A', 'B'])

        // Rerender without any store changes
        rerender()

        // Values should be the same (deep equality)
        expect(result.current).toEqual(firstResult)
      })

      it('should return same values for object when rerendered without changes', () => {
        const { store, useStore } = createSignalStore({
          first: 1,
          second: 2
        })

        const { result, rerender } = renderHook(() => useStore(s => ({
          a: s.first,
          b: s.second
        })))

        const firstResult = result.current
        expect(firstResult).toEqual({ a: 1, b: 2 })

        // Rerender without any store changes
        rerender()

        // Values should be the same (deep equality)
        expect(result.current).toEqual(firstResult)
      })

      it('should create new reference for array only when values actually change', () => {
        const { store, useStore } = createSignalStore({
          itemA: 'A',
          itemB: 'B'
        })

        const { result } = renderHook(() => useStore(s => [s.itemA, s.itemB]))

        const firstResult = result.current
        expect(firstResult).toEqual(['A', 'B'])

        // Update a value
        act(() => {
          store.itemA.set('A1')
        })

        // Reference should be different now
        expect(result.current).not.toBe(firstResult)
        expect(result.current).toEqual(['A1', 'B'])

        const secondResult = result.current

        // Update to same value should still create new reference (value changed)
        act(() => {
          store.itemA.set('A1') // Same value
        })

        // Reference should be the same since value didn't actually change
        expect(result.current).toBe(secondResult)
      })

      it('should create new reference for object only when values actually change', () => {
        const { store, useStore } = createSignalStore({
          first: 1,
          second: 2
        })

        const { result } = renderHook(() => useStore(s => ({
          a: s.first,
          b: s.second
        })))

        const firstResult = result.current
        expect(firstResult).toEqual({ a: 1, b: 2 })

        // Update a value
        act(() => {
          store.first.set(10)
        })

        // Reference should be different now
        expect(result.current).not.toBe(firstResult)
        expect(result.current).toEqual({ a: 10, b: 2 })

        const secondResult = result.current

        // Update to same value
        act(() => {
          store.first.set(10) // Same value
        })

        // Reference should be the same since value didn't actually change
        expect(result.current).toBe(secondResult)
      })
    })
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

  describe('selector throws error', () => {
    it('should throw error when selector function throws', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useStore(s => {
          throw new Error('Selector error')
        }))
      }).toThrow('Selector error')
    })

    it('should throw error when selector accesses non-existent property deeply', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useStore(s => s.nonExistent.value))
      }).toThrow()
    })
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
      }).toThrow('useStore expects either a string key or a selector function')
    })

    it('should throw error when useStore receives undefined', () => {
      const { useStore } = createSignalStore({
        user: { name: 'John' }
      })

      expect(() => {
        renderHook(() => useStore(undefined))
      }).toThrow('useStore expects either a string key or a selector function')
    })
  })
})