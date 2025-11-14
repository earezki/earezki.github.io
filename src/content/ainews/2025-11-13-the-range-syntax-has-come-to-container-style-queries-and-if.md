---
title: "The Range Syntax Has Come to Container Style Queries and if()"
pubDate: 2025-11-13
description: "Chrome 142 introduces range syntax for container style queries and if(), enabling numeric comparisons with custom properties and attr()."
categories: ["AI News", "container-queries", "CSS functions"]
---

## The Range Syntax Has Come to Container Style Queries and if()

Chrome 142 enables numeric comparisons in container style queries and the `if()` function, allowing developers to evaluate values like `--lightness < 50%` or `attr(data-notifs) > 99`.

### Why This Matters
Previously, container style queries could only check exact values, limiting dynamic styling. Range syntax now allows comparisons between numeric values, custom properties, and `attr()`-parsed data, enabling responsive design logic that adapts to variable states. This reduces reliance on JavaScript for conditional styling and improves performance by keeping logic in CSS.

### Key Insights
- "Range syntax now supports numeric comparisons in container style queries, Chrome 142"
- "Custom properties and `attr()` function enable dynamic value comparisons in CSS"
- "Container queries allow scoped logic via `container-name`, unlike `if()` which operates within the same rule"

### Working Example
```css
#container {
  --lightness: 10%;
  background: hsl(270 100% var(--lightness));
  color: if(
    style(--lightness < 50%): white;
    style(--lightness >= 50%): black
  );
  * {
    @container style(--lightness < 50%) {
      color: white;
    }
    @container style(--lightness >= 50%) {
      color: black;
    }
  }
}
```

```css
[data-notifs]::after {
  height: 1.25rem;
  border-radius: 1.25rem;
  @container style(attr(data-notifs type(<number>)) <= 99) {
    content: attr(data-notifs);
    aspect-ratio: 1 / 1;
  }
  @container style(attr(data-notifs type(<number>)) > 99) {
    content: "99+";
    padding-inline: 0.1875rem;
  }
}
```

```css
h1 {
  font-size: 31px;
  span {
    font-weight: if(
      style(1em < 32px): 100;
      style(1em >= 32px): 900
    );
  }
}
```

### Practical Applications
- **Use Case**: Dynamic theming based on `--lightness` values for accessibility adjustments
- **Pitfall**: Mismatched units (e.g., comparing `10%` to `50`) will fail silently in range queries

**References:**
- https://css-tricks.com/the-range-syntax-has-come-to-container-style-queries-and-if/
---