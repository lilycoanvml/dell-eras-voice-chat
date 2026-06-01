/**
 * Analytics Tool
 *
 * Tracks key conversion events through the conversational funnel.
 * In production this would integrate with Dell's analytics stack.
 */

export type EventName =
  | 'session_start'
  | 'question_answered'
  | 'era_revealed'
  | 'product_viewed'
  | 'product_clicked'
  | 'bundle_viewed'
  | 'session_abandoned'
  | 'session_completed';

export interface AnalyticsEvent {
  event: EventName;
  sessionId: string;
  timestamp: Date;
  properties?: Record<string, unknown>;
}

const eventLog: AnalyticsEvent[] = [];

export function track(event: EventName, sessionId: string, properties?: Record<string, unknown>) {
  const entry: AnalyticsEvent = {
    event,
    sessionId,
    timestamp: new Date(),
    properties,
  };
  eventLog.push(entry);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}`, properties);
  }

  // In production: send to analytics endpoint
  // await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(entry) });
}

export function getSessionEvents(sessionId: string): AnalyticsEvent[] {
  return eventLog.filter((e) => e.sessionId === sessionId);
}

export function getFunnelSummary() {
  const totals: Record<EventName, number> = {} as Record<EventName, number>;
  for (const event of eventLog) {
    totals[event.event] = (totals[event.event] || 0) + 1;
  }
  return totals;
}
