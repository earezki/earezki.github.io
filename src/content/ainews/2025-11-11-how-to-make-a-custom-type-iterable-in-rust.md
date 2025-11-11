---
title: "How To Make A Custom Type Iterable In Rust"
pubDate: 2025-11-11
description: "Learn to make a heapless vector iterable in Rust by implementing core iterator traits."
categories: ["AI News", "Rust", "Embedded Systems"]
---

## How To Make A Custom Type Iterable In Rust

This article explains how to implement `IntoIterator`, `Iterator`, and `FromIterator` traits for a heapless vector (`ArrayVec`) using `MaybeUninit<T>` to avoid heap allocation. The implementation enables use in `for` loops and with iterator combinators.

### Why This Matters
Heapless data structures are critical in embedded systems where heap allocation is unsafe or unavailable. However, making such types iterable requires careful handling of memory safety, ownership, and drop semantics. Failing to implement `Drop` for custom iterators can lead to double-frees or memory leaks, with costs ranging from subtle bugs to system crashes.

### Key Insights
- "8-hour App Engine outage, 2012" (not in context, omitted)
- "Sagas over ACID for e-commerce" (not in context, omitted)
- "Temporal used by Stripe, Coinbase" (not in context, omitted)
- "ArrayVec uses `MaybeUninit<T>` for stack-based memory management"
- "Implementing `Drop` for `ArrayVecIntoIter` prevents double-free errors"
- "Iterator traits enable `for item in &vec` syntax and compatibility with `map`, `filter`"

### Working Example

```rust
use core::mem::MaybeUninit;

#[derive(Debug)]
pub struct ArrayVec<T, const N: usize> {
    values: [MaybeUninit<T>; N],
    len: usize,
}

impl<T, const N: usize> ArrayVec<T, N> {
    pub fn new() -> Self {
        ArrayVec {
            values: [const { MaybeUninit::uninit() }; N],
            len: 0,
        }
    }

    pub fn try_push(&mut self, value: T) -> Result<(), T> {
        if self.len == N {
            return Err(value);
        }
        self.values[self.len].write(value);
        self.len += 1;
        Ok(())
    }

    pub fn as_slice(&self) -> &[T] {
        unsafe { core::slice::from_raw_parts(self.values.as_ptr() as *const T, self.len) }
    }
}

pub struct ArrayVecIntoIter<T, const N: usize> {
    values: [MaybeUninit<T>; N],
    len: usize,
    index: usize,
}

impl<T, const N: usize> Iterator for ArrayVecIntoIter<T, N> {
    type Item = T;
    fn next(&mut self) -> Option<Self::Item> {
        if self.index >= self.len {
            return None;
        }
        let i = self.index;
        self.index += 1;
        unsafe { Some(self.values[i].assume_init_read()) }
    }
}

impl<T, const N: usize> Drop for ArrayVecIntoIter<T, N> {
    fn drop(&mut self) {
        for i in self.index..self.len {
            unsafe { self.values[i].assume_init_drop(); }
        }
    }
}

impl<T, const N: usize> IntoIterator for ArrayVec<T, N> {
    type Item = T;
    type IntoIter = ArrayVecIntoIter<T, N>;
    fn into_iter(self) -> Self::IntoIter {
        let this = core::mem::ManuallyDrop::new(self);
        let values = unsafe { core::ptr::read(&this.values) };
        let len = unsafe { core::ptr::read(&this.len) };
        ArrayVecIntoIter { values, len, index: 0 }
    }
}
```

### Practical Applications
- **Use Case**: `ArrayVec` in embedded systems for stack-based collections without heap allocation.
- **Pitfall**: Forgetting to implement `Drop` for custom iterators can cause memory leaks or double-frees.

**References:**
- https://dev.to/allwelldotdev/how-to-make-a-custom-type-iterable-in-rust-c0i
- https://gist.github.com/allwelldotdev/39c817ca8d40fe5aeb808eb6301a18ff