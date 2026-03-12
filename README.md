# react-synapse

A lightweight React library that brings the power of [Preact Signals](https://preactjs.com/guide/v10/signals/) to React applications with enhanced features and an intuitive API. Enjoy fine-grained reactivity with immutable state updates powered by [Mutative](https://github.com/unadlib/mutative).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [TypeScript Guide](#typescript-guide)
- [Best Practices](#best-practices)
- [Comparison](#comparison)
- [How It Works](#how-it-works)

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

or with yarn:

```bash
yarn add react-synapse
```

### Peer Dependencies

react-synapse requires React 18+ or React 19+:

```bash
npm install react react-dom
```

## Quick Start

### Basic Counter Example

```jsx
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

### Global Store Example

```jsx
// store.js
import { createSignalStore } from 'react-synapse';

export const { store, useStore } = createSignalStore({
  user: { name: 'John', age: 30 },
  theme: 'light',
  counter: 0
});
```

```jsx
// Counter.jsx
import { useStore } from './store';

function Counter() {
  const [count, setCount] = useStore('counter');
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

```jsx
// UserProfile.jsx
import { useStore } from './store';

function UserProfile() {
  const [user, setUser] = useStore('user');
  const theme = useStore(s => s.theme);
  
  return (
    <div className={theme}>
      <h1>Hello, {user.name}!</h1>
      <button onClick={() => setUser(draft => { draft.age += 1; })}>
        Birthday!
      </button>
    </div>
  );
}
```

## Core Concepts

### Signals and Fine-Grained Reactivity

Signals are the foundation of react-synapse's reactivity system. Unlike traditional React state where components re-render when any state changes, signals allow components to subscribe to only the specific values they need.

```jsx
// With useState - entire component re-renders
const [user, setUser] = useState({ name: 'John', age: 30 });

// With signals - component only re-renders when accessed values change
const [user, setUser] = useStore('user');
```

**Key benefits:**
- No unnecessary re-renders
- Automatic dependency tracking
- No need for `useMemo` or `useCallback`

### Global Store Pattern

react-synapse uses a global singleton store where all signals are stored. This eliminates the need for context providers or prop drilling.

```jsx
// Create once, use everywhere
const { store, useStore } = createSignalStore({
  user: null,
  settings: { theme: 'light' },
  notifications: []
});

// Access in any component without providers
function AnyComponent() {
  const [user, setUser] = useStore('user');
  // ...
}
```

### Immutable Updates with Mutative

react-synapse uses [Mutative](https://github.com/unadlib/mutative) for immutable state updates. This gives you the convenience of mutable syntax with the safety of immutable updates.

```jsx
// Direct value update
setUser({ name: 'Jane', age: 25 });

// Draft mutation (Immer-style)
setUser(draft => {
  draft.name = 'Jane';
  draft.age += 1;
});

// Functional update
setUser(current => ({ ...current, age: current.age + 1 }));
```

## API Reference

### `createSignalStore(initialStates)`

Creates a typed global store with multiple signal-based state entries. Returns a `store` object and a typed `useStore` hook.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialStates` | `Object` | An object containing initial values for each store entry |

**Returns:**

The function returns an array that is also augmented with object properties, allowing both destructuring patterns:

| Return Format | Description |
|---------------|-------------|
| `[store, useStore]` | Array format for positional destructuring |
| `result.store` | The raw store object with all signals |
| `result.useStore` | A typed React hook for accessing store values |

**Example:**

```typescript
import { createSignalStore } from 'react-synapse';

// Named destructuring (recommended for clarity)
const { store, useStore } = createSignalStore({
  user: { 
    username: 'JohnDoe', 
    age: 30,
    preferences: { theme: 'dark', notifications: true }
  },
  theme: 'light',
  todos: [] as { id: number; text: string; done: boolean }[]
});

// Array destructuring (also valid)
const [store, useStore] = createSignalStore({
  user: { name: 'John' },
  theme: 'light'
});

// Mixed access patterns
const result = createSignalStore({ counter: 0 });
const store = result.store;           // or result[0]
const useStore = result.useStore;     // or result[1]

export { useStore };
```

### `useStore` Hook

A typed React hook returned from `createSignalStore`. Supports multiple access patterns with different return formats.

**Return Format Summary:**

| Access Pattern | Return Type | Description |
|----------------|-------------|-------------|
| `useStore('key')` | `[value, setter]` | Array with `.signal` and `.setSignal` properties |
| `useStore(s => s.key)` | `value` | Computed value directly (single signal) |
| `useStore(s => [s.a, s.b])` | `[valueA, valueB]` | Array of computed values |
| `useStore(s => ({ a: s.a }))` | `{ a: valueA }` | Object with computed values |

#### Pattern 1: String Key (returns `[value, setter]` with named properties)

Access a store value by its key. Returns a tuple with the current value and a setter function. The return value is an array that also has named properties for convenience.

**Return Format:**

| Return Format | Description |
|---------------|-------------|
| `[value, setter]` | Array format for positional destructuring |
| `result.signal` | The current signal value (same as `result[0]`) |
| `result.setSignal` | The setter function (same as `result[1]`) |

```tsx
function UserProfile() {
  // Array destructuring (common pattern)
  const [user, setUser] = useStore('user');
  
  // Named property access (also valid)
  const userState = useStore('user');
  const user = userState.signal;
  const setUser = userState.setSignal;

  // Or mixed destructuring
  const [user, setUser] = useStore('user');
  const { signal: user, setSignal: setUser } = useStore('user');
  
  // TypeScript knows all properties
  console.log(user.username);  // ✓ autocomplete works
  console.log(user.age);       // ✓ autocomplete works
  
  const updateAge = () => {
    // Draft mutation with full typing
    setUser(draft => {
      draft.age += 1;
      draft.preferences.theme = 'light';
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

#### Pattern 2: Function Selector (returns computed value directly)

Use a selector function for read-only access. The selector receives the typed store and returns signals. **Note:** Unlike string keys, function selectors return the computed value directly, not a tuple.

**Single Signal:**

```tsx
function ThemeDisplay() {
  const theme = useStore(s => s.theme);
  return <div className={theme}>Current theme: {theme}</div>;
}
```

**Array of Signals:**

```tsx
function Dashboard() {
  const [user, theme, counter] = useStore(s => [s.user, s.theme, s.counter]);
  
  return (
    <div className={theme}>
      <p>User: {user.name}</p>
      <p>Counter: {counter}</p>
    </div>
  );
}
```

**Object of Signals:**

```tsx
function DashboardStats() {
  const { currentUser, currentTheme } = useStore(s => ({
    currentUser: s.user,
    currentTheme: s.theme
  }));
  
  return (
    <div className={currentTheme}>
      <h1>Welcome, {currentUser.name}!</h1>
    </div>
  );
}
```

> ⚠️ **Note:** When using arrays or objects, the component re-renders when **any** of the selected signals change.

#### Pattern 3: Options with `unwrap: false`

Get raw signals for fine-grained control:

```tsx
function FineGrainedComponent() {
  const { user, theme } = useStore(
    s => ({ user: s.user, theme: s.theme }),
    { unwrap: false }
  );
  
  // Access .value directly for fine-grained control
  console.log(user.value.name);
  console.log(theme.value);
  
  return null;
}
```

### `useReactive(initialState)`

Creates a reactive local state (similar to `useState` but with signals).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialState` | `any` | The initial value of the state |

**Returns:** `[state, setState]` - A tuple with current state and setter

**Example:**

```jsx
import { useReactive } from 'react-synapse';

function TodoList() {
  const [todos, setTodos] = useReactive([
    { id: 1, text: 'Learn React', completed: false }
  ]);

  const toggleTodo = (id) => {
    setTodos((draft) => {
      const todo = draft.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
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
    </div>
  );
}
```

### `useReactiveSignal($signal)`

Subscribes to an existing Preact Signal and returns its current value.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `$signal` | `Signal` | A Preact Signal instance |

**Returns:** The current value of the signal

**Example:**

```jsx
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
```

### `createSignal(initialValue)`

Creates a new Preact Signal with an enhanced setter API.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialValue` | `any` | The initial value of the signal |

**Returns:** A Signal with `.set()` method

**Example:**

```javascript
import { createSignal } from 'react-synapse';

const $user = createSignal({
  name: 'John',
  age: 30
});

// Draft mutation
$user.set((draft) => {
  draft.age = 31;
});

// Direct value
$user.set({ name: 'Jane', age: 25 });
```

### `signal(value)`

Creates a standard Preact Signal (re-exported from `@preact/signals-core`).

```javascript
import { signal } from 'react-synapse';

const count = signal(0);

// Access value
console.log(count.value);

// Update value
count.value = 5;
```

### `computed(fn)`

Creates a derived signal that automatically updates when its dependencies change.

```javascript
import { createSignal, computed, useReactiveSignal } from 'react-synapse';

const $firstName = createSignal('John');
const $lastName = createSignal('Doe');

const $fullName = computed(() => `${$firstName.value} ${$lastName.value}`);

function Profile() {
  const fullName = useReactiveSignal($fullName);
  return <h1>{fullName}</h1>;
}
```

### `effect(fn)`

Creates an effect that runs when signals change.

```javascript
import { createSignal, effect } from 'react-synapse';

const $count = createSignal(0);

// Run side effect when signal changes
effect(() => {
  console.log('Count changed:', $count.value);
  document.title = `Count: ${$count.value}`;
});
```

### `batch(fn)`

Batches multiple signal updates into a single update cycle.

```javascript
import { batch, createSignal } from 'react-synapse';

const $a = createSignal(0);
const $b = createSignal(0);

batch(() => {
  $a.set(1);
  $b.set(2);
  // Only one update cycle
});
```

### `globalStore`

The singleton GlobalStore instance. Useful for advanced use cases.

**Methods:**

| Method | Description |
|--------|-------------|
| `getStore()` | Get the raw store object |
| `getStoreValues()` | Get all current values as a plain object |
| `getStoreState(id)` | Get a specific signal by ID |
| `setStoreState(key, value)` | Create a new signal |
| `hasState(key)` | Check if a signal exists |
| `clearStore()` | Clear all signals (useful for testing) |

**Example:**

```javascript
import { globalStore } from 'react-synapse';

// Check if state exists
if (!globalStore.hasState('user')) {
  globalStore.setStoreState('user', { name: 'Guest' });
}

// Get all values
const allValues = globalStore.getStoreValues();
console.log(allValues); // { user: { name: 'Guest' }, ... }
```

### `useSignalStore(id, initialState)` (Legacy)

Generic hook for global state. Prefer `useStore` from `createSignalStore` for better TypeScript support.

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

## Usage Examples

### Example 1: Todo List with Mutations

```jsx
// store.js
import { createSignalStore } from 'react-synapse';

export const { useStore } = createSignalStore({
  todos: [] as { id: number; text: string; completed: boolean }[],
  filter: 'all' as 'all' | 'active' | 'completed'
});
```

```jsx
// TodoList.jsx
import { useStore } from './store';

function TodoList() {
  const [todos, setTodos] = useStore('todos');
  const [filter, setFilter] = useStore('filter');

  const addTodo = (text) => {
    setTodos(draft => {
      draft.push({
        id: Date.now(),
        text,
        completed: false
      });
    });
  };

  const toggleTodo = (id) => {
    setTodos(draft => {
      const todo = draft.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add todo..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTodo(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
```

### Example 2: Complex Nested State Updates

```jsx
// store.js
import { createSignalStore } from 'react-synapse';

export const { useStore } = createSignalStore({
  app: {
    user: {
      profile: {
        name: 'John',
        settings: {
          notifications: {
            email: true,
            push: false,
            sms: true
          }
        }
      },
      preferences: {
        theme: 'light',
        language: 'en'
      }
    },
    cart: {
      items: [] as { id: number; name: string; quantity: number }[],
      total: 0
    }
  }
});
```

```jsx
// NotificationsSettings.jsx
import { useStore } from './store';

function NotificationsSettings() {
  const [app, setApp] = useStore('app');
  
  const toggleNotification = (type) => {
    setApp(draft => {
      draft.user.profile.settings.notifications[type] = 
        !draft.user.profile.settings.notifications[type];
    });
  };

  const notifications = app.user.profile.settings.notifications;

  return (
    <div>
      <h3>Notification Settings</h3>
      <label>
        <input
          type="checkbox"
          checked={notifications.email}
          onChange={() => toggleNotification('email')}
        />
        Email Notifications
      </label>
      <label>
        <input
          type="checkbox"
          checked={notifications.push}
          onChange={() => toggleNotification('push')}
        />
        Push Notifications
      </label>
      <label>
        <input
          type="checkbox"
          checked={notifications.sms}
          onChange={() => toggleNotification('sms')}
        />
        SMS Notifications
      </label>
    </div>
  );
}
```

### Example 3: Selector Patterns for Derived State

```jsx
// store.js
import { createSignalStore } from 'react-synapse';

export const { store, useStore } = createSignalStore({
  products: [] as { id: number; name: string; price: number; category: string }[],
  selectedCategory: 'all'
});
```

```jsx
// ProductDashboard.jsx
import { computed } from 'react-synapse';
import { useStore } from './store';

// Create computed signals outside components
const $filteredProducts = computed(() => {
  const products = store.products.value;
  const category = store.selectedCategory.value;
  
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
});

const $totalPrice = computed(() => {
  return $filteredProducts.value.reduce((sum, p) => sum + p.price, 0);
});

function ProductDashboard() {
  // Use array selector for multiple values
  const [products, selectedCategory] = useStore(s => [
    s.products,
    s.selectedCategory
  ]);
  
  // Or use object selector
  const { products: allProducts } = useStore(s => ({
    products: s.products
  }));

  const categories = [...new Set(allProducts.map(p => p.category))];

  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => {
          const [, setCategory] = useStore('selectedCategory');
          setCategory(e.target.value);
        }}
      >
        <option value="all">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <ProductList />
      <PriceSummary />
    </div>
  );
}

function ProductList() {
  const filteredProducts = useReactiveSignal($filteredProducts);
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  );
}

function PriceSummary() {
  const total = useReactiveSignal($totalPrice);
  
  return <div>Total: ${total.toFixed(2)}</div>;
}
```

### Example 4: Sharing State Between Components

```jsx
// store.js
import { createSignalStore } from 'react-synapse';

export const { store, useStore } = createSignalStore({
  messages: [] as { id: number; text: string; sender: string }[],
  currentUser: { name: 'Guest', id: null }
});
```

```jsx
// ChatInput.jsx
import { useStore } from './store';

function ChatInput() {
  const [messages, setMessages] = useStore('messages');
  const [currentUser] = useStore('currentUser');

  const sendMessage = (text) => {
    setMessages(draft => {
      draft.push({
        id: Date.now(),
        text,
        sender: currentUser.name
      });
    });
  };

  return (
    <input
      type="text"
      placeholder="Type a message..."
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
          sendMessage(e.target.value);
          e.target.value = '';
        }
      }}
    />
  );
}
```

```jsx
// MessageList.jsx
import { useStore } from './store';

function MessageList() {
  const [messages] = useStore('messages');
  const [currentUser] = useStore('currentUser');

  return (
    <div className="message-list">
      {messages.map(message => (
        <div
          key={message.id}
          className={message.sender === currentUser.name ? 'own' : 'other'}
        >
          <strong>{message.sender}:</strong> {message.text}
        </div>
      ))}
    </div>
  );
}
```

```jsx
// App.jsx
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';

function App() {
  return (
    <div className="chat-app">
      <MessageList />
      <ChatInput />
    </div>
  );
}
```

### Example 5: Effects and Computed Values

```jsx
// store.js
import { createSignalStore } from 'react-synapse';

export const { store, useStore } = createSignalStore({
  user: { name: 'John', status: 'offline' },
  notifications: [] as string[]
});
```

```jsx
// UserPresence.jsx
import { effect, computed, useReactiveSignal } from 'react-synapse';
import { store } from './store';

// Computed: derived state
const $statusMessage = computed(() => {
  const user = store.user.value;
  return `${user.name} is currently ${user.status}`;
});

// Effect: side effects
effect(() => {
  const status = store.user.value.status;
  
  if (status === 'online') {
    console.log('User came online');
    document.title = '🟢 Online';
  } else {
    console.log('User went offline');
    document.title = '⚫ Offline';
  }
});

// Effect with cleanup
effect(() => {
  const notificationCount = store.notifications.value.length;
  
  if (notificationCount > 0) {
    const interval = setInterval(() => {
      console.log(`You have ${notificationCount} unread notifications`);
    }, 5000);
    
    return () => clearInterval(interval);
  }
});

function StatusDisplay() {
  const statusMessage = useReactiveSignal($statusMessage);
  const [user, setUser] = useStore('user');

  return (
    <div>
      <p>{statusMessage}</p>
      <button onClick={() => 
        setUser(draft => {
          draft.status = draft.status === 'online' ? 'offline' : 'online';
        })
      }>
        Toggle Status
      </button>
    </div>
  );
}
```

## TypeScript Guide

### Basic Type Setup

```typescript
// types.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: string[];
  settings: {
    soundEnabled: boolean;
    language: string;
  };
}
```

```typescript
// store.ts
import { createSignalStore } from 'react-synapse';
import type { AppState } from './types';

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

// Export typed hooks for better DX
export type AppStore = typeof store;
```

### Component Usage with Types

```tsx
// Header.tsx
import { useStore } from './store';
import type { User } from './types';

function Header() {
  const [theme, setTheme] = useStore('theme');
  const [user] = useStore('user');
  
  // TypeScript knows the types:
  // theme: 'light' | 'dark'
  // user: User | null
  
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

### Type Inference with Selectors

```tsx
// The selector pattern also maintains type safety
function Dashboard() {
  // Single signal - typed correctly
  const theme = useStore(s => s.theme); // theme: 'light' | 'dark'
  
  // Array selector - each element typed
  const [user, notifications] = useStore(s => [s.user, s.notifications]);
  // user: User | null
  // notifications: string[]
  
  // Object selector - properties typed
  const { currentUser } = useStore(s => ({ currentUser: s.user }));
  // currentUser: User | null
  
  return null;
}
```

### Custom Type Helpers

```typescript
// utils.ts
import type { SignalSetter } from 'react-synapse';

// Helper for async actions
export type AsyncSetter<T> = (
  updater: T | ((draft: T) => T | void) | Promise<T>
) => Promise<T>;

// Helper for store slices
export type StoreSlice<T, K extends keyof T> = {
  value: T[K];
  set: SignalSetter<T[K]>;
};
```

## Best Practices

### 1. Create Store at Application Level

Define your store in a separate file and export the `useStore` hook:

```typescript
// store.ts
import { createSignalStore } from 'react-synapse';

export const { store, useStore } = createSignalStore({
  // Your initial state
});
```

### 2. Use String Keys for Write Access

When you need to update state, use the string key pattern:

```tsx
// ✓ Good - provides setter
const [user, setUser] = useStore('user');

// ⚠️ For read-only, function selector is fine
const user = useStore(s => s.user);
```

### 3. Split Large Objects

Instead of one large object, split into logical pieces:

```typescript
// ✓ Good - granular updates
export const { useStore } = createSignalStore({
  userProfile: { /* ... */ },
  userSettings: { /* ... */ },
  userPreferences: { /* ... */ }
});

// ⚠️ Avoid - causes unnecessary re-rends
export const { useStore } = createSignalStore({
  user: {
    profile: { /* ... */ },
    settings: { /* ... */ },
    preferences: { /* ... */ }
  }
});
```

### 4. Use Draft Mutations for Complex Updates

Draft mutations are more readable and maintainable:

```tsx
// ✓ Good - clear intent
setUser(draft => {
  draft.profile.name = newName;
  draft.settings.notifications.email = true;
});

// ⚠️ Verbose - harder to read
setUser({
  ...user,
  profile: {
    ...user.profile,
    name: newName
  },
  settings: {
    ...user.settings,
    notifications: {
      ...user.settings.notifications,
      email: true
    }
  }
});
```

### 5. Create Computed Values Outside Components

Define computed signals at module level for better performance:

```typescript
// ✓ Good - computed once, shared
const $filteredItems = computed(() => {
  const items = store.items.value;
  const filter = store.filter.value;
  return items.filter(item => item.category === filter);
});

function ItemList() {
  const items = useReactiveSignal($filteredItems);
  // ...
}
```

### 6. Use Effects for Side Effects

Keep side effects in `effect` calls, not in components:

```typescript
// ✓ Good - clean separation of concerns
effect(() => {
  const user = store.user.value;
  if (user) {
    analytics.track('user_active', { id: user.id });
  }
});

function Dashboard() {
  const [user] = useStore('user');
  // Component focuses on UI
}
```

### 7. Clear Store in Tests

Always clear the store between tests:

```typescript
import { globalStore } from 'react-synapse';

beforeEach(() => {
  globalStore.clearStore();
});
```

### Patterns to Avoid

```tsx
// ❌ Don't: Accessing store values during render without hook
function BadComponent() {
  const value = store.someValue.value; // Won't be reactive!
  return <div>{value}</div>;
}

// ✅ Do: Use the hook
function GoodComponent() {
  const value = useStore(s => s.someValue);
  return <div>{value}</div>;
}

// ❌ Don't: Creating selectors that return new objects every time
function BadComponent() {
  // Creates new object every render - causes infinite loops
  const data = useStore(s => ({ 
    user: s.user.value,  // Accessing .value inside selector
    theme: s.theme 
  }));
}

// ✅ Do: Return signals directly
function GoodComponent() {
  const data = useStore(s => ({ 
    user: s.user,  // Return signal, not .value
    theme: s.theme 
  }));
}

// ❌ Don't: Using array/object selectors when you only need one value
function BadComponent() {
  // Re-renders when ANY of these change
  const [user, theme, settings] = useStore(s => [s.user, s.theme, s.settings]);
  return <div>{user.name}</div>; // Only uses user!
}

// ✅ Do: Subscribe only to what you need
function GoodComponent() {
  const user = useStore(s => s.user); // Only re-renders on user changes
  return <div>{user.name}</div>;
}
```

## Comparison

### Comparison with Other State Managers

| Feature | Redux | Context API | Zustand | Jotai | react-synapse |
|---------|-------|-------------|---------|-------|---------------|
| Boilerplate | High | Medium | Low | Low | **Minimal** |
| Re-render Scope | Store-wide | Context-wide | Selector-based | Atom-level | **Signal-level** |
| Bundle Size | ~7kb | Built-in | ~1.5kb | ~1.5kb | **~3kb** |
| Learning Curve | Steep | Low | Low | Low | **Minimal** |
| TypeScript DX | Good | Manual | Good | Good | **Excellent** |
| Immutable Updates | Manual/Toolkit | Manual | Manual | Manual | **Built-in** |
| DevTools | Excellent | None | Good | Good | Basic |
| Middleware | Extensive | None | Limited | None | None |

### Code Comparison

**Redux Toolkit:**

```typescript
// store.ts
const userSlice = createSlice({
  name: 'user',
  initialState: { name: '', age: 0 },
  reducers: {
    setName: (state, action) => { state.name = action.payload },
    setAge: (state, action) => { state.age = action.payload },
  }
});

// Component.tsx
import { useSelector, useDispatch } from 'react-redux';
function UserForm() {
  const name = useSelector(state => state.user.name);
  const dispatch = useDispatch();
  return <input value={name} onChange={e => dispatch(setName(e.target.value))} />;
}
```

**react-synapse:**

```typescript
// store.ts
export const { useStore } = createSignalStore({
  user: { name: '', age: 0 }
});

// Component.tsx
import { useStore } from './store';
function UserForm() {
  const [user, setUser] = useStore('user');
  return <input 
    value={user.name} 
    onChange={e => setUser(draft => { draft.name = e.target.value })} 
  />;
}
```

### When to Use react-synapse

✅ **Use react-synapse when:**
- You want minimal boilerplate
- Fine-grained reactivity is important
- You need excellent TypeScript support
- You prefer Immer-style mutations
- You're building small to medium-sized apps

⚠️ **Consider alternatives when:**
- You need extensive devtools (Redux)
- You need time-travel debugging (Redux)
- You need middleware ecosystem (Redux)
- You're building very large enterprise apps with complex state requirements

## How It Works

react-synapse is built on top of three core technologies:

1. **Preact Signals**: Provides the reactive primitive that tracks dependencies and triggers updates
2. **Mutative**: Enables fast immutable updates using a proxy-based draft mechanism (10x faster than Immer)
3. **React's useSyncExternalStore**: Ensures compatibility with React 18+ concurrent features

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      react-synapse                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  useStore    │  │  useReactive │  │   Signals    │      │
│  │  (Global)    │  │  (Local)     │  │  (computed)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                   react-set-signal                           │
│         (Preact Signals + Mutative integration)              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐              ┌──────────────────┐     │
│  │ @preact/signals  │              │     Mutative     │     │
│  │    - signal      │              │  - createDraft   │     │
│  │    - computed    │              │  - immutable     │     │
│  │    - effect      │              │    updates       │     │
│  └──────────────────┘              └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### The Signal Flow

1. **Creation**: `createSignalStore()` creates signals and stores them in the global `GlobalStore`
2. **Subscription**: `useStore()` subscribes to specific signals using `useSyncExternalStore`
3. **Update**: Calling a setter triggers Mutative to create an immutable update
4. **Notification**: Preact Signals notifies all subscribers of the change
5. **Re-render**: Only components reading the changed signal re-render

## Performance Benefits

- **Minimal Re-renders**: Only components that read a specific signal value will re-render when it changes
- **Efficient Updates**: Mutative provides fast immutable updates without the overhead of structural sharing
- **Fine-grained Reactivity**: Signals allow for precise dependency tracking
- **No Provider Hell**: Unlike Context API, no need to wrap components in providers
- **Automatic Optimization**: No need for manual memoization with `useMemo` or `useCallback`

## Browser Support

Works in all modern browsers that support React 18+.

## Module Exports

react-synapse provides multiple entry points for tree-shaking:

```javascript
// Main export - everything
import { useStore, createSignalStore, useReactive } from 'react-synapse';

// Store-specific exports only
import { useSignalStore, createSignalStore, globalStore } from 'react-synapse/store';

// Signal primitives only
import { useReactive, useReactiveSignal, createSignal, signal, computed, effect } from 'react-synapse/signals';
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related Projects

- [Preact Signals](https://github.com/preactjs/signals) - The underlying signal implementation
- [Mutative](https://github.com/unadlib/mutative) - Fast immutable updates
- [react-set-signal](https://github.com/slashnot/react-set-signal) - The wrapper library combining Preact Signals with Mutative
- [React](https://react.dev) - The UI library this package is built for
