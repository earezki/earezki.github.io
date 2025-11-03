---
title: "Building MoodMatch: An AI Agent for Emotional Analysis and Personalized Recommendations"
pubDate: 2025-11-03
description: "MoodMatch is an AI-powered agent that analyzes user emotions and provides tailored recommendations for music, movies, and books using A2A protocols and third-party APIs."
categories: ["AI News", "AI", "Web Development", "Software Engineering"]
---

## Building MoodMatch: An AI Agent That Understands Your Emotions

MoodMatch is an AI-powered agent designed to analyze user emotional states and deliver personalized recommendations for music, movies, and books. Built as part of the HNG Stage 3 Backend Task, it leverages the A2A (Agent-to-Agent) protocol and integrates with multiple APIs to provide context-aware, emotionally tailored suggestions.

### Purpose and Functionality

MoodMatch operates by:
- **Analyzing user input** to detect emotional states using Google Gemini 2.5 Flash AI.
- **Supporting 52 distinct mood categories**, ranging from "happy" to "bittersweet," enabling nuanced emotional analysis.
- **Generating multi-source recommendations** from Spotify (music), TMDB (movies), and Google Books (books), all with direct, clickable links.
- **Adapting to context**, such as time of day and emotional intensity, to refine suggestions.

### Technical Stack and Integration

The project utilizes the following technologies:
- **Backend**: Python with FastAPI for handling API requests and responses.
- **AI Model**: Google Gemini 2.5 Flash for emotion detection, chosen for its efficiency and accuracy in natural language processing.
- **Third-party APIs**:
  - **Spotify API** for music recommendations.
  - **TMDB API** for movie suggestions.
  - **Google Books API** for book recommendations.
- **Communication Protocol**: A2A (Agent-to-Agent) using JSON-RPC 2.0 for structured agent interactions.
- **Deployment**: Hosted on **Leapcell**, a serverless platform, for scalability and cost-efficiency.
- **Messaging Integration**: Deployed on **Telex.im** to enable real-time user interactions.

### Key Features and Impact

MoodMatch stands out with its:
- **Smart Mood Detection**: Interprets ambiguous phrases (e.g., "I need money") as indicators of stress or anxiety.
- **Comprehensive Mood Coverage**: 52 categories allow for precise emotional mapping, addressing complex or mixed feelings.
- **Unified Interface**: Aggregates recommendations from three platforms into a single response, enhancing user convenience.
- **Context-Aware Recommendations**: Adjusts suggestions based on time of day (e.g., calming music at night) and emotional intensity (e.g., more upbeat content for mild happiness).
- **Immediate Access**: Direct links to recommendations minimize friction, improving user engagement.

### Technical Challenges and Solutions

#### Challenge 1: A2A Protocol Complexity
- **Issue**: JSON-RPC 2.0 required precise request/response handling, which was unfamiliar to the developer.
- **Solution**: Studied the JSON-RPC 2.0 specification, implemented robust error handling, and validated interactions using tools like Postman.

#### Challenge 2: Mood Detection Accuracy
- **Issue**: Mapping free-form text to predefined mood categories was error-prone.
- **Solution**: Used structured prompts with Gemini 2.5 Flash and implemented fuzzy matching to handle ambiguous or novel inputs.

### Reference
[View the full article on DEV Community](https://dev.to/olaitan34/building-moodmatch-an-ai-agent-that-understands-your-emotions-2m36)