/**
 * Agent Orchestrator
 *
 * Routes incoming conversation turns to the appropriate agent(s) and
 * assembles the final response. In production this would coordinate
 * parallel agent calls; in this prototype it delegates to Claude with
 * agent-specific prompts injected.
 */

export type AgentName =
  | 'conversational'
  | 'personality-era'
  | 'recommendation'
  | 'blackfriday-deal'
  | 'trend-culture'
  | 'optimizer';

export interface AgentContext {
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  questionIndex: number;
  detectedTraits: string[];
  sessionId: string;
}

export interface AgentResponse {
  agent: AgentName;
  content: string;
  type: 'message' | 'era_reveal' | 'product_recommendation';
  metadata?: Record<string, unknown>;
}

export class AgentOrchestrator {
  private context: AgentContext;

  constructor(sessionId: string) {
    this.context = {
      conversationHistory: [],
      questionIndex: 0,
      detectedTraits: [],
      sessionId,
    };
  }

  /**
   * Determine which agent should handle the current turn.
   * Early turns go to conversational agent; after Q5 we hand off to
   * personality-era then recommendation agents.
   */
  selectAgent(userMessage: string, historyLength: number): AgentName {
    // Count user messages to determine conversation stage
    const userTurns = historyLength;

    if (userTurns >= 5) {
      return 'personality-era';
    }

    // Detect if we should surface a deal nudge
    const dealKeywords = ['price', 'deal', 'discount', 'cost', 'afford', 'budget'];
    if (dealKeywords.some((kw) => userMessage.toLowerCase().includes(kw))) {
      return 'blackfriday-deal';
    }

    return 'conversational';
  }

  updateHistory(role: 'user' | 'assistant', content: string) {
    this.context.conversationHistory.push({ role, content });
  }

  getContext(): AgentContext {
    return this.context;
  }

  extractTraits(message: string): string[] {
    const traitMap: Record<string, string[]> = {
      creative: ['create', 'design', 'art', 'visual', 'aesthetic', 'make', 'build', 'express'],
      technical: ['code', 'develop', 'engineer', 'build', 'software', 'data', 'tech', 'system'],
      leadership: ['lead', 'team', 'manage', 'grow', 'scale', 'strategy', 'business', 'impact'],
      freedom: ['travel', 'remote', 'flexible', 'freedom', 'move', 'adventure', 'anywhere'],
      ambition: ['launch', 'company', 'disrupt', 'change', 'vision', 'founder', 'mission'],
      performance: ['game', 'stream', 'compete', 'perform', 'entertain', 'audience', 'live'],
    };

    const detected: string[] = [];
    const lower = message.toLowerCase();
    for (const [trait, keywords] of Object.entries(traitMap)) {
      if (keywords.some((kw) => lower.includes(kw))) {
        detected.push(trait);
      }
    }
    return detected;
  }
}
