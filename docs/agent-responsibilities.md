# Agent Responsibilities

## Overview

The system uses 9 agents. In the current prototype, Claude plays all roles
simultaneously via a unified system prompt. The agent files document the
**intended production architecture** where each agent would be a discrete
Claude invocation with its own prompt and configuration.

---

## Agent Summary

| Agent | Prototype Role | Production Role | When Active |
|-------|----------------|-----------------|-------------|
| Conversational | Active (via system prompt) | Standalone Claude call | Turns 1–5 |
| Personality Era | Active (via system prompt) | Standalone Claude call | After turn 5 |
| Recommendation | Active (via system prompt) | Standalone Claude call | After classification |
| Black Friday Deal | Active (pricing data in prompt) | Standalone call | Era reveal assembly |
| Trend Culture | Passive (language in prompt) | Standalone enrichment call | Optional per turn |
| Planner | Implemented in useChat hook | Standalone orchestrator | Every turn |
| Optimizer | Not active (prototype) | Async analytics job | Post-session |
| New Features | Not active (prototype) | Product management tool | Weekly |
| UI Agent | Active (frontend renders it) | UI payload assembler | Era reveal |

---

## Handoff Protocol

```
Turn N (user message)
  → Planner decides: which agent?
  → Agent processes + responds
  → If final turn: Personality Era + Recommendation + Black Friday Deal run in parallel
  → UI Agent assembles payload
  → Frontend receives and renders
```

## Agent Communication Contract

All agents communicate via JSON payloads. The schema:

```typescript
{
  agentName: string;
  inputContext: {
    conversationHistory: Message[];
    userMessage: string;
    sessionState: ConversationState;
  };
  output: {
    type: 'message' | 'era_reveal' | 'product_list' | 'ui_payload';
    content: string | object;
    metadata: Record<string, unknown>;
  };
}
```
