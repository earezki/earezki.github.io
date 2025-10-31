---
title: 'Python Best Practices and Advanced Techniques: Complete Professional Guide'
pubDate: '2025-11-01 15:00:00 +0000'
description: 'Master Python programming with professional best practices, advanced patterns, type hints, performance optimization, testing strategies, and modern Python features. Complete guide for experienced developers.'
categories:
  - Python
  - Programming
  - Best Practices
  - Software Engineering
---

# Python Best Practices and Advanced Techniques: Complete Professional Guide

Python's simplicity makes it easy to start, but mastering professional Python development requires understanding advanced patterns and best practices. This comprehensive guide covers everything from type hints to performance optimization.

## Table of Contents

1. [Modern Python Features](#modern-features)
2. [Type Hints and mypy](#type-hints)
3. [Advanced OOP Patterns](#oop-patterns)
4. [Functional Programming](#functional)
5. [Context Managers](#context-managers)
6. [Decorators and Metaprogramming](#decorators)
7. [Concurrency and Parallelism](#concurrency)
8. [Performance Optimization](#performance)
9. [Testing Strategies](#testing)
10. [Project Structure](#project-structure)

## Modern Python Features {#modern-features}

### 1. Structural Pattern Matching (Python 3.10+)

```python
# Pattern matching for complex data structures
def process_command(command):
    match command:
        case {"action": "create", "resource": resource, **kwargs}:
            return f"Creating {resource} with {kwargs}"
        
        case {"action": "delete", "resource": resource, "id": id}:
            return f"Deleting {resource} #{id}"
        
        case {"action": "update", "resource": resource, "id": id, "data": data}:
            return f"Updating {resource} #{id} with {data}"
        
        case _:
            return "Unknown command"

# Pattern matching with guards
def categorize_number(n):
    match n:
        case 0:
            return "zero"
        case n if n < 0:
            return "negative"
        case n if n > 0 and n < 10:
            return "single digit"
        case _:
            return "multiple digits"

# Pattern matching for parsing
def parse_response(response):
    match response:
        case {"status": "success", "data": data}:
            print(f"Success: {data}")
        
        case {"status": "error", "code": code, "message": msg}:
            print(f"Error {code}: {msg}")
        
        case {"status": "pending"}:
            print("Request pending...")
        
        case _:
            print("Invalid response")
```

### 2. Walrus Operator (Python 3.8+)

```python
# ❌ Bad: Multiple calls or assignments
def process_data(data):
    result = expensive_computation(data)
    if result:
        return result
    return None

# ✅ Good: Walrus operator
def process_data(data):
    if result := expensive_computation(data):
        return result
    return None

# List comprehension with walrus
filtered_data = [
    result
    for item in data
    if (result := process(item)) is not None
]

# While loop with walrus
while (line := file.readline()):
    process_line(line)

# Complex example
def find_first_match(items, condition):
    return next(
        (item for item in items if (result := condition(item)) and result > 0),
        None
    )
```

### 3. F-Strings Advanced Features

```python
# Debugging with f-strings (Python 3.8+)
name = "John"
age = 30
print(f"{name=}, {age=}")  # name='John', age=30

# Formatting numbers
price = 1234.5678
print(f"{price:.2f}")     # 1234.57
print(f"{price:,.2f}")    # 1,234.57
print(f"{price:>10.2f}")  # Right-align, width 10

# Date formatting
from datetime import datetime
now = datetime.now()
print(f"{now:%Y-%m-%d %H:%M:%S}")

# Nested f-strings
data = {"name": "Alice", "score": 95}
print(f"{data['name']:>10}: {data['score']:.1f}%")

# Multi-line f-strings
message = f"""
User: {name}
Age: {age}
Status: {'Active' if age > 18 else 'Minor'}
"""
```

### 4. Data Classes (Python 3.7+)

```python
from dataclasses import dataclass, field
from typing import List
from datetime import datetime

# Basic dataclass
@dataclass
class User:
    name: str
    email: str
    age: int
    created_at: datetime = field(default_factory=datetime.now)
    
# Frozen (immutable) dataclass
@dataclass(frozen=True)
class Point:
    x: float
    y: float
    
    def distance_from_origin(self) -> float:
        return (self.x**2 + self.y**2)**0.5

# Dataclass with complex defaults
@dataclass
class ShoppingCart:
    user_id: str
    items: List[str] = field(default_factory=list)
    total: float = 0.0
    
    def add_item(self, item: str, price: float):
        self.items.append(item)
        self.total += price

# Dataclass with post-init processing
@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)
    
    def __post_init__(self):
        self.area = self.width * self.height

# Advanced: Ordering and comparison
@dataclass(order=True)
class Product:
    sort_index: float = field(init=False, repr=False)
    name: str
    price: float
    
    def __post_init__(self):
        self.sort_index = self.price

products = [
    Product("Laptop", 1000),
    Product("Mouse", 25),
    Product("Keyboard", 75)
]
sorted_products = sorted(products)  # Sorted by price
```

## Type Hints and mypy {#type-hints}

### 1. Basic Type Annotations

```python
from typing import List, Dict, Tuple, Set, Optional, Union, Any

# Function annotations
def greet(name: str, age: int) -> str:
    return f"Hello {name}, you are {age} years old"

# Variable annotations
count: int = 0
names: List[str] = ["Alice", "Bob"]
config: Dict[str, Any] = {"timeout": 30, "retry": True}

# Optional types
def find_user(user_id: str) -> Optional[User]:
    # Returns User or None
    return database.get(user_id)

# Union types
def process_id(id_value: Union[int, str]) -> str:
    return str(id_value)

# Multiple return types
def parse_value(s: str) -> Union[int, float, str]:
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return s
```

### 2. Generic Types

```python
from typing import TypeVar, Generic, List, Dict

# Type variables
T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')

# Generic function
def first(items: List[T]) -> Optional[T]:
    return items[0] if items else None

# Generic class
class Container(Generic[T]):
    def __init__(self):
        self._items: List[T] = []
    
    def add(self, item: T) -> None:
        self._items.append(item)
    
    def get(self, index: int) -> T:
        return self._items[index]
    
    def all(self) -> List[T]:
        return self._items.copy()

# Usage
numbers: Container[int] = Container()
numbers.add(1)
numbers.add(2)

strings: Container[str] = Container()
strings.add("hello")

# Generic with constraints
from typing import Protocol

class Comparable(Protocol):
    def __lt__(self, other: Any) -> bool: ...

T_comparable = TypeVar('T_comparable', bound=Comparable)

def find_min(items: List[T_comparable]) -> T_comparable:
    return min(items)

# Generic repository pattern
class Repository(Generic[T]):
    def __init__(self):
        self._storage: Dict[str, T] = {}
    
    async def save(self, id: str, item: T) -> None:
        self._storage[id] = item
    
    async def find_by_id(self, id: str) -> Optional[T]:
        return self._storage.get(id)
    
    async def find_all(self) -> List[T]:
        return list(self._storage.values())

@dataclass
class User:
    id: str
    name: str
    email: str

user_repo: Repository[User] = Repository()
```

### 3. Protocol Types (Structural Subtyping)

```python
from typing import Protocol, runtime_checkable

# Define protocol
@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Square:
    def draw(self) -> None:
        print("Drawing square")

# Works with any class that implements draw()
def render(shape: Drawable) -> None:
    shape.draw()

# Both work without inheritance
render(Circle())
render(Square())

# Complex protocol example
class SupportsClose(Protocol):
    def close(self) -> None: ...

class SupportsRead(Protocol):
    def read(self, n: int = -1) -> bytes: ...

class Reader(SupportsClose, SupportsRead, Protocol):
    """Anything that can be read and closed"""
    pass

def process_file(file: Reader) -> bytes:
    try:
        data = file.read()
        return data
    finally:
        file.close()
```

### 4. Advanced Type Hints

```python
from typing import (
    Callable, Literal, TypedDict, Final,
    Annotated, overload, cast
)

# Callable types
def execute(callback: Callable[[int, str], bool]) -> None:
    result = callback(42, "test")
    print(result)

# Literal types for strict values
Mode = Literal["read", "write", "append"]

def open_file(path: str, mode: Mode) -> None:
    # mode can only be "read", "write", or "append"
    pass

# TypedDict for structured dictionaries
class UserDict(TypedDict):
    name: str
    age: int
    email: str

def create_user(data: UserDict) -> User:
    return User(**data)

# Final for constants
MAX_CONNECTIONS: Final = 100

# Annotated for metadata
from typing import Annotated

UserId = Annotated[int, "Unique user identifier"]

def get_user(user_id: UserId) -> User:
    pass

# Function overloading
@overload
def process(data: int) -> int: ...

@overload
def process(data: str) -> str: ...

def process(data: Union[int, str]) -> Union[int, str]:
    if isinstance(data, int):
        return data * 2
    return data.upper()

# Type casting
def get_value() -> Any:
    return "hello"

value = cast(str, get_value())  # Tell mypy it's a str
```

## Advanced OOP Patterns {#oop-patterns}

### 1. Abstract Base Classes

```python
from abc import ABC, abstractmethod
from typing import List

# Define abstract interface
class Repository(ABC):
    @abstractmethod
    async def save(self, entity: Any) -> None:
        """Save entity to storage"""
        pass
    
    @abstractmethod
    async def find_by_id(self, id: str) -> Optional[Any]:
        """Find entity by ID"""
        pass
    
    @abstractmethod
    async def find_all(self) -> List[Any]:
        """Get all entities"""
        pass

# Concrete implementation
class UserRepository(Repository):
    def __init__(self):
        self._storage: Dict[str, User] = {}
    
    async def save(self, user: User) -> None:
        self._storage[user.id] = user
    
    async def find_by_id(self, id: str) -> Optional[User]:
        return self._storage.get(id)
    
    async def find_all(self) -> List[User]:
        return list(self._storage.values())

# Abstract property
class Shape(ABC):
    @property
    @abstractmethod
    def area(self) -> float:
        pass
    
    @property
    @abstractmethod
    def perimeter(self) -> float:
        pass

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius
    
    @property
    def area(self) -> float:
        return 3.14159 * self.radius ** 2
    
    @property
    def perimeter(self) -> float:
        return 2 * 3.14159 * self.radius
```

### 2. Descriptors and Properties

```python
# Descriptor protocol
class Validator:
    def __init__(self, min_value: int = None, max_value: int = None):
        self.min_value = min_value
        self.max_value = max_value
    
    def __set_name__(self, owner, name):
        self.name = f"_{name}"
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)
    
    def __set__(self, instance, value):
        if self.min_value is not None and value < self.min_value:
            raise ValueError(f"{self.name} must be >= {self.min_value}")
        if self.max_value is not None and value > self.max_value:
            raise ValueError(f"{self.name} must be <= {self.max_value}")
        setattr(instance, self.name, value)

class Person:
    age = Validator(min_value=0, max_value=150)
    
    def __init__(self, age: int):
        self.age = age

# Property with getter, setter, deleter
class Temperature:
    def __init__(self, celsius: float):
        self._celsius = celsius
    
    @property
    def celsius(self) -> float:
        return self._celsius
    
    @celsius.setter
    def celsius(self, value: float):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero")
        self._celsius = value
    
    @property
    def fahrenheit(self) -> float:
        return self._celsius * 9/5 + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value: float):
        self.celsius = (value - 32) * 5/9

# Cached property
from functools import cached_property

class DataProcessor:
    def __init__(self, data: List[int]):
        self._data = data
    
    @cached_property
    def statistics(self) -> Dict[str, float]:
        # Computed once, then cached
        return {
            "mean": sum(self._data) / len(self._data),
            "min": min(self._data),
            "max": max(self._data)
        }
```

### 3. Mixins

```python
# Mixin classes for composition
class JSONMixin:
    def to_json(self) -> str:
        import json
        return json.dumps(self.__dict__)
    
    @classmethod
    def from_json(cls, json_str: str):
        import json
        data = json.loads(json_str)
        return cls(**data)

class TimestampMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def touch(self):
        self.updated_at = datetime.now()

class ReprMixin:
    def __repr__(self) -> str:
        attrs = ", ".join(
            f"{k}={v!r}"
            for k, v in self.__dict__.items()
            if not k.startswith("_")
        )
        return f"{self.__class__.__name__}({attrs})"

# Combine mixins
@dataclass
class User(JSONMixin, TimestampMixin, ReprMixin):
    id: str
    name: str
    email: str

user = User("1", "John", "john@example.com")
json_str = user.to_json()
print(repr(user))
```

## Functional Programming {#functional}

### 1. Higher-Order Functions

```python
from typing import Callable, Iterable, TypeVar

T = TypeVar('T')
U = TypeVar('U')

# Map, filter, reduce
def map_values(fn: Callable[[T], U], items: Iterable[T]) -> List[U]:
    return [fn(item) for item in items]

def filter_values(predicate: Callable[[T], bool], items: Iterable[T]) -> List[T]:
    return [item for item in items if predicate(item)]

from functools import reduce

def sum_values(items: List[int]) -> int:
    return reduce(lambda acc, x: acc + x, items, 0)

# Compose functions
def compose(*functions: Callable) -> Callable:
    def inner(arg):
        result = arg
        for fn in reversed(functions):
            result = fn(result)
        return result
    return inner

def add_one(x: int) -> int:
    return x + 1

def double(x: int) -> int:
    return x * 2

def square(x: int) -> int:
    return x ** 2

# Compose: square(double(add_one(x)))
process = compose(square, double, add_one)
result = process(5)  # ((5 + 1) * 2) ** 2 = 144

# Partial application
from functools import partial

def power(base: float, exponent: float) -> float:
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(5))    # 125
```

### 2. Closures and Currying

```python
# Closure example
def make_multiplier(factor: int) -> Callable[[int], int]:
    def multiply(x: int) -> int:
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15

# Counter with closure
def make_counter(start: int = 0) -> Callable[[], int]:
    count = start
    
    def counter() -> int:
        nonlocal count
        count += 1
        return count
    
    return counter

counter1 = make_counter()
counter2 = make_counter(100)

print(counter1())  # 1
print(counter1())  # 2
print(counter2())  # 101

# Currying
def curry(fn: Callable) -> Callable:
    def curried(*args):
        if len(args) >= fn.__code__.co_argcount:
            return fn(*args)
        return lambda *more_args: curried(*(args + more_args))
    return curried

@curry
def add_three(a: int, b: int, c: int) -> int:
    return a + b + c

print(add_three(1)(2)(3))     # 6
print(add_three(1, 2)(3))     # 6
print(add_three(1)(2, 3))     # 6

# Memoization
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Custom memoization
def memoize(fn: Callable) -> Callable:
    cache = {}
    
    def memoized(*args):
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]
    
    return memoized

@memoize
def expensive_computation(x: int, y: int) -> int:
    print(f"Computing {x} + {y}")
    return x + y

print(expensive_computation(1, 2))  # Computes
print(expensive_computation(1, 2))  # Uses cache
```

### 3. Itertools and Generators

```python
from itertools import (
    chain, combinations, permutations,
    product, groupby, islice, cycle
)

# Chain iterables
list1 = [1, 2, 3]
list2 = [4, 5, 6]
chained = chain(list1, list2)  # [1, 2, 3, 4, 5, 6]

# Combinations and permutations
items = [1, 2, 3]
combos = list(combinations(items, 2))     # [(1,2), (1,3), (2,3)]
perms = list(permutations(items, 2))      # [(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)]

# Cartesian product
colors = ['red', 'blue']
sizes = ['S', 'M', 'L']
products = list(product(colors, sizes))
# [('red','S'), ('red','M'), ('red','L'), ('blue','S'), ('blue','M'), ('blue','L')]

# Group by
data = [
    {'category': 'fruit', 'name': 'apple'},
    {'category': 'fruit', 'name': 'banana'},
    {'category': 'vegetable', 'name': 'carrot'}
]

sorted_data = sorted(data, key=lambda x: x['category'])
for category, items in groupby(sorted_data, key=lambda x: x['category']):
    print(f"{category}: {list(items)}")

# Generator functions
def fibonacci_gen(n: int):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Generator expression
squares = (x**2 for x in range(10))

# Infinite generator
def infinite_counter(start: int = 0):
    while True:
        yield start
        start += 1

# Take first 10 from infinite sequence
counter = infinite_counter()
first_ten = list(islice(counter, 10))

# Pipeline with generators
def read_file(filename: str):
    with open(filename) as f:
        for line in f:
            yield line.strip()

def filter_comments(lines):
    for line in lines:
        if not line.startswith('#'):
            yield line

def parse_line(lines):
    for line in lines:
        parts = line.split(',')
        yield {'name': parts[0], 'value': parts[1]}

# Chain generators
pipeline = parse_line(filter_comments(read_file('data.csv')))
for item in pipeline:
    print(item)
```

## Context Managers {#context-managers}

### 1. Basic Context Managers

```python
from contextlib import contextmanager
from typing import Generator

# Class-based context manager
class FileManager:
    def __init__(self, filename: str, mode: str):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        # Return False to propagate exceptions
        return False

# Usage
with FileManager('data.txt', 'w') as f:
    f.write('Hello, World!')

# Function-based context manager
@contextmanager
def file_manager(filename: str, mode: str) -> Generator:
    file = open(filename, mode)
    try:
        yield file
    finally:
        file.close()

with file_manager('data.txt', 'r') as f:
    content = f.read()
```

### 2. Advanced Context Managers

```python
import time
from contextlib import contextmanager

# Timer context manager
@contextmanager
def timer(operation: str):
    start = time.time()
    try:
        yield
    finally:
        end = time.time()
        print(f"{operation} took {end - start:.2f} seconds")

with timer("Database query"):
    # Expensive operation
    result = expensive_query()

# Database transaction context manager
@contextmanager
def transaction(connection):
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise

with transaction(db_connection) as conn:
    conn.execute("INSERT INTO users VALUES (...)")
    conn.execute("UPDATE accounts SET balance = ...")

# Temporary directory context manager
import tempfile
import shutil

@contextmanager
def temporary_directory():
    temp_dir = tempfile.mkdtemp()
    try:
        yield temp_dir
    finally:
        shutil.rmtree(temp_dir)

with temporary_directory() as temp_dir:
    # Work with temporary files
    file_path = f"{temp_dir}/temp.txt"
    with open(file_path, 'w') as f:
        f.write("Temporary data")
# Directory is automatically deleted

# Multiple context managers
with (
    open('input.txt') as infile,
    open('output.txt', 'w') as outfile,
    timer("File processing")
):
    for line in infile:
        outfile.write(line.upper())
```

### 3. Async Context Managers

```python
from contextlib import asynccontextmanager
import asyncio

# Async context manager class
class AsyncDatabaseConnection:
    async def __aenter__(self):
        self.connection = await connect_to_database()
        return self.connection
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.connection.close()
        return False

async with AsyncDatabaseConnection() as conn:
    result = await conn.execute("SELECT * FROM users")

# Async context manager function
@asynccontextmanager
async def async_timer(operation: str):
    start = time.time()
    try:
        yield
    finally:
        end = time.time()
        print(f"{operation} took {end - start:.2f} seconds")

async with async_timer("API call"):
    result = await fetch_data()

# Async resource pool
@asynccontextmanager
async def get_connection(pool):
    connection = await pool.acquire()
    try:
        yield connection
    finally:
        await pool.release(connection)

async with get_connection(db_pool) as conn:
    data = await conn.fetchall("SELECT * FROM users")
```

## Decorators and Metaprogramming {#decorators}

### 1. Function Decorators

```python
from functools import wraps
from typing import Callable
import time

# Basic decorator
def timer(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

# Decorator with arguments
def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Attempt {attempt + 1} failed: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def unreliable_api_call():
    # May fail, will retry
    return make_request()

# Decorator for caching
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Decorator for validation
def validate_types(**type_hints):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Validate argument types
            for name, expected_type in type_hints.items():
                value = kwargs.get(name)
                if value is not None and not isinstance(value, expected_type):
                    raise TypeError(
                        f"{name} must be {expected_type}, got {type(value)}"
                    )
            return func(*args, **kwargs)
        return wrapper
    return decorator

@validate_types(name=str, age=int)
def create_user(name: str, age: int):
    return User(name=name, age=age)
```

### 2. Class Decorators

```python
# Class decorator for singleton
def singleton(cls):
    instances = {}
    
    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    
    return get_instance

@singleton
class Database:
    def __init__(self):
        self.connection = connect()

# Class decorator for adding methods
def add_repr(cls):
    def __repr__(self):
        attrs = ", ".join(
            f"{k}={v!r}"
            for k, v in self.__dict__.items()
        )
        return f"{cls.__name__}({attrs})"
    
    cls.__repr__ = __repr__
    return cls

@add_repr
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

# Class decorator for registration
_handlers = {}

def register_handler(event_type: str):
    def decorator(cls):
        _handlers[event_type] = cls
        return cls
    return decorator

@register_handler("user.created")
class UserCreatedHandler:
    def handle(self, event):
        print(f"User created: {event}")

def get_handler(event_type: str):
    return _handlers.get(event_type)
```

### 3. Metaclasses

```python
# Basic metaclass
class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = "Connected"

db1 = Database()
db2 = Database()
print(db1 is db2)  # True

# Metaclass for automatic registration
class PluginMeta(type):
    plugins = {}
    
    def __new__(mcs, name, bases, attrs):
        cls = super().__new__(mcs, name, bases, attrs)
        if name != 'Plugin':  # Don't register base class
            mcs.plugins[name] = cls
        return cls

class Plugin(metaclass=PluginMeta):
    pass

class EmailPlugin(Plugin):
    def send(self, message):
        print(f"Sending email: {message}")

class SMSPlugin(Plugin):
    def send(self, message):
        print(f"Sending SMS: {message}")

# Access all registered plugins
print(PluginMeta.plugins)  # {'EmailPlugin': ..., 'SMSPlugin': ...}

# Metaclass for validation
class ValidatedMeta(type):
    def __new__(mcs, name, bases, attrs):
        # Validate required methods
        required_methods = ['validate', 'save']
        for method in required_methods:
            if method not in attrs:
                raise TypeError(
                    f"{name} must implement {method} method"
                )
        return super().__new__(mcs, name, bases, attrs)

class Model(metaclass=ValidatedMeta):
    def validate(self):
        pass
    
    def save(self):
        pass
```

## Concurrency and Parallelism {#concurrency}

### 1. Asyncio Basics

```python
import asyncio
from typing import List

# Basic async function
async def fetch_data(url: str) -> dict:
    print(f"Fetching {url}")
    await asyncio.sleep(1)  # Simulate network delay
    return {"url": url, "data": "..."}

# Run async function
async def main():
    result = await fetch_data("https://api.example.com")
    print(result)

asyncio.run(main())

# Concurrent execution
async def fetch_all(urls: List[str]) -> List[dict]:
    tasks = [fetch_data(url) for url in urls]
    results = await asyncio.gather(*tasks)
    return results

urls = [
    "https://api.example.com/1",
    "https://api.example.com/2",
    "https://api.example.com/3"
]

results = asyncio.run(fetch_all(urls))

# With timeout
async def fetch_with_timeout(url: str, timeout: float = 5.0):
    try:
        return await asyncio.wait_for(
            fetch_data(url),
            timeout=timeout
        )
    except asyncio.TimeoutError:
        print(f"Timeout fetching {url}")
        return None

# Async context manager for connection pool
class AsyncConnectionPool:
    def __init__(self, max_connections: int = 10):
        self._semaphore = asyncio.Semaphore(max_connections)
    
    async def acquire(self):
        await self._semaphore.acquire()
        return Connection()
    
    async def release(self, connection):
        await connection.close()
        self._semaphore.release()

pool = AsyncConnectionPool(max_connections=5)

async def make_request(url: str):
    connection = await pool.acquire()
    try:
        result = await connection.fetch(url)
        return result
    finally:
        await pool.release(connection)
```

### 2. Threading

```python
import threading
from queue import Queue
from typing import Callable

# Basic threading
def worker(name: str):
    print(f"Worker {name} starting")
    time.sleep(2)
    print(f"Worker {name} finished")

threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(f"#{i}",))
    t.start()
    threads.append(t)

for t in threads:
    t.join()

# Thread pool
from concurrent.futures import ThreadPoolExecutor

def process_item(item: int) -> int:
    time.sleep(0.5)
    return item ** 2

with ThreadPoolExecutor(max_workers=4) as executor:
    items = range(10)
    results = list(executor.map(process_item, items))

# Thread-safe queue
task_queue = Queue()
result_queue = Queue()

def worker_thread():
    while True:
        item = task_queue.get()
        if item is None:
            break
        result = process_item(item)
        result_queue.put(result)
        task_queue.task_done()

# Start workers
num_workers = 4
workers = []
for _ in range(num_workers):
    t = threading.Thread(target=worker_thread)
    t.start()
    workers.append(t)

# Add tasks
for i in range(20):
    task_queue.put(i)

# Wait for completion
task_queue.join()

# Stop workers
for _ in range(num_workers):
    task_queue.put(None)

for t in workers:
    t.join()

# Collect results
results = []
while not result_queue.empty():
    results.append(result_queue.get())
```

### 3. Multiprocessing

```python
from multiprocessing import Pool, Process, Queue, Manager
import os

# Basic multiprocessing
def compute(x: int) -> int:
    return x ** 2

if __name__ == '__main__':
    with Pool(processes=4) as pool:
        results = pool.map(compute, range(10))
        print(results)

# Process with shared state
from multiprocessing import Value, Array

def increment_counter(counter, lock):
    for _ in range(1000):
        with lock:
            counter.value += 1

if __name__ == '__main__':
    counter = Value('i', 0)
    lock = threading.Lock()
    
    processes = [
        Process(target=increment_counter, args=(counter, lock))
        for _ in range(4)
    ]
    
    for p in processes:
        p.start()
    
    for p in processes:
        p.join()
    
    print(f"Final count: {counter.value}")

# Manager for complex data structures
def worker(shared_dict, key, value):
    shared_dict[key] = value

if __name__ == '__main__':
    with Manager() as manager:
        shared_dict = manager.dict()
        
        processes = [
            Process(target=worker, args=(shared_dict, i, i**2))
            for i in range(10)
        ]
        
        for p in processes:
            p.start()
        
        for p in processes:
            p.join()
        
        print(dict(shared_dict))
```

## Performance Optimization {#performance}

### 1. Profiling

```python
import cProfile
import pstats
from line_profiler import LineProfiler

# cProfile for function-level profiling
def slow_function():
    total = 0
    for i in range(1000000):
        total += i
    return total

# Profile execution
cProfile.run('slow_function()')

# Save profile data
cProfile.run('slow_function()', 'profile_stats')

# Analyze profile data
stats = pstats.Stats('profile_stats')
stats.sort_stats('cumulative')
stats.print_stats(10)

# Line-by-line profiling
profiler = LineProfiler()
profiler.add_function(slow_function)
profiler.run('slow_function()')
profiler.print_stats()

# Memory profiling
from memory_profiler import profile

@profile
def memory_intensive():
    large_list = [i for i in range(1000000)]
    return sum(large_list)

memory_intensive()
```

### 2. Performance Optimization Techniques

```python
# ❌ Bad: List concatenation in loop
def bad_concatenation(items):
    result = ""
    for item in items:
        result += str(item)  # Creates new string each time
    return result

# ✅ Good: Join strings
def good_concatenation(items):
    return "".join(str(item) for item in items)

# ❌ Bad: Unnecessary list creation
def bad_sum(items):
    return sum([x ** 2 for x in items])

# ✅ Good: Generator expression
def good_sum(items):
    return sum(x ** 2 for x in items)

# ❌ Bad: Multiple passes over data
def bad_processing(data):
    filtered = [x for x in data if x > 0]
    squared = [x ** 2 for x in filtered]
    summed = sum(squared)
    return summed

# ✅ Good: Single pass
def good_processing(data):
    return sum(x ** 2 for x in data if x > 0)

# Using __slots__ for memory optimization
class RegularPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class OptimizedPoint:
    __slots__ = ['x', 'y']
    
    def __init__(self, x, y):
        self.x = x
        self.y = y

# OptimizedPoint uses ~40% less memory

# Lazy evaluation with generators
def read_large_file(filename):
    with open(filename) as f:
        for line in f:
            # Process line-by-line without loading entire file
            yield process_line(line)

# Use sets for membership testing
# ❌ Bad: O(n) lookup in list
items_list = [1, 2, 3, 4, 5]
if x in items_list:  # Slow for large lists
    pass

# ✅ Good: O(1) lookup in set
items_set = {1, 2, 3, 4, 5}
if x in items_set:  # Fast
    pass
```

## Testing Strategies {#testing}

### 1. pytest Basics

```python
import pytest
from typing import List

# Basic test
def test_addition():
    assert 1 + 1 == 2

# Test with fixtures
@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_sum(sample_data):
    assert sum(sample_data) == 15

# Parametrized tests
@pytest.mark.parametrize("input,expected", [
    (1, 2),
    (2, 4),
    (3, 6),
    (4, 8),
])
def test_double(input, expected):
    assert input * 2 == expected

# Test exceptions
def test_division_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

# Async tests
@pytest.mark.asyncio
async def test_async_function():
    result = await async_fetch_data()
    assert result is not None

# Mocking
from unittest.mock import Mock, patch

def test_with_mock():
    mock_db = Mock()
    mock_db.get_user.return_value = User(id="1", name="Test")
    
    service = UserService(mock_db)
    user = service.find_user("1")
    
    assert user.name == "Test"
    mock_db.get_user.assert_called_once_with("1")

# Patching
@patch('module.external_api_call')
def test_with_patch(mock_api):
    mock_api.return_value = {"status": "success"}
    
    result = process_api_data()
    assert result["status"] == "success"
```

### 2. Test Organization

```python
# tests/conftest.py - Shared fixtures
import pytest

@pytest.fixture(scope="session")
def database():
    db = create_test_database()
    yield db
    db.cleanup()

@pytest.fixture
def user(database):
    user = User(name="Test", email="test@example.com")
    database.save(user)
    yield user
    database.delete(user)

# tests/test_user_service.py
class TestUserService:
    def test_create_user(self, database):
        service = UserService(database)
        user = service.create_user("John", "john@example.com")
        assert user.name == "John"
    
    def test_find_user(self, database, user):
        service = UserService(database)
        found = service.find_user(user.id)
        assert found.id == user.id
    
    @pytest.mark.slow
    def test_expensive_operation(self):
        # Long-running test
        pass

# Run specific tests
# pytest tests/test_user_service.py
# pytest -k "test_create"
# pytest -m "not slow"
```

## Project Structure {#project-structure}

### 1. Standard Project Layout

```
my_project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── __main__.py
│       ├── core/
│       │   ├── __init__.py
│       │   └── models.py
│       ├── services/
│       │   ├── __init__.py
│       │   └── user_service.py
│       └── utils/
│           ├── __init__.py
│           └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   │   └── test_models.py
│   └── integration/
│       └── test_user_service.py
├── docs/
│   └── README.md
├── pyproject.toml
├── setup.py
├── requirements.txt
├── requirements-dev.txt
├── .gitignore
├── .pre-commit-config.yaml
└── README.md
```

### 2. Configuration Management

```python
# config.py
from pydantic import BaseSettings, Field
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "My App"
    debug: bool = False
    database_url: str = Field(..., env="DATABASE_URL")
    redis_url: Optional[str] = None
    api_key: str = Field(..., env="API_KEY")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

# .env file
# DATABASE_URL=postgresql://localhost/mydb
# API_KEY=secret_key_here
```

## Conclusion

Professional Python development requires mastering these patterns and practices:

1. **Type Hints** - Make code self-documenting and catch bugs early
2. **Async/Await** - Handle I/O-bound operations efficiently  
3. **Testing** - Ensure code quality and prevent regressions
4. **Performance** - Profile before optimizing, optimize bottlenecks
5. **Project Structure** - Organize code for maintainability

**Remember**: Write Python code that others (and future you) will thank you for.

## Resources

- [Python Documentation](https://docs.python.org/)
- [Real Python](https://realpython.com/)
- [Python Type Hints](https://peps.python.org/pep-0484/)
- [Effective Python](https://effectivepython.com/)

---

*What Python patterns do you use most in production? Share your experience!*
