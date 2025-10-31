---
title: 'TypeScript Advanced Patterns and Best Practices: Complete Guide'
pubDate: '2025-11-01 14:00:00 +0000'
description: 'Master advanced TypeScript patterns including generics, conditional types, mapped types, type guards, and design patterns. Learn enterprise-grade TypeScript practices with real-world examples.'
categories:
  - TypeScript
  - JavaScript
  - Programming
  - Best Practices
---

# TypeScript Advanced Patterns and Best Practices: Complete Guide

TypeScript has become the de facto standard for building robust JavaScript applications. This comprehensive guide covers advanced TypeScript patterns, best practices, and techniques used in production by leading tech companies.

## Table of Contents

1. [Advanced Type System](#type-system)
2. [Generics Mastery](#generics)
3. [Conditional Types](#conditional-types)
4. [Mapped Types](#mapped-types)
5. [Type Guards and Narrowing](#type-guards)
6. [Utility Types](#utility-types)
7. [Design Patterns in TypeScript](#design-patterns)
8. [Advanced Function Patterns](#functions)
9. [Error Handling](#error-handling)
10. [Real-World Applications](#real-world)

## Advanced Type System {#type-system}

### 1. Union and Intersection Types

```typescript
// Union types - "OR"
type Status = 'pending' | 'success' | 'error';
type ID = string | number;

function handleStatus(status: Status) {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Complete!';
    case 'error':
      return 'Failed!';
  }
}

// Intersection types - "AND"
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

type Staff = Person & Employee;

const employee: Staff = {
  name: 'John',
  age: 30,
  employeeId: 'E123',
  department: 'Engineering'
};

// Discriminated unions for type-safe state management
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleRequest<T>(state: RequestState<T>) {
  switch (state.status) {
    case 'idle':
      return 'Not started';
    case 'loading':
      return 'Fetching...';
    case 'success':
      return `Data: ${state.data}`; // TypeScript knows data exists
    case 'error':
      return `Error: ${state.error.message}`; // TypeScript knows error exists
  }
}
```

### 2. Literal Types and Template Literal Types

```typescript
// Literal types
type Direction = 'north' | 'south' | 'east' | 'west';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Template literal types (TS 4.1+)
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// Result: 'onClick' | 'onFocus' | 'onBlur'

type CSSProperty = 'color' | 'background' | 'font-size';
type CSSValue<T extends CSSProperty> = `${T}: ${string}`;
// 'color: red' | 'background: blue' | 'font-size: 16px'

// Complex template literals
type APIVersion = 'v1' | 'v2' | 'v3';
type Resource = 'users' | 'posts' | 'comments';
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type APIEndpoint = `/api/${APIVersion}/${Resource}`;
// Result: '/api/v1/users' | '/api/v1/posts' | ...

// Creating type-safe event system
type EventMap = {
  click: { x: number; y: number };
  focus: { element: HTMLElement };
  submit: { formData: FormData };
};

type EventType = keyof EventMap;
type EventCallback<T extends EventType> = (data: EventMap[T]) => void;

function addEventListener<T extends EventType>(
  event: T,
  callback: EventCallback<T>
) {
  // Type-safe event handling
}

// Usage
addEventListener('click', (data) => {
  console.log(data.x, data.y); // TypeScript knows the shape
});

addEventListener('focus', (data) => {
  console.log(data.element); // Different shape, still type-safe
});
```

### 3. Index Signatures and Record Types

```typescript
// Basic index signature
interface StringMap {
  [key: string]: string;
}

const config: StringMap = {
  apiUrl: 'https://api.example.com',
  apiKey: 'abc123'
};

// Number index signature
interface NumberArray {
  [index: number]: string;
}

// Record utility type (cleaner)
type Config = Record<string, string>;
type StatusCodes = Record<number, string>;

const httpStatusCodes: StatusCodes = {
  200: 'OK',
  404: 'Not Found',
  500: 'Internal Server Error'
};

// Advanced: Typed keys with Record
type UserRole = 'admin' | 'user' | 'guest';
type Permissions = Record<UserRole, string[]>;

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};

// Nested Record types
type NestedConfig = Record<string, Record<string, unknown>>;

const appConfig: NestedConfig = {
  database: {
    host: 'localhost',
    port: 5432
  },
  cache: {
    ttl: 3600,
    maxSize: 1000
  }
};
```

## Generics Mastery {#generics}

### 1. Generic Functions

```typescript
// Basic generic function
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);        // T inferred as number
const str = identity('hello');   // T inferred as string

// Generic with constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): T {
  console.log(item.length);
  return item;
}

logLength('hello');        // ✅ string has length
logLength([1, 2, 3]);      // ✅ array has length
// logLength(42);          // ❌ Error: number doesn't have length

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair('hello', 42); // [string, number]

// Generic with default type
function create<T = string>(value: T): T {
  return value;
}

const str1 = create('hello');    // T is string
const num1 = create<number>(42); // T is number explicitly
```

### 2. Generic Classes

```typescript
// Generic class with type parameter
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const stringContainer = new Container('hello');
const numberContainer = new Container(42);

// Generic class with constraints
class DataStore<T extends { id: string }> {
  private items: Map<string, T> = new Map();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }
}

interface User {
  id: string;
  name: string;
  email: string;
}

const userStore = new DataStore<User>();
userStore.add({ id: '1', name: 'John', email: 'john@example.com' });

// Generic Repository pattern
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
    return null;
  }

  async findAll(): Promise<User[]> {
    // Implementation
    return [];
  }

  async save(user: User): Promise<User> {
    // Implementation
    return user;
  }

  async delete(id: string): Promise<boolean> {
    // Implementation
    return true;
  }
}
```

### 3. Advanced Generic Patterns

```typescript
// Generic factory pattern
interface Constructor<T> {
  new (...args: any[]): T;
}

function createInstance<T>(ctor: Constructor<T>, ...args: any[]): T {
  return new ctor(...args);
}

class Person {
  constructor(public name: string, public age: number) {}
}

const person = createInstance(Person, 'John', 30);

// Generic builder pattern
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortFn?: (a: T, b: T) => number;
  private limitNum?: number;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  orderBy(sortFn: (a: T, b: T) => number): this {
    this.sortFn = sortFn;
    return this;
  }

  limit(num: number): this {
    this.limitNum = num;
    return this;
  }

  execute(data: T[]): T[] {
    let result = data.filter((item) =>
      this.filters.every((filter) => filter(item))
    );

    if (this.sortFn) {
      result = result.sort(this.sortFn);
    }

    if (this.limitNum) {
      result = result.slice(0, this.limitNum);
    }

    return result;
  }
}

// Usage
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: 2, name: 'Phone', price: 500, category: 'Electronics' },
  { id: 3, name: 'Shirt', price: 50, category: 'Clothing' }
];

const result = new QueryBuilder<Product>()
  .where((p) => p.category === 'Electronics')
  .where((p) => p.price > 400)
  .orderBy((a, b) => b.price - a.price)
  .limit(10)
  .execute(products);
```

## Conditional Types {#conditional-types}

### 1. Basic Conditional Types

```typescript
// Syntax: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Extracting return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return 'hello';
}

type Result = ReturnType<typeof getString>; // string

// Extracting array element type
type ElementType<T> = T extends (infer U)[] ? U : T;

type StringArray = ElementType<string[]>;  // string
type NumberType = ElementType<number>;     // number

// Flatten type
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;     // string
type Num = Flatten<number>;       // number
type NestedArr = Flatten<string[][]>; // string[]
```

### 2. Advanced Conditional Types

```typescript
// Conditional type with distributive property
type ToArray<T> = T extends any ? T[] : never;

type StrOrNum = string | number;
type StrOrNumArray = ToArray<StrOrNum>; // string[] | number[]

// Non-distributive conditional type
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type StrOrNumArray2 = ToArrayNonDist<StrOrNum>; // (string | number)[]

// Exclude and Extract utilities
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;

type T1 = Exclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'
type T2 = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // 'a'

// NonNullable implementation
type NonNullable<T> = T extends null | undefined ? never : T;

type T3 = NonNullable<string | null | undefined>; // string

// Advanced: Unwrap Promise
type Awaited<T> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? Awaited<U>
    : U
  : T;

type P1 = Awaited<Promise<string>>;                    // string
type P2 = Awaited<Promise<Promise<number>>>;           // number
type P3 = Awaited<Promise<Promise<Promise<boolean>>>>; // boolean
```

### 3. Real-World Conditional Type Examples

```typescript
// Type-safe API response handler
type ApiResponse<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

type UnwrapResponse<T> = T extends ApiResponse<infer U> ? U : never;

type UserResponse = ApiResponse<{ id: string; name: string }>;
type User = UnwrapResponse<UserResponse>; // { id: string; name: string }

// Function parameter extraction
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function greet(name: string, age: number): string {
  return `Hello ${name}, ${age}`;
}

type GreetParams = Parameters<typeof greet>; // [string, number]

// Deep partial type
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  cache: {
    ttl: number;
  };
}

const partialConfig: DeepPartial<Config> = {
  database: {
    credentials: {
      username: 'admin'
      // password is optional
    }
  }
  // cache is optional
};
```

## Mapped Types {#mapped-types}

### 1. Basic Mapped Types

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Usage
interface User {
  id: string;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; }

type ReadonlyUser = Readonly<User>;
// { readonly id: string; readonly name: string; readonly email: string; }
```

### 2. Advanced Mapped Types

```typescript
// Pick specific properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type UserBasicInfo = Pick<User, 'id' | 'name'>;
// { id: string; name: string; }

// Omit specific properties
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type UserWithoutEmail = Omit<User, 'email'>;
// { id: string; name: string; }

// Nullable properties
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// { id: string | null; name: string | null; email: string | null; }

// Getters type
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface State {
  name: string;
  age: number;
}

type StateGetters = Getters<State>;
// { getName: () => string; getAge: () => number; }

// Setters type
type Setters<T> = {
  [P in keyof T as `set${Capitalize<string & P>}`]: (value: T[P]) => void;
};

type StateSetters = Setters<State>;
// { setName: (value: string) => void; setAge: (value: number) => void; }
```

### 3. Complex Mapped Types

```typescript
// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface NestedConfig {
  database: {
    connection: {
      host: string;
      port: number;
    };
  };
}

type ImmutableConfig = DeepReadonly<NestedConfig>;
// All nested properties are readonly

// Mutable (remove readonly)
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Type-safe event emitter
type EventMap = {
  userLogin: { userId: string; timestamp: number };
  userLogout: { userId: string };
  dataUpdate: { entityId: string; data: unknown };
};

type EventEmitter = {
  [K in keyof EventMap as `on${Capitalize<string & K>}`]: (
    callback: (data: EventMap[K]) => void
  ) => void;
} & {
  [K in keyof EventMap as `emit${Capitalize<string & K>}`]: (
    data: EventMap[K]
  ) => void;
};

// Result type:
// {
//   onUserLogin: (callback: (data: { userId: string; timestamp: number }) => void) => void;
//   emitUserLogin: (data: { userId: string; timestamp: number }) => void;
//   // ... etc
// }
```

## Type Guards and Narrowing {#type-guards}

### 1. Built-in Type Guards

```typescript
// typeof type guard
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // TypeScript knows it's string
  } else {
    return value.toFixed(2); // TypeScript knows it's number
  }
}

// instanceof type guard
class Dog {
  bark() {
    console.log('Woof!');
  }
}

class Cat {
  meow() {
    console.log('Meow!');
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript knows it's Dog
  } else {
    animal.meow(); // TypeScript knows it's Cat
  }
}

// in operator type guard
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly(); // TypeScript knows it's Bird
  } else {
    animal.swim(); // TypeScript knows it's Fish
  }
}
```

### 2. Custom Type Guards

```typescript
// User-defined type guard
interface User {
  type: 'user';
  name: string;
  email: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

// Type predicate: parameter is Type
function isAdmin(person: User | Admin): person is Admin {
  return person.type === 'admin';
}

function greet(person: User | Admin) {
  if (isAdmin(person)) {
    console.log(`Admin: ${person.name}, Permissions: ${person.permissions}`);
  } else {
    console.log(`User: ${person.name}, Email: ${person.email}`);
  }
}

// Generic type guard
function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

function process<T>(value: T | T[]) {
  if (isArray(value)) {
    value.forEach(item => console.log(item)); // T[]
  } else {
    console.log(value); // T
  }
}

// Null/undefined guard
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const values = [1, null, 2, undefined, 3];
const definedValues = values.filter(isDefined); // number[]
```

### 3. Advanced Type Narrowing

```typescript
// Discriminated unions with type narrowing
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; sideLength: number }
  | { kind: 'rectangle'; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}

// Exhaustiveness checking
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

function getArea2(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      return assertNever(shape); // Ensures all cases are handled
  }
}

// Control flow analysis
function processString(str: string | null | undefined) {
  if (!str) {
    return 'Empty'; // str is null or undefined or ''
  }
  
  // TypeScript knows str is string here
  return str.toUpperCase();
}

// Type narrowing with assignments
let value: string | number;

value = Math.random() < 0.5 ? 'hello' : 42;

if (typeof value === 'string') {
  value.toUpperCase();
}

value = 100; // TypeScript narrows type to number
value.toFixed(2); // No error, TypeScript knows it's number
```

## Utility Types {#utility-types}

### 1. Built-in Utility Types

```typescript
// Partial - makes all properties optional
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
  return { ...todo, ...fieldsToUpdate };
}

// Required - makes all properties required
type RequiredTodo = Required<Partial<Todo>>;

// Readonly - makes all properties readonly
const todo: Readonly<Todo> = {
  title: 'Learn TypeScript',
  description: 'Study advanced patterns',
  completed: false
};

// todo.completed = true; // Error: Cannot assign to 'completed'

// Record - creates object type with specific keys and value type
type PageInfo = Record<'home' | 'about' | 'contact', { title: string; url: string }>;

const pages: PageInfo = {
  home: { title: 'Home', url: '/' },
  about: { title: 'About', url: '/about' },
  contact: { title: 'Contact', url: '/contact' }
};

// Pick - selects subset of properties
type TodoPreview = Pick<Todo, 'title' | 'completed'>;

const preview: TodoPreview = {
  title: 'Learn TypeScript',
  completed: false
};

// Omit - removes specific properties
type TodoWithoutDescription = Omit<Todo, 'description'>;

// Exclude - removes types from union
type T0 = Exclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'
type T1 = Exclude<string | number | (() => void), Function>; // string | number

// Extract - keeps only specific types from union
type T2 = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // 'a'
type T3 = Extract<string | number | (() => void), Function>; // () => void

// NonNullable - removes null and undefined
type T4 = NonNullable<string | number | undefined>; // string | number
type T5 = NonNullable<string[] | null | undefined>; // string[]
```

### 2. Advanced Utility Types

```typescript
// ReturnType - extracts return type
function createUser() {
  return {
    id: '123',
    name: 'John',
    email: 'john@example.com'
  };
}

type User = ReturnType<typeof createUser>;
// { id: string; name: string; email: string; }

// Parameters - extracts parameter types
function greet(name: string, age: number): string {
  return `Hello ${name}, ${age}`;
}

type GreetParams = Parameters<typeof greet>; // [string, number]

// ConstructorParameters - extracts constructor params
class Person {
  constructor(public name: string, public age: number) {}
}

type PersonParams = ConstructorParameters<typeof Person>; // [string, number]

// InstanceType - extracts instance type
type PersonInstance = InstanceType<typeof Person>;
// Person

// ThisParameterType - extracts 'this' parameter type
function toHex(this: Number) {
  return this.toString(16);
}

type ThisType = ThisParameterType<typeof toHex>; // Number

// OmitThisParameter - removes 'this' parameter
type ToHexFunction = OmitThisParameter<typeof toHex>; // () => string
```

### 3. Custom Utility Types

```typescript
// DeepPartial - makes all nested properties optional
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Mutable - removes readonly modifiers
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// PromiseType - extracts Promise value type
type PromiseType<T> = T extends Promise<infer U> ? U : never;

type StringPromise = PromiseType<Promise<string>>; // string

// FunctionPropertyNames - gets function property names
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface Example {
  name: string;
  age: number;
  greet(): void;
  sayHello(): string;
}

type FuncNames = FunctionPropertyNames<Example>; // 'greet' | 'sayHello'

// NonFunctionPropertyNames - gets non-function property names
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFuncNames = NonFunctionPropertyNames<Example>; // 'name' | 'age'

// ValueOf - gets all possible value types
type ValueOf<T> = T[keyof T];

interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
  language: string;
}

type SettingValue = ValueOf<Settings>; // 'light' | 'dark' | number | string
```

## Design Patterns in TypeScript {#design-patterns}

### 1. Singleton Pattern

```typescript
class Database {
  private static instance: Database;
  private constructor() {
    // Private constructor prevents instantiation
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql: string): void {
    console.log(`Executing: ${sql}`);
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true - same instance

// Modern approach with module
class DatabaseConnection {
  query(sql: string): void {
    console.log(`Executing: ${sql}`);
  }
}

export const db = new DatabaseConnection();
```

### 2. Factory Pattern

```typescript
// Abstract factory with generics
interface Product {
  operation(): string;
}

class ConcreteProductA implements Product {
  operation(): string {
    return 'Product A';
  }
}

class ConcreteProductB implements Product {
  operation(): string {
    return 'Product B';
  }
}

type ProductType = 'A' | 'B';

class ProductFactory {
  static createProduct(type: ProductType): Product {
    switch (type) {
      case 'A':
        return new ConcreteProductA();
      case 'B':
        return new ConcreteProductB();
      default:
        throw new Error(`Unknown product type: ${type}`);
    }
  }
}

// Generic factory
interface Creator<T> {
  create(): T;
}

class UserCreator implements Creator<User> {
  create(): User {
    return {
      id: crypto.randomUUID(),
      name: '',
      email: ''
    };
  }
}

class AdminCreator implements Creator<Admin> {
  create(): Admin {
    return {
      type: 'admin',
      name: '',
      permissions: []
    };
  }
}
```

### 3. Observer Pattern

```typescript
interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(data: T): void;
}

class EventEmitter<T> implements Subject<T> {
  private observers: Set<Observer<T>> = new Set();

  attach(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  detach(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Type-safe usage
interface StockPrice {
  symbol: string;
  price: number;
  timestamp: Date;
}

class StockDisplay implements Observer<StockPrice> {
  update(data: StockPrice): void {
    console.log(`${data.symbol}: $${data.price} at ${data.timestamp}`);
  }
}

class StockAlert implements Observer<StockPrice> {
  constructor(private threshold: number) {}

  update(data: StockPrice): void {
    if (data.price > this.threshold) {
      console.log(`ALERT: ${data.symbol} exceeded $${this.threshold}`);
    }
  }
}

// Usage
const stockEmitter = new EventEmitter<StockPrice>();
const display = new StockDisplay();
const alert = new StockAlert(100);

stockEmitter.attach(display);
stockEmitter.attach(alert);

stockEmitter.notify({
  symbol: 'AAPL',
  price: 150,
  timestamp: new Date()
});
```

### 4. Builder Pattern

```typescript
class HttpRequest {
  private constructor(
    public method: string,
    public url: string,
    public headers: Record<string, string>,
    public body?: unknown
  ) {}

  static builder(): HttpRequestBuilder {
    return new HttpRequestBuilder();
  }
}

class HttpRequestBuilder {
  private method: string = 'GET';
  private url: string = '';
  private headers: Record<string, string> = {};
  private body?: unknown;

  setMethod(method: string): this {
    this.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setBody(body: unknown): this {
    this.body = body;
    return this;
  }

  build(): HttpRequest {
    if (!this.url) {
      throw new Error('URL is required');
    }
    return new HttpRequest(this.method, this.url, this.headers, this.body);
  }
}

// Usage
const request = HttpRequest.builder()
  .setMethod('POST')
  .setUrl('https://api.example.com/users')
  .addHeader('Content-Type', 'application/json')
  .addHeader('Authorization', 'Bearer token123')
  .setBody({ name: 'John', email: 'john@example.com' })
  .build();
```

## Advanced Function Patterns {#functions}

### 1. Function Overloading

```typescript
// Function overload signatures
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: string): HTMLElement;

// Implementation signature
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// Usage - TypeScript knows exact return type
const div = createElement('div');     // HTMLDivElement
const span = createElement('span');   // HTMLSpanElement
const input = createElement('input'); // HTMLInputElement

// Advanced: Overloads with generics
function makeArray<T>(arg: T): T[];
function makeArray<T>(arg: T[]): T[];
function makeArray<T>(arg: T | T[]): T[] {
  return Array.isArray(arg) ? arg : [arg];
}

const arr1 = makeArray(5);       // number[]
const arr2 = makeArray([1, 2]); // number[]
```

### 2. Currying and Partial Application

```typescript
// Generic curry function
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => fn(a, b);
}

function add(a: number, b: number): number {
  return a + b;
}

const curriedAdd = curry(add);
const add5 = curriedAdd(5);
console.log(add5(3)); // 8

// Advanced curry with variable arguments
type Curry<T> = T extends (arg: infer A, ...rest: infer R) => infer Return
  ? R extends []
    ? (arg: A) => Return
    : (arg: A) => Curry<(...args: R) => Return>
  : never;

function curry3<A, B, C, D>(
  fn: (a: A, b: B, c: C) => D
): (a: A) => (b: B) => (c: C) => D {
  return (a) => (b) => (c) => fn(a, b, c);
}

// Partial application
function partial<T extends any[], U extends any[], R>(
  fn: (...args: [...T, ...U]) => R,
  ...fixedArgs: T
): (...rest: U) => R {
  return (...rest: U) => fn(...fixedArgs, ...rest);
}

function greet(greeting: string, name: string, punctuation: string): string {
  return `${greeting}, ${name}${punctuation}`;
}

const sayHello = partial(greet, 'Hello');
console.log(sayHello('John', '!')); // Hello, John!

const sayHelloJohn = partial(greet, 'Hello', 'John');
console.log(sayHelloJohn('!')); // Hello, John!
```

### 3. Pipe and Compose

```typescript
// Pipe - left to right composition
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;
const square = (x: number) => x ** 2;

const compute = pipe(addOne, double, square);
console.log(compute(5)); // ((5 + 1) * 2) ** 2 = 144

// Compose - right to left composition
function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

const compute2 = compose(square, double, addOne);
console.log(compute2(5)); // ((5 + 1) * 2) ** 2 = 144

// Type-safe pipe with different types
type PipeFn = <A, B>(a: A) => B;

function typedPipe<A, B, C>(
  fn1: (a: A) => B,
  fn2: (b: B) => C
): (a: A) => C {
  return (a: A) => fn2(fn1(a));
}

const toStr = (n: number) => n.toString();
const toUpper = (s: string) => s.toUpperCase();

const process = typedPipe(toStr, toUpper);
console.log(process(42)); // "42"
```

## Error Handling {#error-handling}

### 1. Custom Error Types

```typescript
// Base error class
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class NotFoundError extends ApplicationError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

class ValidationError extends ApplicationError {
  constructor(
    message: string,
    public fields: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
  }
}

// Usage
function getUser(id: string): User {
  const user = database.findUser(id);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  return user;
}

function validateUser(data: unknown): User {
  const errors: Record<string, string> = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  }
  
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  
  return data as User;
}
```

### 2. Result Type Pattern

```typescript
// Result type for error handling without exceptions
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: new Error('Division by zero')
    };
  }
  
  return {
    success: true,
    value: a / b
  };
}

// Usage
const result = divide(10, 2);

if (result.success) {
  console.log(result.value); // TypeScript knows value exists
} else {
  console.error(result.error); // TypeScript knows error exists
}

// Helper functions for Result type
function ok<T>(value: T): Result<T> {
  return { success: true, value };
}

function err<E = Error>(error: E): Result<never, E> {
  return { success: false, error };
}

// Async version
type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

async function fetchUser(id: string): AsyncResult<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      return err(new NotFoundError('User'));
    }
    
    const user = await response.json();
    return ok(user);
  } catch (error) {
    return err(error as Error);
  }
}

