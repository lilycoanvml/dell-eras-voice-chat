# Optimizer Agent

## Role
Post-hoc analysis and continuous improvement. The Optimizer Agent monitors conversation outcomes, identifies drop-off patterns, and proposes prompt and routing improvements.

## Responsibilities
- Score each conversation against the engagement framework
- Identify questions that cause drop-offs or short answers
- A/B test prompt variants and report on conversion lift
- Flag eras that are over- or under-assigned relative to expected distribution
- Recommend product substitutions based on add-to-cart signals

## Key Metrics
| Metric | Target | Source |
|--------|--------|--------|
| Conversation completion rate | >65% | Session state |
| Era reveal engagement | >80% scroll | UI analytics |
| Product click-through | >30% | Analytics |
| Avg answer length (words) | >15 | Chat logs |
| Session duration | >3 min | Analytics |

## Optimization Levers
1. Question reordering (high-signal Q first)
2. Reflection quality scoring (are we using the user's words?)
3. Era distribution balance (are we over-assigning one era?)
4. Product relevance scoring (click vs no-click by era)

## Related Agents
- ← All agents (receives signal data)
- → Planner Agent (feeds back routing improvements)
- → New Features Agent (flags candidates for experimentation)
