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
const BURST_WINDOW_MS = 60_000; // 1 minuut
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
     * 1️⃣ Burst check (cooldown)
     */
    const recentCount = countRecentEvents(userId, timestamp - BURST_WINDOW_MS);
    const inCooldown = recentCount >= BURST_LIMIT;
    if (inCooldown && debug) {
        console.log(`⚠️ Cooldown actief → ${userId} (${recentCount} acties < 1 min)`);
    }
    /**
     * 2️⃣ Daglimiet check (hard)
     */
    const todayCount = countEventsForDay(userId, type, startOfDay(timestamp), endOfDay(timestamp));
    if (todayCount >= DAILY_LIMITS[type]) {
        if (debug) {
            console.log(`⛔ Daglimiet bereikt → ${userId} (${type}: ${todayCount})`);
        }
        return { ok: false, reason: "daily_limit" };
    }
    /**
     * 3️⃣ Event altijd opslaan
     */
    addEvent(randomUUID(), userId, type, timestamp);
    /**
     * 4️⃣ Punten alleen als niet in cooldown
     */
    if (!inCooldown) {
        addPoints(userId, POINTS[type]);
        if (debug) {
            console.log(`✅ Punt toegekend → ${userId} (${type})`);
        }
        return { ok: true };
    }
    if (debug) {
        console.log(`⚠️ Geen punten (cooldown) → event wel gelogd (${userId})`);
    }
    return { ok: false, reason: "burst" };
}
//# sourceMappingURL=xpEngine.js.map