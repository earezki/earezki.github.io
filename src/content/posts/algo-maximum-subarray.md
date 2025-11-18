---
title: 'Maximum Subarray: Kadane's Algorithm and the Art of Local vs Global Optimization'
pubDate: '2025-11-17'
description: 'Discover how Kadane's algorithm finds the maximum sum subarray in O(n) time. Learn why tracking local maximums leads to global solutions, and how this pattern applies far beyond array problems.'
categories:
  - Algorithms
  - Interview
  - Dynamic Programming
  - AI Assisted
---

## The Problem

Given an array of integers (positive, negative, or zero), find the contiguous subarray with the largest sum and return that sum. You need at least one element in your subarray, so you can't just return an empty array for all negatives.

This problem shows up in surprising places. Imagine you're analyzing profit and loss across consecutive days and want to find the best period to highlight in a report. Or you're processing sensor data looking for the strongest sustained signal. Or you're a data scientist finding the most significant trend in a noisy time series. The pattern is universal: find the best consecutive slice.

## Breaking Down the Challenge

Start with `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`. Your answer is `6` from the subarray `[4, -1, 2, 1]`. Notice you don't just grab the maximum element (`4` appears twice). You're looking for the sum of consecutive elements that gives you the biggest total.

What about `[-1]`? There's only one element, and it's negative, but you still need to return it: `-1`. You can't have an empty subarray.

Here's what makes this interesting: `[5, -3, 5]`. You might think taking just the first `5` gives you the max, but actually the entire array sums to `7`. Sometimes it's worth pushing through a negative section if there's more value on the other side.

The naive approach is checking every possible subarray. For each starting position, try every ending position and sum those elements. That's O(n³) if you're doing the sum naively, O(n²) if you're clever about accumulating sums. Neither scales well.

## The Solution: Kadane's Algorithm

```java
public int maxSubArray(int[] nums) {
    int currentSum = nums[0];
    int maxSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}
```

This is Kadane's algorithm, and it's one of those solutions that feels like magic until you understand the insight behind it.

At each position, you make a decision: do I start a new subarray here, or do I extend the one I've been building? The answer depends on whether adding the current element to your running sum makes it better or worse than just starting fresh.

`currentSum = Math.max(nums[i], currentSum + nums[i])` captures this perfectly. If `currentSum + nums[i]` is negative or smaller than just `nums[i]` alone, you're better off ditching everything before and starting fresh at this element.

Then you track the global maximum: `maxSum = Math.max(maxSum, currentSum)`. At each step, check if your current subarray is the best you've seen so far.

Time complexity is O(n) because we make one pass through the array. Space complexity is O(1) because we only track two variables regardless of input size.
