import { awardPoints } from "./xpEngine.js";
export function handleEvent(event, debug = false) {
    return awardPoints(event.userId, event.type, event.timestamp, debug);
}
//# sourceMappingURL=handleEvent.js.map