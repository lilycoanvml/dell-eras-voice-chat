# Orchestration Flow

## Turn-by-Turn Walkthrough

### System Init
```
User loads /chat
  → useChat.startConversation() fires
  → POST /api/chat with { messages: [{ role: "user", content: "Hi..." }] }
  → Claude responds with opening message (Q1)
  → Frontend renders as MessageBubble
```

### Turns 2–5 (Discovery)
```
User types answer
  → useChat.sendMessage(input)
  → POST /api/chat with full history
  → Claude responds with reflection + next question
  → Frontend appends MessageBubble
  → Progress bar advances
```

### Turn 6 (Era Reveal Trigger)
```
User types 5th answer
  → POST /api/chat with full history (10 messages now)
  → Claude detects question count, switches to JSON output mode
  → Claude returns: { "type": "era_reveal", "era": {...}, "products": [...] }
  → API route detects JSON, parses, returns { type: "era_reveal", data: {...} }
  → useChat sets eraReveal state, ChatInterface renders EraReveal
  → EraReveal animates: era card (0ms) → products (2200ms)
```

## State Machine

```
idle
  → [startConversation] → loading
  → [API response] → idle

idle
  → [sendMessage] → loading
  → [message response] → idle
  → [era_reveal response] → era_revealed
  → [error] → error

error
  → [retry / reload] → idle

era_revealed
  → [reset] → idle
```

## Error Handling

| Error | Handling |
|-------|---------|
| API timeout | Show error message, offer retry |
| JSON parse failure on era reveal | Fall back to treating as text message |
| Network offline | Error state with reload prompt |
| Claude API rate limit | 429 response → "Too many requests, please wait" |
