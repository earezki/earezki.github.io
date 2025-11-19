---
title: "Building an AI-Powered Migration Pathways Agent with Go and the A2A Protocol"
pubDate: 2025-11-03
description: "A detailed walkthrough of creating an AI agent that provides real-time visa pathway recommendations using Google's Gemini LLM, the A2A protocol, and Go."
categories: ["AI News", "AI Development", "Go Programming", "A2A Protocol"]
---

## Building an AI-Powered Migration Pathways Agent with Go and the A2A Protocol

This article details the development of an AI agent that assists users in identifying the most suitable international migration pathways by analyzing personal profiles, budgets, and destination requirements. The solution leverages **Google's Gemini LLM** for natural language processing, the **A2A (Agent-to-Agent) protocol** for standardized agent communication, and **Go (Golang)** for efficient backend implementation. The agent is deployed on **Heroku** for scalability and integration with platforms like Telex.im.

---

### Key Features and Functionality

The Migration Pathways Agent processes natural language queries (e.g., "I'm a software engineer from Nigeria wanting to move to Canada with a $10,000 budget") and returns structured, actionable responses. Example output includes:

- **Best visa pathway** (e.g., Express Entry for Canada)
- **Processing time** (6–12 months)
- **Cost range** ($2,300–$3,000)
- **Success rate** (Medium to High)
- **Requirements** (work experience, language proficiency, ECA)
- **Next steps** (language tests, credential assessments)

This eliminates the need for users to manually research complex visa policies, reducing decision fatigue and improving accuracy.

---

### Architecture Overview

The system is structured into three core components:

1. **A2A Protocol Layer**  
   - **Agent Card** (`GET /.well-known/agent.json`): Exposes metadata about the agent's capabilities.  
   - **Planner Endpoint** (`POST /a2a/planner`): Accepts JSON-RPC 2.0 requests for task execution.  
   - Supported methods:  
     - `message/send` (submit migration queries)  
     - `tasks/get` (retrieve task results)  
     - `tasks/send` (legacy task submission)  

2. **Go Server**  
   - Uses Go for performance, simplicity, and Heroku compatibility.  
   - Key components:  
     - `MigrationAgent` struct: Manages tasks, Gemini client, and in-memory storage.  
     - `GeminiClient`: Integrates with Google's Gemini LLM for structured output.  
     - `embed` package: Embeds the agent card (`agent.json`) for static serving.  

3. **Gemini Integration**  
   - **Prompt Engineering**:  
     - Ensures the LLM extracts profession, origin, and destination from queries.  
     - Avoids hardcoded rules (e.g., "USA" vs. "Canada") by relying on natural language parsing.  
   - **Model Used**: `gemini-2.0-flash-exp` for speed and structured reasoning.  

---

### Implementation Details

#### Step 1: Setting Up the Gemini Client  
```go
type GeminiClient struct {
    APIKey  string
    BaseURL string
    Model   string
}

func NewGeminiClient() *GeminiClient {
    return &GeminiClient{
        APIKey:  os.Getenv("GEMINI_API_KEY"),
        BaseURL: "https://generativelanguage.googleapis.com/v1beta",
        Model:   "gemini-2.0-flash-exp",
    }
}
```
- **Purpose**: Initializes the Gemini API connection with environment variables.  
- **Best Practice**: Store API keys securely using environment variables.  

#### Step 2: Task Processing Flow  
```go
func (a *MigrationAgent) ProcessTask(taskID string, message Message) (*Task, error) {
    // 1. Create task with "working" state
    task := &Task{
        ID: taskID,
        Kind: "task",
        Status: TaskStatus{
            State:     "working",
            Timestamp: time.Now().UTC().Format(time.RFC3339),
        },
    }

    // 2. Extract user query from message parts
    var userQuery string
    for _, part := range message.Parts {
        if part.Type == "text" {
            userQuery += part.Text + " "
        }
    }

    // 3. Query Gemini
    responseText, err := a.gemini.GetMigrationPathways(userQuery, "", "", profile.Budget)

    // 4. Update task with results
    task.Status = TaskStatus{
        State: "completed",
        Message: &StatusMessage{
            Kind: "message",
            Role: "agent",
            Parts: []Part{{Kind: "text", Text: responseText}},
            MessageID: messageID,
            TaskID: taskID,
        },
    }
    return task, nil
}
```
- **Purpose**: Processes user queries, interacts with Gemini, and updates task status.  
- **Key Design**: Uses in-memory maps for task storage and ensures structured A2A responses.  

