/**
 * Agent Router
 *
 * Maps agent names to their configuration and prompt files.
 * Used by the orchestrator to assemble the right system context per turn.
 */

export interface AgentRoute {
  name: string;
  promptFile: string;
  configFile: string;
  maxTokens: number;
  temperature: number;
  priority: number;
}

export const AGENT_ROUTES: Record<string, AgentRoute> = {
  conversational: {
    name: 'Conversational Agent',
    promptFile: 'agents/conversational-agent/prompts.md',
    configFile: 'agents/conversational-agent/config.json',
    maxTokens: 512,
    temperature: 0.8,
    priority: 1,
  },
  'personality-era': {
    name: 'Personality Era Agent',
    promptFile: 'agents/personality-era-agent/prompts.md',
    configFile: 'agents/personality-era-agent/config.json',
    maxTokens: 1024,
    temperature: 0.4,
    priority: 2,
  },
  recommendation: {
    name: 'Recommendation Agent',
    promptFile: 'agents/recommendation-agent/prompts.md',
    configFile: 'agents/recommendation-agent/config.json',
    maxTokens: 1024,
    temperature: 0.3,
    priority: 3,
  },
  'blackfriday-deal': {
    name: 'Black Friday Deal Agent',
    promptFile: 'agents/blackfridaydeal-agent/blackfridaydeal-agent.md',
    configFile: 'agents/blackfridaydeal-agent/config.json',
    maxTokens: 512,
    temperature: 0.5,
    priority: 4,
  },
  'trend-culture': {
    name: 'Trend Culture Agent',
    promptFile: 'agents/trend-culture-agent/prompts.md',
    configFile: 'agents/trend-culture-agent/config.json',
    maxTokens: 256,
    temperature: 0.9,
    priority: 5,
  },
  optimizer: {
    name: 'Optimizer Agent',
    promptFile: 'agents/optimizer-agent/optimizer-agent.md',
    configFile: 'agents/optimizer-agent/config.json',
    maxTokens: 256,
    temperature: 0.2,
    priority: 6,
  },
};

export function getRoute(agentName: string): AgentRoute | null {
  return AGENT_ROUTES[agentName] ?? null;
}
