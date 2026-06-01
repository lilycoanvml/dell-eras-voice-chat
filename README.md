# Find Your Next Era
### Dell Technologies × Black Friday

A conversational Black Friday experience built around identity, possibility,
and human transformation. It starts with a conversation, not a product grid.

---

## The Experience

1. **Landing** — "Something is shifting for you." A single CTA invites users in.
2. **Discovery** — 5 personality questions from an AI guide. Warm, insightful, never salesy.
3. **Era Reveal** — A dramatic classification into one of six life chapter archetypes.
4. **Products** — "Here are a few things that can support your next era." Three curated Dell products, Black Friday priced.

**The Six Eras:** The Creator · The Innovator · The Achiever · The Explorer · The Visionary · The Performer

---

## Quick Start

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
├── app/
│   ├── page.tsx                    # Landing page
│   ├── chat/page.tsx               # Chat experience
│   ├── api/chat/route.ts           # Claude API endpoint
│   ├── frontend/
│   │   ├── components/             # React components
│   │   └── hooks/useChat.ts        # Conversation state
│   ├── backend/services/           # Era classifier, orchestrator
│   └── orchestration/              # Planner, routing, state
│
├── agents/                         # Agent definitions + config
│   ├── conversational-agent/
│   ├── personality-era-agent/
│   ├── recommendation-agent/
│   ├── blackfridaydeal-agent/
│   ├── trend-culture-agent/
│   ├── planner-agent/
│   ├── optimizer-agent/
│   ├── newfeatures-agent/
│   └── ui-agent/
│
├── data/                           # Products, eras, personas, trends
├── prompts/                        # System prompts, tone guides
├── tools/                          # Recommendation engine, analytics
└── docs/                           # Architecture, journey, presentation
```

---

## Agent Architecture

| Agent | Role |
|-------|------|
| **Conversational** | Drives the 5-question discovery |
| **Personality Era** | Classifies user into an era archetype |
| **Recommendation** | Selects era-matched Dell products |
| **Black Friday Deal** | Applies pricing and urgency |
| **Trend Culture** | Keeps language culturally resonant |
| **Planner** | Orchestrates agent routing per turn |
| **Optimizer** | Monitors outcomes, proposes improvements |
| **New Features** | Manages experimentation roadmap |
| **UI Agent** | Assembles era reveal UI payloads |

---

## Tech Stack

- **Next.js 14** (App Router) — frontend + API routes
- **TypeScript** — end-to-end type safety
- **Tailwind CSS** — styling
- **Anthropic SDK** — Claude integration
- **Framer Motion** — animations

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `CLAUDE_MODEL` | No | Override model (default: `claude-sonnet-4-6`) |
| `NEXT_PUBLIC_APP_ENV` | No | `development` or `production` |

---

## Docs

- [Architecture](docs/architecture.md) — system design decisions
- [User Journey](docs/user-journey.md) — full experience arc
- [Agent Responsibilities](docs/agent-responsibilities.md) — who does what
- [Orchestration Flow](docs/orchestration-flow.md) — turn-by-turn mechanics
- [Presentation Notes](docs/presentation-notes.md) — pitch deck companion
# Dell-Black-Friday-Eras
# dell-eras-voice-chat
