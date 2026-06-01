/**
 * Conversation Planner
 *
 * Decides the next action in the conversation workflow based on current state.
 * Implements the multi-agent routing logic for the "Find Your Next Era" flow.
 */

import type { ConversationPhase } from '../state/conversation-state';

export type PlannerAction =
  | 'continue_discovery'
  | 'probe_deeper'
  | 'transition_to_reveal'
  | 'show_products'
  | 'handle_objection'
  | 'recover_conversation';

export interface PlannerDecision {
  action: PlannerAction;
  agentToInvoke: string;
  rationale: string;
  shouldInjectContext?: boolean;
}

export class ConversationPlanner {
  decide(
    phase: ConversationPhase,
    questionIndex: number,
    lastUserMessage: string,
    detectedTraits: string[]
  ): PlannerDecision {
    // Short or evasive answer — probe deeper before advancing
    if (lastUserMessage.split(' ').length < 4 && questionIndex < 5) {
      return {
        action: 'probe_deeper',
        agentToInvoke: 'conversational',
        rationale: 'Response too brief — need richer signal before classification',
        shouldInjectContext: false,
      };
    }

    // All 5 questions answered — trigger reveal
    if (questionIndex >= 5) {
      return {
        action: 'transition_to_reveal',
        agentToInvoke: 'personality-era',
        rationale: 'Sufficient signal collected for era classification',
        shouldInjectContext: true,
      };
    }

    // Standard flow
    return {
      action: 'continue_discovery',
      agentToInvoke: 'conversational',
      rationale: `Continuing discovery phase — question ${questionIndex + 1} of 5`,
      shouldInjectContext: false,
    };
  }

  buildWorkflowSummary(answers: Record<number, string>, traits: string[]): string {
    return [
      `Collected answers: ${Object.keys(answers).length}`,
      `Detected traits: ${traits.join(', ') || 'none yet'}`,
      `Top signals: ${this.topSignals(answers)}`,
    ].join('\n');
  }

  private topSignals(answers: Record<number, string>): string {
    const allText = Object.values(answers).join(' ').toLowerCase();
    const signals = ['create', 'build', 'lead', 'travel', 'game', 'launch', 'code'];
    return signals.filter((s) => allText.includes(s)).join(', ') || 'unclear';
  }
}
