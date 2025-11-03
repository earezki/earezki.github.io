---
title: "The 'Most Hated' CSS Feature: Understanding tan() in CSS"
pubDate: 2025-11-03
description: "Explore the CSS `tan()` function, its mathematical foundation, and practical applications for creating dynamic shapes and layouts. Learn why it's dubbed the 'Most Hated' CSS feature."
categories: ["AI News", "CSS functions", "math"]
---

## The 'Most Hated' CSS Feature: Understanding tan() in CSS

The CSS `tan()` function, part of the trigonometric functions introduced in CSS, has been labeled the "Most Hated" CSS feature in the 2025 State of CSS survey. Despite its mathematical utility, its complexity and niche use cases have sparked debate among developers. This article delves into the mathematical principles behind `tan()`, its practical applications in CSS, and why it remains a polarizing feature.

---

### 1. Mathematical Definition of `tan()`

- **Definition**: The tangent of an angle in a right-angled triangle is the ratio of the length of the *opposite* side to the *adjacent* side:  
  $$
  \tan(\theta) = \frac{\text{opposite}}{\text{adjacent}}
  $$
- **CSS Context**: In CSS, `tan()` is used to calculate proportions dynamically, especially when working with triangular shapes or angles.
- **Key Properties**:
  - Returns undefined (or extremely large values) at 90° and 270°, where the adjacent side length is zero.
  - Positive in the first and third quadrants (0°–90° and 180°–270°), negative in the second and fourth.

---

### 2. CSS Applications of `tan()`

#### A. Creating Polygonal Layouts
- **Use Case**: Arrange elements into polygonal shapes (e.g., octagons, triangles).
- **Example**: A circular menu using triangles arranged around a center point.
  - **Steps**:
    - Define `--total` (number of items) and `--radius` (container size).
    - Calculate rotation angles using `calc(360deg / var(--total) * var(--i))`.
    - Use `tan()` to dynamically compute the height of each triangle:
      ```css
      height: calc(2 * var(--radius) * tan(var(--theta)));
      ```
  - **Impact**: Eliminates manual calculations, ensuring scalability and responsiveness.

#### B. Dynamic Shape Adjustments
- **Example**: Adjust triangle dimensions based on container size without hardcoding.
- **Code Snippet**:
  ```css
  li {
    --theta: calc(360deg / 2 / var(--total));
    height: calc(2 * var(--radius) * tan(var(--theta)));
  }
  ```

#### C. Unit Circle Visualization
- **Concept**: Visualizing `tan()` values on a unit circle.
  - **Key Insight**: The tangent line extends from the circle’s point to the x-axis, representing the ratio of sine and cosine.
  - **Limitations**: At 90° and 270°, the tangent line becomes parallel to the x-axis, leading to undefined/infinitive values.

---

### 3. Practical Examples and Demos

#### A. Circular Menu with Triangular Items
- **Implementation**:
  - Use `clip-path: polygon(100% 0, 0 50%, 100% 100%)` to shape items as triangles.
  - Apply `transform-origin: left center` to position them around the center.
- **Result**: A responsive, polygon-shaped menu where each item's height is dynamically calculated using `tan()`.

#### B. Polygonal Image Gallery
- **Approach**: Repurpose the same logic to arrange images in a polygonal layout.
- **Advantages**: Maintains consistent spacing and proportions regardless of screen size.

---

### 4. Working Example

#### HTML Structure
```html
<ul style="--total: 8">
  <li style="--i: 1">1</li>
  <li style="--i: 2">2</li>
  <!-- ... up to 8 items -->
</ul>
```

#### CSS Styling
```css
:root {
  --radius: 35vmin;
}

ul {
  display: grid;
  place-items: center;
  width: calc(var(--radius) * 2);
  aspect-ratio: 1;
}

li {
  position: absolute;
  width: var(--radius);
  transform: translateX(calc(var(--radius) / 2)) rotate(var(--rotation));
  transform-origin: left center;
  clip-path: polygon(100% 0, 0 50%, 100% 100%);
}

li {
  --rotation: calc(360deg / var(--total) * var(--i));
  --theta: calc(360deg / 2 / var(--total));
  height: calc(2 * var(--radius) * tan(var(--theta)));
}
```

---

### 5. Recommendations and Best Practices

- **When to Use `tan()`**:
  - For dynamic layout adjustments involving angles or triangles.
  - When creating scalable, responsive polygonal shapes.
- **Best Practices**:
  - Use CSS variables (`--total`, `--radius`) for maintainability.
  - Pair with `sibling-index()` and `sibling-count()` (when available) for cleaner code.
  - Avoid manual calculations for triangle dimensions.
- **Pitfalls to Avoid**:
  - Misunderstanding angle calculations (e.g., using degrees instead of radians).
  - Forgetting to handle undefined values at 90°/270°, which can break layouts.
  - Overcomplicating simple designs with trigonometric functions.

---

### 6. Future Trigonometric Functions in CSS

The article hints at upcoming functions like `asin()`, `acos()`, and `atan2()`, which will expand CSS's mathematical capabilities. These functions will enable more complex animations and layouts, further blurring the line between design and computation.

---

### References

- [The "Most Hated" CSS Feature: tan() | CSS-Tricks](https://css-tricks.com/the-most-hated-css-feature-tan/)