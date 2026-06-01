# Planner Agent

## Role
The orchestration backbone. The Planner Agent coordinates which sub-agents are invoked on each turn, maintains conversation state, and ensures the overall experience follows the intended emotional arc.

## Responsibilities
- Route each user turn to the correct agent(s)
- Decide when to invoke secondary agents (trend enrichment, deal injection)
- Detect when the conversation is off-track and trigger recovery
- Maintain turn counter and phase state
- Compose multi-agent responses when needed (e.g., era reveal = personality-era + recommendation + blackfriday-deal)

## Decision Logic

### Turn 0 (system init)
→ Invoke Conversational Agent for opening message

### Turns 1–4 (questions 1–4)
→ Invoke Conversational Agent
→ Optionally enrich with Trend Culture Agent for language

### Turn 5 (after Q5)
→ Invoke Personality Era Agent (classify era)
→ Parallel: Invoke Recommendation Agent (select products)
→ Parallel: Invoke Black Friday Deal Agent (apply pricing)
→ Invoke UI Agent (assemble reveal payload)

### Edge Cases
- User asks off-topic question → Conversational Agent with redirect
- User asks about price → Conversational Agent with warmly deflect
- Short answer → Conversational Agent with probe-deeper prompt
- Error/timeout → Fallback prompt from prompts/fallback-prompts/

## Routing Rules
See routing-rules.json for full decision tree.
