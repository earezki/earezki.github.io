---
title: "Inline editing with custom elements in Rails"
pubDate: 2025-11-13
description: "Inline editing in Rails apps is achieved with a custom HTML element, requiring just one tag."
categories: ["AI News", "Web Development", "Rails"]
---

## Inline editing with custom elements in Rails

Inline editing in Rails apps is achieved with a custom HTML element, requiring just one tag. The `editable-content` element handles click detection, input creation, and server updates via PATCH requests.

### Why This Matters
The ideal model for inline editing is seamless, framework-agnostic interactivity. However, the technical reality requires managing DOM manipulation, server communication, and CSRF security. A misstep in handling these layers can lead to failed updates or security vulnerabilities, increasing debugging complexity.

### Key Insights
- "Custom elements use lifecycle callbacks like `connectedCallback` for encapsulation."
- "The `#save` method uses `fetch` with a CSRF token for secure PATCH requests."
- "Editable-content is part of the Web Components standard, enabling framework-agnostic interactivity."

### Working Example
```html
<editable-content url="<%= post_path(@post) %>">
  <h1 name="post[title]"><%= @post.title %></h1>
</editable-content>
```

```javascript
// app/javascript/components/editable_content.js
class EditableContent extends HTMLElement {
  connectedCallback() {
    this.addEventListener("click", (event) => this.#edit(event));
  }

  #edit(event) {
    const target = this.#editable(event.target);
    if (!target || target === this || !target.hasAttribute("name")) return;
    const field = this.#create(target);
    const wrapper = this.#wrap(field);
    wrapper.original = target;
    target.replaceWith(wrapper);
    field.focus();
    field.addEventListener("blur", () => this.#save(wrapper, field));
  }

  async #save(wrapper, field) {
    const formData = new FormData();
    formData.append(field.name, field.value);
    const response = await fetch(this.#url, {
      method: "PATCH",
      headers: { "X-CSRF-Token": this.#csrfToken },
      body: formData
    });
    if (!response.ok) return;
    const display = wrapper.original;
    display.textContent = field.value;
    wrapper.replaceWith(display);
  }
}
customElements.define("editable-content", EditableContent);
```

### Practical Applications
- **Use Case**: "Rails apps with Hotwire for inline title editing."
- **Pitfall**: "Forgetting the `name` attribute on editable elements leads to failed server updates."

**References:**
- https://dev.to/railsdesigner/inline-editing-with-custom-elements-in-rails-10gl
---