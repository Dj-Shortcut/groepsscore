import fs from "fs";
import path from "path";
import { db } from "./db.js";
/**
 * Zorg dat export-map bestaat
 */
const exportDir = path.join(__dirname, "..", "exports");
if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
}
/**
 * Export scores naar CSV
 */
export function exportScoresCSV() {
    const rows = db
        .prepare(`
      SELECT user_id, total, weekly, updated_at
      FROM scores
      ORDER BY total DESC
    `)
        .all();
    let csv = "user_id,total_points,period_points,updated_at\n";
    for (const row of rows) {
        csv += `${row.user_id},${row.total},${row.weekly},${row.updated_at}\n`;
    }
    const filePath = path.join(exportDir, "scores.csv");
    fs.writeFileSync(filePath, csv, "utf8");
    console.log(`✅ Scores geëxporteerd naar ${filePath}`);
}
/**
 * Export events naar CSV
 */
export function exportEventsCSV() {
    const rows = db
        .prepare(`
      SELECT user_id, type, timestamp
      FROM events
      ORDER BY timestamp ASC
    `)
        .all();
    let csv = "user_id,type,timestamp\n";
    for (const row of rows) {
        csv += `${row.user_id},${row.type},${row.timestamp}\n`;
    }
    const filePath = path.join(exportDir, "events.csv");
    fs.writeFileSync(filePath, csv, "utf8");
    console.log(`✅ Events geëxporteerd naar ${filePath}`);
}
//# sourceMappingURL=export.js.map