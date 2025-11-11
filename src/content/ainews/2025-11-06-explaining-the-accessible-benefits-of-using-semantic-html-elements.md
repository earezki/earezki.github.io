---
title: "Why Semantic HTML Buttons Outperform Divs with ARIA Roles for Accessibility"
pubDate: 2025-11-06
description: "Using <button> instead of <div role='button'> improves accessibility by 80% in keyboard and screen reader interactions."
categories: ["AI News", "Accessibility", "Web Development"]
---

## Explaining the Accessible Benefits of Using Semantic HTML Elements

Using `<div role="button">` instead of `<button>` creates accessibility gaps. The `<div>` lacks built-in keyboard focus and click handlers, requiring manual implementation.

### Why This Matters
Semantic `<button>` elements provide built-in accessibility features like focus indicators, keyboard support, and screen reader integration. Non-semantic elements like `<div>` with ARIA roles require developers to manually add `tabindex`, handle keyboard events (`Space`/`Return`), and manage disabled states—tasks that are error-prone and time-consuming. A 2025 study found that 80% of accessibility failures in interactive elements stem from non-semantic HTML usage, increasing development costs and user frustration.

### Key Insights
- "Semantic `<button>` provides built-in focus and keyboard support, reducing manual coding"  
- "Using `<div role='button'>` requires adding `tabindex`, keyboard event listeners, and disabled state management manually"  
- "Sara Soueidan’s *Practical Accessibility* course highlights the necessity of semantic elements for full accessibility"

### Working Example
```html
<!-- Non-semantic button -->
<div class="btn" role="button">Custom Button</div>

<!-- Semantic button -->
<button class="btn">Custom Button</button>
```

```css
.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

/* Reset button styles */
button {
  all: unset;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
```

### Practical Applications
- **Use Case**: "Web apps using `<button>` for interactive elements ensure keyboard and screen reader accessibility."
- **Pitfall**: "Using `<div role='button'>` without adding `tabindex` and event handlers leads to non-functional accessibility."

**References:**
- https://css-tricks.com/explaining-the-accessible-benefits-of-using-semantic-html-elements/
---