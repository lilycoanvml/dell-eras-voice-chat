/**
 * Conversation State Manager
 *
 * Tracks in-memory conversation state for a single session.
 * In production this would be backed by a database or Redis.
 */

export type ConversationPhase =
  | 'welcome'
  | 'discovery_q1'
  | 'discovery_q2'
  | 'discovery_q3'
  | 'discovery_q4'
  | 'discovery_q5'
  | 'era_reveal'
  | 'product_exploration'
  | 'complete';

export interface ConversationState {
  sessionId: string;
  phase: ConversationPhase;
  questionIndex: number;
  answers: Record<number, string>;
  detectedTraits: string[];
  assignedEra: string | null;
  startedAt: Date;
  completedAt: Date | null;
  conversionEvent: boolean;
}

const sessions = new Map<string, ConversationState>();

export function createSession(sessionId: string): ConversationState {
  const state: ConversationState = {
    sessionId,
    phase: 'welcome',
    questionIndex: 0,
    answers: {},
    detectedTraits: [],
    assignedEra: null,
    startedAt: new Date(),
    completedAt: null,
    conversionEvent: false,
  };
  sessions.set(sessionId, state);
  return state;
}

export function getSession(sessionId: string): ConversationState | undefined {
  return sessions.get(sessionId);
}

export function updateSession(
  sessionId: string,
  updates: Partial<ConversationState>
): ConversationState | null {
  const existing = sessions.get(sessionId);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  sessions.set(sessionId, updated);
  return updated;
}

export function advancePhase(sessionId: string): ConversationPhase | null {
  const state = sessions.get(sessionId);
  if (!state) return null;

  const phaseOrder: ConversationPhase[] = [
    'welcome',
    'discovery_q1',
    'discovery_q2',
    'discovery_q3',
    'discovery_q4',
    'discovery_q5',
    'era_reveal',
    'product_exploration',
    'complete',
  ];

  const currentIndex = phaseOrder.indexOf(state.phase);
  const nextPhase = phaseOrder[currentIndex + 1] ?? 'complete';

  updateSession(sessionId, {
    phase: nextPhase,
    questionIndex: state.questionIndex + 1,
  });

  return nextPhase;
}

export function recordAnswer(sessionId: string, questionIndex: number, answer: string) {
  const state = sessions.get(sessionId);
  if (!state) return;
  updateSession(sessionId, {
    answers: { ...state.answers, [questionIndex]: answer },
  });
}
