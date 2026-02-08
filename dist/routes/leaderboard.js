import { generateWeeklyLeaderboardText } from "../leaderboard.js";
export function leaderboardHandler(res) {
    const text = generateWeeklyLeaderboardText();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ text }));
}
//# sourceMappingURL=leaderboard.js.map