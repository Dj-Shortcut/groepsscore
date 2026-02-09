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

/**
 * Runtime guard voor scorable events.
 */
export function isScorableEvent(
  type: EventType
): type is ScorableEventType {
  return type === "post" || type === "comment";
}
