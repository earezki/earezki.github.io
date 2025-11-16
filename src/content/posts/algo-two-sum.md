---
title: 'Two Sum: The First Step Into Algorithmic Problem Solving'
pubDate: '2025-11-16'
description: 'Master the Two Sum problem with a hash map solution. Learn how to transform a brute force O(n²) approach into an elegant O(n) algorithm, and why this problem appears in nearly every coding interview.'
categories:
  - Algorithms
  - Interview
  - Hash Maps
---

## The Problem

Given an array of integers and a target sum, find two numbers that add up to that target and return their indices. No sorting allowed, no modifying the array, and you can't use the same element twice.

Why this matters. Imagine you're building a financial app that needs to find matching transactions, one debit and one credit that cancel each other out. Or maybe you're working on a recommendation system trying to find pairs of users with similar interests. These real-world scenarios map to the exact same problem structure.

## Breaking Down the Challenge

Let's walk through a concrete example. Say you have `nums = [2, 7, 11, 15]` and `target = 9`. Your eyes immediately spot that `2 + 7 = 9`, so you return `[0, 1]`. Easy !

Now imagine your array has 100,000 elements. Your eyes can't scan anymore.

The naive approach is to check every pair: for each number, look at every other number and see if they sum to the target. That works, but it's O(n²), for 100,000 elements, you're looking at 10 billion operations.

Here's the key insight that changes everything: instead of comparing every pair, what if you could know immediately whether the complement exists? If you're at number `2` and you need `9`, you need `7`. Do you have `7` stored somewhere? If yes, we're done. This is where hash maps shine.

## The Solution: Trading Space for Time

```java
public int[] twoSum(int[] nums, int target) {
    // First pass: build a map of every number to its index
    Map<Integer, Integer> idxByNum = IntStream.range(0, nums.length)
            .collect(HashMap::new,
                    (lhs, idx) -> lhs.put(nums[idx], idx),
                    HashMap::putAll);

    // Second pass: for each number, check if its complement exists
    for (int i = 0; i < nums.length; i++) {
        int n = nums[i];
        int diff = target - n;

        Integer idx = idxByNum.get(diff);
        if (idx != null && idx != i) {
            return new int[]{i, idx};
        }
    }

    return new int[]{};
}
```

In the first pass, we build a hash map where the key is each number and the value is its index. This takes O(n) time and uses O(n) space.

In the second pass, we iterate through the array again. For each number `n`, we calculate what complement we'd need: `diff = target - n`. Then we look it up in our hash map. If it exists and it's not the same element (`idx != i`), we found our pair. Return the indices and we're done.

The time complexity is O(n) because we make two passes through the array, each taking linear time. The space complexity is O(n) because we're storing the hash map. Compare that to the brute force O(n²) approach, and you see why this matters for large datasets.

Let's trace through our example: `[2, 7, 11, 15]`, target `9`.
- Build map: `{2→0, 7→1, 11→2, 15→3}`
- Iteration 1: We have `2`. We need `9 - 2 = 7`. Look in map. Found! Index is `1`. Return `[0, 1]`.

## Alternative Approaches:

There are other ways to solve this, and each has merit.

**The Two-Pointer Approach (if sorting is allowed):**
Sort the array, then place one pointer at the start and one at the end. If the sum is too small, move the left pointer right. If it's too large, move the right pointer left. This is O(n log n) due to sorting but uses O(1) extra space if you ignore the sorting space. The downside? You lose the original indices and have to track them separately. It's elegant for certain scenarios but loses information.

**Single-Pass Hash Map (subtle but important):**
Instead of two passes, you can do it in one. As you iterate, check if the complement exists in the map. If not, add the current number to the map and keep going. This saves a tiny bit of overhead, though both are O(n).

```
map = {}
for each number n at index i:
    complement = target - n
    if complement exists in map:
        return [map[complement], i]
    map[n] = i
```

The two-pass approach is slightly clearer about its intent—build first, then search. The single-pass is more efficient in practice.

## When Should You Actually Care?

For the Two Sum problem on LeetCode or in an interview, the hash map solution is the gold standard. It's efficient, clean, and shows you understand the space-time trade-off.

Whenever you have a problem that feels O(n²) because you're comparing elements, ask yourself: can I precompute something to make lookups instant? Want to find if an element exists? Hash set. Want quick range queries? Segment tree. Want to know about previous elements as you move forward? Hash map with current state.