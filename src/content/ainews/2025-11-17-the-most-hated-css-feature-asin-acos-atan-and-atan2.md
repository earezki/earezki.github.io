---
title: "Inverse Trigonometric Functions in CSS: asin(), acos(), atan(), and atan2()"
pubDate: 2025-11-17
description: "Trigonometric functions in CSS, including asin(), acos(), atan(), and atan2(), are the 'Most Hated' feature per State of CSS 2025."
categories: ["AI News", "CSS", "Math"]
---

## CSS Trigonometric Functions: The “Most Hated” CSS Feature

Trigonometric functions in CSS, including `asin()`, `acos()`, `atan()`, and `atan2()`, were named the “Most Hated” feature in the State of CSS 2025 survey. These inverse functions enable dynamic angle calculations but face domain restrictions and edge-case challenges.

### Why This Matters
Inverse trigonometric functions like `asin()` and `acos()` are limited to inputs between -1 and 1, returning `NaN` for invalid values, which breaks responsive designs. `atan()` and `atan2()` resolve quadrant ambiguity, making them critical for layout calculations. Misuse can lead to silent failures in gradients or animations, costing hours in debugging.

### Key Insights
- "asin(1.2) returns NaN due to domain restrictions, 2025"
- "atan2() resolves quadrant ambiguity in angle calculations"
- "CSS-Tricks uses `atan()` for dynamic conic gradients, 2025"

### Working Example
```css
.gradient {
  --angle: atan(var(--height-gradient) / var(--width-gradient));
  --rotation: calc(90deg - var(--angle));
  background: conic-gradient(from var(--rotation), #84a59d 180deg, #f28482 180deg);
}
```

```javascript
const body = document.querySelector("body");
body.addEventListener("pointermove", (event) => {
  body.style.setProperty("--m-x", `${event.clientX}px`);
  body.style.setProperty("--m-y", `${event.clientY}px`);
});
```

### Practical Applications
- **Use Case**: `atan()` for responsive conic gradients in CSS-Tricks examples
- **Pitfall**: Forgetting `atan2()`’s quadrant-awareness leads to incorrect angle calculations in mouse-tracking animations

**References:**
- https://css-tricks.com/the-most-hated-css-feature-asin-acos-atan-and-atan2/
---