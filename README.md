# react-synapse

A lightweight React library that brings the power of [Preact Signals](https://preactjs.com/guide/v10/signals/) to React applications with enhanced features and an intuitive API. Enjoy fine-grained reactivity with immutable state updates powered by [Mutative](https://github.com/unadlib/mutative).

## Features

- 🎯 **Fine-grained Reactivity** - Leverage Preact Signals for optimal performance
- 🔄 **Immutable Updates** - Built-in Immer-style immutable state mutations using Mutative
- ⚡ **Minimal Re-renders** - Components only re-render when their specific signal values change
- 🪝 **React Hooks Integration** - Seamless integration with React's hooks ecosystem
- 📦 **Tiny Bundle Size** - Minimal overhead, maximum performance
- 🔷 **TypeScript Support** - Full type definitions with autocompletion for store values
- 🏪 **Global Store** - Built-in typed global state management with `createSignalStore`

## Installation

```bash
npm install react-synapse
```

or with pnpm:

```bash
pnpm add react-synapse
```

## Quick Start

```javascript
import { useReactive } from 'react-synapse';

function Counter() {
  const [count, setCount] = useReactive(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Why Signals? Benefits Over Traditional State Management

### 🚀 Simplicity

Traditional state management libraries like Redux, Zustand, or MobX require significant boilerplate:
- Redux: Actions, reducers, action creators, middleware, selectors
- Context API: Provider wrappers, consumer hooks, memoization

With `react-synapse`, you get a simple, intuitive API:

```javascript
// That's it! No providers, no reducers, no actions
const { store, useStore } = createSignalStore({
  user: { name: 'John', age: 30 },
  theme: 'light'
})

// In any component - just use it
const [user, setUser] = useStore('user')
```

### ⚡ Reduced Re-renders

**Traditional Context/Redux approach:**
```javascript
// ❌ All components consuming the context re-render
// even when only 'theme' changes
const { user, theme, settings } = useContext(AppContext)
```

**Signal-based approach:**
```javascript
// ✅ Only components using 'theme' re-render when theme changes
const [theme, setTheme] = useStore('theme')

// This component won't re-render when theme changes!
const [user, setUser] = useStore('user')
```

### 📊 Performance Comparison

| Feature | Redux | Context API | Zustand | react-synapse |
|---------|-------|-------------|---------|------------------|
| Boilerplate | High | Medium | Low | **Minimal** |
| Re-render Scope | Store-wide | Context-wide | Selector-based | **Signal-level** |
| Bundle Size | ~7kb | Built-in | ~1.5kb | **~3kb** |
| Learning Curve | Steep | Low | Low | **Minimal** |
| TypeScript DX | Good | Manual | Good | **Excellent** |
| Immutable Updates | Manual/Toolkit | Manual | Manual | **Built-in** |

### 🎯 Fine-grained Reactivity

Signals track exactly which components depend on which values. This means:

1. **No selector functions needed** - Unlike Redux where you write selectors to prevent unnecessary renders
2. **No `useMemo` or `useCallback` optimization** - Signals automatically optimize updates
3. **No Provider wrappers** - State is truly global without wrapping your app

### 💡 Real-world Example

**Before (Redux Toolkit):**
```javascript
// store.js
const userSlice = createSlice({
  name: 'user',
  initialState: { name: '', age: 0 },
  reducers: {
    setName: (state, action) => { state.name = action.payload },
    setAge: (state, action) => { state.age = action.payload },
  }
})
export const { setName, setAge } = userSlice.actions

// Component.jsx
import { useSelector, useDispatch } from 'react-redux'
import { setName } from './store'

function UserForm() {
  const name = useSelector(state => state.user.name)
  const dispatch = useDispatch()
  
  return <input value={name} onChange={e => dispatch(setName(e.target.value))} />
}
```

**After (react-synapse):**
```javascript
// store.js
export const { useStore } = createSignalStore({
  user: { name: '', age: 0 }
})

// Component.jsx
import { useStore } from './store'

function UserForm() {
  const [user, setUser] = useStore('user')
  
  return <input 
    value={user.name} 
    onChange={e => setUser(draft => { draft.name = e.target.value })} 
  />
}
```

---

## API Reference

### `createSignalStore(initialStates)`

Creates a typed global store with multiple signal-based state entries. Returns a `store` object and a typed `useStore` hook for accessing state with full TypeScript autocompletion.

**Parameters:**
- `initialStates` - An object containing initial values for each store entry

**Returns:**
- `{ store, useStore }` - An object containing:
  - `store` - The raw store object with all signals
  - `useStore` - A typed React hook for accessing store values

**Example:**

```typescript
import { createSignalStore } from 'react-synapse';

// Create your store with initial state
const { store, useStore } = createSignalStore({
  user: { 
    username: 'JohnDoe', 
    age: 30,
    preferences: { theme: 'dark', notifications: true }
  },
  theme: 'light',
  todos: [] as { id: number; text: string; done: boolean }[]
});

// Export useStore for use in components
export { useStore };
```

### `useStore` (from createSignalStore)

A typed React hook returned from `createSignalStore` that provides access to store values with full TypeScript autocompletion. Supports two access patterns:

#### Pattern 1: String Key (returns `[value, setter]`)

**Parameters:**
- `key` - The string key of the store entry (typed based on initial state)

**Returns:**
- `[value, setter]` - A tuple containing:
  - `value` - The current state value (fully typed)
  - `setter` - A function to update the value (supports direct values or draft mutations)

**Example:**

```tsx
import { useStore } from './store';

function UserProfile() {
  // Full autocompletion! user is typed as { username: string, age: number, preferences: {...} }
  const [user, setUser] = useStore('user');
  
  // TypeScript knows all the properties
  console.log(user.username);  // ✓ autocomplete works
  console.log(user.age);       // ✓ autocomplete works
  
  const updateAge = () => {
    // Immer-style draft mutation with full typing
    setUser(draft => {
      draft.age += 1;                        // ✓ autocomplete works
      draft.preferences.theme = 'light';     // ✓ autocomplete works
    });
  };
  
  // Or direct value update
  const resetUser = () => {
    setUser({
      username: 'Guest',
      age: 0,
      preferences: { theme: 'light', notifications: false }
    });
  };
  
  return (
    <div>
      <h1>Hello, {user.username}!</h1>
      <p>Age: {user.age}</p>
      <button onClick={updateAge}>Birthday!</button>
    </div>
  );
}
```

#### Pattern 2: Function Selector (returns value only)

**Parameters:**
- `selector` - A function that receives the typed store and returns a signal

**Returns:**
- `value` - The current value of the selected signal (fully typed)

This pattern is useful when you only need to read a value without updating it, or when you want a more functional style.

**Example:**

```tsx
import { useStore } from './store';

function ThemeDisplay() {
  // Function selector pattern - returns just the value, no setter
  const theme = useStore(s => s.theme);
  
  // theme is typed as 'light' | 'dark' (or string based on your store)
  return <div className={theme}>Current theme: {theme}</div>;
}

function UserStats() {
  // Access nested values directly
  const user = useStore(s => s.user);
  
  // user is typed based on your store definition
  return (
    <div>
      <p>Name: {user.username}</p>
      <p>Age: {user.age}</p>
    </div>
  );
}
```

#### Combining Both Patterns

You can use both patterns in the same component:

```tsx
import { useStore } from './store';

function Dashboard() {
  // String key pattern when you need to update
  const [settings, setSettings] = useStore('settings');
  
  // Function selector pattern for read-only values
  const theme = useStore(s => s.theme);
  const notifications = useStore(s => s.notifications);
  
  return (
    <div className={theme}>
      <h2>Notifications ({notifications.length})</h2>
      <button onClick={() => setSettings(draft => {
        draft.soundEnabled = !draft.soundEnabled;
      })}>
        Toggle Sound: {settings.soundEnabled ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
```

### `useSignalStore(id, initialState)` (Legacy/Generic)

A generic React hook for managing global state. For better TypeScript support, prefer using `useStore` from `createSignalStore`.

**Parameters:**
- `id` - A string identifier for the store entry
- `initialState` - The initial value (used only if the store entry doesn't exist)

**Returns:**
- `[value, setter]` - A tuple with current value and setter function

**Example:**

```javascript
import { useSignalStore } from 'react-synapse';

function Counter() {
  const [count, setCount] = useSignalStore('globalCounter', 0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### `useReactive(initialState)`

A React hook that creates a reactive state with Preact Signals under the hood. Similar to `useState`, but with enhanced features.

**Parameters:**
- `initialState` - The initial value of the state

**Returns:**
- `[state, setState]` - A tuple containing the current state and a setter function

**Example:**

```javascript
import { useReactive } from 'react-synapse';

function TodoList() {
  const [todos, setTodos] = useReactive([
    { id: 1, text: 'Learn React', completed: false }
  ]);

  const toggleTodo = (id) => {
    // Immer-style draft mutation
    setTodos((draft) => {
      const todo = draft.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
    });
  };

  const addTodo = (text) => {
    // Direct value update
    setTodos((draft) => {
      draft.push({ id: Date.now(), text, completed: false });
    });
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => toggleTodo(todo.id)}>
          <input type="checkbox" checked={todo.completed} readOnly />
          {todo.text}
        </div>
      ))}
      <button onClick={() => addTodo('New Todo')}>Add Todo</button>
    </div>
  );
}
```

### `useReactiveSignal($signal)`

A React hook that subscribes to an existing Preact Signal and returns its current value. This is useful for sharing state across components.

**Parameters:**
- `$signal` - A Preact Signal instance

**Returns:**
- `state` - The current value of the signal

**Example:**

```javascript
import { createSignal, useReactiveSignal } from 'react-synapse';

// Create a global signal
const $counter = createSignal(0);

function DisplayCounter() {
  const count = useReactiveSignal($counter);
  return <p>Count: {count}</p>;
}

function IncrementButton() {
  return (
    <button onClick={() => $counter.set(prev => prev + 1)}>
      Increment
    </button>
  );
}

function App() {
  return (
    <>
      <DisplayCounter />
      <IncrementButton />
    </>
  );
}
```

### `createSignal(initialValue)`

Creates a new Preact Signal with an enhanced API that includes an Immer-style setter method.

**Parameters:**
- `initialValue` - The initial value of the signal

**Returns:**
- `$signal` - A Preact Signal with an additional `.set()` method

**Example:**

```javascript
import { createSignal } from 'react-synapse';

const $user = createSignal({
  name: 'John',
  age: 30,
  address: { city: 'New York' }
});

// Immer-style mutation
$user.set((draft) => {
  draft.age = 31;
  draft.address.city = 'Los Angeles';
});

// Or direct value update
$user.set({ name: 'Jane', age: 25, address: { city: 'Chicago' } });

// Or function returning new value
$user.set((current) => ({ ...current, age: current.age + 1 }));
```

### Re-exported from Preact Signals

The library also re-exports core Preact Signals functionality:

```javascript
import { signal, effect, computed } from 'react-synapse';
```

- `signal(initialValue)` - Create a standard Preact Signal
- `effect(fn)` - Create an effect that runs when signals change
- `computed(fn)` - Create a derived signal that automatically updates when its dependencies change

## Advanced Usage

### Complete Store Example

Here's a full example of setting up a typed global store:

```typescript
// store.ts
import { createSignalStore } from 'react-synapse';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: string[];
  settings: {
    soundEnabled: boolean;
    language: string;
  };
}

const initialState: AppState = {
  user: null,
  theme: 'light',
  notifications: [],
  settings: {
    soundEnabled: true,
    language: 'en'
  }
};

export const { store, useStore } = createSignalStore(initialState);
```

```tsx
// Header.tsx
import { useStore } from './store';

function Header() {
  const [theme, setTheme] = useStore('theme');
  const [user] = useStore('user');
  
  return (
    <header className={theme}>
      <h1>Welcome, {user?.name ?? 'Guest'}</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}
```

```tsx
// Settings.tsx
import { useStore } from './store';

function Settings() {
  const [settings, setSettings] = useStore('settings');
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.soundEnabled}
          onChange={() => setSettings(draft => {
            draft.soundEnabled = !draft.soundEnabled;
          })}
        />
        Sound Enabled
      </label>
      <select 
        value={settings.language}
        onChange={e => setSettings(draft => {
          draft.language = e.target.value;
        })}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}
```

### Effects and Computed Values

Use Preact's `effect` for side effects:

**Example with effect:**
```javascript
import { createSignal, effect } from 'react-synapse';

const $count = createSignal(0);

// Run side effect when signal changes
effect(() => {
  console.log('Count changed:', $count.value);
  document.title = `Count: ${$count.value}`;
});
```

Use Preact's `computed` for computed values:

**Example with computed:**

```javascript
import { createSignal, computed, useReactiveSignal } from 'react-synapse';

const $firstName = createSignal('John');
const $lastName = createSignal('Doe');

// Computed signal: automatically updates when firstName or lastName changes
const $fullName = computed(() => `${$firstName.value} ${$lastName.value}`);

function Profile() {
  const fullName = useReactiveSignal($fullName);
  return <h1>{fullName}</h1>;
}

// Update signals
$firstName.set('Jane');
// $fullName automatically recomputes to "Jane Doe"
```

## How It Works

`react-synapse` uses React's `useSyncExternalStore` hook to subscribe to Preact Signals, ensuring compatibility with React 18+ concurrent features. State updates are handled through [Mutative](https://github.com/unadlib/mutative), providing Immer-style immutable updates with better performance.

## Performance Benefits

- **Minimal Re-renders**: Only components that read a specific signal value will re-render when it changes
- **Efficient Updates**: Mutative provides fast immutable updates without the overhead of structural sharing
- **Fine-grained Reactivity**: Signals allow for precise dependency tracking
- **No Provider Hell**: Unlike Context API, no need to wrap components in providers
- **Automatic Optimization**: No need for manual memoization with `useMemo` or `useCallback`

## Browser Support

Works in all modern browsers that support React 18+.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related Projects

- [Preact Signals](https://github.com/preactjs/signals) - The underlying signal implementation
- [Mutative](https://github.com/unadlib/mutative) - Fast immutable updates
- [React](https://react.dev) - The UI library this package is built for