#### Step 3: A2A Response Format  
```json
{
  "jsonrpc": "2.0",
  "id": "task-id",
  "result": {
    "id": "task-id",
    "kind": "task",
    "status": {
      "state": "completed",
      "timestamp": "2025–11–03T…",
      "message": {
        "kind": "message",
        "role": "agent",
        "parts": [{"kind": "text", "text": "…"}],
        "messageId": "msg-id",
        "taskId": "task-id"
      }
    },
    "artifacts": […]
  }
}
```
- **Purpose**: Ensures compatibility with A2A clients (e.g., Telex.im).  
- **Common Pitfall**: Missing fields like `messageId` or incorrect JSON structure can break integrations.  

---

### Deployment on Heroku

**Steps:**
1. **Procfile**:  
   ```text
   web: bin/server
   ```
2. **Dynamic Port Binding**:  
   ```go
   port := os.Getenv("PORT")
   if port == "" {
       port = "8080"
   }
   addr := ":" + port
   ```
3. **Environment Variables**:  
   ```bash
   heroku config:set GEMINI_API_KEY=your_key_here
   ```
4. **Deploy**:  
   ```bash
   git push heroku main
   ```
- **Heroku Buildpack**: Automatically compiles Go binaries and runs `bin/server`.  

---

### Key Learnings

- **Avoid Over-Engineering Parsing**: Let Gemini handle natural language extraction instead of hardcoded rules.  
- **A2A Protocol Compliance**: Minor spec violations (e.g., missing `messageId`) can break integrations. Test with real clients early.  
- **Prompt Engineering**: Use precise instructions (e.g., "provide THE SINGLE BEST option") to eliminate ambiguity.  
- **LLM Temperature**: Low temperature ensures structured, deterministic outputs for migration pathways.  

---

### Testing and Examples

**Example cURL Request:**
```bash
curl -X POST https://migration-pathways-agent-ca4e1c945e86.herokuapp.com/a2a/planner \
-H "Content-Type: application/json" \
-d '{
  "jsonrpc": "2.0",
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [{
        "type": "text",
        "text": "I am a data scientist from India wanting to move to USA with $10000"
      }]
    }
  },
  "id": 1
}'
```

**Live API**: [https://migration-pathways-agent-ca4e1c945e86.herokuapp.com/a2a/planner](https://migration-pathways-agent-ca4e1c945e86.herokuapp.com/a2a/planner)  
**Agent Card**: [https://migration-pathways-agent-ca4e1c945e86.herokuapp.com/.well-known/agent.json](https://migration-pathways-agent-ca4e1c945e86.herokuapp.com/.well-known/agent.json)

---

## Recommendations

- **Use A2A for Interoperability**: Standardize agent communication to ensure compatibility with platforms like Telex.im.  
- **Optimize Prompt Engineering**: Define strict output formats to avoid back-and-forth with users.  
- **Monitor LLM Outputs**: Validate structured responses (e.g., budget, processing time) for accuracy.  
- **Secure API Keys**: Never hardcode API keys; use environment variables or secrets managers.  
- **Test with Real Clients**: Verify A2A responses using tools like VS Code REST Client before deployment.  

---

**Repository**: [github.com/brainox/immigration-pathways-agent](https://github.com/brainox/immigration-pathways-agent)  
**Author**: [Obinna Aguwa](https://dev.to/macmartins)  
**Original Article**: [https://dev.to/macmartins/building-an-ai-powered-migration-pathways-agent-with-go-and-the-a2a-protocol-22gm](https://dev.to/macmartins/building-an-ai-powered-migration-pathways-agent-with-go-and-the-a2a-protocol-22gm)