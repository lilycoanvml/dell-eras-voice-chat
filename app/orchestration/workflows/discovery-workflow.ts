/**
 * Discovery Workflow
 *
 * Defines the step-by-step execution plan for a complete
 * "Find Your Next Era" session.
 */

export interface WorkflowStep {
  id: string;
  phase: string;
  agent: string;
  action: string;
  condition?: string;
  parallel?: boolean;
}

export const DISCOVERY_WORKFLOW: WorkflowStep[] = [
  {
    id: 'step-1',
    phase: 'welcome',
    agent: 'conversational',
    action: 'greet_and_ask_q1',
  },
  {
    id: 'step-2',
    phase: 'discovery_q1',
    agent: 'conversational',
    action: 'reflect_and_ask_q2',
    condition: 'answer_length >= 3',
  },
  {
    id: 'step-3',
    phase: 'discovery_q2',
    agent: 'conversational',
    action: 'reflect_and_ask_q3',
    condition: 'answer_length >= 3',
  },
  {
    id: 'step-4',
    phase: 'discovery_q3',
    agent: 'conversational',
    action: 'reflect_and_ask_q4',
    condition: 'answer_length >= 3',
  },
  {
    id: 'step-5',
    phase: 'discovery_q4',
    agent: 'conversational',
    action: 'signal_final_and_ask_q5',
    condition: 'answer_length >= 3',
  },
  {
    id: 'step-6a',
    phase: 'era_reveal',
    agent: 'personality-era',
    action: 'classify_era',
    parallel: true,
  },
  {
    id: 'step-6b',
    phase: 'era_reveal',
    agent: 'recommendation',
    action: 'select_products',
    parallel: true,
  },
  {
    id: 'step-6c',
    phase: 'era_reveal',
    agent: 'blackfriday-deal',
    action: 'apply_pricing',
    parallel: true,
  },
  {
    id: 'step-7',
    phase: 'era_reveal',
    agent: 'ui',
    action: 'assemble_and_render_reveal',
  },
];
