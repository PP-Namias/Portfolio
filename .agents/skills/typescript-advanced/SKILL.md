---
name: typescript-advanced
description: Advanced TypeScript patterns and type safety
---

# Advanced TypeScript Skill

Advanced TypeScript patterns, generics, and type-level programming.

## When to use this skill

- Creating complex type definitions
- Implementing type-safe patterns
- Building generic utilities
- Enhancing code reliability

## Patterns

### 1. Discriminated Unions
```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: new Error('Division by zero') };
  }
  return { success: true, data: a / b };
}

function handleResult(result: Result<number>) {
  if (result.success) {
    console.log(result.data); // TypeScript knows this is a number
  } else {
    console.error(result.error.message); // TypeScript knows this is an Error
  }
}
```

### 2. Template Literal Types
```typescript
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = `on${Capitalize<EventName>}`;

const handler: HandlerName = 'onClick'; // Valid
const invalid: HandlerName = 'onSubmit'; // Error

type CSSProperty = 'margin' | 'padding';
type CSSDirection = 'top' | 'right' | 'bottom' | 'left';
type CSSSpacing = `${CSSProperty}-${CSSDirection}`;

const spacing: CSSSpacing = 'margin-top'; // Valid
```

### 3. Conditional Types
```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>; // false

type NonNullable<T> = T extends null | undefined ? never : T;

type Example = NonNullable<string | null | undefined>; // string
```

### 4. Mapped Types
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type UserBasic = Pick<User, 'name' | 'email'>;
```

### 5. Utility Types
```typescript
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type Extract<T, U> = T extends U ? T : never;

type Exclude<T, U> = T extends U ? never : T;
```

### 6. Function Overloads
```typescript
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: 'p'): HTMLParagraphElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const div = createElement('div'); // HTMLDivElement
const span = createElement('span'); // HTMLSpanElement
```

### 7. Type Guards
```typescript
interface Cat {
  type: 'cat';
  meow(): void;
}

interface Dog {
  type: 'dog';
  bark(): void;
}

type Animal = Cat | Dog;

function isCat(animal: Animal): animal is Cat {
  return animal.type === 'cat';
}

function handleAnimal(animal: Animal) {
  if (isCat(animal)) {
    animal.meow(); // TypeScript knows this is a Cat
  } else {
    animal.bark(); // TypeScript knows this is a Dog
  }
}
```

### 8. Branded Types
```typescript
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId) {
  // Implementation
}

const userId = createUserId('user-123');
const orderId = createOrderId('order-456');

getUser(userId); // Valid
getUser(orderId); // Error: OrderId is not assignable to UserId
```

### 9. Recursive Types
```typescript
type DeepFlatten<T> = T extends Array<infer U> ? DeepFlatten<U> : T;

type NestedArray = number[][][];
type Flattened = DeepFlatten<NestedArray>; // number

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

### 10. Type-Level Arithmetic
```typescript
type BuildTuple<N extends number, T extends any[] = []> = T['length'] extends N
  ? T
  : BuildTuple<N, [...T, any]>;

type Add<A extends number, B extends number> = [...BuildTuple<A>, ...BuildTuple<B>]['length'];

type Sum = Add<2, 3>; // 5
```

## Checklist

- [ ] Types properly defined
- [ ] Type guards implemented
- [ ] Generics used effectively
- [ ] Type safety enforced
- [ ] Documentation updated
