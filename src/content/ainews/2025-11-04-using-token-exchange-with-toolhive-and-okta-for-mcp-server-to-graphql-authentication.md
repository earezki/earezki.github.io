---
title: "Securing GraphQL API Access with Token Exchange via ToolHive and Okta"
pubDate: 2025-11-04
description: "This article demonstrates how to use Okta and ToolHive to enable secure token exchange for MCP server authentication with a GraphQL API, ensuring role-based access and audit trails."
categories: ["AI News", "security", "devops", "software", "development"]
---

## Using Token Exchange with ToolHive and Okta for MCP Server to GraphQL Authentication

This article explains how to implement secure authentication for a GraphQL API using Okta and ToolHive, leveraging token exchange to ensure that only authorized users can access backend services through an MCP server. The setup ensures role-based access, clean audit trails, and separation of concerns between the MCP server and backend API.

---

### Key Concepts and Setup

#### Environment Requirements
- **Backend API**: Requires tokens with `aud=backend` and `scopes=[backend-api:read]`.
- **MCP Server**: Requires tokens with `aud=mcpserver` and `scopes=mcp:tools:call`.
- **Authentication Flow**: Users authenticate via VSCode, which connects to the MCP server (ToolHive), which exchanges tokens for backend API access.

#### Okta Configuration
- **Authorization Servers**: Two servers are created:
  - **MCP Server AS**: Issues tokens for `mcp:tools:call`.
  - **Backend AS**: Issues tokens for `backend-api:read`.
- **Trust Between Servers**: The backend AS must trust the MCP server AS for token exchange.

#### Application Setup
- **VSCode Client**: OIDC application with Redirect URIs `http://127.0.0.1:33418` and `https://vscode.dev/redirect`.
- **ToolHive Client**: API Services application with Token Exchange grant enabled. Requires unchecking "Require Demonstrating Proof of Possession" and assigning token exchange policies.

#### Policies
- **MCP Client Policy**: Grants `mcp:tools:call` scope to the VSCode client on the MCP server AS.
- **Token Exchange Policy**: Allows the ToolHive client to exchange tokens for `backend-api:read` scope on the backend AS.

---

### Implementation Steps

#### Cloning and Configuring the GraphQL Server
1. Clone the Apollo GraphQL demo repository:
   ```bash
   git clone https://github.com/StacklokLabs/apollo-mcp-auth-demo
   ```
2. Configure `.env` with Okta domain, issuer, audience, and scopes:
   ```text
   OKTA_DOMAIN=integrator-3683736.okta.com
   OKTA_ISSUER=https://integrator-3683736.okta.com/oauth2/auswdh3wurjeJ62La697
   OKTA_AUDIENCE=backend
   REQUIRED_SCOPES=backend-api:read
   ```

3. Start the server:
   ```bash
   npm install
   npm start
   ```

#### Configuring the MCP Server (ToolHive)
1. Modify `apollo-mcp-config.yaml` to specify the backend AS:
   ```yaml
   transport:
     type: sse
     port: 8000
   auth:
     servers:
       - https://integrator-3683736.okta.com/oauth2/auswdh3wurjeJ62La697
   ```

2. Run ToolHive with token exchange parameters:
   ```bash
   thv run \
   --oidc-audience mcpserver \
   --token-exchange-audience backend \
   --token-exchange-client-id 0oawdgw7krVBSwzIx697 \
   --token-exchange-client-secret O2zqVb-evhKgfBOD-PRVDs5HFyCXAnRZAwxAtQOH9oGt72aBrLBiwEVlyyTengj9 \
   --token-exchange-url https://integrator-3683736.okta.com/oauth2/auswdh3wurjeJ62La697/v1/token \
   apollo-mcp-server -- /config.yaml
   ```

---

### Authentication Flow and Token Exchange

#### VSCode Integration
- VSCode connects to the MCP server via ToolHive.
- The user authenticates with Okta, receiving a token with `aud=mcpserver`.
- ToolHive exchanges this token for a backend API token (`aud=backend`) using the configured policies.

#### Token Exchange Process
1. **Client Token**:
   ```json
   {
     "iss": "https://idp.example.com/oauth2/default",
     "aud": "mcpserver",
     "scp": ["mcp:tools:call"],
     "sub": "user@example.com"
   }
   ```
2. **Exchanged Token**:
   ```json
   {
     "iss": "https://idp.example.com/oauth2/default",
     "aud": "backend",
     "scp": ["backend-api:read"],
     "sub": "user@example.com"
   }
   ```

---

### Benefits and Best Practices

#### Security and Efficiency
- **Role-Based Access**: Tokens ensure only authorized users can access specific services.
- **Audit Trails**: Each API call is attributed to a user, not a generic service account.
- **Short-Lived Tokens**: Reduces the risk of token misuse compared to long-lived secrets.

#### Recommendations
- **Avoid Hardcoding Secrets**: Use environment variables or files for `--token-exchange-client-secret`.
- **Validate Redirect URIs**: Ensure VSCode’s Redirect URIs match Okta’s configuration.
- **Test in Isolated Environments**: Use separate Okta realms for development and production.

---

### Working Example

```bash
# Start the GraphQL server
npm start

# Run ToolHive with token exchange
thv run \
--oidc-audience mcpserver \
--token-exchange-audience backend \
--token-exchange-client-id 0oawdgw7krVBSwzIx697 \
--token-exchange-client-secret <SECRET> \
--token-exchange-url https://integrator-3683736.okta.com/oauth2/auswdh3wurjeJ62La697/v1/token \
apollo-mcp-server -- /config.yaml
```

---

### References
- [ModelContextProtocol Authorization Docs](https://modelcontextprotocol.io/docs/tutorials/security/authorization)
- [Okta Token Exchange Guide](https://developer.okta.com/docs/guides/set-up-token-exchange/main/)

```url
https://dev.to/stacklok/using-token-exchange-with-toolhive-and-okta-for-mcp-server-to-graphql-authentication-3ehi
```