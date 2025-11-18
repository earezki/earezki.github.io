---
title: 'Product of Array Except Self: Division-Free Array Manipulation'
pubDate: '2025-11-18'
description: 'Learn how to compute products of all elements except the current one without using division. Master the prefix-suffix pattern that appears in countless array problems and understand why O(n) with O(1) space is achievable.'
categories:
  - Algorithms
  - Interview
  - Array Manipulation
  - AI Assisted
---

## The Problem

Given an array of integers, return a new array where each element at index `i` is the product of all elements in the original array except the one at `i`. Oh, and you can't use division, and you need to do it in O(n) time.

Think about calculating percentage contributions in a dataset where each element needs to know its proportion relative to all others, but you can't use division because of numerical stability issues. Or imagine a distributed system where each node needs to compute aggregate values excluding its own contribution. The pattern matters beyond the math.

## Breaking Down the Challenge

Start simple: `nums = [1, 2, 3, 4]`. The answer is `[24, 12, 8, 6]`. Let's verify:
- Index 0: product of [2, 3, 4] = 24 ✓
- Index 1: product of [1, 3, 4] = 12 ✓
- Index 2: product of [1, 2, 4] = 8 ✓
- Index 3: product of [1, 2, 3] = 6 ✓

If division were allowed, this would be trivial: calculate the total product, then divide by each element. But what if there's a zero in the array? Division breaks down. What if there are two zeros? The whole thing collapses.

Here's the trick that makes this interesting: `nums = [1, 2, 3, 0]`. The answer is `[0, 0, 0, 6]`. Everything except the zero position becomes zero because you're multiplying by that zero somewhere in the product chain.

The naive approach is computing the product for each position by iterating through all other elements. For each of n elements, you multiply n-1 values. That's O(n²), which fails at scale.

## The Solution: Prefix and Suffix Products

```java
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    
    // Build prefix products from left
    result[0] = 1;
    for (int i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }
    
    // Build suffix products from right and combine
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] = result[i] * suffix;
        suffix *= nums[i];
    }
    
    return result;
}
```

The insight here is recognizing that the product of everything except `nums[i]` equals the product of everything before `i` multiplied by the product of everything after `i`.

First pass: build prefix products. At index `i`, store the product of all elements from index 0 to i-1. This gives you "everything to the left."

Second pass: build suffix products on the fly and multiply them into the result. As you go backwards, maintain the running product of everything you've seen so far (from the right), which gives you "everything to the right."

Time complexity is O(n) because we make two passes through the array. Space complexity is O(1) if you don't count the output array (which the problem typically doesn't), because we only use the `suffix` variable as extra space.