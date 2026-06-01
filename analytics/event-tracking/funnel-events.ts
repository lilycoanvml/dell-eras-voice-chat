/**
 * Funnel event definitions for the "Find Your Next Era" experience.
 */

export const FUNNEL_EVENTS = {
  // Top of funnel
  LANDING_VIEW: 'landing_page_viewed',
  CTA_CLICK: 'begin_journey_clicked',

  // Discovery
  CHAT_STARTED: 'chat_conversation_started',
  Q1_ANSWERED: 'question_1_answered',
  Q2_ANSWERED: 'question_2_answered',
  Q3_ANSWERED: 'question_3_answered',
  Q4_ANSWERED: 'question_4_answered',
  Q5_ANSWERED: 'question_5_answered',

  // Era reveal
  ERA_REVEALED: 'era_revealed',
  ERA_CARD_VIEWED: 'era_card_viewed',
  PRODUCTS_SCROLLED: 'products_scrolled_into_view',

  // Product engagement
  PRODUCT_CARD_VIEWED: 'product_card_viewed',
  PRODUCT_CLICKED: 'product_clicked',
  BUNDLE_VIEWED: 'bundle_viewed',

  // Session
  SESSION_ABANDONED: 'session_abandoned',
  SESSION_COMPLETED: 'session_completed',
  START_OVER_CLICKED: 'start_over_clicked',
  SHARE_CARD_CLICKED: 'share_card_clicked',
} as const;

export type FunnelEvent = typeof FUNNEL_EVENTS[keyof typeof FUNNEL_EVENTS];
