import { awardPoints } from "./xpEngine.js";
import { InternalEvent } from "./events.js";

export function handleEvent(event: InternalEvent, debug = false) {
  return awardPoints(
    event.userId,
    event.type,
    event.timestamp,
    debug
  );
}
