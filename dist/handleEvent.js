import { isScorableEvent } from "./scorableEvents.js";
import { awardPoints } from "./xpEngine.js";
/**
 * Centrale event handler
 * - ontvangt ALLE events
 * - beslist of ze scorable zijn
 */
export function handleEvent(event) {
    if (isScorableEvent(event.type)) {
        return awardPoints(event.userId, event.type, event.timestamp);
    }
    // Niet-scorable events (message, message_read, …)
    // zijn geldig maar leveren geen punten op
    return { ok: true };
}
//# sourceMappingURL=handleEvent.js.map