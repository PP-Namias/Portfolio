---
name: react-patterns
description: Advanced React patterns and best practices
---

# React Patterns Skill

Advanced React patterns, hooks, and best practices for modern applications.

## When to use this skill

- Creating complex React components
- Implementing advanced patterns
- Optimizing performance
- Building reusable components

## Patterns

### 1. Compound Components
```tsx
import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext(null);

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, children }) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext);
  const isOpen = openIndex === index;

  return (
    <div className="accordion-item">
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, onToggle: () => setOpenIndex(isOpen ? null : index) })
      )}
    </div>
  );
}

function AccordionHeader({ children, isOpen, onToggle }) {
  return (
    <button onClick={onToggle} aria-expanded={isOpen}>
      {children}
    </button>
  );
}

function AccordionContent({ children, isOpen }) {
  return isOpen ? <div className="accordion-content">{children}</div> : null;
}

// Usage
<Accordion>
  <AccordionItem index={0}>
    <AccordionHeader>Title 1</AccordionHeader>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

### 2. Render Props
```tsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return render(position);
}

// Usage
<MouseTracker render={({ x, y }) => (
  <div>Mouse is at ({x}, {y})</div>
)} />
```

### 3. Custom Hooks
```tsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage
const [name, setName] = useLocalStorage('name', 'John');
```

### 4. Higher-Order Components
```tsx
function withLogger(WrappedComponent) {
  return function WithLogger(props) {
    useEffect(() => {
      console.log('Component mounted:', WrappedComponent.name);
      return () => console.log('Component unmounted:', WrappedComponent.name);
    }, []);

    return <WrappedComponent {...props} />;
  };
}

// Usage
const EnhancedComponent = withLogger(MyComponent);
```

### 5. Error Boundaries
```tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### 6. Suspense and Lazy Loading
```tsx
const LazyComponent = React.lazy(() => import('./MyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 7. Context with Performance
```tsx
const ValueContext = createContext(null);
const DispatchContext = createContext(null);

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ValueContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </ValueContext.Provider>
  );
}

function useValue() {
  const context = useContext(ValueContext);
  if (context === undefined) {
    throw new Error('useValue must be used within AppProvider');
  }
  return context;
}

function useDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within AppProvider');
  }
  return context;
}
```

## Checklist

- [ ] Patterns applied correctly
- [ ] Performance optimized
- [ ] Accessibility implemented
- [ ] Tests written
- [ ] Documentation updated
