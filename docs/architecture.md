# Architecture Overview

## System Design

Find Your Next Era is a stateless, single-session conversational web app.
Each page load is a fresh session; there is no authentication or persistent user database.

```
Browser
  ↓ POST /api/chat (full conversation history)
Next.js API Route
  ↓ Anthropic SDK
Claude (claude-sonnet-4-6)
  ↑ type: "message" or type: "era_reveal" (JSON)
React Frontend
  ↑ Renders MessageBubble or EraReveal + ProductCard components
```

## Key Design Decisions

### Stateless API
Every chat request sends the full message history. This simplifies the backend
to a single endpoint with no session management. Trade-off: larger payloads as
the conversation grows, but this is acceptable for a 5-turn experience.

### Client-Side State
All conversation state (messages array, loading state, era reveal data) lives in
the `useChat` hook. No Redux, no global store. Trade-off: state is lost on refresh,
which is acceptable for a prototype.

### Single Claude Call
Rather than orchestrating multiple agent API calls per turn, the prototype uses
a single Claude call with a rich system prompt that embodies all agent behaviors.
The multi-agent architecture in `agents/`, `app/orchestration/`, and `app/backend/`
documents the target production architecture.

### JSON Protocol
When Claude detects it's time for the era reveal (after the 5th user answer),
it responds with pure JSON rather than conversational text. The API route detects
this pattern and routes it to the `era_reveal` response type.

## Production Architecture (Future State)

```
Browser
  ↓
API Gateway
  ↓
Planner Agent (routes turn)
  ↓                    ↓                    ↓
Conversational     Personality-Era      Recommendation
Agent              Agent                Agent
  ↑                    ↑                    ↑
        Orchestrator (assembles response)
  ↑
Analytics + Memory Store
  ↑
Browser
```
