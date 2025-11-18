---
title: 'Best Time to Buy and Sell Stock: Finding Profit in a Single Pass'
pubDate: '2025-11-15'
description: 'Learn how to find the maximum profit from a single stock transaction with an elegant O(n) solution. Discover why tracking the minimum price is the key insight that transforms this problem from complex to simple.'
categories:
  - Algorithms
  - Interview
  - Dynamic Programming
  - AI Assisted
---

## The Problem

You've got an array of stock prices where each element represents the price on that day. You can buy once and sell once, and you need to maximize your profit. If you can't make a profit, return zero.

Here's why this matters beyond the obvious stock market connection. Say you're analyzing server load patterns and trying to find the best time to scale down and scale up to minimize costs. Or you're optimizing a caching strategy where you need to identify the lowest resource point before a spike. The pattern is everywhere: find the minimum before the maximum.

## Breaking Down the Challenge

Let's start with a real example: `prices = [7, 1, 5, 3, 6, 4]`. Your gut tells you to buy at `1` and sell at `6` for a profit of `5`. That's correct, but how do you systematically find this without checking every possible buy-sell pair?

The constraints are simple but important: you must buy before you sell. You can't sell on day 2 and buy on day 5, even if that would give you a better "profit." Time moves forward, and so must your transactions.

Here's what catches people: you might think you need to find the absolute minimum and absolute maximum in the array. But what if the minimum comes after the maximum? In `[5, 4, 3, 2, 1]`, buying at `5` and selling at anything else loses money. The answer is `0`.

## The Solution: One Pass, Two Variables

```java
public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else {
            int profit = price - minPrice;
            maxProfit = Math.max(maxProfit, profit);
        }
    }
    
    return maxProfit;
}
```

**The Kadane's Algorithm Connection:**
Here's something interesting: you can transform this into a maximum subarray problem. Create a new array where each element is the difference between consecutive days: `diff[i] = prices[i+1] - prices[i]`. Now find the maximum sum of any subarray in `diff`.

Why does this work? Each element in `diff` represents the profit or loss from holding the stock for one day. The maximum subarray sum represents the best consecutive period to hold the stock.

```
diffs = [prices[i+1] - prices[i] for each i]
return max subarray sum of diffs (or 0 if negative)
```

This is elegant from a theoretical perspective and helps you see connections between problems, but in practice it's harder to implement correctly and doesn't buy you anything over the simple minimum-tracking approach.

**The DP Formulation:**
You could also think of this as a dynamic programming problem. At each day, you're in one of two states: you either own the stock or you don't. Track the maximum profit for each state:

```
hold = -infinity (cost to hold stock)
sold = 0 (profit from selling)

for each price:
    hold = max(hold, -price)  // buy today or keep holding
    sold = max(sold, hold + price)  // sell today or stay sold
    
return sold
```