# UI Agent

## Role
Translates agent outputs into UI payloads that drive the frontend. The UI Agent is the bridge between the AI layer and the visual experience — ensuring the right animations, colors, timing, and components are used for each moment.

## Responsibilities
- Assemble the EraRevealPayload structure from Personality Era + Recommendation outputs
- Select era-specific colors, animations, and reveal sequences
- Control transition timing between conversation and reveal phases
- Validate that all required UI fields are present before sending to frontend
- Provide fallback UI states for error conditions

## Era Visual System
Each era has a distinct visual identity that carries through the reveal:

| Era | Primary | Secondary | Motif |
|-----|---------|-----------|-------|
| Creator | #8B5CF6 | #EC4899 | Purple → Pink gradient |
| Innovator | #06B6D4 | #3B82F6 | Cyan → Blue gradient |
| Achiever | #F59E0B | #DC2626 | Amber → Red gradient |
| Explorer | #10B981 | #059669 | Emerald gradient |
| Visionary | #7C3AED | #DC2626 | Violet → Red gradient |
| Performer | #EF4444 | #F97316 | Red → Orange gradient |

## Reveal Sequence
1. Fade to black (200ms)
2. Era card enters with blur-to-focus + scale animation (1200ms)
3. Era name draws in (800ms delay)
4. Products appear sequentially with 150ms stagger (starts 2200ms after era card)

## Related Agents
- ← Personality Era Agent (era data)
- ← Recommendation Agent (product data)
- ← Black Friday Deal Agent (pricing)
