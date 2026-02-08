import { db } from "./db.js";
/**
 * Scores ophalen (of initialiseren)
 */
export function getUserScore(userId) {
    let row = db
        .prepare("SELECT * FROM scores WHERE user_id = ?")
        .get(userId);
    if (!row) {
        const now = Date.now();
        db.prepare("INSERT INTO scores (user_id, total, weekly, updated_at) VALUES (?, 0, 0, ?)").run(userId, now);
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
export function addEvent(id, userId, type, timestamp) {
    db.prepare("INSERT INTO events (id, user_id, type, timestamp) VALUES (?, ?, ?, ?)").run(id, userId, type, timestamp);
}
/**
 * Daglimiet check
 */
export function countEventsForDay(userId, type, dayStart, dayEnd) {
    const row = db
        .prepare(`
      SELECT COUNT(*) as count FROM events
      WHERE user_id = ?
        AND type = ?
        AND timestamp BETWEEN ? AND ?
    `)
        .get(userId, type, dayStart, dayEnd);
    return row.count;
}
/**
 * Burst check
 */
export function countRecentEvents(userId, since) {
    const row = db
        .prepare(`
      SELECT COUNT(*) as count FROM events
      WHERE user_id = ?
        AND timestamp >= ?
    `)
        .get(userId, since);
    return row.count;
}
/**
 * Punten toevoegen
 */
export function addPoints(userId, points) {
    db.prepare(`
    UPDATE scores
    SET total = total + ?,
        weekly = weekly + ?,
        updated_at = ?
    WHERE user_id = ?
  `).run(points, points, Date.now(), userId);
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
export function getWeeklyLeaderboard(limit = 10) {
    return db.prepare(`
    SELECT user_id, weekly
    FROM scores
    ORDER BY weekly DESC
    LIMIT ?
  `).all(limit);
}
//# sourceMappingURL=store.js.map