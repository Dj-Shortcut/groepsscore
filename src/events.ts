/**
 * Alle event types die het systeem kent
 * (DIT is de single source of truth)
 */
export type EventType =
  | "post"
  | "comment"
  | "message"
  | "message_read";

/**
 * Interne event-representatie
 * Alles in de app werkt vanaf hier met dit type
 */
export type InternalEvent = {
  userId: string;

  /**
   * Type van event (zie EventType hierboven)
   */
  type: EventType;

  /**
   * Unix timestamp (ms)
   */
  timestamp: number;

  /**
   * Waar komt het event vandaan
   */
  source: "facebook" | "test" | "cli";

  /**
   * Optional context (thread, post, group, …)
   */
  targetId?: string;

  /**
   * Vrije metadata (Facebook payload, message text, ids, …)
   */
  meta?: Record<string, any>;
};
