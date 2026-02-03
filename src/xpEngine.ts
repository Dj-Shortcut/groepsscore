import { randomUUID } from "crypto";
import { EventType } from "./types.js";
import {
  addEvent,
  addPoints,
  countEventsForDay,
  countRecentEvents,
} from "./store.js";

/**
 * Puntwaarden
 */
const POINTS: Record<EventType, number> = {
  post: 10,
  comment: 3,
};

/**
 * Daglimieten
 */
const DAILY_LIMITS: Record<EventType, number> = {
  post: 3,
  comment: 10,
};

/**
 * Anti-spam instellingen
 */
const BURST_LIMIT = 3;
const BURST_WINDOW_MS = 60_000; // 1 minuut

/**
 * Resultaat van puntentoekenning
 */
export type AwardResult =
  | { ok: true }
  | { ok: false; reason: "burst" | "daily_limit" };

function logDebug(debug: boolean, message: string): void {
  if (debug) {
    console.log(message);
  }
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function endOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

/**
 * Hoofdfunctie
 */
export function awardPoints(
  userId: string,
  type: EventType,
  timestamp: number = Date.now(),
  debug: boolean = false
): AwardResult {
  /**
   * 1️⃣ Burst check (cooldown)
   */
  const recentCount = countRecentEvents(
    userId,
    timestamp - BURST_WINDOW_MS
  );
  const inCooldown = recentCount >= BURST_LIMIT;

  if (inCooldown) {
    logDebug(
      debug,
      `⚠️ Cooldown actief → ${userId} (${recentCount} acties < 1 min)`
    );
  }

  /**
   * 2️⃣ Daglimiet check (hard)
   */
  const todayCount = countEventsForDay(
    userId,
    type,
    startOfDay(timestamp),
    endOfDay(timestamp)
  );

  if (todayCount >= DAILY_LIMITS[type]) {
    logDebug(
      debug,
      `⛔ Daglimiet bereikt → ${userId} (${type}: ${todayCount})`
    );
    return { ok: false, reason: "daily_limit" };
  }

  /**
   * 3️⃣ Event altijd opslaan
   */
  addEvent(randomUUID(), userId, type, timestamp);

  /**
   * 4️⃣ Punten alleen als niet in cooldown
   */
  if (inCooldown) {
    logDebug(
      debug,
      `⚠️ Geen punten (cooldown) → event wel gelogd (${userId})`
    );
    return { ok: false, reason: "burst" };
  }

  addPoints(userId, POINTS[type]);
  logDebug(debug, `✅ Punt toegekend → ${userId} (${type})`);

  return { ok: true };
}
