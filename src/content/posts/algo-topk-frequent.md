---
title: "Top K Frequent Elements: Finding Signal in the Noise"
pubDate: '2025-11-09'
description: 'Master the Top K Frequent problem with practical heap-based and optimized solutions. Learn when to use max heaps vs min heaps, and why this matters for real-world data analysis.'
categories:
  - Algorithms
  - Interview
  - Heap
  - HashMap
---

## The Problem You'll Face in Production

Imagine you're building analytics for a streaming platform. Thousands of songs are played every hour, and your product team wants to know: "What are the 10 most-played songs right now?" Or picture yourself analyzing logs, you need to identify the 50 most common error codes to prioritize debugging. This is the Top K Frequent problem, and it's everywhere in real systems.

The core challenge: given an array of numbers, find the k most frequently occurring elements. Simple enough conceptually, but the efficiency matters when you're processing millions of records.

## The Problem Unpacked

Here's what we're working with:

**Input:** An array of integers and a number k

**Output:** The k most frequent elements (order doesn't matter)

**Example scenarios:**

Let's say we have `nums = [1,1,1,2,2,3]` and `k = 2`. The breakdown is:
- 1 appears 3 times
- 2 appears 2 times
- 3 appears 1 time

So the answer is `[1, 2]` the two elements that show up most often.

Another example: `nums = [1,2,1,2,1,2,3,1,3,2]` with `k = 2`:
- 1 appears 4 times
- 2 appears 4 times
- 3 appears 2 times

Answer: `[1, 2]`

## The Straightforward Approach: Count Everything, Then Pick

The intuition is straightforward: count how many times each number appears, then extract the top k. Let's walk through it.

**Step 1: Build a frequency map**

We'll iterate through the array once and count occurrences using a HashMap. This takes O(n) time and gives us all the information we need.

**Step 2: Extract the top k**

Now here's where it gets interesting. We have two reasonable strategies:

The **max heap approach** throws all entries into a max heap (ordered by frequency), then polls k times. Conceptually simple, grab the biggest each time.

The **min heap approach** is trickier but smarter: keep only k entries in a min heap. As you iterate through the frequency map, if you see something more frequent than the smallest item in your heap, kick out that smallest item and add the new one. This uses less memory when k is tiny compared to the number of unique elements.

Let me show you the max heap solution first since it's more intuitive:

```java
import java.util.*;

public class TopKFrequent {
    public int[] topKFrequent(int[] nums, int k) {
        if (nums.length == 0 || k == 0) return new int[0];
        
        // Count frequencies
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }
        
        // Create max heap ordered by frequency
        PriorityQueue<Map.Entry<Integer, Integer>> maxHeap = 
            new PriorityQueue<>(
                Collections.reverseOrder(
                    Comparator.comparingInt(Map.Entry::getValue)
                )
            );
        
        // Add everything to the heap
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            maxHeap.offer(entry);
        }
        
        // Poll the requested k elements
        int[] result = new int[k];
        for (int i = 0; i < k && !maxHeap.isEmpty(); i++) {
            result[i] = maxHeap.poll().getKey();
        }
        
        return result;
    }
}
```

**How it works:** We build a HashMap to count everything, this is our foundation. Then we feed all those entries into a max heap (a PriorityQueue with reverse comparator). Since heaps are ordered by frequency, the k largest frequencies bubble to the top. We simply poll k times and collect the keys.

**Complexity:**
- Time: O(n + m log m), where n is array length and m is unique elements. We count in O(n), build the heap in O(m log m), and extract k in O(k log m).
- Space: O(m) for the HashMap and heap

## The Alternative: Min Heap for Memory Efficiency

Now, here's where you might optimize if k is much smaller than the number of unique elements. Instead of keeping all entries, maintain only a min heap of size k:

```java
// Min heap approach -> more memory-efficient
PriorityQueue<Map.Entry<Integer, Integer>> minHeap = 
    new PriorityQueue<>(
        Comparator.comparingInt(Map.Entry::getValue)
    );

for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
    minHeap.offer(entry);
    if (minHeap.size() > k) {
        // Remove the least frequent element keeping only upto k elements in the Heap
        minHeap.poll();
    }
}

// Now the heap contains exactly the k most frequent
// but you need to get it in revered order (i = k - 1; ...; i--)
int[] result = new int[k];
for (int i = k - 1; i >= 0 && !minHeap.isEmpty(); i--) {
    result[i] = minHeap.poll().getKey();
}
```

This approach only keeps k entries at a time. As you iterate through the frequency map, if the heap grows beyond k, you ditch the element with the lowest frequency. By the end, you're left with exactly k most-frequent elements. It's maintains a "top k candidates" list as you go.

**Complexity:**
- Time: O(n + m log k), where m is unique elements. The heap operations are now O(log k) instead of O(log m).
- Space: O(k) for the heap itself (plus O(m) for the initial frequency map)