// Usage with async/await
const userResult = await fetchUser('123');

if (userResult.success) {
  console.log(userResult.value.name);
} else {
  console.error(userResult.error.message);
}
```

### 3. Option/Maybe Type

```typescript
// Option type for nullable values
type Option<T> = Some<T> | None;

interface Some<T> {
  kind: 'some';
  value: T;
}

interface None {
  kind: 'none';
}

function some<T>(value: T): Option<T> {
  return { kind: 'some', value };
}

function none(): Option<never> {
  return { kind: 'none' };
}

// Helper functions
function map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  return option.kind === 'some' ? some(fn(option.value)) : none();
}

function flatMap<T, U>(
  option: Option<T>,
  fn: (value: T) => Option<U>
): Option<U> {
  return option.kind === 'some' ? fn(option.value) : none();
}

function getOrElse<T>(option: Option<T>, defaultValue: T): T {
  return option.kind === 'some' ? option.value : defaultValue;
}

// Usage
function findUser(id: string): Option<User> {
  const user = database.findUser(id);
  return user ? some(user) : none();
}

const userOption = findUser('123');

const userName = map(userOption, (user) => user.name);
const upperName = map(userName, (name) => name.toUpperCase());

console.log(getOrElse(upperName, 'Unknown'));
```

## Real-World Applications {#real-world}

### Complete Type-Safe API Client

```typescript
// API response types
type ApiResponse<T> = Result<T, ApiError>;

interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request config
interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

// API client
class ApiClient {
  constructor(private baseURL: string) {}

  private async request<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = new URL(endpoint, this.baseURL);
      
      if (config.params) {
        Object.entries(config.params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: config.body ? JSON.stringify(config.body) : undefined
      });

      if (!response.ok) {
        return err({
          code: `HTTP_${response.status}`,
          message: response.statusText
        });
      }

      const data = await response.json();
      return ok(data);
    } catch (error) {
      return err({
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Usage
const api = new ApiClient('https://api.example.com');

const userResult = await api.get<User>('/users/123');

if (userResult.success) {
  console.log(userResult.value.name);
} else {
  console.error(userResult.error.message);
}
```

## Conclusion

TypeScript's type system is incredibly powerful. Master these patterns to write safer, more maintainable code:

1. **Leverage Type Inference** - Let TypeScript do the work
2. **Use Generics Wisely** - Write reusable, type-safe code
3. **Create Custom Type Guards** - Narrow types accurately
4. **Utilize Utility Types** - Don't reinvent the wheel
5. **Design with Types** - Let types guide your architecture

**Remember**: Strong types lead to strong code.

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Effective TypeScript](https://effectivetypescript.com/)

---

*What TypeScript patterns do you use most? Share your favorites!*
