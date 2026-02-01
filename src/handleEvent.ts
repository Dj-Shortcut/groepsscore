import { awardPoints } from "./xpEngine";
import { InternalEvent } from "./events";

export function handleEvent(event: InternalEvent, debug = false) {
  return awardPoints(
    event.userId,
    event.type,
    event.timestamp,
    debug
  );
}
