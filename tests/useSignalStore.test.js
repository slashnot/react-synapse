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
  })
})