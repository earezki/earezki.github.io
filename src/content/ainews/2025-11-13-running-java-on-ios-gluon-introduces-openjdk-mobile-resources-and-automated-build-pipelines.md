---
title: "Running Java on iOS: Gluon Introduces OpenJDK Mobile Resources and Automated Build Pipelines"
pubDate: 2025-11-13
description: "OpenJDK now compiles and runs as a native binary on iOS, enabling unmodified Java code execution on mobile platforms."
categories: ["AI News", "Mobile Development", "OpenJDK"]
---

## Running Java on iOS: Gluon Introduces OpenJDK Mobile Resources and Automated Build Pipelines

Gluon has advanced the Hotspot-on-iOS project, enabling OpenJDK to build and run as a native binary on iOS. This achievement allows Java code to execute on iOS without modification, marking a major step toward cross-platform Java development.

### Why This Matters
The ideal of "write once, run anywhere" faces technical hurdles on iOS due to Apple’s prohibition on runtime-generated assembly code, which eliminates JIT compilation and complicates dynamic Java features. Previous attempts, like RoboVM and GraalVM, sacrificed OpenJDK alignment for performance. The new Zero interpreter, combined with AOT compilation from Project Leyden, balances compatibility and performance, though iOS apps will still face inherent limitations compared to native code.

### Key Insights
- "Zero interpreter used for iOS builds, 2025": Chosen for its platform-agnostic C++ codebase, aligning with upstream OpenJDK updates.
- "Project Leyden enables AOT compilation for iOS Java apps": Combines with Zero to sidestep Apple’s JIT restrictions while retaining Java’s dynamic capabilities.
- "OpenJFX integrated for mobile GUI, pending hardware acceleration": Base libraries compile on iOS/Android, but platform-native rendering APIs remain under development.

### Practical Applications
- **Use Case**: Java developers creating cross-platform mobile apps with OpenJDK Mobile and OpenJFX.
- **Pitfall**: Overreliance on AOT compilation may limit Java’s dynamic features, requiring careful optimization for iOS performance.

**References:**
- https://www.infoq.com/news/2025/11/java-on-ios/