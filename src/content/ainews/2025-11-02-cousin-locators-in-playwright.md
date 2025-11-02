---
title: "Cousin Locators in Playwright: A Robust Strategy for Targeting Elements in Test Automation"
pubDate: 2025-11-02
description: "This article explains how to use 'cousin locators' in Playwright to reliably target specific elements in dynamic web applications, avoiding issues with inconsistent element order or brittle dynamic IDs."
categories: ["AI News", "testing", "automation", "software development"]
---

## Cousin Locators in Playwright: A Robust Strategy for Targeting Elements in Test Automation

When web pages render multiple instances of the same element or component, traditional locator strategies like indexes or dynamic IDs can be unreliable. This article introduces **cousin locators**, a method to precisely target elements by leveraging relationships between elements within a shared container.

### Problem with Traditional Locator Strategies
- **Indexes**: Failing when element order or count changes dynamically.
- **Dynamic IDs**: Brittle if the dynamic portion (e.g., `edit-${username}-button`) is inconsistently formatted or hard to predict.
- **Impact**: Tests become unstable, leading to flaky results and maintenance challenges.

### Cousin Locators: A Reliable Alternative
Cousin locators use **unique identifiers within a shared container** to narrow down the target element. This approach ensures accuracy even in dynamic environments.

#### Key Implementation Steps
1. **Identify a Unique Element in the Container**  
   Use a static or predictable attribute (e.g., `user-id`) to locate the container. For example:
   ```javascript
   page.getByTestId('user-id').filter({ hasText: '920437' })
   ```
   - **Purpose**: Pinpoint the specific container (e.g., a user profile) using a unique identifier.
   - **Impact**: Eliminates ambiguity by isolating the correct container.

2. **Filter the Container Using the Unique Element**  
   Use the `filter({ has: ... })` method to scope the search to the identified container:
   ```javascript
   getProfileContainer(userId: string) {
     const userIdElement = this.userId.filter({ hasText: userId });
     return this.profileContainer.filter({ has: userIdElement });
   }
   ```
   - **Purpose**: Narrow the search to the container associated with the specific user ID.
   - **Impact**: Ensures subsequent locators (e.g., "Edit" button) operate within the correct context.

3. **Target the Desired Element Within the Container**  
   Once the container is isolated, locate the specific element (e.g., "Edit" button) within it:
   ```javascript
   async clickEditProfileButton(userId: string) {
     const profileContainer = this.getProfileContainer(userId);
     await profileContainer.getByTestId('edit-profile-button').click();
   }
   ```
   - **Purpose**: Perform actions (e.g., clicks) on the correct element within the isolated container.
   - **Impact**: Increases test reliability by avoiding cross-container interference.

### Working Example
A complete implementation in a Playwright page object model:
```javascript
export class ProfileList {
  readonly page: Page;
  readonly profileContainer: Locator;
  readonly userId: Locator;
  readonly editProfileButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileContainer = page.getByTestId('profile-container');
    this.userId = page.getByTestId('user-id');
    this.editProfileButton = page.getByTestId('edit-profile-button');
  }

  getProfileContainer(userId: string) {
    const userIdElement = this.userId.filter({ hasText: userId });
    return this.profileContainer.filter({ has: userIdElement });
  }

  async clickEditProfileButton(userId: string) {
    const profileContainer = this.getProfileContainer(userId);
    await profileContainer.locator(this.editProfileButton).click();
  }
}
```
- **Usage**: Instantiate `ProfileList` with a `Page` object and call `clickEditProfileButton('920437')` to edit Dawn Summers' profile.

### Recommendations
- **Best Practices**:
  - Use static or predictable identifiers (e.g., `user-id`) for container isolation.
  - Avoid brittle dynamic IDs (e.g., `edit-${username}-button`) unless necessary.
  - Validate container isolation with assertions (e.g., `expect(profileContainer).toBeVisible()`).
- **When to Use**:
  - When multiple instances of the same element exist on a page.
  - When element order or count is dynamic or inconsistent.
- **Pitfalls to Avoid**:
  - Relying on fragile text matches (e.g., `hasText: '920437'`) if the text might change.
  - Forgetting to scope locators to the correct container, leading to unintended interactions.

For further details, refer to the original article: [Cousin Locators in Playwright](https://dev.to/zoekclegg/cousin-locators-in-playwright-mk9).