---
title: "Integrating Mastra Agents with Telex via A2A Requests"
pubDate: 2025-11-03
description: "A step-by-step guide to integrating Mastra AI agents with Telex using A2A (App-to-App) requests, enabling real-time JSON-RPC communication for structured message exchange."
categories: ["AI News", "AI Integration", "Software Development"]
---

## Integrating Mastra Agents with Telex via A2A Requests

This guide demonstrates how to integrate **Mastra AI agents** with the **Telex** platform using **A2A (App-to-App) requests** to enable real-time, structured communication between the two systems. The integration leverages **JSON-RPC 2.0** for message exchange, allowing Telex to send prompts to Mastra agents and receive intelligent responses. The implementation includes local setup, custom API route creation, and deployment to Mastra Cloud.

---

### Overview

**Goal**  
Create a two-way communication channel where:  
- **Telex** sends structured messages (e.g., *"word to describe not feeling like socializing"*)  
- **Mastra** processes the message using an AI agent and returns a response (e.g., *"Reclusive — Meaning: Avoiding the company of other people..."*)  

**Stack Used**  
- **Mastra**: Framework for building AI agents  
- **Node.js + TypeScript**: Backend development  
- **Telex**: Educational platform for messaging  
- **Mastra Cloud**: Deployment and public endpoint exposure  

---

### Key Implementation Steps

#### 1. **Setting Up Mastra Locally**
- **Project Initialization**  
  ```bash
  mkdir telex-mastra-agent && cd telex-mastra-agent
  npm init -y
  npm install @mastra/core @mastra/agents
  npm install -D typescript ts-node @types/node
  npx tsc --init
  ```

- **Agent Definition**  
  Create `src/agents/word-agent.ts` to define an agent that analyzes user messages:  
  ```ts
  import { Agent } from "@mastra/agents";
  export const wordAgent = new Agent({
    name: "wordAgent",
    instructions: "Analyze a user's message and determine the emotional tone or meaning.",
  });
  ```

#### 2. **Understanding Telex A2A Request Format**
Telex sends messages via **JSON-RPC 2.0**. Example request:  
```json
{
  "jsonrpc": "2.0",
  "id": "request-001",
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "role": "user",
      "parts": [
        { "kind": "text", "text": "not feeling like socializing" }
      ],
      "messageId": "msg-001"
    },
    "configuration": { "blocking": true }
  }
}
```

**Validation Requirements**  
- `jsonrpc` must be `"2.0"`  
- `id` is required  
- Only `method: "message/send"` is supported  

---

### 3. **Creating a Custom A2A Endpoint**

**Code Implementation**  
Create `a2aRouter.ts` to handle Telex requests and route them to Mastra agents:  
```ts
import { registerApiRoute } from "@mastra/core/server";
import { randomUUID } from "crypto";
import { wordAgent } from "../src/agents/word-agent";

export const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastra = c.get("mastra");
      const agentId = c.req.param("agentId");
      const body = await c.req.json();
      const { jsonrpc, id: requestId, method, params } = body || {};

      // Validate JSON-RPC format
      if (jsonrpc !== "2.0" || !requestId) {
        return c.json({
          jsonrpc: "2.0",
          id: requestId || null,
          error: {
            code: -32600,
            message: 'Invalid Request: "jsonrpc" must be "2.0" and "id" is required',
          },
        }, 400);
      }

      // Validate method
      if (method !== "message/send") {
        return c.json({
          jsonrpc: "2.0",
          id: requestId,
          error: {
            code: -32601,
            message: `Unsupported method: "${method}". Only "message/send" is allowed.`,
          },
        }, 400);
      }

      // Extract user text
      const userText = params?.message?.parts
        ?.find((p: any) => p.kind === "text")?.text?.trim() || "";

      if (!userText) {
        return c.json({
          jsonrpc: "2.0",
          id: requestId,
          error: {
            code: -32602,
            message: 'Invalid params: "message.parts[0].text" is required',
          },
        }, 400);
      }

      // Resolve agent and process input
      const agent = agentId === "wordAgent" ? wordAgent : mastra.getAgent(agentId);
      const input = { action: userText, context: userText };

      let agentText = "";
      if ((agent as any).run) {
        const agentResponse = await (agent as any).run(input);
        agentText = agentResponse?.output?.text ?? agentResponse?.text ?? "";
      } else if ((agent as any).generate) {
        const agentResponse = await (agent as any).generate(userText);
        agentText = agentResponse?.text ?? "";
      } else {
        throw new Error("Agent does not support run() or generate()");
      }

      // Construct Telex-style response
      const result = {
        id: randomUUID(),
        status: {
          state: "completed",
          timestamp: new Date().toISOString(),
          message: {
            kind: "message",
            role: "agent",
            parts: [{ kind: "text", text: agentText }],
            messageId: randomUUID(),
            taskId: randomUUID(),
            contextId: randomUUID(),
          },
        },
        kind: "task",
      };

      return c.json({
        jsonrpc: "2.0",
        id: requestId,
        result,
      });
    } catch (error) {
      console.error("A2A route error:", error);
      return c.json({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: error?.message || "Internal server error",
        },
      }, 500);
    }
  },
});
```

