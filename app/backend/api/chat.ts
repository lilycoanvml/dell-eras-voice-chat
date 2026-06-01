/**
 * Backend API module — re-exports the Next.js route handler logic
 * for use with the agent orchestrator in production.
 *
 * The prototype uses `app/api/chat/route.ts` directly.
 * This module is the integration point for the production backend.
 */

export { POST } from '@/app/api/chat/route';
