---
title: "Building a Google Play Store Rating Agent with Mastra and Telex.im"
pubDate: 2025-11-03
description: "A step-by-step guide to creating an AI agent that fetches Google Play Store app ratings and integrates with Telex.im using Mastra's framework and the A2A protocol."
categories: ["AI News", "AI Agents", "Telex.im", "Mastra"]
---

## Building a Google Play Store Rating Agent with Mastra and Telex.im

This article details the development of an AI agent using **Mastra**, a framework for building AI-powered agents, and integrating it with **Telex.im**, an AI-augmented chat platform. The agent fetches real-time Google Play Store app ratings, reviews, install counts, and developer information, demonstrating the use of Mastra's tools, memory systems, and A2A protocol compliance.

---

### Key Components and Implementation

#### 1. **Project Setup with Mastra**
- **Initialization**: The Mastra CLI (`npm create mastra@latest -y`) generates a project structure with pre-configured agents, tools, and workflows.
- **Project Structure**:
  ```
  src/
  ├── mastra/
  │   ├── agents/
  │   ├── tools/
  │   ├── workflows/
  │   ├── scorers/
  │   └── index.ts
  ├── .env.example
  ├── package.json
  └── tsconfig.json
  ```
- **Model Integration**: Google Gemini 2.0 Flash was selected as the model, with API key setup via `.env.example`.

#### 2. **Core Features Utilized**
- **Mastra Agents**:
  - Custom instructions for behavior and personality.
  - Integration with Google Gemini 2.0 Flash.
  - Access to tools for Play Store data.
  - Memory for conversation context using `LibSQLStore`.

- **Mastra Tools**:
  - Created with `createTool` function.
  - Used `zod` for schema validation (input/output).
  - Async execution for API calls (e.g., `google-play-scraper`).
  - Error handling and type inference.

- **Mastra Memory**:
  - Persistent conversation history using SQLite via `LibSQLStore`.
  - Automatic context management across sessions.

- **Mastra Server & API Routes**:
  - OpenAPI documentation and Swagger UI for testing.
  - Custom API routes via `registerApiRoute`.
  - JSON-RPC 2.0 support for A2A protocol compliance.

- **Mastra Logger**:
  - Structured logging with PinoLogger.
  - Tracks requests, responses, and errors with stack traces.

- **Bundler Configuration**:
  - External dependencies like `google-play-scraper` are handled via `bundler.externals`.

#### 3. **Play Store Scraping Tool**
- **Implementation**: 
  ```ts
  export const playStoreRatingTool = createTool({
    id: 'get-playstore-rating',
    description: 'Get current ratings and information for an app from Google Play Store',
    inputSchema: z.object({ appName: z.string() }),
    outputSchema: z.object({
      appId: z.string(),
      title: z.string(),
      rating: z.number(),
      // ... other fields
    }),
    execute: async ({ context }) => {
      const searchResults = await gplay.search({ term: context.appName, num: 1 });
      const appDetails = await gplay.app({ appId: searchResults[0].appId });
      return { /* formatted data */ };
    },
  });
  ```
- **Purpose**: Fetches app details (ratings, installs, reviews) using `google-play-scraper`.

#### 4. **Agent Configuration**
- **Custom Instructions**:
  - Explicit formatting rules to avoid raw JSON output.
  - Example:  
    ```
    [App Name] has a rating of [X.X]/5.0 with [number] total ratings.
    ```

- **Memory Integration**:
  ```ts
  export const playStoreAgent = new Agent({
    name: 'PlayStore Rating Agent',
    instructions: `...`,
    model: 'google/gemini-2.0-flash',
    tools: { playStoreRatingTool },
    memory: new Memory({ storage: new LibSQLStore({ url: 'file:../mastra.db' }) }),
  });
  ```

#### 5. **A2A Protocol Integration**
- **JSON-RPC 2.0 Compliance**:
  - Route handler for A2A communication:
    ```ts
    export const a2aAgentRoute = registerApiRoute('/a2a/agent/:agentId', {
      method: 'POST',
      handler: async (c) => {
        const body = await c.req.json();
        // Validate JSON-RPC 2.0 format
        // Convert A2A messages to Mastra format
        // Execute agent and return A2A-compliant response
      },
    });
    ```
