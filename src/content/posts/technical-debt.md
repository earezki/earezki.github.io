---
title: Technical debt
pubDate: '2021-01-02 05:49:46 +0100'
categories:
  - Software design
---

![technical debt](/assets/technical-debt.png "technical debt")

In an agile environment, during the [sprint planning](https://en.wikipedia.org/wiki/Scrum_(software_development)), prioritized tasks are defined, and unnecessary ones are deferred. tasks such as:

- Migrate to the new programming language version.
- Refactor a legacy module.
- Use abstractions to better separate the modules.
- … etc

These are considered  **&quot;Technical tasks&quot;**  and they&#39;re delaShipping first time codeyed and rescheduled sprint after another.

Usually, the business prioritize functional requirements that contributes to the evolution of the product.
Shipping first time codeShipping first time code
For this reason, technical tasks needs to be listed, keep track of them, and communicate them to the business, explaining that these tasks are like a debt, delaying them would increase the debt hence it would cost more interest to pay off that debt in the long run.

On a previous project, we had two boards, a business board with all the functional requirements, and a technical board managed by the developers that holds all the technical requirements to reduce the debt.

**Ward Cunningham**  was the one to first make the comparison between technical complexity and debt, he said:

> Shipping first time code is like going into debt. A little debt speeds development so long as it is paid back promptly with a rewrite… The danger occurs when the debt is not repaid. Every minute spent on not-quite-right code counts as interest on that debt. Entire engineering organizations can be brought to a stand-still under the debt load of an unconsolidated implementation, object-oriented or otherwise.

—  **Ward Cunningham, 1992**

When writing a code, we express our understanding of the problem and the solution, as the project matures, we acquire new knowledge and understandings on the software. Technical debt is accumulated when we&#39;re not refactoring existing code to express current understandings.

This doesn&#39;t mean that we should lower the standards of the design and the code to go faster while adding new features, at the contrary, we should always thrive to develop to the best to our understandings at the time of making.

And we shouldn&#39;t forget to prioritize technical tasks, to make adjustments and refactor old code when new knowledge and understandings are acquired.
