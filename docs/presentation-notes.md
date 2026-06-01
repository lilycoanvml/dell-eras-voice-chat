# Presentation Notes

## Pitch Frame

**Open with the problem:**
"Black Friday is broken for premium tech. The experience that's supposed to
inspire — the moment someone decides to invest in themselves — looks like
a spreadsheet. Price vs. specs vs. stars. Nobody feels anything."

**Introduce the insight:**
"What if we started with identity instead of inventory?
What if we asked 'who are you becoming?' before 'what do you want to buy?'"

**Introduce the concept:**
"Find Your Next Era. A 5-minute conversation that classifies you into one
of six life chapter archetypes — and then reveals the Dell technology that
can take you there."

**Show the demo:**
Walk through the full experience live. Key moments to land:
1. The opening message — "Something's shifting for you."
2. Q3 reflection — show how the AI echoes back their specific words
3. The era reveal animation — this is the magic moment, give it silence
4. The product cards — "Here are a few things that can support your next era."

---

## Talking Points

### On the experience design
"We started with a conversation, not a product grid. The first five turns
are pure discovery — no pricing, no specs, no pressure. By the time
products appear, the user already feels seen."

### On the agent architecture
"Behind this conversation are nine specialized agents working together.
A Conversational Agent drives the discovery. A Personality Era Agent
classifies you into one of six archetypes. A Recommendation Agent
selects the most narratively matched products. A UI Agent orchestrates
the reveal sequence."

### On the eras
"Six eras. Not product categories — life archetypes. The Creator, the
Innovator, the Achiever, the Explorer, the Visionary, the Performer.
Each has its own visual identity, language, and curated Dell product bundle."

### On scalability
"This prototype runs on a single Claude call per turn. The production
architecture would run parallel agent invocations — each specialist
working simultaneously, assembled by a Planner agent."

---

## Demo Tips

- Use a real, specific persona for the demo. Don't give vague answers.
  "I want to build an AI design tool" → Innovator or Creator
  "I want to launch my photography business" → Creator
  "I want to scale my team" → Achiever

- When the era reveals, pause. Let the animation breathe.

- Point out that the description references words from the answers given.
  This is the "magic" of the personalization.

- Point out the savings badges — the Black Friday context without the
  Black Friday ugliness.

---

## Q&A Preparation

**"Why 6 eras?"**
Six was calibrated to cover the primary professional identity archetypes
without over-segmenting. It's broad enough to be inclusive, specific enough
to feel personal. This is v1 — the New Features Agent has a roadmap for
era blending ("You're at the intersection of Creator and Innovator").

**"How does it know which era to assign?"**
Claude analyzes the full 5-answer transcript holistically. It looks for
keyword clusters, emotional tone, work identity signals, and Q5 (the "true
success" question) carries the most weight. The Personality Era Agent's
prompt instructs it to reference specific user language in the description —
that's what makes it feel personal rather than generic.

**"Could this work year-round?"**
Yes — the Black Friday pricing is a layer on top. The core experience
("Find Your Next Era") could run as a perennial product discovery tool.
Black Friday is the launch window with urgency and savings as the hook.