- **Key Requirements**:
  - Proper handling of `artifacts` and `history` for Telex compatibility.
  - Strict adherence to JSON-RPC 2.0 spec.

---

### Deployment and Integration

#### 1. **Mastra Cloud Deployment**
- **Process**:
  - Run `mastra dev` for local testing.
  - Push code to GitHub and import to Mastra Cloud.
  - Deployment URL:  
    `https://playstore-rating-fetcher-agent.mastra.cloud/a2a/agent/playStoreAgent`

- **Benefits**:
  - Automatic infrastructure, scaling, and monitoring.
  - No manual configuration required.

#### 2. **Telex.im Integration**
- **Workflow Configuration**:
  ```json
  {
    "name": "playstore_rating_agent",
    "nodes": [
      {
        "id": "playstore_agent",
        "type": "a2a/mastra-a2a-node",
        "url": "https://playstore-rating-fetcher-agent.mastra.cloud/a2a/agent/playStoreAgent"
      }
    ]
  }
  ```
- **Requirements**:
  - Match Telex's expected format (lowercase names, position arrays, etc.).

---

### Challenges and Solutions

| **Challenge**               | **Solution**                                                                 |
|----------------------------|-------------------------------------------------------------------------------|
| **Raw JSON in Responses**   | Updated agent instructions to enforce conversational formatting.            |
| **Telex Workflow Format**   | Followed the weather agent example for structure and naming conventions.    |
| **A2A Protocol Compliance** | Studied the A2A protocol spec and implemented `artifacts`/`history` fields. |

---

### Performance and Results

- **Speed**: 1–2 second response times.
- **Accuracy**: Real-time data from Google Play Store.
- **User Experience**: Clean, formatted responses (e.g., "WhatsApp Messenger has a rating of 4.39/5.0...").
- **Integration**: Seamless with Telex.im.

---

### Recommendations

- **Agent Instructions**: Be explicit about formatting and behavior.
- **A2A Compliance**: Follow JSON-RPC 2.0 and Telex's workflow structure strictly.
- **Error Handling**: Use `try/catch` for API calls and handle edge cases (e.g., app not found).
- **Testing**: Validate each component (tool → agent → API route) incrementally.
- **Documentation**: Refer to Mastra's docs and the A2A protocol blog for clarity.

---

### Working Example

**Play Store Rating Agent Code**:
```ts
// playstore-tool.ts
export const playStoreRatingTool = createTool({
  id: 'get-playstore-rating',
  description: 'Get current ratings and information for an app from Google Play Store',
  inputSchema: z.object({ appName: z.string() }),
  outputSchema: z.object({
    appId: z.string(),
    title: z.string(),
    rating: z.number(),
    ratingsCount: z.number(),
    installs: z.string(),
    developer: z.string(),
  }),
  execute: async ({ context }) => {
    const searchResults = await gplay.search({ term: context.appName, num: 1 });
    const appDetails = await gplay.app({ appId: searchResults[0].appId });
    return {
      appId: appDetails.appId,
      title: appDetails.title,
      rating: appDetails.score,
      ratingsCount: appDetails.reviews,
      installs: appDetails.installs,
      developer: appDetails.developer,
    };
  },
});
```

**Usage Example**:
- Query: `"What's the rating for Spotify?"`
- Response:  
  `"Spotify has a rating of 4.5/5.0 with 10,000,000+ ratings. It has been installed 500,000,000+ times and is offered by Spotify AB."`

---

### Resources

- **Mastra Documentation**: [https://docs.mastra.ai](https://docs.mastra.ai)
- **Telex.im**: [https://telex.im](https://telex.im)
- **A2A Protocol Blog**: [https://fynix.dev/blog/telex-x-mastra](https://fynix.dev/blog/telex-x-mastra)
- **Source Code**: [https://github.com/toluwanithepm/playstore-rating-fetcher-agent](https://github.com/toluwanithepm/playstore-rating-fetcher-agent)
- **Live Agent**: [PlayStore Rating Agent on Telex.im](https://telex.im/agents/playstore-rating-agent)