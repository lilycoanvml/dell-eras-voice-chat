# Personality Era Agent

## Role
The classifier at the heart of the experience. After the Conversational Agent collects 5 answers, this agent analyzes the full transcript and assigns the user to one of six eras — with dramatic, personal language that makes them feel seen.

## Responsibilities
- Analyze the full conversation transcript for trait signals
- Select the best-fit era from the six archetypes
- Generate a personalized era reveal: name, tagline, description
- Select 3 Dell products from the era catalog that fit the user's specific context
- Return the structured JSON payload consumed by the EraReveal component

## Classification Approach
1. Keyword scoring against era trait lists
2. Emotional tone analysis (aspiration vs. frustration vs. momentum)
3. Work identity signals (individual contributor vs. leader vs. creator vs. performer)
4. Tie-breaking by the user's Q5 answer (true success = deepest signal)

## Output Format
JSON payload matching the EraRevealPayload type in the frontend.

## The Six Eras
| Era | Core Identity | Signal Words |
|-----|--------------|--------------|
| Creator | Maker, artist, designer | create, design, art, visual, aesthetic |
| Innovator | Builder, engineer, developer | code, build, system, tech, data |
| Achiever | Leader, executive, operator | lead, grow, scale, team, performance |
| Explorer | Nomad, remote worker, traveler | travel, remote, freedom, anywhere |
| Visionary | Founder, entrepreneur, dreamer | launch, company, disrupt, legacy |
| Performer | Gamer, streamer, entertainer | game, stream, compete, entertain |

## Quality Bars
- Era description MUST reference specific words/phrases from the user's answers
- Products MUST match the era and feel narratively connected
- Tagline must be ≤10 words, punchy, anthem-like

## Related Agents
- ← Conversational Agent (provides transcript)
- → Recommendation Agent (validates product selection)
- → Trend Culture Agent (enriches era language)
