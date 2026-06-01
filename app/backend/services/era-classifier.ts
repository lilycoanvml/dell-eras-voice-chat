/**
 * Era Classifier Service
 *
 * Scores a conversation transcript against the six era archetypes and
 * returns the best-fit era with a confidence score. Used by the
 * personality-era agent to validate Claude's classification.
 */

export type EraId = 'creator' | 'innovator' | 'achiever' | 'explorer' | 'visionary' | 'performer';

export interface EraDefinition {
  id: EraId;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  keywords: string[];
  antiKeywords: string[];
}

export interface ClassificationResult {
  era: EraDefinition;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  runnerUp?: EraDefinition;
}

export const ERA_DEFINITIONS: Record<EraId, EraDefinition> = {
  creator: {
    id: 'creator',
    name: 'The Creator Era',
    tagline: 'Your craft is your currency.',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    keywords: ['create', 'design', 'art', 'visual', 'aesthetic', 'make', 'express', 'beauty',
      'film', 'photo', 'video', 'content', 'brand', 'portfolio', 'studio', 'canvas'],
    antiKeywords: ['code', 'engineer', 'data', 'manage', 'team', 'travel', 'game'],
  },
  innovator: {
    id: 'innovator',
    name: 'The Innovator Era',
    tagline: 'You build what others only imagine.',
    primaryColor: '#06B6D4',
    secondaryColor: '#3B82F6',
    keywords: ['code', 'develop', 'engineer', 'build', 'software', 'data', 'tech', 'system',
      'stack', 'api', 'app', 'product', 'startup', 'open source', 'deploy', 'ml', 'ai'],
    antiKeywords: ['art', 'travel', 'game', 'lead', 'manage', 'team'],
  },
  achiever: {
    id: 'achiever',
    name: 'The Achiever Era',
    tagline: 'Greatness is the only setting you know.',
    primaryColor: '#F59E0B',
    secondaryColor: '#DC2626',
    keywords: ['lead', 'team', 'manage', 'grow', 'scale', 'strategy', 'business', 'impact',
      'revenue', 'goal', 'performance', 'executive', 'director', 'kpi', 'quarterly'],
    antiKeywords: ['code', 'art', 'travel', 'game'],
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer Era',
    tagline: 'The whole world is your workspace.',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    keywords: ['travel', 'remote', 'flexible', 'freedom', 'move', 'adventure', 'anywhere',
      'nomad', 'location', 'beach', 'cafe', 'abroad', 'balance', 'lifestyle'],
    antiKeywords: ['office', 'team', 'game', 'code'],
  },
  visionary: {
    id: 'visionary',
    name: 'The Visionary Era',
    tagline: 'You see the future before it arrives.',
    primaryColor: '#7C3AED',
    secondaryColor: '#DC2626',
    keywords: ['launch', 'company', 'disrupt', 'change', 'vision', 'founder', 'mission',
      'startup', 'legacy', 'impact', 'billion', 'category', 'movement', 'transform'],
    antiKeywords: ['game', 'art', 'travel', 'manage'],
  },
  performer: {
    id: 'performer',
    name: 'The Performer Era',
    tagline: 'When you play, the world watches.',
    primaryColor: '#EF4444',
    secondaryColor: '#F97316',
    keywords: ['game', 'stream', 'compete', 'perform', 'entertain', 'audience', 'live',
      'twitch', 'youtube', 'gaming', 'fps', 'rank', 'esport', 'broadcast', 'content'],
    antiKeywords: ['manage', 'lead', 'code', 'travel'],
  },
};

export class EraClassifier {
  classify(transcript: string): ClassificationResult {
    const lower = transcript.toLowerCase();
    const scores: Record<EraId, number> = {} as Record<EraId, number>;

    for (const [id, def] of Object.entries(ERA_DEFINITIONS) as [EraId, EraDefinition][]) {
      let score = 0;
      for (const kw of def.keywords) {
        const matches = (lower.match(new RegExp(kw, 'g')) || []).length;
        score += matches * 2;
      }
      for (const anti of def.antiKeywords) {
        if (lower.includes(anti)) score -= 1;
      }
      scores[id] = Math.max(0, score);
    }

    const sorted = (Object.entries(scores) as [EraId, number][]).sort((a, b) => b[1] - a[1]);
    const [topId, topScore] = sorted[0];
    const [runnerUpId] = sorted[1];
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const dominance = totalScore > 0 ? topScore / totalScore : 0;

    return {
      era: ERA_DEFINITIONS[topId],
      score: topScore,
      confidence: dominance > 0.4 ? 'high' : dominance > 0.25 ? 'medium' : 'low',
      runnerUp: ERA_DEFINITIONS[runnerUpId],
    };
  }
}
