import { db } from "./db.js";
import { EventType } from "./types.js";

/**
 * Interne DB-rij types
 */
type ScoreRow = {
  user_id: string;
  total: number;
  weekly: number;
  updated_at: number;
};

type CountRow = {
  count: number;
};

/**
 * Scores ophalen (of initialiseren)
 */
export function getUserScore(userId: string) {
  let row = db
    .prepare("SELECT * FROM scores WHERE user_id = ?")
    .get(userId) as ScoreRow | undefined;

  if (!row) {
    const now = Date.now();

    db.prepare(
      "INSERT INTO scores (user_id, total, weekly, updated_at) VALUES (?, 0, 0, ?)"
    ).run(userId, now);

    row = {
      user_id: userId,
      total: 0,
      weekly: 0,
      updated_at: now,
    };
  }

  return {
    userId: row.user_id,
    total: row.total,
    weekly: row.weekly,
    updatedAt: row.updated_at,
  };
}

/**
 * Event opslaan
 */
export function addEvent(
  id: string,
  userId: string,
  type: EventType,
  timestamp: number
) {
  db.prepare(
    "INSERT INTO events (id, user_id, type, timestamp) VALUES (?, ?, ?, ?)"
  ).run(id, userId, type, timestamp);
}

/**
 * Daglimiet check
 */
export function countEventsForDay(
  userId: string,
  type: EventType,
  dayStart: number,
  dayEnd: number
): number {
  const row = db
    .prepare(
      `
      SELECT COUNT(*) as count FROM events
      WHERE user_id = ?
        AND type = ?
        AND timestamp BETWEEN ? AND ?
    `
    )
    .get(userId, type, dayStart, dayEnd) as CountRow;

  return row.count;
}

/**
 * Burst check
 */
export function countRecentEvents(
  userId: string,
  since: number
): number {
  const row = db
    .prepare(
      `
      SELECT COUNT(*) as count FROM events
      WHERE user_id = ?
        AND timestamp >= ?
    `
    )
    .get(userId, since) as CountRow;

  return row.count;
}

/**
 * Punten toevoegen
 */
export function addPoints(userId: string, points: number) {
  db.prepare(
    `
    UPDATE scores
    SET total = total + ?,
        weekly = weekly + ?,
        updated_at = ?
    WHERE user_id = ?
  `
  ).run(points, points, Date.now(), userId);
}
/**
 * Reset wekelijkse scores
 */
export function resetWeeklyScores() {
  db.prepare(`
    UPDATE scores
    SET weekly = 0,
        updated_at = ?
  `).run(Date.now());
}

/**
 * Haal top N gebruikers op (weekranking)
 */
export function getWeeklyLeaderboard(limit: number = 10) {
  return db.prepare(`
    SELECT user_id, weekly
    FROM scores
    ORDER BY weekly DESC
    LIMIT ?
  `).all(limit) as { user_id: string; weekly: number }[];
}
