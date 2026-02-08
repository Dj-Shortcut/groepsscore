/**
 * Alle event types die het systeem kent.
 * DIT is de enige plaats waar EventType bestaat.
 */
export type EventType =
  | "post"
  | "comment"
  | "message"
  | "message_read";

/**
 * Interne event-representatie.
 * Alles downstream (scoring, handlers, opslag)
 * werkt uitsluitend met dit type.
 */
export type InternalEvent = {
  /**
   * Actor / gebruiker die het event veroorzaakt
   */
  userId: string;

  /**
   * Type van het event
   */
  type: EventType;

  /**
   * Unix timestamp (ms)
   */
  timestamp: number;

  /**
   * Herkomst van het event
   */
  source: "facebook" | "test" | "cli";

  /**
   * Optional context:
   * - postId
   * - threadId
   * - groupId
   * - recipientId
   */
  targetId?: string;

  /**
   * Vrije metadata:
   * - Facebook payload
   * - message text
   * - ids
   * - debug info
   */
  meta?: Record<string, any>;
};
