import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * ESM-vervanging voor __dirname
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Data directory
 */
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "groepsscore.db");

/**
 * Open database
 */
export const db = new Database(dbPath);

/**
 * Schema
 */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT,
  timestamp INTEGER
);

CREATE TABLE IF NOT EXISTS scores (
  user_id TEXT PRIMARY KEY,
  total INTEGER,
  weekly INTEGER,
  updated_at INTEGER
);
`);
