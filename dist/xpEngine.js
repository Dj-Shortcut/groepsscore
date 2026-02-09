import { randomUUID } from "crypto";
import { addEvent, addPoints, countEventsForDay, countRecentEvents, } from "./store.js";
/**
 * Puntwaarden
 */
const POINTS = {
    post: 10,
    comment: 3,
};
/**
 * Daglimieten
 */
const DAILY_LIMITS = {
    post: 3,
    comment: 10,
};
/**
 * Anti-spam instellingen
 */
const BURST_LIMIT = 3;
const BURST_WINDOW_MS = 60_000;
function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function endOfDay(ts) {
    const d = new Date(ts);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
}
/**
 * Hoofdfunctie
 */
export function awardPoints(userId, type, timestamp = Date.now(), debug = false) {
    /**
     * 1️⃣ Burst check
     */
    const recentCount = countRecentEvents(userId, timestamp - BURST_WINDOW_MS);
    const inCooldown = recentCount >= BURST_LIMIT;
    /**
     * 2️⃣ Daglimiet check
     */
    const todayCount = countEventsForDay(userId, type, startOfDay(timestamp), endOfDay(timestamp));
    if (todayCount >= DAILY_LIMITS[type]) {
        return { ok: false, reason: "daily_limit" };
    }
    /**
     * 3️⃣ Event opslaan
     */
    addEvent(randomUUID(), userId, type, timestamp);
    /**
     * 4️⃣ Punten toekennen indien niet in cooldown
     */
    if (inCooldown) {
        return { ok: false, reason: "burst" };
    }
    addPoints(userId, POINTS[type]);
    return { ok: true };
}
//# sourceMappingURL=xpEngine.js.map