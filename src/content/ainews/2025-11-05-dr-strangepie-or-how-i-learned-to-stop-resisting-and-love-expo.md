---
title: "Dr. Strangepie or: How I Learned to Stop Resisting and Love Expo"
pubDate: 2025-11-05
description: "A developer's journey from skepticism to appreciation of Expo, highlighting its native modules and services that streamline React Native app development for a social platform."
categories: ["AI News", "React Native", "Software Development"]

---

## Dr. Strangepie or: How I Learned to Stop Resisting and Love Expo

This article details Kevin Smith’s transition from skepticism to enthusiasm for using **Expo** in developing Pie, a Chicago-based social platform aimed at combating loneliness. Initially concerned about the limitations of Expo compared to barebones React Native, Smith found that Expo’s ecosystem significantly accelerated development, improved user engagement, and simplified deployment processes.

---

### Key Themes and Benefits of Expo

#### **1. Vast Library of Native Modules**
Expo provides pre-built native modules that reduce the need for custom code, enabling faster feature implementation. These modules are critical for Pie’s social and media-driven features:

- **Media Modules**
  - **expo-camera**, **expo-image-picker**, **expo-media-library**: Enable users to select or take profile pictures and upload images for plans or chats.
  - **expo-audio**, **expo-video**: Support audio feedback (e.g., *ding* for friend requests) and video integration (under development).

- **Social Modules**
  - **expo-contacts**: Syncs user contacts to find existing Pie users.
  - **expo-clipboard**, **expo-sms**, **expo-sharing**: Facilitates quick sharing of plan links via clipboard, SMS, or third-party apps.

- **Plan Discovery Modules**
  - **expo-location**, **expo-calendar**: Enables location-based plan discovery and calendar integration for RSVPs.

- **Miscellaneous Enhancements**
  - **expo-store-review**: Boosts app store reviews.
  - **expo-haptics**: Adds tactile feedback for user actions.
  - **expo-datadog**, **expo-insights**: Monitors app performance and user engagement.

#### **2. Expo Application Services (EAS)**
Expo’s services streamline development, testing, and deployment workflows:

- **EAS Build**: Replaces App Center, allowing teams to generate builds for testing before app store submission.
- **EAS Submit**: Simplifies app store submissions.
- **EAS Update**: Enables over-the-air updates (planned for implementation).
- **EAS Workflows**: Automates testing via CI/CD pipelines (under QA review).

These services reduce manual overhead, ensuring faster feature delivery and stable app performance.

#### **3. Impact on Development and User Experience**
- **Speed**: Expo’s modules and EAS services allow Pie to ship features rapidly while maintaining stability.
- **User Engagement**: Features like haptics, location-based discovery, and social sharing enhance user interaction and retention.
- **Scalability**: The ecosystem supports both frequent updates and long-term maintenance, balancing app usage with user well-being (e.g., encouraging phone-free interactions).

---

### Recommendations for Adopting Expo

- **When to Use Expo**: Ideal for apps requiring native features (camera, location, etc.) without the complexity of managing native code.
- **Best Practices**:
  - Leverage EAS Build for pre-deployment testing.
  - Integrate EAS Update for seamless feature rollouts.
  - Use expo-insights and expo-datadog for performance monitoring.
- **Pitfalls to Avoid**:
  - Over-reliance on Expo modules may limit customization; assess if bare React Native is needed for advanced use cases.
  - Ensure EAS workflows are configured correctly to avoid deployment bottlenecks.

---

### Real-World Application Example

**Scenario**: Implementing a feature to allow users to share a plan via SMS.

**Code Example**:
```javascript
import * as SMS from 'expo-sms';

const sharePlanViaSMS = async (planLink) => {
  const { result } = await SMS.sendSMSAsync({
    body: `Check out this plan: ${planLink}`,
    recipients: ['+1234567890'],
  });
  if (result === 'sent') {
    alert('Plan shared successfully!');
  } else {
    alert('Failed to send SMS.');
  }
};
```

**Explanation**: The `expo-sms` module simplifies SMS sharing by abstracting native Android/iOS APIs. This reduces development time and ensures cross-platform compatibility.

---

### Reference
[Dr. Strangepie or: How I Learned to Stop Resisting and Love Expo](https://dev.to/keveightysev/dr-strangepie-or-how-i-learned-to-stop-resisting-and-love-expo-1o7a)