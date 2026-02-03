import { ServerResponse } from "http";
import { generateMonthlyLeaderboardText } from "../leaderboard.js";

export function leaderboardHandler(res: ServerResponse) {
  const text = generateMonthlyLeaderboardText();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ text }));
}