**Purpose**  
- Validates incoming Telex requests  
- Extracts user text for processing  
- Routes to the correct Mastra agent  
- Returns a structured Telex-compatible response  

---

### 4. **Linking the Route to Mastra**

Update `mastra/index.ts` to register the custom route:  
```ts
import { Mastra } from "@mastra/core/mastra";
import { a2aAgentRoute } from "./a2aRouter";

export const mastra = new Mastra({
  server: {
    apiRoutes: [a2aAgentRoute],
  },
});
```

**Result**  
The endpoint `http://localhost:4111/a2a/agent/wordAgent` becomes accessible for testing.

---

### 5. **Deploying to Mastra Cloud**

Deploy the project using:  
```bash
npx mastra deploy
```

**Post-Deployment**  
- A public URL like `https://white-cloud-noon.mastra.cloud/a2a/agent/wordAgent` is generated  
- This URL is registered in Telex for A2A app configuration  

---

### Key Takeaways

- **Custom Routes**: Mastra allows extending its API for specialized integrations  
- **JSON-RPC Compliance**: Telex requires strict adherence to JSON-RPC 2.0 format  
- **Real-Time Communication**: A2A integration enables seamless interaction between conversational platforms and AI agents  

---

## Working Example

```ts
// a2aRouter.ts (simplified)
import { registerApiRoute } from "@mastra/core/server";
import { randomUUID } from "crypto";
import { wordAgent } from "../agents/word-agent";

export const a2aAgentRoute = registerApiRoute("/a2a/agent/:agentId", {
  method: "POST",
  handler: async (c) => {
    const body = await c.req.json();
    const { method, params } = body;

    if (method !== "message/send") {
      return c.json({ error: "Unsupported method" }, 400);
    }

    const userText = params.message.parts.find(p => p.kind === "text")?.text;
    const agentResponse = await wordAgent.run({ action: userText, context: userText });

    return c.json({
      jsonrpc: "2.0",
      result: {
        status: {
          message: {
            parts: [{ kind: "text", text: agentResponse.text }],
          },
        },
      },
    });
  },
});
```

---

## Recommendations

- **Use TypeScript**: Ensures type safety for JSON-RPC and agent inputs  
- **Validate Inputs**: Always check for required fields (e.g., `jsonrpc`, `id`)  
- **Error Handling**: Return detailed JSON-RPC errors for debugging  
- **Test with Real Scenarios**: Simulate Telex messages to validate agent responses  
- **Avoid Hardcoding**: Use environment variables for agent IDs and endpoints  

**Potential Pitfalls**  
- Incorrect JSON-RPC formatting may cause Telex to reject requests  
- Failing to handle `run()` and `generate()` methods in agents can break processing  
- Misconfigured Telex app settings may prevent message delivery  

---

**Reference**  
[https://dev.to/modinat_adesola_0ea6e1d30/integrating-mastra-agents-with-telex-via-a2a-requests-28h8](https://dev.to/modinat_adesola_0ea6e1d30/integrating-mastra-agents-with-telex-via-a2a-requests-28h8)