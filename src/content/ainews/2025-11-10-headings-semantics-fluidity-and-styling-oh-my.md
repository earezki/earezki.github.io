---
title: "Headings: Semantics, Fluidity, and Styling — Oh My! | CSS-Tricks"
pubDate: 2025-11-10
description: "A detailed exploration of proper heading placement, fluid typography techniques, and emerging CSS features for styling headings, emphasizing accessibility, semantics, and cross-browser compatibility."
categories: ["AI News", "Web Development", "CSS"]
---

## Headings: Semantics, Fluidity, and Styling — Oh My!

This article addresses best practices for structuring and styling HTML headings, focusing on semantic correctness, responsive typography, and emerging CSS features. It emphasizes accessibility, usability, and cross-browser compatibility in modern web development.

---

### Semantic Structure of Headings

Proper placement of `<h1>` and other heading elements is critical for accessibility and semantic HTML. The `<header>` element should **not** contain the main page heading (`<h1>`) if it’s part of the `<main>` content. Key guidelines include:

- **Avoid placing `<h1>` in the `<header>`** unless it’s the site-wide title (not the page-specific heading). This prevents confusion for screen readers and users navigating via skip links.
- **Nesting `<header>` inside `<main>`** loses the semantic role of `<header>` (which maps to `role="banner"`), reducing clarity for assistive technologies.
- **Correct structure** places `<h1>` directly within `<main>`, separate from `<header>`:

  ```html
  <header>
    <!-- Site-wide header content -->
  </header>
  <main>
    <h1>Page heading</h1>
    <!-- Main content -->
  </main>
  ```

  **Impact**: Ensures predictable navigation for screen readers and maintains semantic landmarks.

---

### Fluid Typography with `clamp()`

Responsive typography requires balancing scalability and accessibility. The `clamp()` function allows font sizes to scale between a minimum and maximum value based on viewport width. However, improper use can break accessibility when users zoom.

- **Basic `clamp()` usage**:
  ```css
  .article-heading {
    font-size: clamp(18px, 4vw, 36px);
  }
  ```
  - **Min**: `18px` (smallest font size).
  - **Ideal**: `4vw` (viewport width-based scaling).
  - **Max**: `36px` (largest font size).

- **Accessibility issue**: If the "ideal" value uses `vw`, zooming disrupts the scaling. To fix this, use **`rem`** for the ideal value, calculated based on character count per line:

  ```css
  .article-heading {
    --heading-smallest: 2.5rem;
    --heading-largest: 5rem;
    --m: calc((var(--heading-largest) - var(--heading-smallest)) / (30 - 20));
    font-size: clamp(var(--heading-smallest), var(--m) * 100vw, var(--heading-largest));
  }
  ```

  **Note**: This works in Chrome and Safari but not Firefox due to unit division in `calc()`.

---

### Emerging CSS Features: `:heading` Pseudo-Class

A new experimental CSS feature in Firefox Nightly allows targeting headings more efficiently:

- **`:heading`** pseudo-class selects all heading elements (`<h1>` to `<h6>`):
  ```css
  :heading {
    color: #333;
  }
  ```
- **`:heading(2, 3)`** targets only `<h2>` and `<h3>`:
  ```css
  :heading(2, 3) {
    font-weight: bold;
  }
  ```

  **Advantages**:
  - Cleaner syntax than `h1, h2, h3, h4, h5, h6`.
  - Automatically ignores non-heading elements with ARIA roles or attributes.

  **Limitation**: Currently only available in Firefox Nightly (not widely supported).

---

## Working Example

### Semantic Structure
```html
<header>
  <nav>Site Navigation</nav>
</header>
<main>
  <h1>Welcome to Our Blog</h1>
  <article>
    <h2>Responsive Typography Tips</h2>
    <p>...</p>
  </article>
</main>
```

### Fluid Typography
```css
.article-heading {
  --heading-smallest: 1.5rem;
  --heading-largest: 3rem;
  --m: calc((var(--heading-largest) - var(--heading-smallest)) / (40 - 20));
  font-size: clamp(var(--heading-smallest), var(--m) * 100vw, var(--heading-largest));
}
```

---

## Recommendations

- **Semantic Structure**:
  - Always place `<h1>` inside `<main>`, not in `<header>`.
  - Use `<header>` only for introductory content, not for page headings.
- **Fluid Typography**:
  - Prefer `rem` over `vw` for the middle value in `clamp()` to ensure zoom accessibility.
  - Test across browsers, as unit-based calculations may fail in Firefox.
- **New Features**:
  - Use `:heading` for cleaner CSS when targeting multiple headings.
  - Monitor browser support for `:heading` and use fallbacks where necessary.

---

**Reference**: [Headings: Semantics, Fluidity, and Styling — Oh My! | CSS-Tricks](https://css-tricks.com/headings-semantics-fluidity-and-styling-oh-my/)