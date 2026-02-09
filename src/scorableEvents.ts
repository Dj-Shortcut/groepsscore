import type { EventType } from "./events.js";

/**
 * Alle event types die *punten kunnen scoren* in de app.
 *
 * We gebruiken Extract<> om alleen de event types
 * te selecteren die relevant zijn voor scoring.
 */
export type ScorableEventType = Extract<
  EventType,
  "post" | "comment"
>;

const SCORABLE_EVENT_TYPES: ReadonlySet<EventType> = new Set([
  "post",
  "comment",
]);

export function isScorableEvent(
  type: EventType
): type is ScorableEventType {
  return SCORABLE_EVENT_TYPES.has(type);
}
