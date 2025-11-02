---
title: "Pure CSS Tabs With Details, Grid, and Subgrid"
pubDate: 2025-10-27
description: "A modern approach to creating accessible CSS-only tabs using the <details> element, CSS Grid, and Subgrid, with practical implementation examples and accessibility considerations."
categories: ["AI News", "Web Development", "CSS", "Accessibility"]
---

## Pure CSS Tabs With Details, Grid, and Subgrid

This article presents a modern, accessible method for creating tabbed interfaces using only HTML and CSS, leveraging the `<details>` element, CSS Grid, and Subgrid. The approach avoids JavaScript, relies on semantic HTML, and ensures compatibility with screen readers and keyboard navigation. Key components include structured HTML for tabs, grid-based layout, and subgrid for alignment, with emphasis on accessibility and browser support.

---

### HTML Structure

The foundation of the tab interface is built using the `<details>` element, which acts as a container for each tab. The structure includes:
- A parent `.grid` container to hold all tabs.
- Individual `<details>` elements with `class="item"` for each tab.
- A `<summary>` element inside each `<details>` to serve as the tab label and toggle.
- Content sections inside each `<details>` for the tab panel.

**Example HTML:**
```html
<div class="grid">
  <details class="item" name="alpha" open style="--n: 1">
    <summary class="subitem">First item</summary>
    <div>Content for first tab</div>
  </details>
  <details class="item" name="alpha" style="--n: 2">
    <summary class="subitem">Second item</summary>
    <div>Content for second tab</div>
  </details>
  <details class="item" name="alpha" style="--n: 3">
    <summary class="subitem">Third item</summary>
    <div>Content for third tab</div>
  </details>
</div>
```

---

### CSS Implementation

#### 1. **Grid Layout Setup**
The `.grid` container is styled as a CSS Grid with:
- `grid-template-columns: repeat(3, minmax(200px, 1fr))` for three equal-width columns.
- `grid-template-rows: auto 1fr` to allocate space for tabs (first row) and content (second row).
- `column-gap: 1rem` for spacing between columns.

**Code:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-template-rows: auto 1fr;
  column-gap: 1rem;
}
```

#### 2. **Subgrid for Alignment**
Each `<details>` element is styled as a subgrid to inherit the parent grid's column and row lines, avoiding nested grid complexity.

**Code:**
```css
details {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
  grid-column: 1 / -1;
  grid-row: 1 / span 3;
}
```

#### 3. **Tab Content Styling**
The tab content (inside `<details>`) is placed in the second row of the subgrid and spans all columns.

**Code:**
```css
details::details-content {
  grid-row: 2;
  grid-column: 1 / -1;
  padding: 1rem;
  border-bottom: 2px solid dodgerblue;
}
```

#### 4. **Visibility Control**
Only the open tab's content is shown using the `[open]` attribute selector.

**Code:**
```css
details:not([open])::details-content {
  display: none;
}
```

#### 5. **Tab Label Styling**
The `<summary>` element is styled to appear in the first row of the subgrid and visually indicate the open state.

**Code:**
```css
summary {
  grid-row: 1;
  display: grid;
  padding: 1rem;
  border-bottom: 2px solid dodgerblue;
  cursor: pointer;
}

details[open] summary {
  font-weight: bold;
}
```

#### 6. **Column Distribution**
Each tab is positioned in its respective column using `:nth-of-type` or CSS variables for dynamic spacing.

**Code:**
```css
details:nth-of-type(1) summary {
  grid-column: 1 / span 1;
}
details:nth-of-type(2) summary {
  grid-column: 2 / span 1;
}
details:nth-of-type(3) summary {
  grid-column: 3 / span 1;
}
```

---

### Accessibility Considerations

- **Built-in Features**: `<details>` includes keyboard navigation, screen reader support, and state tracking (open/closed).
- **Content Hiding**: Using `display: none` on inactive tabs prevents screen readers from reading hidden content but may interfere with "find in page" functionality.
- **Limitations**: Pure CSS tabs lack advanced widget features (e.g., keyboard navigation via arrow keys, role definitions) compared to ARIA-based implementations.

**Recommendation**: Test with screen readers and consider hybrid approaches for complex use cases.

---

### Working Example

```html
<div class="grid">
  <details class="item" name="alpha" open style="--n: 1">
    <summary class="subitem">First item</summary>
    <div>Content for first tab</div>
  </details>
  <details class="item" name="alpha" style="--n: 2">
    <summary class="subitem">Second item</summary>
    <div>Content for second tab</div>
  </details>
  <details class="item" name="alpha" style="--n: 3">
    <summary class="subitem">Third item</summary>
    <div>Content for third tab</div>
  </details>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-template-rows: auto 1fr;
  column-gap: 1rem;
}

details {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
  grid-column: 1 / -1;
  grid-row: 1 / span 3;
}

details::details-content {
  grid-row: 2;
  grid-column: 1 / -1;
  padding: 1rem;
  border-bottom: 2px solid dodgerblue;
}

details:not([open])::details-content {
  display: none;
}

summary {
  grid-row: 1;
  display: grid;
  padding: 1rem;
  border-bottom: 2px solid dodgerblue;
  cursor: pointer;
}

details[open] summary {
  font-weight: bold;
}

details:nth-of-type(1) summary {
  grid-column: 1 / span 1;
}
details:nth-of-type(2) summary {
  grid-column: 2 / span 1;
}
details:nth-of-type(3) summary {
  grid-column: 3 / span 1;
}
```

---

### Recommendations

- **Use Subgrid**: Avoid nested grids; subgrid simplifies alignment and reduces complexity.
- **Dynamic Tabs**: Use templating languages (e.g., Liquid, Svelte) for scalable tab generation.
- **Accessibility**: Ensure screen reader compatibility by avoiding `display: none` for tab content or use ARIA roles if needed.
- **Browser Support**: Verify compatibility with WebKit browsers (e.g., Safari) for `::details-content` and Subgrid.
- **Avoid `display: contents`**: Potential bugs in Safari and limited support may affect functionality.

---

### References

- [CodePen Demo](https://codepen.io/jpyrat/pen/NPxzmWd)
- [Svelte Playground Example](https://svelte.dev/playground/5a25ea7854e04b76bb0d6c9b9ff02ba3?version=5.42.3)
- [Original Article](https://css-tricks.com/pure-css-tabs-with-details-grid-and-subgrid/)