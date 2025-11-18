---
title: 'Longest Substring Without Repeating Characters: The Sliding Window Technique'
pubDate: '2025-11-16'
description: 'Master the sliding window pattern through one of its most elegant applications. Learn how to find the longest substring without repeating characters in O(n) time using a hash set and two pointers.'
categories:
  - Algorithms
  - Interview
  - Sliding Window
  - Hash Sets
  - AI Assisted
---

## The Problem

Given a string, find the length of the longest substring that contains no repeating characters. Just the length, not the actual substring itself, though knowing where it is can be useful for debugging.

Think about autocomplete or search suggestions. You want to identify unique character sequences to avoid showing repetitive patterns. Or consider data compression: finding runs of unique characters helps determine the best compression strategy. The pattern recognition here extends far beyond string manipulation.

## Breaking Down the Challenge

Let's work through `"abcabcbb"`. Your eyes scan and quickly spot `"abc"` with length `3`. That's the answer, but there are other valid substrings: `"bca"`, `"cab"`, `"ab"`, `"bc"`. All of them have no repeating characters, but `"abc"` is the longest.

Now try `"bbbbb"`. Every character is the same, so the longest unique substring is just `"b"` with length `1`. The answer changes completely based on the input structure.

Here's the tricky part: `"pwwkew"`. You might think `"wke"` with length `3`, and you'd be right. But notice how you have to mentally reset when you hit the second `w`. That's the key insight: when you find a duplicate, you need to adjust your window.

What about edge cases? An empty string returns `0`. A single character returns `1`. A string with all unique characters returns its full length.

## The Solution: Sliding Window with a Hash Set

```java
public int lengthOfLongestSubstring(String s) {
    Set<Character> seen = new HashSet<>();
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        
        while (seen.contains(c)) {
            seen.remove(s.charAt(left));
            left++;
        }
        
        seen.add(c);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```

The sliding window technique is simple. Imagine two pointers, `left` and `right`, defining a window in your string. The `right` pointer explores forward, and the `left` pointer contracts the window when needed.

We maintain a `HashSet` called `seen` that tracks which characters are currently in our window. As we move `right` forward, we add each character to the set. If we encounter a character that's already in the set, we have a duplicate. Now the `while` loop kicks in: keep removing characters from the left side of the window until we've eliminated the duplicate.

The time complexity is O(n) because each character is visited at most twice: once by `right` and once by `left`. The space complexity is O(min(n, m)) where `m` is the size of the character set (128 for ASCII, 26 for lowercase letters, etc.).

**Handling Large Strings:**
For very large strings, you might want to process in chunks or use a streaming approach. If you're analyzing a massive log file, you don't need to load it all into memory. Process it character by character, maintaining your window state:

```
maxLength = 0
windowStart = 0
seen = {}

for each character c from stream:
    while c in seen:
        remove character at windowStart from seen
        windowStart++
    add c to seen
    maxLength = max(maxLength, current_position - windowStart + 1)
```
